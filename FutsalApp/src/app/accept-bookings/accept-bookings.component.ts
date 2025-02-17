import { Component, Input } from '@angular/core';
import { BookingDetail } from '../shared/BookingDetail';
import { CommonModule, NgIf } from '@angular/common';
import { BookingDetailService } from '../shared/booking-detail.service';

@Component({
  selector: 'app-accept-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accept-bookings.component.html',
  styles: ``
})
export class AcceptBookingsComponent {
@Input() bookingDetail: BookingDetail[] = [];
booking: any;

component(
){}
}
