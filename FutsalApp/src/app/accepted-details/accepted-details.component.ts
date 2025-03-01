import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingDetailService } from '../shared/booking-detail.service';
import { ToastrService } from 'ngx-toastr';
import { BookingDetail } from '../shared/BookingDetail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accepted-details',
  templateUrl: './accepted-details.component.html',
  styleUrls: ['./accepted-details.css'],
  standalone: true,
  imports: [CommonModule],
})
export class AcceptedDetailsComponent implements OnInit {
  bookingDetail: BookingDetail | null = null;
  

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingDetailService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('id');
    console.log('Booking ID from route:', bookingId);
    console.log('Route Params:', this.route.snapshot.paramMap); // Debugging log

    if (bookingId && !isNaN(Number(bookingId))) {
      this.loadBookingDetail(Number(bookingId)); // Load booking details if ID is valid
    } else {
      this.toastr.error('Invalid booking ID.', 'Error'); // Error notification
    }
  }

  private loadBookingDetail(id: number): void {
    this.bookingService.getBookingDetailById(id).subscribe({
      next: (res: BookingDetail) => {
        this.bookingDetail = res;
        console.log('Booking details loaded:', this.bookingDetail); // Debugging log
      },
      error: (err) => {
        this.toastr.error('Failed to fetch booking details.', 'Error'); // User-friendly error message
        console.error('Error fetching booking details:', err); // Log the error for debugging
      },
    });
  }
}
