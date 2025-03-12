import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Hotel } from '../models/hotel';

@Injectable({
  providedIn: 'root',
})
export class HotelsService {
  private apiUrl = 'http://localhost:3000/Hotel'; // Replace with actual API URL

  constructor(private http: HttpClient) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    });
  }
  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }
  deleteHotel(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`; // Construct the URL for the specific hotel
    return this.http
      .delete<any>(url, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }
  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  createHotel(hotel: Hotel): Observable<Hotel> {
    return this.http.post<Hotel>(this.apiUrl, hotel, {
      headers: this.getAuthHeaders(),
    });
  }
  updateHotel(id: string, hotel: Hotel): Observable<Hotel> {
    const url = `${this.apiUrl}/${id}`; // Construct the URL for the specific hotel
    return this.http
      .patch<Hotel>(url, hotel, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError));
  }


  // Error handling
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
