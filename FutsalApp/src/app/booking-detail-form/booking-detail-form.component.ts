import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingDetailService } from '../shared/booking-detail.service';
import { ToastrService } from 'ngx-toastr';  // For toast notifications
import { BookingDetail } from '../shared/BookingDetail';
import { CommonModule } from '@angular/common';
// Form component for creating/updating bookings

@Component({
  selector: 'app-booking-detail-form',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './booking-detail-form.component.html',
  styles: ``
  
})
export class BookingDetailFormComponent {
  @Output() updatedBooking = new EventEmitter<BookingDetail>();  // Declare Output event emitter
  
  bookingList: BookingDetail[] = [];  // List to store booking details
  selectedBooking: BookingDetail | null = null;  // Booking detail selected for editing

  constructor(
    private bookingService: BookingDetailService,  // Service to handle booking data
    private toastr: ToastrService  // To display toast notifications
    
  ) {
    this.loadBookingList();  // Load the list of bookings on component initialization
  }

  /**
   * Fetches the list of booking details from the service.
   */
  private loadBookingList(): void {
    this.bookingService.getBookingDetails().subscribe({
      next: (res: BookingDetail[]) => {
        this.bookingList = res;
        console.log('Fetched booking list:', this.bookingList);  // Debugging log
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

  /**
   * Populates the form with the booking detail data for editing.
   * @param booking - Booking detail to populate in the form
   */
  populateForm(booking: BookingDetail): void {
    
    this.selectedBooking = { ...booking };  // Copy the selected booking for editing
    console.log('Populating form with booking data:', this.selectedBooking);
    
    // Emit the selected booking to the parent component
    this.updatedBooking.emit(this.selectedBooking); }

  /**
   * Updates the selected booking detail.
   * @param updatedBooking - Updated booking detail object
   */
  onUpdate(updatedBooking: BookingDetail): void {
    if (!updatedBooking || !updatedBooking.id) {
      console.error('Invalid booking detail for update:', updatedBooking);
      this.toastr.error('Invalid booking detail. Please try again.', 'Update Error');
      return;
    }

    this.bookingService.putBookingDetail(updatedBooking).subscribe({
      next: () => {
        console.log('Booking detail updated successfully:', updatedBooking);
        this.toastr.success('Booking detail updated successfully.', 'Update Success');
        this.selectedBooking = null;  // Clear the selected booking
        this.loadBookingList();  // Reload the list after the update
      },
      error: (err) => {
        console.error('Error updating booking detail:', err);
        this.toastr.error('Failed to update booking detail. Please try again.', 'Update Error');
      },
    });
  }

  /**
   * Cancels the edit operation.
   */
  cancelEdit(): void {
    this.selectedBooking = null;  // Clear the selected booking
    console.log('Edit operation cancelled.');
  }

  /**
   * Deletes a booking detail by ID after confirmation.

   * @param bookingId - ID of the booking detail to delete
   */
  onDelete(id: number): void {
    console.log('Attempting to delete booking with ID:', id);
    if (!id || isNaN(id)) {
      console.error('Invalid ID for delete operation:', id);
      this.toastr.error('Invalid booking detail ID. Please refresh and try again.', 'Delete Error');
      return;
    }

    const deleteConfirmation = confirm(
      'Are you sure you want to delete this booking detail? This action cannot be undone.'
    );

    if (deleteConfirmation) {
      this.bookingService.deleteBookingDetail(id).subscribe({
        next: () => {
          console.log('Booking detail with ID ${Id} deleted successfully.');
          this.toastr.success('Booking detail deleted successfully.', 'Delete Success');
          this.loadBookingList();  // Reload the list after deletion
        },
        error: (err) => {
          console.error('Error occurred while deleting booking detail:', err);
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
