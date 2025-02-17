import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FutsalDetail } from './futsal-detail';

@Injectable({
  providedIn: 'root',
})
export class FutsalDetailService {
  private apiUrl = 'https://localhost:5001/api/FutsalDetails'; // API base URL

  constructor(private http: HttpClient) {}


  
  // Helper method to get headers with Authorization token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Modify as needed for your app's token storage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Include token in the headers
    });
  }

  /**
   * Create (POST) a new futsal detail.
   * @param futsalDetail - The futsal detail object to be created.
   * @returns Observable of the created futsal detail.
   */
  postFutsalDetail(futsalDetail: FutsalDetail): Observable<FutsalDetail> {
    console.log('POST Request - Payload being sent:', futsalDetail);
    return this.http
      .post<FutsalDetail>(this.apiUrl, futsalDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'POST', futsalDetail)));
  }

  /**
   * Read (GET) all futsal name details.
   * @returns Observable of an array of futsal name details.
   */
  getFutsalDetails(): Observable<FutsalDetail[]> {
    console.log('GET Request - Fetching all futsal details');
    return this.http
      .get<FutsalDetail[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET')));
  }

  /**
   * Read (GET) a single futsal name detail by ID.
   * @param id - The ID of the futsal name detail.
   * @returns Observable of the fetched futsal name detail.
   */
  getFutsalDetailById(id: number): Observable<FutsalDetail> {
    console.log(`GET Request - Fetching futsal detail with ID: ${id}`);
    return this.http
      .get<FutsalDetail>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'GET', { id })));
  }

  /**
   * Fetch additional form data (e.g., operation hours).
   * @returns Observable containing the form data.
   */
  getFormData(): Observable<{ operationHours: string }> {
    const formDataUrl = `${this.apiUrl}/form-data`; // Update endpoint if needed
    console.log('Attempting to fetch form data from:', formDataUrl); // Log the URL
    return this.http
      .get<{ operationHours: string }>(formDataUrl)
      .pipe(
        catchError((error) => {
          console.error('Error while fetching form data:', error); // Log the error details
          return this.handleError(error, 'GET');
        })
      );
  }

  /**
   * Update (PUT) an existing futsal name detail.
   * @param futsalDetail - The futsal name detail object to be updated.
   * @returns Observable of the updated futsal name detail.
   */
  putFutsalDetail(futsalDetail: FutsalDetail): Observable<FutsalDetail> {
    console.log(
      `PUT Request - Updating futsal detail with ID: ${futsalDetail.futsalId}`,
      futsalDetail
    );
    return this.http
      .put<FutsalDetail>(`${this.apiUrl}/${futsalDetail.futsalId}`, futsalDetail, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'PUT', futsalDetail)));
  }

  /**
   * Update (PUT) an existing futsal detail by ID.
   * @param futsalId - The ID of the futsal detail.
   * @param futsalData - The futsal detail object to be updated.
   * @returns Observable of the updated futsal detail.
   */
  updateFutsalDetail(futsalId: string, futsalData: FutsalDetail): Observable<FutsalDetail> {
    console.log(`PUT Request - Updating futsal detail with ID: ${futsalId}`);
    return this.http
      .put<FutsalDetail>(`${this.apiUrl}/${futsalId}`, futsalData, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleError(error, 'PUT', futsalData)));
  }

  /**
   * Delete (DELETE) a futsal name detail by ID.
   * @param id - The ID of the futsal name detail to be deleted.
   * @returns Observable of void.
   */
  deleteFutsalDetail(id: number): Observable<void> {
    console.log(`DELETE Request - Deleting futsal detail with ID: ${id}`);
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
