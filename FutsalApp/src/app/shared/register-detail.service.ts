import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegisterDetail } from './register-detail';

@Injectable({
  providedIn: 'root',
})
export class RegisterDetailService {
  register(value: any): Observable<RegisterDetail> {
    return this.postRegisterDetail(value);
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://localhost:5001/api/Register'; // API base URL for registration

  constructor(private http: HttpClient) {}

 
  private getHeaders(): HttpHeaders {
        return new HttpHeaders({
      
    });
  }

  /**
   * Register (POST) a new user.
   * @param registerDetail - The registration details object to be created.
   * @returns Observable of the created registration details.
   */
  postRegisterDetail(registerDetail: RegisterDetail): Observable<RegisterDetail> {
    console.log('POST Request - Payload being sent:', registerDetail);
    return this.http
      .post<RegisterDetail>(this.apiUrl, registerDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', registerDetail)));
  }

  /**
   * Read (GET) all registration details.
   * @returns Observable of an array of registration details.
   */
  getRegisterDetails(): Observable<RegisterDetail[]> {
    console.log('GET Request - Fetching all registration details');
    return this.http
      .get<RegisterDetail[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET')));
  }

  /**
   * Read (GET) a single registration detail by ID.
   * @param id - The ID of the registration detail.
   * @returns Observable of the fetched registration detail.
   */
  getRegisterDetailById(id: number): Observable<RegisterDetail> {
    console.log(`GET Request - Fetching registration detail with ID: ${id}`);
    return this.http
      .get<RegisterDetail>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET', { id })));
  }

  /**
   * Update (PUT) an existing registration detail.
   * @param registerDetail - The registration detail object to be updated.
   * @returns Observable of the updated registration detail.
   */
  putRegisterDetail(registerDetail: RegisterDetail): Observable<RegisterDetail> {
    console.log(`PUT Request - Updating registration detail with ID: ${registerDetail.Id}`, registerDetail);
    return this.http
      .put<RegisterDetail>(`${this.apiUrl}/${registerDetail.Id}`, registerDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'PUT', registerDetail)));
  }

  /**
   * Delete (DELETE) a registration detail by ID.
   * @param id - The ID of the registration detail to be deleted.
   * @returns Observable of void.
   */
  deleteRegisterDetail(id: number): Observable<void> {
    console.log(`DELETE Request - Deleting registration detail with ID: ${id}`);
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
