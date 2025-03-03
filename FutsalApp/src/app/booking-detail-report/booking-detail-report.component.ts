import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-booking-detail-report',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './booking-detail-report.component.html',
  styleUrl: "./booking-detail-report.css"
})
export class BookingDetailReportComponent implements OnInit {
  isAdmin: boolean = false;
  isLoggedIn: boolean = true;
  futsalName: string = '';
  location: string = '';
  contactNumber: string = '';
  pricing: string = '';

  constructor(private route: ActivatedRoute) {}
  checkUserRole() {
    const userData = localStorage.getItem('loggedInUser'); // ✅ Fetch stored user data
    if (userData) {
      const parsedUser = JSON.parse(userData); // ✅ Parse JSON
      this.isAdmin = parsedUser.roleId === 'Admin'; // ✅ Compare role
    } else {
      this.isAdmin = false; // Default to false if no user data found
    }
    console.log("Is Admin:", this.isAdmin); // ✅ Debugging log
  }
  ngOnInit(): void {
    this.checkUserRole();
    this.futsalName = this.route.snapshot.paramMap.get('futsalName')!;
    console.log('Futsal Name:', this.futsalName);
    this.location = this.route.snapshot.queryParamMap.get('location')!;
    this.contactNumber = this.route.snapshot.queryParamMap.get('contactNumber')!;
    this.pricing = this.route.snapshot.queryParamMap.get('pricing')!;
     console.log('Location:', this.location);
     console.log('Contact Number:', this.contactNumber);
  }
  
}