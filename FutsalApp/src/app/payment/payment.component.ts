import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Payment, PaymentModel } from '../shared/payment.model';
import { PaymentService } from '../shared/payment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  @Input() bookingId!: number;
  @Input() finalPrice: number | null = null;
  displayFinalPrice : number | null = null;

  payments: Payment[] = [];
  newPayments: Payment[] = [];
  editingPayment: Payment | null = null;

  PaymentModel = PaymentModel;
  paymentModels = Object.entries(PaymentModel)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ key, value }));

  constructor(private paymentService: PaymentService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.displayFinalPrice = this.finalPrice;//200;
    if (this.bookingId) this.loadPayments();
console.log('Final Price received in PaymentComponent:', this.finalPrice);
    // Initialize with one payment row
    this.newPayments = [{ paymentModelId: PaymentModel.Esewa, totalAmount: this.finalPrice ?? 0 }];
  }

  getPaymentModelName(id: PaymentModel): string {
    return this.paymentModels.find(m => m.value === id)?.key || 'Unknown';
  }

  // Load existing payments
  loadPayments(): void {
    if (!this.bookingId) return;
    this.paymentService.getPaymentsByBookingId(this.bookingId).subscribe({
      next: data => (this.payments = data),
      error: err => {
        console.error('Error fetching payments:', err);
        this.payments = [];
      }
    });
  }

  // Add new payment row
  addPaymentRow(): void {
    const last = this.newPayments[this.newPayments.length - 1];
    if (!last.paymentModelId || !last.totalAmount) {
      this.toastr.error('Please fill the current row before adding a new one.');
      return;
    }
    this.newPayments.push({ paymentModelId: PaymentModel.Esewa, totalAmount: 0 });
  }

  // Remove payment row
  removePaymentRow(index: number): void {
    this.newPayments.splice(index, 1);
  }

  // Submit all payments
  submitAllPayments(form: NgForm): void {
    if (form.invalid) {
      this.toastr.error('Form Error', 'Please fill all required fields.');
      return;
    }

    if (!this.bookingId) return;

    const paymentsToAdd = this.newPayments.map(p => ({
      ...p,
      bookingId: this.bookingId
    }));

    const totalEntered = paymentsToAdd.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
    if (totalEntered !== this.finalPrice) {
      this.toastr.warning(
        `Total payment (Rs. ${totalEntered}) does not match booking price (Rs. ${this.finalPrice})`
      );
    }

    paymentsToAdd.forEach(p => {
      this.paymentService.createPayment(p).subscribe(() => this.loadPayments());
    });

    // Reset rows
    this.newPayments = [{ paymentModelId: PaymentModel.Esewa, totalAmount: 0 }];
    form.resetForm();
  }

  // Edit payment
  editPayment(payment: Payment): void {
    this.editingPayment = { ...payment, bookingId: this.bookingId };
  }

  // Update payment
  updatePayment(form: NgForm): void {
    if (!this.editingPayment?.id || form.invalid) {
      this.toastr.error('Please fill all required fields.');
      return;
    }

    this.paymentService.updatePayment(this.editingPayment.id, this.editingPayment)
      .subscribe(() => {
        this.loadPayments();
        this.editingPayment = null;
        form.resetForm();
      });
  }

  // Delete payment
  deletePayment(id: number): void {
    this.paymentService.deletePayment(id).subscribe(() => this.loadPayments());
  }

  cancelEdit(): void {
    this.editingPayment = null;
  }
}
