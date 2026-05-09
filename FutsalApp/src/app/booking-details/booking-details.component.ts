
import {AfterViewInit,ChangeDetectorRef,EventEmitter,Output,OnInit,OnChanges,SimpleChanges,Component,} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { AuthService } from '../shared/auth.service';
import { BookingDetail } from '../shared/BookingDetail'; 
import { BookingDetailService } from '../shared/booking-detail.service';
import { BookingDetailFormComponent } from '../booking-detail-form/booking-detail-form.component';
import { BookingDetailReportComponent } from '../booking-detail-report/booking-detail-report.component';
import { PaymentComponent } from '../payment/payment.component';

@Component({
 selector: 'app-booking-details',
 standalone: true,
 imports: [
 CommonModule,
 FormsModule,
 BookingDetailFormComponent,
 BookingDetailReportComponent,
 PaymentComponent,
 NgxMaterialTimepickerModule,
 ],
 templateUrl: './booking-details.component.html',
 styleUrls: ['./booking-details.css'],
})
export class BookingDetailsComponent implements OnInit, OnChanges {
 showPaymentModal: boolean = false;
 isAdmin: boolean = false;
 userRole: string = '';
 @Output() bookingUpdated = new EventEmitter<{
 date: string;
 time: string;
 duration: number;
 }>();
 bookingIdForPayment: number | null = null;
 bookingForEdit: BookingDetail | null = null;
 formSubmitted: boolean = false;
 calculatedEndTime: string = '';
 formData: BookingDetail = this.initializeFormData();
 futsalPricing: any = {};
 futsalList: any[] = []; // List of all futsal
selectedFutsal: string = '';



 constructor(
 private bookingscreenService: BookingDetailService,
 private authService: AuthService,
 private toastr: ToastrService,
 private route: ActivatedRoute,
 private cdr: ChangeDetectorRef
 ) {}

