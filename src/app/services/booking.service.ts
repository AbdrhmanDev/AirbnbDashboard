import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import {
  Booking,
  CreateBookingDTO,
  UpdateBookingDTO,
  BookingStatus,
  PaymentStatus,
  User,
} from '../models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/Booking`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Create a new booking
  createBooking(bookingData: CreateBookingDTO): Observable<Booking> {
    return this.http
      .post<{
        message: string;
        booking: Booking & { userId: User; hostId: User };
      }>(this.apiUrl, bookingData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.booking));
  }

  // Get all bookings
  getBookings(): Observable<Booking[]> {
    return this.http
      .get<Booking[]>(this.apiUrl, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response));
  }

  // Get a specific booking by ID
  getBookingById(id: string): Observable<Booking> {
    return this.http
      .get<any>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response));
  }

  // Update a booking
  updateBooking(id: string, updateData: UpdateBookingDTO): Observable<Booking> {
    return this.http
      .put<{
        message: string;
        booking: Booking & { userId: User; hostId: User };
      }>(`${this.apiUrl}/${id}`, updateData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.booking));
  }

  // Cancel a booking
  cancelBooking(id: string): Observable<Booking> {
    return this.http
      .patch<{
        message: string;
        booking: Booking & { userId: User; hostId: User };
      }>(
        `${this.apiUrl}/${id}/cancel`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(map((response) => response.booking));
  }

  // Confirm a booking
  confirmBooking(id: string): Observable<Booking> {
    return this.http
      .patch<{
        message: string;
        booking: Booking & { userId: User; hostId: User };
      }>(
        `${this.apiUrl}/${id}/confirm`,
        {},
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(map((response) => response.booking));
  }

  // Update payment status
  updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus
  ): Observable<Booking> {
    return this.http
      .patch<{
        message: string;
        booking: Booking & { userId: User; hostId: User };
      }>(
        `${this.apiUrl}/${id}/payment`,
        { paymentStatus },
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(map((response) => response.booking));
  }

  // Get user's bookings (as a guest)
  getUserBookings(userId: string): Observable<Booking[]> {
    return this.http
      .get<{
        message: string;
        bookings: Array<Booking & { userId: User; hostId: User }>;
      }>(`${this.apiUrl}/user/${userId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.bookings));
  }

  // Get host's bookings (properties they are hosting)
  getHostBookings(hostId: string): Observable<Booking[]> {
    return this.http
      .get<{
        message: string;
        bookings: Array<Booking & { userId: User; hostId: User }>;
      }>(`${this.apiUrl}/host/${hostId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.bookings));
  }

  // Get property bookings
  getPropertyBookings(propertyId: string): Observable<Booking[]> {
    return this.http
      .get<{
        message: string;
        bookings: Array<Booking & { userId: User; hostId: User }>;
      }>(`${this.apiUrl}/property/${propertyId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.bookings));
  }

  // Check property availability
  checkAvailability(
    propertyId: string,
    startDate: Date,
    endDate: Date
  ): Observable<boolean> {
    const params = new HttpParams()
      .set('startDate', startDate.toISOString())
      .set('endDate', endDate.toISOString());

    return this.http
      .get<{ message: string; available: boolean }>(
        `${this.apiUrl}/property/${propertyId}/availability`,
        {
          params,
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(map((response) => response.available));
  }

  // Delete a booking (admin only)
  deleteBooking(id: string): Observable<void> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(() => void 0));
  }
}
