import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FutsalDetailService } from '../shared/futsal-detail.service';
import { FutsalDetail } from '../shared/futsal-detail';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../shared/auth.service';
import { AppComponent } from '../app.component';
import { ImageService } from 'src/app/shared/Image.service';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-futsal',
  standalone: true,
  imports: [CommonModule],
  providers: [],
  templateUrl: './futsal.component.html',
  styleUrls: ['./futsal.css']
})
export class FutsalComponent implements OnInit {

  imageUrls: Map<string, string> = new Map();  // Use a Map to store images per futsal
  futsalDetails: FutsalDetail[] = [];
  isAdmin: boolean = false;
  isLoggedIn: boolean = false;
  loginStatusChange = new EventEmitter<boolean>();

  constructor(
    private futsalDetailService: FutsalDetailService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private appcomponent: AppComponent,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    this.isLoggedIn = !!token; // Check if user is logged in from localStorage

    // Subscribe to the login status
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
    });

    // Fetch futsal details when component initializes
    this.futsalDetailService.getFutsalDetails().subscribe(
      (data) => {
        this.futsalDetails = data; // Store the fetched data
        this.futsalDetails.forEach((futsal) => {
          if (futsal.image) { // Ensure image is defined before attempting to load
            this.loadImage(futsal); // Load image for each futsal
          }
        });
      },
      (error) => {
        console.error('Error fetching futsal details:', error);
      }
    );
  }

 

  fetchFutsalDetails(): void {
    this.futsalDetailService.getFutsalDetails().subscribe((data) => {
      this.futsalDetails = data;
      this.futsalDetails.forEach((futsal) => {
        if (futsal.image) { // Ensure image is defined
          this.loadImage(futsal);
        }
      });
    });
  }

  loadImage(futsal: FutsalDetail): void {
    if (futsal.image) {
      this.imageService.getImage(futsal.image).subscribe((imageBlob) => {
        const objectURL = URL.createObjectURL(imageBlob);
        this.imageUrls.set(futsal.futsalName, objectURL);  // Store the URL in the map
      });
    }
  }
  getImageUrl(futsal: FutsalDetail): string {
    return this.imageUrls.get(futsal.futsalName) || '';  // Return the image URL for the specific futsal
  }
  

  goToBooking(futsal: FutsalDetail): void {
    if (this.isLoggedIn) {
      // Navigate to booking screen with futsal details as query params
      this.router.navigate(['/bookingscreen', futsal.futsalName], {
        queryParams: {
          location: futsal.location,
          contactNumber: futsal.contactNumber,
          pricing: futsal.pricing,
        },
      });
    } else {
      alert('Please login to book a futsal ground!');
    }
  }

  
}
