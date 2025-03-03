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
  
    // Accept booking on the backend
    this.acceptBookingService.acceptBooking(acceptBookingData).subscribe({
      next: () => {
        this.toastr.success('Booking accepted successfully.', 'Success');
  
        // Remove the accepted booking from the frontend list immediately
        this.bookingList = this.bookingList.filter(b => b.id !== booking.id);
  
        // Delete the booking from the backend (optional based on your backend logic)
        if (booking.id != null && !isNaN(booking.id)) {
          this.bookingService.deleteBookingDetail(booking.id).subscribe({
            next: () => {
              console.log('Booking deleted successfully from backend.');
            },
            error: (err) => {
              console.error('Failed to delete booking from backend:', err);
              this.toastr.error('Failed to delete booking from backend.', 'Error');
            }
          });
        } else {
          this.toastr.error('Invalid booking ID for deletion.', 'Error');
        }
  
        // Optionally print the accepted booking details
        this.printBookingDetails(booking);
      },
      error: (err) => {
        this.toastr.error(`Failed to accept booking. ${err.error?.message || err.message}`, 'Error');
      }
    });
  }
  
  

  printBookingDetails(booking: BookingDetail): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        
          <h2>Booking Details</h2>
          <p><strong>Email:</strong> ${booking.email}</p>
          <p><strong>Date:</strong> ${booking.selectDate}</p>
          <p><strong>Time:</strong> ${booking.selectTime}</p>
          <p><strong>Duration:</strong> ${booking.selectDuration}</p>
          <p><strong>Court:</strong> ${booking.selectCourt}</p>
          <p><strong>Payment Method:</strong> ${booking.selectPaymentMethod}</p>
          
          <p><strong>Contact:</strong> ${booking.contactNumber}</p>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        
      `);
      printWindow.document.close();
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
