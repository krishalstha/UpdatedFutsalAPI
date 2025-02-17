import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginDetail } from './login-detail';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginDetailService {
  private apiUrl = 'https://localhost:5001/api/Login'; // API base URL for login
  private loggedInSource = new BehaviorSubject<boolean>(false);  // Default to false
  loggedIn$ = this.loggedInSource.asObservable();
  
  setLoginStatus(status: boolean): void {
    this.loggedInSource.next(status);  // Update login status
  }
  constructor(private http: HttpClient) {}
 login(credentials: { email: string; password: string }): Observable<LoginDetail> {
    return this.http
      .post<LoginDetail>(this.apiUrl, credentials, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', credentials)));
  }
 
  private getHeaders(): HttpHeaders {
        return new HttpHeaders({
      
    });
  }

  /**
   * Login (POST) a new user.
   * @param loginDetail - The login details object to be created.
   * @returns Observable of the created login details.
   */
  postLoginDetail(loginDetail: LoginDetail): Observable<LoginDetail> {
    console.log('POST Request - Payload being sent:', loginDetail);
    return this.http
      .post<LoginDetail>(this.apiUrl, loginDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', loginDetail)));
  }
/**
   * Centralized error handling for HTTP requests with enhanced logging.
   * @param error - The HttpErrorResponse object.
   * @param method - The HTTP method that caused the error.
   * @param payload - The payload sent with the request (optional).
   * @returns Observable that throws a user-friendly error message.
   */
private handleError(error: HttpErrorResponse, method: string, payload: any = null): Observable<never> {
    let errorMessage = 'An unexpected error occurred.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else if (error.status === 401) {
      errorMessage = 'Invalid email or password.';
    } else if (error.status === 500) {
      errorMessage = 'Internal server error. Please try again later.';
    } else {
      errorMessage = `Error: ${error.message || 'Unknown error'}`;
    }

    console.error(`HTTP Error (${method}) - URL: ${this.apiUrl}`);
    if (payload) console.error('Payload:', JSON.stringify(payload, null, 2));
    console.error('Full error details:', error);

    return throwError(() => new Error(errorMessage));
  }
}
