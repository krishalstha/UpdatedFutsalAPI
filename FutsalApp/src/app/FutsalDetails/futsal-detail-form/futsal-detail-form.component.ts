import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FutsalDetail } from '../../shared/futsal-detail';
import { FutsalDetailService } from '../../shared/futsal-detail.service';
import { ImageService } from 'src/app/shared/Image.service';

@Component({
  selector: 'app-futsal-detail-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './futsal-detail-form.component.html',
  styleUrls: ['./futsal-detail-form.css'],
})
export class FutsalDetailFormComponent implements OnChanges {
  image: string = '';
  formSubmitted: boolean = false;
  formData: FutsalDetail = this.initializeFormData();
  selectedFile: File | null = null;
  selectedFileUrl: string | null = null;

  @Input() futsalForEdit: FutsalDetail | null = null;

  constructor(
    private futsalService: FutsalDetailService,
    private toastr: ToastrService,
    private imageService: ImageService
  ) {}

  /**
   * Initialize default form data.
   */
  private initializeFormData(): FutsalDetail {
    return {
      futsalId: null,
      futsalName: '',
      location: '',
      contactNumber: '',
      email: '',
      description: '',
      pricing: '',
      operationHours: '', 
      court: '',
      image: '',
    };
  }

  /**
   * Populate the form with selected futsal details for editing or fetch data if necessary.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['futsalForEdit'] && this.futsalForEdit) {
      console.log('Populating form with futsal data:', this.futsalForEdit);
      this.formData = { ...this.futsalForEdit };

      // Fetch operationHours if not already present in futsalForEdit
      if (!this.formData.operationHours) {
        this.fetchOperationHours();  // Ensure it's fetching operationHours
      }
    }
  }

  /**
   * Handle image file input change.
   */
  onImageChange(event: any) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      this.selectedFile = file;  // Store the file for later upload
      this.formData.image = file.name;  // Set the file name in form data (or use a data URL if preferred)

      const reader = new FileReader();  // Create a new FileReader instance
      reader.onload = (e: any) => {
        this.selectedFileUrl = e.target.result;  // Set the data URL for the image preview
      };
      reader.readAsDataURL(file);  // Read the file as a data URL (base64 encoded)
    }
  }

  /**
   * Fetch operation hours from the API.
   */
  private fetchOperationHours(): void {
    this.futsalService.getFormData().subscribe({
      next: (data) => {
        if (data && data.operationHours) {
          this.formData.operationHours = data.operationHours;  // Change here
          console.log('Fetched operation hours:', this.formData.operationHours);  // Log the result
        } else {
          this.formData.operationHours = 'Not available'; // Fallback value
          console.warn('Operation hours not found in the response:', data);
          this.toastr.warning('Operation hours are not available at the moment.', 'Warning');
        }
      },
      error: (err) => {
        this.formData.operationHours = 'Not available'; // Fallback value
        console.error('Error fetching operation hours:', err);
        this.toastr.error('Failed to fetch operation hours.', 'API Error');
      },
    });
  }

  /**
   * Handle form submission.
   */
  onSubmit(form: NgForm): void {
    if (this.formSubmitted) return; // Prevent duplicate submissions
    this.formSubmitted = true;

    if (!this.isFormValid(form)) {
      this.formSubmitted = false; // Allow resubmission after fixing errors
      return;
    }

    this.formData.futsalId ? this.updateRecord(form) : this.insertRecord(form);
  }

  /**
   * Validate the form.
   */
  private isFormValid(form: NgForm): boolean {
    console.log('Form Validity:', form.valid);
    console.log('Form Data:', this.formData);

    if (!form.valid) {
      this.toastr.error('Please fill all the required fields.', 'Form Error');
      return false;
    }

    if (!this.formData.futsalName.trim()) {
      this.toastr.error('Futsal Name is required.', 'Validation Error');
      return false;
    }

    if (!/^\d{10}$/.test(this.formData.contactNumber)) {
      this.toastr.error('Contact number must be exactly 10 digits.', 'Validation Error');
      return false;
    }

    if (!this.isEmailValid(this.formData.email)) {
      this.toastr.error('Please provide a valid email address.', 'Validation Error');
      return false;
    }

    return true;
  }

  /**
   * Check if an email is valid.
   */
  private isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Insert a new record.
   */
  private insertRecord(form: NgForm): void {
    console.log('Payload being sent:', this.formData);
    
    // Ensure the image is included
    this.formData.image = this.selectedFile ? this.selectedFile.name : '';  // or base64 string if needed

    this.futsalService.postFutsalDetail(this.formData).subscribe({
      next: () => {
        this.toastr.success('Record inserted successfully!', 'Futsal Detail');
        this.uploadimage();  // Upload the image after the record is inserted
        this.resetForm(form);
      },
      error: (err) => {
        console.error('Insert Error:', err);
        this.toastr.error('Failed to insert the record.', 'Insert Error');
      },
    });
  }

  /**
   * Upload image after record insert.
   */
  uploadimage() {
    if (!this.selectedFile) {
      this.toastr.warning('No image selected to upload.', 'Warning');
      return;
    }
  
    this.imageService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        this.toastr.success('Image uploaded successfully!', 'Upload Success');
        console.log('Image Upload Response:', response);
      },
      error: (err) => {
        console.error('Image Upload Error:', err);
        this.toastr.error('Failed to upload image.', 'Upload Error');
      },
    });
  }

  /**
   * Update an existing record.
   */
  private updateRecord(form: NgForm): void {
    console.log('Payload being sent for update:', this.formData);

    this.futsalService.putFutsalDetail(this.formData).subscribe({
      next: () => {
        this.toastr.info('Record updated successfully!', 'Futsal Detail');
        this.resetForm(form);
      },
      error: (err) => {
        console.error('Update Error:', err);
        this.toastr.error('Failed to update the record.', 'Update Error');
      },
      complete: () => (this.formSubmitted = false),
    });
  }

  /**
   * Reset the form.
   */
  private resetForm(form: NgForm): void {
    form.resetForm();
    this.formData = this.initializeFormData();
    this.formSubmitted = false;
  }

  /**
   * Restrict contact number input to numeric only and limit to 10 digits.
   */
  onNumberInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '').slice(0, 10);
    (event.target as HTMLInputElement).value = input;
    this.formData.contactNumber = input;
  }
}
