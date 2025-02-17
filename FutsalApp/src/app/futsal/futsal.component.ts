import { Component, EventEmitter, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FutsalDetailService } from '../shared/futsal-detail.service';
import { FutsalDetail } from '../shared/futsal-detail';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../shared/auth.service';
import { AppComponent } from '../app.component';



@Component({
  selector: 'app-futsal',
  standalone: true, 
  imports: [CommonModule],
  providers: [],
  templateUrl: './futsal.component.html',
  styleUrl: './futsal.css'
})
export class FutsalComponent implements OnInit {
  //isShowLogout: boolean = false;
  futsalDetails: FutsalDetail[] = [];
  isLoggedIn: boolean = false;
  loginStatusChange = new EventEmitter<boolean>();

  constructor(
    private futsalDetailService: FutsalDetailService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private appcomponent: AppComponent,
    
   
  ) {}
  ngOnInit(): void {
    const token = localStorage.getItem("Token");
    if(token){
      this.isLoggedIn =true;
    }else{
      this.isLoggedIn = false;
    }
    // Check if the user is logged in
    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;   
    });
    
    // Call the service to fetch futsal details when the component is initialized
    this.futsalDetailService.getFutsalDetails().subscribe(
      (data) => {
        this.futsalDetails = data; // Store the fetched data
      },
      (error) => {
        console.error('Error fetching futsal details:', error);
      }
    );
  }
  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,  
    });
    dialogRef.afterClosed().subscribe(() => {
      if (localStorage.getItem("Token")) {
        window.location.reload();
      }
    });
  }
  openSignupDialog(): void {
    this.dialog.open(RegisterComponent, {
      width: '400px',
      disableClose: false, // Prevent closing by clicking outside
    });
  }

  goToBooking(futsal: FutsalDetail): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/bookingscreen', futsal.futsalName], {
        queryParams: {
          location: futsal.location,
          contactNumber: futsal.contactNumber,
          pricing: futsal.pricing,
          }
      });
    } else {
      alert('Please login to book a futsal ground!');
    }
  }

  logout(): void {  
    //this.appcomponent.logout();
    this.authService.logout(); 
    this.isLoggedIn = false;  
    localStorage.clear();
  }
}