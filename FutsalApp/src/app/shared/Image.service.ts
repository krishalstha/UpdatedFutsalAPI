import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = 'https://localhost:5001/api/UploadImage';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
    });
  }

  uploadImage(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<any>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  getImage(imageName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}?imageName=${imageName}`, { responseType: 'blob' }).pipe(
      catchError(this.handleError)
    );
  }

  editImageName(oldImageName: string, newImageName: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?oldImageName=${oldImageName}&newImageName=${newImageName}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  deleteImage(imageName: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?imageName=${imageName}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server error (status code: ${error.status}): ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}