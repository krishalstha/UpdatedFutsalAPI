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
  contactNumber?: string;
}

@Component({
  selector: 'app-bdashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule],
})
export class BDashboardComponent implements OnInit {
  weekDays: { date: string }[] = []; // Stores 'YYYY-MM-DD' format
  timeSlots: string[] = [];
  bookings: Booking[] = [];
  futsalNames: string[] = [];
  selectedFutsalName: string = 'All Futsals'; // Default filter
  showFutsalDropdown: boolean = false; // State for dropdown visibility
  currentStartDate: Date = new Date();
  weekStart: Date = new Date();
  weekEnd: Date = new Date();
  isPastWeek: boolean = false;

  constructor(
    private bookingService: BookingDetailService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.generateWeekDays();
    this.generateTimeSlots();
    this.updateWeekStatus();   // <-- REQUIRED
    this.fetchFutsalNames(1);
  }
  fetchFutsalNames(indexToSelect?: number): void {
    this.bookingService.getFutsalNames().subscribe({
      next: (names) => {
        this.futsalNames = ['All Futsals', ...names]; // Add 'All Futsals' option
        // The default selectedFutsalName is already 'All Futsals'
        if (indexToSelect !== undefined && names.length > indexToSelect) {
            this.selectedFutsalName = names[indexToSelect];
            // Since the name is now set, fetch the bookings for this specific futsal.
            this.fetchBookings(); 
        } else {
             // Fallback for when there is only one or no futsals.
             this.fetchBookings();
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching futsal names:', err);
      }
    });
  }

  // ✅ New: Toggle the dropdown visibility
  toggleFutsalDropdown(): void {
    this.showFutsalDropdown = !this.showFutsalDropdown;
  }

  // ✅ New: Set the filter and refresh bookings
  selectFutsalName(futsalName: string): void {
    this.selectedFutsalName = futsalName;
    this.showFutsalDropdown = false; // Close dropdown after selection
    this.fetchBookings(); // Refresh the data for the selected futsal
  }

  generateWeekDays() {
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(this.currentStartDate);
      day.setDate(this.currentStartDate.getDate() + i);
      return { date: day.toISOString().split('T')[0] };
    });
  
    this.weekStart = new Date(this.currentStartDate);
    this.weekEnd = new Date(this.currentStartDate);
    this.weekEnd.setDate(this.currentStartDate.getDate() + 6);
  }
  updateWeekStatus() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const start = new Date(this.weekStart);
    start.setHours(0, 0, 0, 0);
  
    // If the weekStart is earlier than today's week → past week
    this.isPastWeek = start < today;
  }
  
  previousWeek() {
    this.currentStartDate.setDate(this.currentStartDate.getDate() - 7);
    this.generateWeekDays();
    this.updateWeekStatus();  // <-- dynamically check
    this.fetchBookings();
  }
  
  nextWeek() {
    this.currentStartDate.setDate(this.currentStartDate.getDate() + 7);
    this.generateWeekDays();
    this.updateWeekStatus(); // <-- dynamically check
    this.fetchBookings();
  }
    

  generateTimeSlots() {
    const startHour = 6; // 6 AM
    const endHour = 18;  // 6 PM
    this.timeSlots = [];
  
    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      this.timeSlots.push(`${formattedHour}:00`);
    }
  }
  
  fetchBookings() {
    // Only pass the name if it's not the default 'All Futsals'
    const nameToFetch = this.selectedFutsalName !== 'All Futsals' ? this.selectedFutsalName : undefined;
    
    this.bookingService.getBookings(nameToFetch).subscribe( // Pass the optional parameter
      (data: any[]) => {
        // ... (rest of your existing logic for mapping bookings) ...
        console.log('Bookings data received:', data);
        this.bookings = data.map((booking) => {
          let durationMinutes = 60;
          if (booking.selectDuration === '30 mins') {
            durationMinutes = 30;
          } else if (booking.selectDuration === '2 hours') {
            durationMinutes = 120;
          }
          
          return {
            date: booking.selectDate.split('T')[0],  // 'YYYY-MM-DD'
            time: booking.selectTime.substring(0, 5),  // 'HH:mm'
            duration: durationMinutes,
            contactNumber: booking.contactNumber || '' 
          };
        });
        this.cdr.detectChanges();  // Force UI update
      },
      // ... (rest of error handling) ...
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
    // Get current slot's start and end times (assuming each slot is 1 hour)
    const slotStart = this.convertTimeToMinutes(time);
    const slotEnd = slotStart + 60; // Assuming each display slot is 1 hour
    
    return this.bookings.some((booking) => {
      const bookingStart = this.convertTimeToMinutes(booking.time);
      const bookingEnd = bookingStart + booking.duration;
      
      // Check for any overlap between booking and current slot
      return booking.date === date && 
             ((bookingStart < slotEnd && bookingEnd > slotStart) || 
              (bookingStart === slotStart));
    });
  }
  
  onBookingUpdated(updatedBooking: { date: string, time: string, duration: number }) {
    // Find the existing booking if it exists
    const index = this.bookings.findIndex(booking => booking.date === updatedBooking.date && booking.time === updatedBooking.time);
    
  
    if (index !== -1) {
      // Update existing booking
      this.bookings[index] = updatedBooking;
    } else {
      // Add new booking
      this.bookings.push(updatedBooking);
    }
  
    console.log('Updated Bookings:', this.bookings);
    this.cdr.detectChanges(); // Update the UI
  }
  
  getBookingPhoneNumber(date: string, time: string): string {
    const slotStart = this.convertTimeToMinutes(time);
  
    const booking = this.bookings.find(b => {
      const bookingStart = this.convertTimeToMinutes(b.time);
      const bookingEnd = bookingStart + b.duration;
      return b.date === date && slotStart >= bookingStart && slotStart < bookingEnd;
    });
  
    return booking ? booking.contactNumber || 'No phone number available' : 'No booking';
  }
  
  
  isBookingStartTime(booking: Booking, time: string): boolean {
    return booking.time === time; // Ensures phone number only appears in the first slot
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
