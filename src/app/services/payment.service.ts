import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getPayments(filters?: PaymentFilters): Observable<Payment[]> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params = params.set(key, value.toISOString());
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http
      .get<{ message: string; payments: Payment[] }>(this.apiUrl, { params })
      .pipe(map((response) => response.payments));
  }

  getPaymentById(id: string): Observable<Payment> {
    return this.http
      .get<{ message: string; payment: Payment }>(`${this.apiUrl}/${id}`)
      .pipe(map((response) => response.payment));
  }

  getPaymentSummary(): Observable<PaymentSummary> {
    return this.http
      .get<{ message: string; summary: PaymentSummary }>(
        `${this.apiUrl}/summary`
      )
      .pipe(map((response) => response.summary));
  }

  processPayment(id: string): Observable<Payment> {
    return this.http
      .post<{ message: string; payment: Payment }>(
        `${this.apiUrl}/${id}/process`,
        {}
      )
      .pipe(map((response) => response.payment));
  }

  refundPayment(id: string): Observable<Payment> {
    return this.http
      .post<{ message: string; payment: Payment }>(
        `${this.apiUrl}/${id}/refund`,
        {}
      )
      .pipe(map((response) => response.payment));
  }

  createPayment(paymentData: Partial<Payment>): Observable<Payment> {
    return this.http
      .post<{ message: string; payment: Payment }>(this.apiUrl, paymentData)
      .pipe(map((response) => response.payment));
  }

  updatePayment(id: string, updateData: Partial<Payment>): Observable<Payment> {
    return this.http
      .put<{ message: string; payment: Payment }>(
        `${this.apiUrl}/${id}`,
        updateData
      )
      .pipe(map((response) => response.payment));
  }

  deletePayment(id: string): Observable<void> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/${id}`)
      .pipe(map(() => void 0));
  }
}
