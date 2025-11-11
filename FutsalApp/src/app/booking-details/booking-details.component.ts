import { ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Component, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { BookingDetail } from '../shared/BookingDetail';
import { BookingDetailService } from '../shared/booking-detail.service';
import { BookingDetailFormComponent } from '../booking-detail-form/booking-detail-form.component';
import { BookingDetailReportComponent } from '../booking-detail-report/booking-detail-report.component';
import { ActivatedRoute } from '@angular/router';
//import { PaymentService } from '../shared/payment.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    BookingDetailFormComponent,
    BookingDetailReportComponent,
    NgxMaterialTimepickerModule,
  ],
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.css']
})
export class BookingDetailsComponent implements OnInit, OnChanges {
  @Output() bookingUpdated = new EventEmitter<{ date: string, time: string, duration: number }>();
  bookingForEdit: BookingDetail | null = null;
  formSubmitted: boolean = false;
  calculatedEndTime: string = '';
  formData: BookingDetail = this.initializeFormData();

  constructor(
    private bookingscreenService: BookingDetailService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    //private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  private initializeFormData(): BookingDetail {
    return {
      id: null,
      contactNumber: '',
      selectDate: '',
      selectTime: '',
      selectDuration: '',
      selectPaymentMethod: '',
      email: '',
      price: 0,
      calcTime: ''
    };
  }

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.formData.id = user.Id;
      this.formData.email = user.email;
    }

    this.route.queryParams.subscribe(params => {
      const { date, time } = params;
      if (date && time) {
        this.formData.selectDate = date;
        this.formData.selectTime = time;
        this.calculateEndTime();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookingForEdit'] && this.bookingForEdit) {
      this.formData = { ...this.bookingForEdit };
    }
  }

  onDurationChange(): void {
    this.calculateEndTime();
    this.calculatePricing();
  }

  calculatePricing(): void {
    switch (this.formData.selectDuration) {
      case '30 mins':
        this.formData.price = 500;
        break;
      case '1 hour': 
        this.formData.price = 1000;
        break;
      case '2 hours':
        this.formData.price = 2000;
        break;
      default:
        this.formData.price = 0;
    }
  }

  onPricingUpdated(pricing: string): void {
    this.formData.price = Number(pricing);
  }

  onBookingForEdit(booking: BookingDetail): void {
    this.formData = booking;
  }

  getDurationInMinutes(duration: string): number {
    switch (duration) {
      case '30 mins': return 30;
      case '1 hour': return 60;
      case '2 hours': return 120;
      default: return 0;
    }
  }

  calculateEndTime(): void {
    if (!this.formData.selectTime || !this.formData.selectDuration) {
      this.formData.calcTime = '';
      return;
    }

    const startTime = this.formData.selectTime;
    const duration = this.getDurationInMinutes(this.formData.selectDuration);

    let [hours, minutes] = startTime.split(':').map(Number);
    let date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setMinutes(date.getMinutes() + duration);

    let endHours = date.getHours();
    let endMinutes = date.getMinutes();
    let ampm = endHours >= 12 ? 'PM' : 'AM';

    endHours = endHours % 12 || 12;
    let endTimeStr = `${endHours}:${endMinutes.toString().padStart(2, '0')} ${ampm}`;

    this.formData.calcTime = endTimeStr;
  }

  redirectToEsewa(amount: number): void {
    const transactionId = 'TXN' + Math.floor(Math.random() * 100000000); 
    const successUrl = 'http://localhost:4200/payment-success';
    const failureUrl = 'http://localhost:4200/payment-failure';
  
    const esewaForm = document.createElement('form');
    esewaForm.method = 'POST';
    esewaForm.action = 'https://rc-epay.esewa.com.np/epay/main';



  
    const esewaData = {
      amt: amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: transactionId,
      scd: 'EPAYTEST', // test merchant code
      su: successUrl,
      fu: failureUrl
    };
  
    for (const key in esewaData) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(esewaData[key as keyof typeof esewaData]);
      esewaForm.appendChild(input);
    }
  
    document.body.appendChild(esewaForm);
    esewaForm.submit();
  }
  
  

  onSubmit(form: NgForm): void {
    if (this.formSubmitted) return;
    this.formSubmitted = true;
  
    if (!this.isFormValid(form)) {
      this.formSubmitted = false;
      return;
    }
  
    this.calculatePricing();
  
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.formData.email = user.email;
    }
  
    if (this.formData.selectPaymentMethod === 'Online') {
      // Save booking first, then redirect
      this.bookingscreenService.postBookingDetail(this.formData).subscribe({
        next: (res) => {
          this.toastr.success('Booking saved! Redirecting to eSewa...', 'Success');
          this.redirectToEsewa(this.formData.price);
        },
        error: (err) => {
          this.toastr.error('Failed to save booking before payment.', 'Error');
          console.error('Esewa Booking Error:', err);
          this.formSubmitted = false;
        }
      });
    } else {
      this.formData.id ? this.updateRecord(form) : this.insertRecord(form);
    }
  }
  

  private isFormValid(form: NgForm): boolean {
    if (!form.valid) {
      this.toastr.error('Please fill all the required fields.', 'Form Error');
      return false;
    }

    if (!/^\d{10}$/.test(this.formData.contactNumber)) {
      this.toastr.error('Contact number must be exactly 10 digits.', 'Validation Error');
      return false;
    }

    return true;
  }

  private insertRecord(form: NgForm): void {
    this.bookingscreenService.postBookingDetail(this.formData).subscribe({
      next: () => {
        this.toastr.success('Record inserted successfully!', 'BookingDetail');
        this.resetForm(form);
      },
      error: (err) => {
        console.error('Insert Error:', err);
        this.toastr.error('Failed to insert the record.', 'Insert Error');
        this.formSubmitted = false;
      },
    });
  }

  private updateRecord(form: NgForm): void {
    this.bookingscreenService.putBookingDetail(this.formData).subscribe({
      next: () => {
        this.toastr.info('Record updated successfully!', 'BookingScreen Detail');
        this.resetForm(form);
      },
      error: (err) => {
        console.error('Update Error:', err);
        this.toastr.error('Failed to update the record.', 'Update Error');
        this.formSubmitted = false;
      },
      complete: () => (this.formSubmitted = false),
    });
  }

  private resetForm(form: NgForm): void {
    form.resetForm();
    this.formData = this.initializeFormData();
    this.calculatedEndTime = '';
    this.formSubmitted = false;
  }

  onNumberInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '').slice(0, 10);
    (event.target as HTMLInputElement).value = input;
    this.formData.contactNumber = input;
  }
}
