import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { AuthService } from './shared/auth.service';
import { NgIf } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  providers: [],
  styleUrls: ['./app.component.css']  // Corrected from styleUrl to styleUrls
})
export class AppComponent implements OnInit {
  isMenuOpen = false;
  isAdmin: boolean = false;
  isLoggedIn: boolean = true;
  loginStatusChange = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.checkUserRole();
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
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
  
  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      disableClose: false,
      autoFocus: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      if (localStorage.getItem('Token')) {
        this.isLoggedIn = true;  // Update login status
        window.location.reload(); // Reload the page after successful login
      }
    });
  }

  openSignupDialog(): void {
    this.dialog.open(RegisterComponent, {
      width: '400px',
      disableClose: false,
    });
  }

  logout(): void {
    this.authService.logout();  // Call logout method from auth service
    this.isLoggedIn = false;  // Update login status
    localStorage.clear();  // Clear local storage
  }
}
