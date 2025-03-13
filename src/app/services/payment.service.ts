import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Payment, PaymentSummary, PaymentFilters } from '../models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getPayments(): Observable<Payment[]> {
    return this.http
      .get<Payment[]>(this.apiUrl, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response));
  }

  getPaymentById(id: string): Observable<Payment> {
    return this.http
      .get<{ message: string; payment: Payment }>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.payment));
  }

  getPaymentSummary(): Observable<PaymentSummary> {
    return this.http
      .get< PaymentSummary >(
        `${this.apiUrl}/payment/summary`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response));
  }

  processPayment(id: string): Observable<Payment> {
    return this.http
      .post<{ message: string; payment: Payment }>(
        `${this.apiUrl}/${id}/process`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response.payment));
  }

  refundPayment(id: string): Observable<Payment> {
    return this.http
      .post<{ message: string; payment: Payment }>(
        `${this.apiUrl}/${id}/refund`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response.payment));
  }

  createPayment(paymentData: Partial<Payment>): Observable<Payment> {
    return this.http
      .post<{ message: string; payment: Payment }>(this.apiUrl, paymentData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map((response) => response.payment));
  }

  updatePayment(id: string, updateData: Partial<Payment>): Observable<Payment> {
    return this.http
      .put<{ message: string; payment: Payment }>(
        `${this.apiUrl}/${id}`,
        updateData,
        { headers: this.getAuthHeaders() }
      )
      .pipe(map((response) => response.payment));
  }

  deletePayment(id: string): Observable<void> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(map(() => void 0));
  }
}
