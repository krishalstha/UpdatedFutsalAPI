import {AfterViewInit,ChangeDetectorRef,EventEmitter,Output,OnInit,OnChanges,SimpleChanges,Component,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AuthService } from '../shared/auth.service';
import { AdminBookingDetail } from '../shared/admin-BookingDetail';
import { AdminBookingDetailService } from '../shared/admin-booking-detail.service';

import { BookingDetailFormComponent } from '../booking-detail-form/booking-detail-form.component';
import { BookingDetailReportComponent } from '../booking-detail-report/booking-detail-report.component';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-admin-booking-details',   // 🔥 UPDATED
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BookingDetailFormComponent,
    BookingDetailReportComponent,
    PaymentComponent,
    NgxMaterialTimepickerModule,
  ],
  templateUrl: './admin-booking-details.component.html',   // 🔥 UPDATED
  styleUrls: ['./admin-booking-details.css'],    // 🔥 UPDATED
})
export class AdminBookingDetailsComponent    // 🔥 UPDATED
  implements OnInit, OnChanges
{
  showPaymentModal: boolean = false;
  @Output() bookingUpdated = new EventEmitter<{
    date: string;
    time: string;
    duration: number;
  }>();

  bookingIdForPayment: number | null = null;
  bookingForEdit: AdminBookingDetail | null = null;
  formSubmitted: boolean = false;
  calculatedEndTime: string = '';
  formData: AdminBookingDetail = this.initializeFormData();

  constructor(
    private adminbookingscreenService: AdminBookingDetailService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  private initializeFormData(): AdminBookingDetail {
    return {
      id: null,
      contactNumber: '',
      selectDate: '',
      selectTime: '',
      selectDuration: '',
      selectPaymentMethod: '',
      email: '',
      price: 0,
      discount: '',
      finalPrice: 0,
      isDiscountApplied: false,
      calcTime: '',
    };
  }

  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      this.formData.email = user.email;
    }

    this.route.queryParams.subscribe((params) => {
      const { date, time } = params;
      if (date && time) {
        this.formData.selectDate = date;
        this.formData.selectTime = time;
        this.calculateEndTime();
        this.calculatePricing();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookingForEdit'] && this.bookingForEdit) {
      this.formData = { ...this.bookingForEdit };
    }
  }

  onDateChange(): void {
    this.calculatePricing();
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
    this.calculateFinalPrice();
  }

  /** Tuesday (2) + Friday (5) discount */
  calculatePriceWithDayDiscount(): number {
    let priceAfterDiscount = this.formData.price;
    this.formData.isDiscountApplied = false;

    if (this.formData.selectDate) {
      const selectedDate = new Date(this.formData.selectDate);
      const day = selectedDate.getDay();

      if (day === 2 || day === 5) {
        priceAfterDiscount -= this.formData.price * 0.1;
        this.formData.isDiscountApplied = true;

        this.toastr.info(
          '10% discount applied for Tuesday/Friday!',
          'Discount'
        );
      }
    }

    return priceAfterDiscount;
  }

  calculateFinalPrice(): void {
    let currentPrice = this.calculatePriceWithDayDiscount();

    const discountValue = String(this.formData.discount || '').trim();
    let finalDiscount = 0;

    if (discountValue.endsWith('%')) {
      const percent = parseFloat(discountValue.slice(0, -1));
      if (!isNaN(percent)) finalDiscount = (currentPrice * percent) / 100;
    } else if (discountValue) {
      const amount = parseFloat(discountValue);
      if (!isNaN(amount)) finalDiscount = amount;
    }

    this.formData.finalPrice = Math.max(0, currentPrice - finalDiscount);
    this.cdr.detectChanges();
  }

  calculateEndTime(): void {
    if (!this.formData.selectTime || !this.formData.selectDuration) {
      this.formData.calcTime = '';
      return;
    }

    const [h, m] = this.formData.selectTime.split(':').map(Number);
    const duration = this.getDurationInMinutes(this.formData.selectDuration);

    const date = new Date();
    date.setHours(h, m);
    date.setMinutes(date.getMinutes() + duration);

    const endHours = date.getHours() % 12 || 12;
    const endMinutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    this.formData.calcTime = `${endHours}:${endMinutes} ${ampm}`;
  }

  getDurationInMinutes(duration: string): number {
    switch (duration) {
      case '30 mins':
        return 30;
      case '1 hour':
        return 60;
      case '2 hours':
        return 120;
      default:
        return 0;
    }
  }

  redirectToEsewa(amount: number): void {
    const transactionId = 'TXN' + Math.floor(Math.random() * 100000000);
    const successUrl = 'http://localhost:4200/payment-success';
    const failureUrl = 'http://localhost:4200/payment-failure';

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc-epay.esewa.com.np/epay/main';

    const payload = {
      amt: amount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: amount,
      pid: transactionId,
      scd: 'EPAYTEST',
      su: successUrl,
      fu: failureUrl,
    };

    for (const key in payload) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(payload[key as keyof typeof payload]);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }

  onSubmit(form: NgForm): void {
    if (this.formSubmitted) return;
    this.formSubmitted = true;

    if (!form.valid) {
      this.toastr.error('Please fill all required fields.');
      this.formSubmitted = false;
      return;
    }

    this.calculatePricing();

    const user = this.authService.getLoggedInUser();
    if (user) this.formData.email = user.email;

    this.adminbookingscreenService.postBookingDetail(this.formData).subscribe({
      next: (res) => {
        this.toastr.success('Booking created!', 'Success');

        if (res.id) {
          this.adminbookingscreenService.setBookingId(res.id);
          this.bookingIdForPayment = res.id;
        }

        if (this.formData.selectPaymentMethod === 'Online') {
          this.redirectToEsewa(this.formData.finalPrice);
        } else {
          this.toastr.info('Booking saved. Pay in cash.');
        }

        this.resetForm(form);
      },
      error: () => {
        this.toastr.error('Failed to save booking.');
        this.formSubmitted = false;
      },
    });
  }

  resetForm(form: NgForm): void {
    form.resetForm();
    this.formData = this.initializeFormData();
    this.formSubmitted = false;
  }

  onPaymentsave(paymentData: any) {
    console.log('Payment saved:', paymentData);
  }

  onBookingForEdit(booking: AdminBookingDetail) {
    this.bookingForEdit = booking;
    this.formData = { ...booking };
    this.calculatePricing();
    this.calculateEndTime();
  }

  OnClickMakePayment(): void {
    this.showPaymentModal = true;
  }

  onNumberInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value
      .replace(/[^0-9]/g, '')
      .slice(0, 10);

    (event.target as HTMLInputElement).value = input;
    this.formData.contactNumber = input;
  }
}
