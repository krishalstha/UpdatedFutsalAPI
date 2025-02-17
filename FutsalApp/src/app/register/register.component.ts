import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterDetailService } from '../shared/register-detail.service'; // Updated service import
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, 
    private router: Router,
     private registerDetailService: RegisterDetailService,
     private dialogRef: MatDialogRef<RegisterComponent>,
     private dialog: MatDialog
    
    ) { // Injected RegisterDetailService
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        Roleid: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /**
   * Custom Validator: Ensure Password and Confirm Password match.
   */
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Handle the form submission.
   */
  onSignupSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    console.log('Form Submitted Successfully:', this.registerForm.value);

    // Simulate successful registration using the RegisterDetailService
    this.registerDetailService.register(this.registerForm.value).subscribe({
      next: () => {
        alert('Registration successful!');
        this.close();
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      },
    });
  }
  close(): void {
    this.dialogRef.close();
  
  
}

  /**
   * Get error messages for form fields.
   */
  getFieldError(field: string): string | null {
    const control = this.registerForm.get(field);
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
    if (field === 'confirmPassword' && this.registerForm.hasError('passwordMismatch')) {
      return 'Passwords do not match.';
    }
    return null;
  }
}
