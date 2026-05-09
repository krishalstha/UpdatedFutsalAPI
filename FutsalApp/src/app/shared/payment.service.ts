import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from './payment.model'; // Assuming the model file path

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  // NOTE: Replace with your actual API base URL if different
  private apiUrl = 'https://localhost:5001/api/Payment'; 

  getPaymentsByBookingId(bookingId: number): Observable<Payment[]> {
    const params = new HttpParams().set('bookingId', bookingId.toString());
    // Use the query parameter approach
    return this.http.get<Payment[]>(this.apiUrl, { params });
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  updatePayment(id: number, payment: Payment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
