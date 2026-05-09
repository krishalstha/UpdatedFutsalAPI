import { ChangeDetectorRef, Component } from '@angular/core';
import { BookingDetailService } from '../shared/booking-detail.service';
import { ToastrService } from 'ngx-toastr';
import { BookingDetail } from '../shared/BookingDetail';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AcceptBookingsService } from '../shared/accept-bookings.service';
import { AcceptBookings } from '../shared/accept-bookings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accept-bookings',
  templateUrl: './accept-bookings.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./accept-bookings.css']
})
export class AcceptBookingsComponent {
  bookings: AcceptBookings[] = [];
  bookingList: BookingDetail[] = [];

  constructor(
    private bookingService: BookingDetailService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private acceptBookingService: AcceptBookingsService,
    private router: Router
  ) {
    this.loadBookingList();
  }

  private loadBookingList(): void {
    this.bookingService.getBookingDetails().subscribe({
      next: (res: BookingDetail[]) => {
        this.bookingList = res;
        if (this.bookingList.length === 0) {
          this.toastr.info('No booking details found.', 'Information');
        }
      },
      error: (err) => {
        console.error('Error loading booking details:', err);
        this.toastr.error('Failed to load booking details.', 'Error');
      },
    });
  }

  acceptBooking(booking: BookingDetail): void {
    if (!booking.id) {
      this.toastr.error('Invalid booking ID.', 'Error');
      return;
    }
  
    if (!booking.selectDate || !booking.selectTime) {
      this.toastr.error('Invalid date or time.', 'Error');
      return;
    }
  
    const cleanedDate = booking.selectDate.split('T')[0];
    const dateTimeString = `${cleanedDate}T${booking.selectTime}`;
    const dateObject = new Date(dateTimeString);
  
    if (isNaN(dateObject.getTime())) {
      this.toastr.error('Invalid DateTime format.', 'Error');
      return;
    }
  
    const formattedDateTime = dateObject.toISOString();
  
    const acceptBookingData: AcceptBookings = {
      Id: booking.id,
      BookingId: booking.id,
      DateTime: formattedDateTime,
      Status: 'Accepted'
    };
  
    this.acceptBookingService.acceptBooking(acceptBookingData).subscribe({
      next: () => {
        this.toastr.success('Booking accepted successfully.', 'Success');
        const acceptedBooking = this.bookingList.find(b => b.id === booking.id);
        if (acceptedBooking) {
          acceptedBooking.status = 'Accepted';
        }
        this.printBookingDetails(booking);
      },
      error: (err) => {
        this.toastr.error(`Failed to accept booking. ${err.error?.message || err.message}`, 'Error');
      }
    });
  }
  printBookingDetails(booking: any) {
    const printContents = `
      <html>
        <head>
          <title>Booking Details</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 20px; }
            h2 { color: #5a67f2; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #5a67f2; color: white; }
          </style>
        </head>
        <body>
          <h2>Booking Details</h2>
          <table>
            <tr><th>Email</th><td>${booking.email}</td></tr>
            <tr><th>Date</th><td>${booking.selectDate}</td></tr>
            <tr><th>Time</th><td>${booking.selectTime}</td></tr>
            <tr><th>Duration</th><td>${booking.selectDuration}</td></tr>
            <tr><th>Payment Method</th><td>${booking.selectPaymentMethod}</td></tr>
            <tr><th>Contact</th><td>${booking.contactNumber}</td></tr>
            <tr><th>Status</th><td>${booking.status}</td></tr>
          </table>
        </body>
      </html>
    `;
    const popup = window.open('', '_blank', 'width=800,height=600');
    if (popup) {
      popup.document.open();
      popup.document.write(printContents);
      popup.document.close();
      popup.print();
    }
  }
  

  denyBooking(id: number): void {
    if (!id || isNaN(id)) {
      this.toastr.error('Invalid booking detail ID.', 'Deny Error');
      return;
    }

    if (confirm('Are you sure you want to deny this booking?')) {
      this.bookingService.deleteBookingDetail(id).subscribe({
        next: () => {
          this.toastr.success('Booking denied successfully.', 'Success');
          this.loadBookingList();
        },
        error: (err) => {
          console.error('Error denying booking:', err);
          this.toastr.error('Failed to deny booking.', 'Error');
        },
      });
    }
  }
}
