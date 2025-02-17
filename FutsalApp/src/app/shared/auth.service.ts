import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private apiUrl = 'https://localhost:5001/api'; // Adjust to your actual API endpoint

  constructor(private http: HttpClient, private router: Router) {
    // Check if user is already logged in from localStorage when the app starts
    if (localStorage.getItem('loggedInUser')) {
      this.loggedIn.next(true);
    }
  }
  getUserRole(): string {
    // Example: Retrieve user role from localStorage or API
    return localStorage.getItem('userRole') || 'user';
  }

  // Get logged-in user details (for example, user data)
  getLoggedInUser() {
    const userData = localStorage.getItem('loggedInUser');
    return userData ? JSON.parse(userData) : null;
  }

  // Login function
  login(credentials: { email: string, password: string }) {
    return this.http.post<any>(`${this.apiUrl}/Login`, credentials).subscribe(
      (response) => {
        if (response.User) {
          localStorage.setItem('loggedInUser', JSON.stringify(response.User));

          // ✅ Extract and store the correct role from "roleId"
        const userRole = response.User.roleId; // "User" or "Admin"
        if (userRole) {
        localStorage.setItem('userRole', userRole);
        }
           this.loggedIn.next(true);  // Notify that the user is logged in
          this.router.navigate(['/home']);  // Navigate to home or the appropriate route
        }
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }

  // Logout function
  logout() {
    localStorage.removeItem('loggedInUser')
    this.loggedIn.next(false)// Notify that the user is logged out
    this.router.navigate(['/home']) // Redirect to home or login page
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
