// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class PaymentService {
//   private apiUrl = 'https://localhost:5001/api/esewa';

//   constructor(private http: HttpClient) {}

//  // Make the payment request to the backend
//  makePayment(amount: number, transactionId: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/pay`, { amount, transactionId });
//   }

//   // Check the payment status (you can use this method after initiating the payment)
//   checkPaymentStatus(transactionId: string): Observable<any> {
//     return this.http.get<any>(`${this.apiUrl}/check-status/${transactionId}`);
//   }
// }
