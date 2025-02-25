import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivateChild {

  constructor(private router: Router) {}

  canActivateChild(): boolean {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

    if (user && user.roleId === 'Admin') {
      return true; // Allow admin access
    } else {
      alert('Access denied! Admins only.');
      this.router.navigate(['/home']); // Redirect non-admin users
      return false;
    }
  }
}
