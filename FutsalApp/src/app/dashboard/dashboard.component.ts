import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BookingDetailService } from '../shared/booking-detail.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

// Booking Interface
interface Booking {
  date: string;
  time: string;
  duration: number; // Duration in minutes
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  weekDays: { date: string }[] = []; // Stores 'YYYY-MM-DD' format
  timeSlots: string[] = [];
  bookings: Booking[] = [];

  constructor(
    private bookingService: BookingDetailService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.generateWeekDays();
    this.generateTimeSlots();
    this.fetchBookings();
  }

  generateWeekDays() {
    const today = new Date();
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      return { date: day.toISOString().split('T')[0] }; // 'YYYY-MM-DD'
    });
  }

  generateTimeSlots() {
    this.timeSlots = Array.from({ length: 15 }, (_, i) =>
      `${String(6 + i).padStart(2, '0')}:00`
    );
  }

  fetchBookings() {
    this.bookingService.getBookings().subscribe(
      (data: any[]) => {
        console.log('Bookings data received:', data);
        this.bookings = data.map((booking) => ({
          date: booking.selectDate.split('T')[0], // 'YYYY-MM-DD'
          time: booking.selectTime.substring(0, 5), // 'HH:mm'
          duration: booking.selectDuration ? parseInt(booking.selectDuration) * 60 : 60
        }));
        console.log('Processed bookings:', this.bookings);
        this.cdr.detectChanges(); // Force UI update
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching bookings:', error);
      }
    );
  }
  onBookingClick(date: string, time: string): void {
    // Check if the slot is booked
    if (this.isBooked(date, time)) {
      // Redirect to the booking details page for accepted bookings
      this.router.navigate(['/admin-dashboard/acceptbookings'], { queryParams: { date, time } });
    } else {
      // Redirect to a booking page for available slots
      this.router.navigate(['/admin-dashboard/bookingscreen/:futsalName'], { queryParams: { date, time } });
    }
  }
  
  isBooked(date: string, time: string): boolean {
    return this.bookings.some((booking) => {
      const bookingStart = this.convertTimeToMinutes(booking.time);
      const bookingEnd = bookingStart + booking.duration;

      const slotTime = this.convertTimeToMinutes(time);
      const booked = booking.date === date && slotTime >= bookingStart && slotTime < bookingEnd;

      if (booked) {
        console.log(`Slot booked: ${date} at ${time}`);
      }

      return booked;
    });
  }

  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  bookSlot(date: string, time: string): void {
    if (this.isBooked(date, time)) {
      alert('This slot is already booked!');
      return;
    }

    this.bookingService.bookSlot({ date, time }).subscribe(() => {
      this.bookings.push({ date, time, duration: 60 });
      this.cdr.detectChanges();
      alert('Booking successful!');
    });
  }

  trackByFn(index: number, item: any): any {
    return item;
  }
}
