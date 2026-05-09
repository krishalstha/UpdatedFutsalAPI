import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookingDetail } from './BookingDetail';

@Injectable({
  providedIn: 'root',
})
export class AdminBookingDetailService {

  private apiBookingUrl = 'https://localhost:5001/api/BookingScreen';

  // For payment modal (optional)
  private bookingIdSource = new BehaviorSubject<number | null>(null);
  currentBookingId = this.bookingIdSource.asObservable();

  constructor(private http: HttpClient) {}

  /** Set booking ID for payment communication */
  setBookingId(id: number): void {
    console.log('📦 [ADMIN] Booking ID set:', id);
    this.bookingIdSource.next(id);
  }

  /** Generate Token Header */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /** CREATE Booking (Admin Can Create) */
  postBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    console.log('📤 [ADMIN-POST] Sending:', bookingDetail);
    return this.http
      .post<BookingDetail>(this.apiBookingUrl, bookingDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', bookingDetail)));
  }

  /** GET All bookings (Admin – Full Access) */
  getBookingDetails(): Observable<BookingDetail[]> {
    console.log('📥 [ADMIN-GET] Fetching all booking details');
    return this.http
      .get<BookingDetail[]>(this.apiBookingUrl, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET')));
  }

  /** GET booking by ID */
  getBookingDetailById(id: number): Observable<BookingDetail> {
    if (!id || isNaN(id)) {
      console.error('[ADMIN] Invalid ID:', id);
      return throwError(() => new Error('Invalid ID'));
    }

    return this.http
      .get<BookingDetail>(`${this.apiBookingUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET', { id })));
  }

  /** UPDATE booking */
  putBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    console.log('✏️ [ADMIN-PUT] Updating:', bookingDetail);
    return this.http
      .put<BookingDetail>(`${this.apiBookingUrl}/${bookingDetail.id}`, bookingDetail, {
        headers: this.getHeaders(),
      })
      .pipe(catchError((error) => this.handleError(error, 'PUT', bookingDetail)));
  }

  /** DELETE booking */
  deleteBookingDetail(id: number): Observable<void> {
    console.log('🗑️ [ADMIN-DELETE] ID:', id);
    return this.http
      .delete<void>(`${this.apiBookingUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'DELETE', { id })));
  }

  /** Admin Error Handler */
  private handleError(error: HttpErrorResponse, method: string, payload: any = null): Observable<never> {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error (${error.status}): ${error.error?.message || error.message}`;
      console.error('[ADMIN] Error body:', error.error);
    }

    console.error(`❌ HTTP Error (${method}) → ${this.apiBookingUrl}`);
    if (payload) console.error('Payload:', JSON.stringify(payload, null, 2));
    console.error('Full error:', error);

    return throwError(() => new Error(errorMessage));
  }
}
