import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FutsalDetail } from '../shared/futsal-detail';
import { FutsalDetailService } from '../shared/futsal-detail.service';
import { FutsalDetailFormComponent } from "../FutsalDetails/futsal-detail-form/futsal-detail-form.component";

@Component({
  selector: 'app-futsal-details',
  templateUrl: './futsal-details.component.html',
  standalone: true,
  imports: [CommonModule, FutsalDetailFormComponent],
})
export class FutsalDetailsComponent {

  futsalList: FutsalDetail[] = []; // List to store futsal details
  selectedFutsal: FutsalDetail | null = null; // Futsal detail selected for editing

  constructor(
    private futsalService: FutsalDetailService, // Service to handle futsal data
    private toastr: ToastrService // To display toast notifications
  ) {
    this.loadFutsalList(); // Load the list on component initialization
  }

  /**
   * Fetches the list of futsal details from the service.
   */
  private loadFutsalList(): void {
    this.futsalService.getFutsalDetails().subscribe({
      next: (res: FutsalDetail[]) => {
        this.futsalList = res;
        if (this.futsalList.length === 0) {
          this.toastr.info('No futsal details found.', 'Information');
        }
      },
      error: (err: any) => {
        console.error('Error loading futsal details:', err);
        this.toastr.error('Failed to load futsal details.', 'Error');
      },
    });
  }

  /**
   * Populates the form with futsal detail data for editing.
   * @param futsal - Futsal detail to populate in the form
   */
  populateForm(futsal: FutsalDetail): void {
    this.selectedFutsal = { ...futsal }; // Create a copy of the selected futsal for editing
    console.log('Populating form with futsal data:', this.selectedFutsal);
  }
  
  
  /**
   * Updates the selected futsal detail.
   * @param updatedFutsal - Updated futsal detail object
   */
  onUpdate(updatedFutsal: FutsalDetail): void {
    if (!updatedFutsal || !updatedFutsal.futsalId) {
      console.error('Invalid futsal detail for update:', updatedFutsal);
      this.toastr.error('Invalid futsal detail. Please try again.', 'Update Error');
      return;
    }

    this.futsalService.putFutsalDetail(updatedFutsal).subscribe({
      next: () => {
        console.log('Futsal detail updated successfully:', updatedFutsal);
        this.toastr.success('Futsal detail updated successfully.', 'Update Success');
        this.selectedFutsal = null; // Clear the selected futsal
        this.loadFutsalList(); // Reload the list after the update
      },
      error: (err) => {
        console.error('Error updating futsal detail:', err);
        this.toastr.error('Failed to update futsal detail. Please try again.', 'Update Error');
      },
    });
  }

  /**
   * Cancels the edit operation.
   */
  cancelEdit(): void {
    this.selectedFutsal = null; // Clear the selected futsal
    console.log('Edit operation cancelled.');
  }

  /**
   * Deletes a futsal detail by ID after confirmation.
   * @param futsalDetailId - ID of the futsal detail to delete
   */
  onDelete(futsalDetailId: number): void {
    if (!futsalDetailId || isNaN(futsalDetailId)) {
      console.error('Invalid ID for delete operation:', futsalDetailId);
      this.toastr.error('Invalid futsal detail ID. Please refresh and try again.', 'Delete Error');
      return;
    }

    const deleteConfirmation = confirm(
      'Are you sure you want to delete this futsal detail? This action cannot be undone.'
    );

    if (deleteConfirmation) {
      this.futsalService.deleteFutsalDetail(futsalDetailId).subscribe({
        next: () => {
          console.log('Futsal detail deleted successfully.');
          this.toastr.success('Futsal detail deleted successfully.', 'Delete Success');
          this.loadFutsalList(); // Reload the list after deletion
        },
        error: (err) => {
          console.error('Error occurred while deleting futsal detail:', err);
          if (err.status === 404) {
            this.toastr.error('Futsal detail not found.', 'Delete Error');
          } else if (err.status === 500) {
            this.toastr.error('Server error occurred while deleting the futsal detail.', 'Delete Error');
          } else {
            this.toastr.error('Failed to delete the futsal detail. Please try again.', 'Delete Error');
          }
        },
      });
    }
  }
}
