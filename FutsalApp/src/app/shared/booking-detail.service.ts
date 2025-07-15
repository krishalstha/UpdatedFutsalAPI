import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookingDetail } from './BookingDetail';
import { AuthService } from './auth.service'; // Make sure this path is correct

@Injectable({
  providedIn: 'root',
})
export class BookingDetailService {
  private apiBookingUrl = 'https://localhost:5001/api/BookingScreen'; // API base URL
  loggedInUserEmail: string = ''; // Email of currently logged in user

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) {
    const user = this.authService.getLoggedInUser(); // Get user info from AuthService
    this.loggedInUserEmail = user?.email || '';
    this.loadBookingList(); // Load booking list on initialization (optional)
  }

  private loadBookingList(): void {
    console.log(`Loading bookings for: ${this.loggedInUserEmail}`);
    // Add any relevant logic if needed
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  postBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    console.log('POST Request - Payload being sent:', bookingDetail);
    return this.http
      .post<BookingDetail>(this.apiBookingUrl, bookingDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', bookingDetail)));
  }

  getPrice(bookingDetails: any): Observable<number> {
    return this.http.post<number>('your-api-url-to-fetch-price', bookingDetails);
  }

  getBookingDetails(): Observable<BookingDetail[]> {
    console.log('GET Request - Fetching all booking details');
    return this.http
      .get<BookingDetail[]>(this.apiBookingUrl, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET')));
  }

  getBookings(): Observable<any> {
    return this.http
      .get(`${this.apiBookingUrl}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET')));
  }

  bookSlot(bookingData: { date: string; time: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiBookingUrl}/book`, bookingData, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', bookingData)));
  }

  getBookingDetailById(id: number): Observable<BookingDetail> {
    if (!id || isNaN(id)) {
      console.error('Invalid booking ID:', id);
      return throwError(() => new Error('Invalid booking ID'));
    }
    return this.http
      .get<BookingDetail>(`${this.apiBookingUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET', { id })));
  }

  putBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    return this.http
      .put<BookingDetail>(`${this.apiBookingUrl}/${bookingDetail.id}`, bookingDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'PUT', bookingDetail)));
  }

  deleteBookingDetail(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiBookingUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'DELETE', { id })));
  }

  private handleError(error: HttpErrorResponse, method: string, payload: any = null): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error (status code: ${error.status}): ${error.error?.message || error.message}`;
      console.error('Error response body:', error.error);
    }

    console.error(`HTTP Error (${method}) - URL: ${this.apiBookingUrl}`);
    if (payload) console.error('Payload:', JSON.stringify(payload, null, 2));
    console.error('Full error details:', error);

    return throwError(() => new Error(errorMessage));
  }
}
