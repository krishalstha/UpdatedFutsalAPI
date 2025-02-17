import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookingDetail } from './BookingDetail';

@Injectable({
  providedIn: 'root',
})
export class BookingDetailService {
  private apiUrl = 'https://localhost:5001/api/BookingScreen'; // API base URL

  constructor(private http: HttpClient) {}

 
  // Helper method to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Modify as needed for your app's token storage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include token in the headers
    });
  }

  /**
   * Create (POST) a new bookingscreen detail.
   * @param bookingDetail - The bookingscreen detail object to be created.
   * @returns Observable of the created bookingscreen detail.
   */
  postBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    console.log('POST Request - Payload being sent:', bookingDetail);
    return this.http
      .post<BookingDetail>(this.apiUrl, bookingDetail, { headers: this.getHeaders() })
      .pipe(
        catchError((error) =>{
          return this.handleError(error, 'POST', bookingDetail)
  }));
  }

  /**
   * Read (GET) all bookingscreen name details.
   * @returns Observable of an array of bookingscreen name details.
   */
  getBookingDetails(): Observable<BookingDetail[]> {
    console.log('GET Request - Fetching all bookingscreen details');
    return this.http
      .get<BookingDetail[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET')));
  }

  /**
   * Read (GET) a single bookingscreen name detail by ID.
   * @param id - The ID of the bookingscreen name detail.
   * @returns Observable of the fetched bookingscreen name detail.
   */
  getBookingDetailById(id: number): Observable<BookingDetail> {
    console.log(`GET Request - Fetching bookingscreen detail with ID: ${id}`);
    return this.http
      .get<BookingDetail>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET', { id })));
  }

  

  /**
   * Update (PUT) an existing bookingscreen name detail.
   * @param bookingDetail - The bookingscreen name detail object to be updated.
   * @returns Observable of the updated bookingscreen name detail.
   */
  putBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    console.log(
      `PUT Request - Updating bookingscreen detail with ID: ${bookingDetail.id}`,
      bookingDetail
    );
    return this.http
      .put<BookingDetail>(`${this.apiUrl}/${bookingDetail.id}`, bookingDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'PUT', bookingDetail)));
  }

  /**
   * Update (PUT) an existing bookingscreen detail by ID.
   * @param userId - The ID of the bookingscreen detail.
   * @param userData - The bookingscreen detail object to be updated.
   * @returns Observable of the updated bookingscreen detail.
   */
  updateBookingDetail(id: string, userData: BookingDetail): Observable<BookingDetail> {
    console.log(`PUT Request - Updating bookingDetail  with ID: ${id}`);
    return this.http
      .put<BookingDetail>(`${this.apiUrl}/${id}`, userData, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'PUT', userData)));
  }

  /**
   * Delete (DELETE) a bookingscreen name detail by ID.
   * @param id - The ID of the bookingscreen name detail to be deleted.
   * @returns Observable of void.
   */
  deleteBookingDetail(id: number): Observable<void> {
    console.log(`DELETE Request - Deleting bookingDetail  with ID: ${id}`);
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'DELETE', { id })));
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
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error (status code: ${error.status}): ${
        error.error?.message || error.message
      }`;
    }

    console.error(`HTTP Error (${method}) - URL: ${this.apiUrl}`);
    if (payload) console.error('Payload:', JSON.stringify(payload, null, 2));
    console.error('Full error details:', error);

    return throwError(() => new Error(errorMessage));
  }
}