import { Component } from '@angular/core';
import { BookingDetailService } from '../shared/booking-detail.service';
import { ToastrService } from 'ngx-toastr';
import { BookingDetail } from '../shared/BookingDetail';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AcceptBookingsService } from '../shared/accept-bookings.service';
import { AcceptBookings } from '../shared/accept-bookings';

@Component({
  selector: 'app-accept-bookings',
  templateUrl: './accept-bookings.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./accept-bookings.css']
})
export class AcceptBookingsComponent {
  bookings: AcceptBookings[] = [];
  bookingList: BookingDetail[] = [];
  selectedBooking: BookingDetail | null = null;

  constructor(
    private bookingService: BookingDetailService,
    private toastr: ToastrService,
    private acceptBookingService: AcceptBookingsService,
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
        console.error('Booking ID is missing:', booking);
        return;
    }

    if (!booking.selectDate || !booking.selectTime) {
        this.toastr.error('Invalid date or time.', 'Error');
        console.error('Invalid Date or Time:', booking.selectDate, booking.selectTime);
        return;
    }

    console.log('Original DateTime:', booking.selectDate, booking.selectTime);

    const cleanedDate = booking.selectDate.split('T')[0]; // Remove time if already present
const dateTimeString = `${cleanedDate}T${booking.selectTime}`;
const dateObject = new Date(dateTimeString);

if (isNaN(dateObject.getTime())) {
    this.toastr.error('Invalid DateTime format.', 'Error');
    console.error('Failed to create valid DateTime:', dateTimeString);
    return;
}

const formattedDateTime = dateObject.toISOString();


    const acceptBookingData: AcceptBookings = {
        Id: booking.id,
        BookingId: booking.id,
        DateTime: formattedDateTime,  // Send correctly formatted DateTime
        Status: 'Accepted'
    };

    console.log('Payload being sent:', acceptBookingData);

    this.acceptBookingService.acceptBooking(acceptBookingData).subscribe({
        next: (res) => {
          
            console.log('Booking accepted:', res);
            this.toastr.success('Booking accepted successfully.', 'Success');
            this.loadBookingList(); // Refresh the list
        },
        error: (err) => {
            console.error('Error accepting booking:', err);
            this.toastr.error(`Failed to accept booking. ${err.error?.message || err.message}`, 'Error');
        }
    });
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
