import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingDetailService } from '../shared/booking-detail.service';

interface ReportData {
  bookingId: number;
  email: string; 
  FutsalName: string; 
  selectDate: string;
  selectTime: string;
  selectDuration: number;
  price: string; // Or number if numeric
  status: string; // optional
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [DatePipe]
})
export class ReportComponent implements OnInit {
  reportData: ReportData[] = [];
  totalBookings: number = 0;
  totalIncome: number = 0;

  constructor(
    private bookingService: BookingDetailService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.bookingService.getBookingDetails().subscribe(
      (data) => {
        // Map BookingDetail[] → ReportData[]
        this.reportData = data.map((b: any) => ({
          bookingId: b.id,
          email: b.email,
          FutsalName: b.futsalName,
          selectDate: b.selectDate,
          selectTime: b.selectTime,
          selectDuration: b.selectDuration,
          price: b.price,
          status: b.status || 'Pending'
        }));
  
        this.totalBookings = this.reportData.length;
        this.totalIncome = this.reportData.reduce(
          (sum, item) => sum + this.parsePrice(item.price),
          0
        );
      },
      (error) => console.error('Error loading report:', error)
    );
  }
  

  parsePrice(price: string | number): number {
    return typeof price === 'number' ? price : parseFloat(price);
  }

  formatDate(dateString: string): string {
    return this.datePipe.transform(dateString, 'short') || '';
  }
}
