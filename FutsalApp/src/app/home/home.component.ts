import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { NgIf } from '@angular/common';
// import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  isAdmin: boolean = false;
  isLoggedIn: boolean = true;
  
  constructor(private dialog: MatDialog,
    
    private router: Router,
    private authService: AuthService
    
  ) { 
   
  }
  ngOnInit(): void{
    this.checkLoginStatus();
    this.checkUserRole();
  }
  navigateToFutsal(): void {
    this.router.navigate(['/futsal']);
  } 
     // Add the checkLoginStatus method here
     checkLoginStatus() {
      const token = localStorage.getItem('Token');
      this.isLoggedIn = !!token; // Check if user is logged in from localStorage
  
      // Subscribe to the login status
      this.authService.isLoggedIn().subscribe((status) => {
        this.isLoggedIn = status;
      });
    }
    
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
  logout(): void {
    this.authService.logout();  // Call logout method from auth service
    this.isLoggedIn = false;  // Update login status
    localStorage.clear();  // Clear local storage
  }
}