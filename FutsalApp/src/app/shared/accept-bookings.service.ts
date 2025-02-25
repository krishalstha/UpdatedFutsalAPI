import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AcceptBookings } from './accept-bookings';

@Injectable({
  providedIn: 'root',
})
export class AcceptBookingsService {
  private apiUrl = 'https://localhost:5001/api/AcceptBookings';

  constructor(private http: HttpClient) {}

  // Get all bookings
  getBookings(): Observable<AcceptBookings[]> {
    return this.http.get<AcceptBookings[]>(this.apiUrl);
  }

  // Helper method to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Adjust token retrieval as needed
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Accept a booking by sending a POST request to the API.
   * @param booking - The booking detail object to accept.
   * @returns Observable of the response.
   */
  acceptBooking(booking: AcceptBookings): Observable<any> {
    if (!booking.BookingId) {
        console.error('Error: BookingId is missing!');
        return throwError(() => new Error('BookingId is required'));
    }

    // Ensure DateTime is properly formatted
    let DateTime = '';
    if (booking.DateTime) {
        const parsedDate = new Date(booking.DateTime);
        if (!isNaN(parsedDate.getTime())) {
            DateTime = parsedDate.toISOString(); // Convert only if valid
        } else {
            console.error('Invalid DateTime value:', booking.DateTime);
            return throwError(() => new Error('Invalid DateTime value'));
        }
    } else {
        console.error('Missing DateTime value:', booking.DateTime);
        return throwError(() => new Error('DateTime is required'));
    }

    const formattedBooking = {
        ...booking,
        DateTime: DateTime, // Assign the formatted date
    };

    console.log('POST Request to:', `${this.apiUrl}/accept`);
    console.log('Payload:', formattedBooking);

    return this.http.post(`${this.apiUrl}/accept`, formattedBooking, { headers: this.getHeaders() });
}

// ✅ Add this method to fetch accepted bookings
getAcceptedBookings(): Observable<AcceptBookings[]> {
  return this.http.get<AcceptBookings[]>(`${this.apiUrl}`);
}
  /**
   * Centralized error handling for HTTP requests with enhanced logging.
   * @param error - The HttpErrorResponse object.
   * @param method - The HTTP method that caused the error.
   * @param payload - The payload sent with the request (optional).
   * @returns Observable that throws a user-friendly error message.
   */
  private handleError(
    error: HttpErrorResponse,
    method: string,
    payload: any = null
  ): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error (status code: ${error.status}): ${error.error?.message || error.message}`;
    }

    console.error(`HTTP Error (${method}) - URL: ${this.apiUrl}`);
    if (payload) console.error('Payload:', JSON.stringify(payload, null, 2));
    console.error('Full error details:', error);
    console.log('Error Response:', error.error);

    return throwError(() => new Error(errorMessage));
  }
}