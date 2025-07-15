import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingDetailService } from '../shared/booking-detail.service';
import { ToastrService } from 'ngx-toastr';
import { BookingDetail } from '../shared/BookingDetail';
import { CommonModule } from '@angular/common';
import { AuthService } from '../shared/auth.service'; // Assuming you have this

@Component({
  selector: 'app-booking-detail-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-detail-form.component.html',
  styles: ``
})
export class BookingDetailFormComponent {
  @Output() updatedBooking = new EventEmitter<BookingDetail>();
  bookingList: BookingDetail[] = [];
  selectedBooking: BookingDetail | null = null;
  loggedInUserEmail: string = '';

  constructor(
    private bookingService: BookingDetailService,
    private toastr: ToastrService,
    private authService: AuthService // Inject AuthService to get logged-in user
  ) {
    const user = this.authService.getLoggedInUser();
    this.loggedInUserEmail = user?.email || '';
    this.loadBookingList();
  }

  private loadBookingList(): void {
    this.bookingService.getBookingDetails().subscribe({
      next: (res: BookingDetail[]) => {
        this.bookingList = res.filter(x => x.email == this.loggedInUserEmail);
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

  populateForm(booking: BookingDetail): void {
    this.selectedBooking = { ...booking };
    this.updatedBooking.emit(this.selectedBooking);
  }

  onUpdate(updatedBooking: BookingDetail): void {
    if (!updatedBooking || !updatedBooking.id) {
      this.toastr.error('Invalid booking detail. Please try again.', 'Update Error');
      return;
    }

    this.bookingService.putBookingDetail(updatedBooking).subscribe({
      next: () => {
        this.toastr.success('Booking detail updated successfully.', 'Update Success');
        this.selectedBooking = null;
        this.loadBookingList();
      },
      error: (err) => {
        this.toastr.error('Failed to update booking detail. Please try again.', 'Update Error');
      },
    });
  }

  cancelEdit(): void {
    this.selectedBooking = null;
  }

  onDelete(id: number): void {
    if (!id || isNaN(id)) {
      this.toastr.error('Invalid booking detail ID. Please refresh and try again.', 'Delete Error');
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this booking detail?');

    if (confirmDelete) {
      this.bookingService.deleteBookingDetail(id).subscribe({
        next: () => {
          this.toastr.success('Booking detail deleted successfully.', 'Delete Success');
          this.loadBookingList();
        },
        error: (err) => {
          if (err.status === 404) {
            this.toastr.error('Booking detail not found.', 'Delete Error');
          } else {
            this.toastr.error('Failed to delete the booking detail. Please try again.', 'Delete Error');
          }
        },
      });
    }
  }
}
