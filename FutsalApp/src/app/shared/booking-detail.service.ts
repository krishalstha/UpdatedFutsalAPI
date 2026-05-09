import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookingDetail } from './BookingDetail';
import { AuthService } from './auth.service'; // ✅ Ensure this path is correct
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BookingDetailService {
  private apiBookingUrl = 'https://localhost:5001/api/BookingScreen'; // ✅ Your API URL
  private apiFutsalUrl = 'https://localhost:5001/api/FutsalDetails';
  loggedInUserEmail: string = ''; // Currently logged-in user's email

  // ✅ BehaviorSubject to share bookingId between components (like Payment)
  private bookingIdSource = new BehaviorSubject<number | null>(null);
  currentBookingId = this.bookingIdSource.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    const user = this.authService.getLoggedInUser();
    this.loggedInUserEmail = user?.email || '';
    this.loadBookingList();
  }

  // ✅ Set booking ID after booking is created
  setBookingId(id: number): void {
    console.log('📦 Booking ID set for payment:', id);
    this.bookingIdSource.next(id);
  }

  private loadBookingList(): void {
    console.log(`Loading bookings for: ${this.loggedInUserEmail}`);
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ✅ POST (Create Booking)
  postBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    console.log('POST Request - Payload being sent:', bookingDetail);
    return this.http
      .post<BookingDetail>(this.apiBookingUrl, bookingDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', bookingDetail)));
  }
  getFullReport(): Observable<any[]> {
    const url = `${this.apiBookingUrl}/report`; // Create a backend endpoint to return detailed report
    return this.http.get<any[]>(url, { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error, 'GET Report')));
  }
  
  getFutsalByName(futsalName: string): Observable<any> {
    const futsalNameEncoded = encodeURIComponent(futsalName);
    const url = `https://localhost:5001/api/FutsalDetails/by-name/${futsalNameEncoded}`;
    return this.http.get(url, { headers: this.getHeaders() })
      .pipe(catchError(error => this.handleError(error, 'GET Futsal by name')));
  }
  
  
  // ✅ Example: Price calculation (custom endpoint)
  getPrice(bookingDetails: any): Observable<number> {
    return this.http.post<number>('your-api-url-to-fetch-price', bookingDetails);
  }

  // ✅ GET All Bookings
  getBookingDetails(): Observable<BookingDetail[]> {
    console.log('GET Request - Fetching all booking details');
    return this.http
      .get<BookingDetail[]>(this.apiBookingUrl, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET')));
  }
  getFutsalNames(): Observable<string[]> {
    console.log('GET Request - Fetching all Futsal Details to extract names');
    
    // Assumes the endpoint returns an array of futsal objects (e.g., FutsalDetail[])
    return this.http.get<any[]>(this.apiFutsalUrl, { headers: this.getHeaders() }).pipe(
      map(futsalDetails => {
        // Extract unique futsalName properties from the response array
        const names = futsalDetails
          .map(f => f.futsalName as string)
          .filter((value, index, self) => self.indexOf(value) === index);
          
        console.log('Extracted unique Futsal Names:', names);
        return names;
      }),
      catchError((error) => this.handleError(error, 'GET Futsal Names'))
    );
  }
  

  // ✅ GET All Bookings (generic)
  getBookings(futsalName?: string): Observable<any> {
    let url = `${this.apiBookingUrl}/filter`;
    if (futsalName) {
      // ⚠️ Backend must support filtering by futsalName, e.g., /api/BookingScreen?futsalName=XYZ
      url += `?futsalName=${encodeURIComponent(futsalName)}`;
    }
    
    return this.http.get(url, { headers: this.getHeaders() })
    .pipe(catchError((error) => this.handleError(error, 'GET Bookings')));
}

  // ✅ POST (Book Slot)
  bookSlot(bookingData: { date: string; time: string }): Observable<any> {
    return this.http
      .post<any>(`${this.apiBookingUrl}/book`, bookingData, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', bookingData)));
  }

  // ✅ GET by ID
  getBookingDetailById(id: number): Observable<BookingDetail> {
    if (!id || isNaN(id)) {
      console.error('Invalid booking ID:', id);
      return throwError(() => new Error('Invalid booking ID'));
    }
    return this.http
      .get<BookingDetail>(`${this.apiBookingUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET', { id })));
  }

  // ✅ PUT (Update Booking)
  putBookingDetail(bookingDetail: BookingDetail): Observable<BookingDetail> {
    return this.http
      .put<BookingDetail>(`${this.apiBookingUrl}/${bookingDetail.id}`, bookingDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'PUT', bookingDetail)));
  }

  // ✅ DELETE
  deleteBookingDetail(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiBookingUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'DELETE', { id })));
  }

  // ⚠️ Centralized Error Handling
  private handleError(error: HttpErrorResponse, method: string, payload: any = null): Observable<never> {
    let errorMessage: string;
  
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 409) {
        // Conflict: time slot already booked
        errorMessage = error.error?.message || 'This time slot is already booked. Please choose another.';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid request.';
      } else {
        errorMessage = `Server error (status code: ${error.status}): ${error.error?.message || error.message}`;
      }
  
      // Show alert to the user
      alert(errorMessage);
    }
  
    // Optional: Keep console logging for debugging
    console.error(`HTTP Error (${method}) - URL: ${this.apiBookingUrl}`);
    if (payload) console.error('Payload:', JSON.stringify(payload, null, 2));
    console.error('Full error details:', error);
  
    // Return an observable error
    return throwError(() => new Error(errorMessage));
  }
  
  
}
