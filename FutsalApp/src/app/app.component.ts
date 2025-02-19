import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { AuthService } from './shared/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterModule, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  providers: [AppComponent],
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
   
    this.checkUserRole();
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
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
  
  
}
