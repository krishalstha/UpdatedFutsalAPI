import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router'; 
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterComponent } from '../register/register.component';
import { ForgotPasswordComponent } from '../forget/forget.component';
import { CommonModule } from '@angular/common';
import { LoginDetailService } from '../shared/login-detail.service';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.css'], // Fixed `styleUrl` typo to `styleUrls`
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private loginService: LoginDetailService,
    private fb: FormBuilder, 
    private router: Router,
    private loginDetailService: LoginDetailService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private dialog: MatDialog,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  /**
   * Handle login form submission.
   */
  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }
  
    const { email, password } = this.loginForm.value;
  
    this.loginDetailService.login({  email, password }).subscribe({
      next: (response: any) => {
        if (response && response.roleId ) {
          const roleId = response.roleId;
  
          // Store user details in localStorage
          localStorage.setItem('loggedInUser', JSON.stringify({  email, roleId }));
  
          // Display role-based success message
          switch (roleId) {
            case 'Admin':
              alert('Admin login successful!');
              this.router.navigateByUrl('/admin-dashboard');
              
              break;
            case 'User':
              alert('User login successful!');
              this.router.navigateByUrl('/futsal');
              break;
            default:
              alert('Login successful, but role not recognized.');
              console.error('Unknown role:', roleId);
          }

          this.closeDialog(); // Close the dialog after login
          localStorage.setItem("Token","fhgfhjfghfghfghfghfghfhfhjhf");
        } else {
          alert('Invalid login response. Please try again.');
        }
      },
      error: (err: any) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials and try again.');
      },
    });
  }

  /**
   * Close the login dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  /**
   * Open the signup dialog.
   */
  openSignup(): void {
    this.closeDialog(); // Close current dialog
    this.dialog.open(RegisterComponent, {
      width: '400px',
      disableClose: false,
    });
  }

  /**
   * Open the forgot password dialog.
   */
  openForgetPassword(): void {
    this.closeDialog(); // Close current dialog
    this.dialog.open(ForgotPasswordComponent, {
      width: '400px',
      disableClose: false,
    });
  }

  /**
   * Get error messages for form fields.
   */
  getFieldError(field: string): string | null {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
    }
    if (control?.hasError('email')) {
      return 'Enter a valid email address.';
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `Password must be at least ${requiredLength} characters long.`;
    }
    return null;
  }
}