 /** Initialize default booking form data */
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
 discount: '',
 finalPrice: 0,
 isDiscountApplied: false,
 calcTime: '',
 futsalName: 'Default Futsal' // Added futsalName as required by validation logic
 };
 }

 /** OnInit lifecycle — initialize user and query params */
 ngOnInit(): void {
  this.checkUserRole();
  
  const futsalName = decodeURIComponent(this.route.snapshot.paramMap.get('futsalName') || '');

 this.formData.futsalName = 'The Arena Futsal';
 

 this.route.params.subscribe(params => {
 if (params['futsalName']) { // Check for a route parameter named 'futsalName'
  this.formData.futsalName = decodeURIComponent(params['futsalName']);
  
  this.loadFutsalDetails(this.formData.futsalName);


 } else if (futsalName) {
  this.loadFutsalDetails(futsalName);
}
 });
 
 // 3. Handle user and role initialization
 const user = this.authService.getLoggedInUser();
 if (user) {
 this.formData.email = user.email;
 }
 this.userRole = this.authService.getUserRole().toLowerCase();
 
 // 4. Handle query parameters (date/time selection)
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

 checkUserRole() {
  const userData = localStorage.getItem('loggedInUser');
  if (userData) {
    const parsedUser = JSON.parse(userData);
    this.isAdmin = parsedUser.roleId === 'Admin';
  } else {
    this.isAdmin = false;
  }
  console.log("Is Admin:", this.isAdmin);
}


 /** Handle date or duration changes */
 onDateChange(): void {
 this.calculatePricing();
 }

 onDurationChange(): void {
 this.calculateEndTime();
 this.calculatePricing();
 }
 loadFutsalDetails(name: string): void {
  this.bookingscreenService.getFutsalByName(name).subscribe({
    next: (futsal: any) => { // type 'any' or define a FutsalDetail interface
      console.log('Loaded Futsal:', futsal);

      // Example: pricing for 30 mins base
      const basePrice = futsal.pricing || 0;

      this.futsalPricing = {
        price30min: basePrice,
        price1hr: basePrice * 2,
        price2hr: basePrice * 4
      };

      this.calculatePricing(); // recalc if duration already selected
    },
    error: (err) => {
      console.error('Error loading futsal details', err);
      this.toastr.error('Error loading futsal details', 'Error');
    }
  });
}

 /** Set base price based on duration */
 calculatePricing(): void {
  switch (this.formData.selectDuration) {
    case '30 mins':
      this.formData.price = this.futsalPricing.price30min;
      break;
    case '1 hour':
      this.formData.price = this.futsalPricing.price1hr;
      break;
    case '2 hours':
      this.formData.price = this.futsalPricing.price2hr;
      break;
    default:
      this.formData.price = 0;
  }

  this.calculateFinalPrice();
}



calculatePriceWithDayDiscount(): number {
 let priceAfterDiscount = this.formData.price;
 this.formData.isDiscountApplied = false;

 if (this.formData.selectDate) {
 const selectedDate = new Date(this.formData.selectDate);
 const day = selectedDate.getDay(); 

 // Tuesday = 2, Friday = 5
 if (day === 2 || day === 5) {
 const discountAmount = this.formData.price * 0.10; // 10%
 priceAfterDiscount -= discountAmount;
 this.formData.isDiscountApplied = true;

 this.toastr.info('10% discount applied for Tuesday/Friday!', 'Discount');
 }
 }

 return priceAfterDiscount;
}


 /** Calculate final price after all discounts */
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

 /** Calculate end time */
 calculateEndTime(): void {
 if (!this.formData.selectTime || !this.formData.selectDuration) {
 this.formData.calcTime = '';
 return;
 }

 const [hours, minutes] = this.formData.selectTime.split(':').map(Number);
 const duration = this.getDurationInMinutes(this.formData.selectDuration);
 const date = new Date();
 date.setHours(hours, minutes);
 date.setMinutes(date.getMinutes() + duration);

 const endHours = date.getHours() % 12 || 12;
 const endMinutes = date.getMinutes().toString().padStart(2, '0');
 const ampm = date.getHours() >= 12 ? 'PM' : 'AM';

 // The API endpoint is likely strict about time formats. Let's ensure calcTime 
 // is formatted cleanly, though it may not be strictly required for submission.
 this.formData.calcTime = `${endHours}:${endMinutes} ${ampm}`;
 }

 /** Convert duration to minutes */
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

 /** eSewa redirect */
 redirectToEsewa(amount: number): void {
 const transactionId = 'TXN' + Math.floor(Math.random() * 100000000);
 const successUrl = 'http://localhost:4200/payment-success';
 const failureUrl = 'http://localhost:4200/payment-failure';

 const form = document.createElement('form');
 form.method = 'POST';
 form.action = 'https://epay.esewa.com.np/api/epay/main/v2/form';

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

 /** Submit booking form */
 onSubmit(form: NgForm): void {
  if (this.formSubmitted) return;
  this.formSubmitted = true;

  if (!this.isFormValid(form)) {
    this.formSubmitted = false;
    return;
  }

  this.calculatePricing();

  const user = this.authService.getLoggedInUser();
  if (user) this.formData.email = user.email;

  // --- 🟢 Step 1: Calculate numeric discount to send to API ---
  let discountValueToSend: number | null = null;
  const discountString = String(this.formData.discount || '').trim();

  if (discountString) {
    // Extract only numeric value
    const numericDiscount = parseFloat(discountString.replace(/[^\d.]/g, ''));
    if (!isNaN(numericDiscount)) {
      discountValueToSend = numericDiscount;
    }
  }

  const payloadForApi = { ...this.formData };
  (payloadForApi as any).discount = discountValueToSend;

  delete (payloadForApi as any).id; // remove id for POST

  // 🟢 Save booking using the cleaned payload
  this.bookingscreenService.postBookingDetail(payloadForApi as BookingDetail).subscribe({
    next: (res) => {
      this.toastr.success('Booking confirmed!', 'Success');
      console.log('✅ Booking created:', res);

      if (res.id) {
        // 🔥 Update formData.id so Make Payment works
        this.formData.id = res.id;
        this.bookingIdForPayment = res.id;

        // Optional: share with service
        this.bookingscreenService.setBookingId(res.id);
      }

      // 🟢 If payment method is Online, trigger eSewa
      if (this.formData.selectPaymentMethod === 'Online') {
        this.redirectToEsewa(this.formData.finalPrice);
      } else {
        this.toastr.info('Booking done! Payment will be done in cash.', 'Info');
      }

      // ❌ Only reset form if you don’t need the bookingId for payment
      // this.resetForm(form); 
      this.formSubmitted = false; // reset submission state
    },
    error: (err) => {
      if (err.status === 409) {
        this.toastr.error('This time slot is already booked.', 'Booking Conflict');
      } else {
        this.toastr.error('Failed to save booking.', 'Error');
      }
      this.formSubmitted = false;
    }
  });
}


 /** Form validation */
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

 /** Reset form */
 private resetForm(form: NgForm): void {
 form.resetForm();
 this.formData = this.initializeFormData();
 this.formSubmitted = false;
 this.calculatedEndTime = '';
 }
 // Add this to your BookingDetailsComponent
onPaymentsave(paymentData: any) {
 // Handle any actions after payment is saved, e.g., refresh bookings
 console.log('Payment saved:', paymentData);
}
// Add this to handle booking edit from child component
onBookingForEdit(booking: BookingDetail) {
 this.bookingForEdit = booking;
 this.formData = { ...booking };
 this.calculatePricing();
 this.calculateEndTime();
}
private isFormValidFormData(): boolean {
  if (
    !this.formData.selectDate ||
    !this.formData.selectTime ||
    !this.formData.selectDuration ||
    !this.formData.selectPaymentMethod ||
    !this.formData.contactNumber ||
    !/^\d{10}$/.test(this.formData.contactNumber)
  ) {
    return false;
  }
  return true;
}

OnClickMakePayment(): void {
  // Check if form is valid first
  if (!this.isFormValidFormData()) {
    this.toastr.error('Please fill all required fields correctly before payment.', 'Form Error');
    return;
  }

  this.formSubmitted = true;

  // Calculate pricing and discount
  this.calculatePricing();

  const user = this.authService.getLoggedInUser();
  if (user) this.formData.email = user.email;

  // Prepare discount
  let discountValueToSend: number | null = null;
  const discountString = String(this.formData.discount || '').trim();
  if (discountString) {
    const numericDiscount = parseFloat(discountString.replace(/[^\d.]/g, ''));
    if (!isNaN(numericDiscount)) discountValueToSend = numericDiscount;
  }

  const payloadForApi = { ...this.formData };
  (payloadForApi as any).discount = discountValueToSend;
  delete (payloadForApi as any).id; // remove id for POST

  // Post booking first
  this.bookingscreenService.postBookingDetail(payloadForApi as BookingDetail).subscribe({
    next: (res) => {
      this.toastr.success('Booking created! You can now proceed to payment.', 'Success');

      if (res.id) {
        this.formData.id = res.id;
        this.bookingIdForPayment = res.id;
        this.bookingscreenService.setBookingId(res.id);

        // Open payment modal immediately
        this.showPaymentModal = true;
        this.cdr.detectChanges();
        console.log('Payment modal opened with bookingId:', this.bookingIdForPayment);
      }

      this.formSubmitted = false; // reset state
    },
    error: (err) => {
      if (err.status === 409) {
        this.toastr.error('This time slot is already booked.', 'Booking Conflict');
      } else {
        this.toastr.error('Failed to create booking for payment.', 'Error');
      }
      this.formSubmitted = false;
    }
  });
}


 /** Limit contact number input */
 onNumberInput(event: Event): void {
 const input = (event.target as HTMLInputElement).value
 .replace(/[^0-9]/g, '')
 .slice(0, 10);
 (event.target as HTMLInputElement).value = input;
 this.formData.contactNumber = input;
 }
}
