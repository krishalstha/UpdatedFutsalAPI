import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookingDetail } from './BookingDetail';

@Injectable({
  providedIn: 'root',
})
export class BookingDetailService {
  private apiBookingUrl  = 'https://localhost:5001/api/BookingScreen'; // API base URL

  constructor(private http: HttpClient) {}

  // Helper method to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Post a new booking detail
  postBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    console.log('POST Request - Payload being sent:', bookingDetail);
    return this.http
      .post<BookingDetail>(this.apiBookingUrl , bookingDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', bookingDetail)));
  }

 
  getPrice(bookingDetails: any): Observable<number> {
    return this.http.post<number>('your-api-url-to-fetch-price', bookingDetails);
  }
  // Get all booking details
  getBookingDetails(): Observable<BookingDetail[]> {
    console.log('GET Request - Fetching all booking details');
    return this.http
      .get<BookingDetail[]>(this.apiBookingUrl , { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET')));
  }
  

  // Get specific bookings
  getBookings(): Observable<any> {
    return this.http.get(`${this.apiBookingUrl }`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => this.handleError(error, 'GET'))
      );
  }

  // Book a slot
  bookSlot(bookingData: { date: string; time: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiBookingUrl }/book`, bookingData, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', bookingData)));
  }

  

  // Get booking detail by ID
  getBookingDetailById(id: number): Observable<BookingDetail> {
    if (!id || isNaN(id)) {
      console.error('Invalid booking ID:', id);
      return throwError(() => new Error('Invalid booking ID'));
    }
    return this.http
      .get<BookingDetail>(`${this.apiBookingUrl }/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET', { id })));
  }

  // Update booking detail
  putBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    return this.http
      .put<BookingDetail>(`${this.apiBookingUrl }/${bookingDetail.id}`, bookingDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'PUT', bookingDetail)));
  }

  // Delete booking detail by ID
  deleteBookingDetail(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiBookingUrl }/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'DELETE', { id })));
  }

  // Global error handler
  private handleError(error: HttpErrorResponse, method: string, payload: any = null): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error (status code: ${error.status}): ${error.error?.message || error.message}`;
      console.error('Error response body:', error.error);
    }

    console.error(`HTTP Error (${method}) - URL: ${this.apiBookingUrl }`);
    if (payload) console.error('Payload:', JSON.stringify(payload, null, 2));
    console.error('Full error details:', error);

    return throwError(() => new Error(errorMessage));
  }
}