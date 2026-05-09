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
        // Retrieve the stored value and ensure it's a string, defaulting to 'user'.
        // If userRole is undefined or null, it defaults to 'user'.
        const storedRole = localStorage.getItem('userRole') || 'user';
        
        // Normalize to a consistent lowercase string for comparison
        const normalizedRole = String(storedRole).toLowerCase();
    
        // If the role is numeric '1' or the string 'admin', return 'admin'.
        if (normalizedRole === 'admin' || normalizedRole === '1') {
          return 'admin';
        }
        
        // Fallback for all other non-admin roles (e.g., 'user', '2', or the default 'user')
        // This is typically done to ensure only authorized roles like 'admin' are explicitly checked.
        return 'user';
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
            console.log('API Role ID:', userRole); // ⬅️ CHECK THIS VALUE!
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
