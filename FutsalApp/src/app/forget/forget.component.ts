import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  // Import Router
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.css']
})
export class ForgotPasswordComponent {
  
  forgetForm: FormGroup;  // Declare the form group
  emailError: string = '';  // For email validation error message
  passwordError: string = '';  // For password validation error message

  constructor(private fb: FormBuilder, private router: Router,private dialogRef: MatDialogRef<ForgotPasswordComponent>) {
    // Initialize the form with validation rules
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email with validation
      oldPassword: ['', Validators.required],  // Old password required
      newPassword: ['', [Validators.required, Validators.minLength(6)]]  // New password required with min length of 6 characters
    });
  }

  // Method to handle form submission
  onResetPasswordSubmit(): void {
    if (this.forgetForm.valid) {
      const formData = this.forgetForm.value;
      console.log('Form Data:', formData);
      
      // Call your service to handle the password reset request here

      // After successful reset, navigate to login page
      this.router.navigate(['/login']);  // Redirect to the login page
    } else {
      // Show validation errors if the form is invalid
      if (this.forgetForm.get('email')?.invalid) {
        this.emailError = 'Please enter a valid email address.';
      }
      if (this.forgetForm.get('oldPassword')?.invalid) {
        this.passwordError = 'Please enter your old password.';
      }
      if (this.forgetForm.get('newPassword')?.invalid) {
        this.passwordError = 'Please enter a new password with at least 6 characters.';
      }
    }
  }
  close(): void {
    this.dialogRef.close();
  }
}
