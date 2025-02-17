import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-booking-detail-report',
  imports: [],
  templateUrl: './booking-detail-report.component.html',
  styleUrl: "./booking-detail-report.css"
})
export class BookingDetailReportComponent implements OnInit {
  futsalName: string = '';
  location: string = '';
  contactNumber: string = '';
  pricing: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.futsalName = this.route.snapshot.paramMap.get('futsalName')!;
    console.log('Futsal Name:', this.futsalName);
    this.location = this.route.snapshot.queryParamMap.get('location')!;
    this.contactNumber = this.route.snapshot.queryParamMap.get('contactNumber')!;
    this.pricing = this.route.snapshot.queryParamMap.get('pricing')!;
     console.log('Location:', this.location);
     console.log('Contact Number:', this.contactNumber);
  }
  
}