import { EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, FormsModule, BookingDetailFormComponent, BookingDetailReportComponent],
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.css']
})
export class BookingDetailsComponent implements OnInit, OnChanges {
  @Output() bookingUpdated = new EventEmitter<{ date: string, time: string, duration: number }>();
  bookingForEdit: BookingDetail | null = null;
  formSubmitted: boolean = false;
  calculatedEndTime: string = ''; // Stores calculated end time
  formData: BookingDetail = this.initializeFormData();
  courts: any[] = [];

  constructor(
    private bookingscreenService: BookingDetailService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  private initializeFormData(): BookingDetail {
    return {
      id: null,
      contactNumber: '',
      selectDate: '',
      selectTime: '',
      selectDuration: '',
      selectCourt: '',
      selectPaymentMethod: '',
      email: '',
    };
  }
  
  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    console.log('Logged-in user:', user); // Add this for debugging
    if (user) {
      this.formData.id = user.Id; // Store user ID in formData
      this.formData.email = user.email;
    }
    this.loadCourts(); // Load courts from database

    // Check the initial value of selectCourt
  console.log("Initial Selected Court ID: ", this.formData.selectCourt);

   // Retrieve the date and time from query params
   this.route.queryParams.subscribe(params => {
    const { date, time } = params;
    if (date && time) {
      this.formData.selectDate = date; // Set date
      this.formData.selectTime = time; // Set time
      this.calculateEndTime(); // Calculate end time based on selected time and duration
    }
  });
  }
  
 
    

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookingForEdit'] && this.bookingForEdit) {
      console.log('Populating form with booking data:', this.bookingForEdit);
      this.formData = { ...this.bookingForEdit };
    }
  }
  loadCourts(): void {
    this.bookingscreenService.getCourts().subscribe({
      next: (data) => {
        console.log('Fetched courts:', data);
        if (Array.isArray(data) && data.length > 0) {
          this.courts = data;
          console.log('Courts loaded successfully:', this.courts);
        } else {
          this.toastr.warning('No courts available.', 'Info');
        }
      },
      error: (err) => {
        console.error('Error fetching courts:', err);
        this.toastr.error('Failed to load courts.', 'Error');
      }
    });
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
  
    const startTime = this.formData.selectTime ?? '00:00'; // Default to "00:00" if undefined
    const duration = this.getDurationInMinutes(this.formData.selectDuration ?? '0'); // Default to "0" if undefined
  
    let [hours, minutes] = startTime.split(':').map(Number);
    let date = new Date();
    date.setHours(hours, minutes, 0, 0);
  
    date.setMinutes(date.getMinutes() + duration);
  
    let endHours = date.getHours();
    let endMinutes = date.getMinutes();
    let ampm = endHours >= 12 ? 'PM' : 'AM';
  
    endHours = endHours % 12 || 12; // Convert 24-hour format to 12-hour format
    let endTimeStr = `${endHours}:${endMinutes.toString().padStart(2, '0')} ${ampm}`;
  
    this.formData.calcTime = endTimeStr;
  }
  

  onSubmit(form: NgForm): void {
    if (this.formSubmitted) return; // Prevent duplicate submissions
    this.formSubmitted = true;
    if (!this.isFormValid(form)) {
      this.formSubmitted = false; // Allow resubmission after fixing errors
      return;
    }
  
    console.log("Selected Court ID on submit: ", this.formData.selectCourt); // Add this log here
    console.log(this.formData);
    this.formData.id ? this.updateRecord(form) : this.insertRecord(form);
  }
  

  private isFormValid(form: NgForm): boolean {
    console.log('Form Validity:', form.valid);
    console.log('Form Data:', this.formData);

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
    console.log('Payload being sent:', this.formData);

    this.bookingscreenService.postBookingDetail(this.formData).subscribe({
      next: () => {
        this.toastr.success('Record inserted successfully!', 'BookingDetail');
        this.resetForm(form);
      },
      error: (err) => {
        console.error('Insert Error:', err);
        this.toastr.error('Failed to insert the record.', 'Insert Error');
      },
    });
  }

  private updateRecord(form: NgForm): void {
    console.log('Payload being sent for update:', this.formData);

    this.bookingscreenService.putBookingDetail(this.formData).subscribe({
      next: () => {
        this.toastr.info('Record updated successfully!', 'BookingScreen Detail ');
        this.resetForm(form);
      },
      error: (err) => {
        console.error('Update Error:', err);
        this.toastr.error('Failed to update the record.', 'Update Error');
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
