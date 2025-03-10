import { Component, OnInit } from '@angular/core';
import { BookingDetailService } from '../shared/booking-detail.service';
import { AcceptBookingsService } from '../shared/accept-bookings.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  totalBookings: number = 0;
  totalIncome: number = 0;

  constructor(
    private bookingscreenService: BookingDetailService,
    private acceptbookingsService: AcceptBookingsService
  ) {}

  ngOnInit(): void {
    this.getReportData();
  }

  getReportData(): void {
    this.bookingscreenService.getBookingDetails().subscribe(
      (bookingDetails) => {
        this.totalBookings = bookingDetails.length;
        this.calculateTotalIncome(bookingDetails);
      },
      (error) => {
        console.error('Error fetching booking details:', error);
      }
    );
  }

  calculateTotalIncome(bookingDetails: any[]): void {
    this.totalIncome = 0;
    
    bookingDetails.forEach((booking) => {
      const pricePerBooking = this.parsePrice(booking.price); // Get the pricing directly from the backend
      this.totalIncome += pricePerBooking; // Add to total income
    });
  }

  // Parse the price string and return the price per booking as a number
  parsePrice(price: string): number {
    return parseFloat(price); // Converts price from string to float
  }
}
