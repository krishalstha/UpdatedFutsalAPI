import { Component, OnChanges, SimpleChanges, OnInit } from '@angular/core'; 
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service'; // Import AuthService
import { BookingDetail } from '../shared/BookingDetail';
import { BookingDetailService } from '../shared/booking-detail.service';
import { BookingDetailFormComponent } from '../booking-detail-form/booking-detail-form.component';
import { BookingDetailReportComponent } from '../booking-detail-report/booking-detail-report.component';



@Component({
  selector: 'app-booking-details',
  standalone: true,
  imports: [CommonModule, FormsModule, BookingDetailFormComponent,BookingDetailReportComponent],
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.css'
  
})
export class BookingDetailsComponent implements OnInit, OnChanges {
// Method to receive the emitted data from child
onBookingForEdit(booking: BookingDetail): void {
  //this.bookingForEdit = booking;
  //console.log('Received booking for edit:', this.bookingForEdit);
  const bookingData = booking;
  // this.formData.email=bookingData.email;
  // this.formData.contactNumber=bookingData.contactNumber;
  this.formData = bookingData;
}
  bookingForEdit: BookingDetail | null = null;
  formSubmitted: boolean = false;
  calculatedEndTime: string = ''; // Stores calculated end time
  formData: BookingDetail = this.initializeFormData();
  

 // @Input() bookingForEdit: BookingDetail | null = null;

  constructor(
    private bookingscreenService: BookingDetailService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
 

  /**
   * Initialize default form data.
   */
  private initializeFormData(): BookingDetail {
    return {
      id: null,
      contactNumber: '',
      selectDate: '',
      selectTime: '',
      selectDuration: '',
      selectCourt: '',
      selectPaymentMethod: '',
      email:''
    };
  }
  ngOnInit(): void {
    const user = this.authService.getLoggedInUser();
    console.log('Logged-in user:', user); // Add this for debugging
    if (user) {
      this.formData.id = user.Id; // Store user ID in formData
      this.formData.email = user.email;
    }
  }
  
  /**
   * Populate the form with selected bookingscreen details for editing.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bookingForEdit'] && this.bookingForEdit) {
      console.log('Populating form with booking data:', this.bookingForEdit);
      this.formData = { ...this.bookingForEdit };
    }
  }


  // This method is called when updatedBooking event is emitted from the child
  onBookingUpdate(updatedBooking: BookingDetail): void {
    console.log('Received updated booking:', updatedBooking);
    this.formData = updatedBooking;  // Update form data with the emitted booking
  }


 /**
   * Convert duration string to minutes.
   */
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

  let startTime = this.formData.selectTime;
  let duration = this.getDurationInMinutes(this.formData.selectDuration);

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


  /**
   * Handle form submission.
   */
  onSubmit(form: NgForm): void {
    if (this.formSubmitted) return; // Prevent duplicate submissions
    this.formSubmitted = true;
    if (!this.isFormValid(form)) {
      this.formSubmitted = false; // Allow resubmission after fixing errors
      return;
    }
    this.formData.id ? this.updateRecord(form) : this.insertRecord(form);
    window.location.reload();
  }

  /**
   * Validate the form.
   */
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

  /**
   * Insert a new record.
   */
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

  /**
   * Update an existing record.
   */
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

  /**
   * Reset the form.
   */
  private resetForm(form: NgForm): void {
    form.resetForm();
    this.formData = this.initializeFormData();
    this.calculatedEndTime = '';
    this.formSubmitted = false;
  }

  /**
   * Restrict contact number input to numeric only and limit to 10 digits.
   */
  onNumberInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '').slice(0, 10);
    (event.target as HTMLInputElement).value = input;
    this.formData.contactNumber = input;
  }
}