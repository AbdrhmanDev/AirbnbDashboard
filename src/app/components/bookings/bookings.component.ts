import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule
  ],
  template: `
    <div class="bookings-container">
      <div class="bookings-header">
        <h2>
          <mat-icon [matBadge]="pendingBookings.length" 
                   [matBadgeHidden]="pendingBookings.length === 0" 
                   matBadgeColor="warn">
            book_online
          </mat-icon>
          الحجوزات
        </h2>
      </div>

      <div class="bookings-list">
        <mat-card *ngFor="let booking of bookings" 
                  [ngClass]="{'pending': booking.status === 'pending',
                             'confirmed': booking.status === 'confirmed',
                             'cancelled': booking.status === 'cancelled'}">
          <mat-card-header>
            <mat-card-title>{{booking.hotelName}}</mat-card-title>
            <mat-card-subtitle>{{booking.guestName}}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="booking-info">
              <p>
                <mat-icon>event</mat-icon>
                من: {{booking.checkIn | date:'shortDate'}}
              </p>
              <p>
                <mat-icon>event</mat-icon>
                إلى: {{booking.checkOut | date:'shortDate'}}
              </p>
              <p>
                <mat-icon>person</mat-icon>
                {{booking.guestEmail}}
              </p>
              <p>
                <mat-icon>phone</mat-icon>
                {{booking.guestPhone}}
              </p>
              <p>
                <mat-icon>hotel</mat-icon>
                {{booking.roomCount}} غرف
              </p>
              <p class="price">
                <mat-icon>payments</mat-icon>
                {{booking.totalPrice}} ريال
              </p>
            </div>
          </mat-card-content>

          <mat-card-actions *ngIf="booking.status === 'pending'">
            <button mat-button color="primary" (click)="confirmBooking(booking.id)">
              <mat-icon>check</mat-icon>
              تأكيد
            </button>
            <button mat-button color="warn" (click)="cancelBooking(booking.id)">
              <mat-icon>close</mat-icon>
              رفض
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      padding: 16px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      height: 100%;
    }

    .bookings-header {
      margin-bottom: 20px;
    }

    .bookings-header h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #3f51b5;
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: calc(100vh - 200px);
      overflow-y: auto;
    }

    mat-card {
      border-right: 4px solid;
      transition: all 0.3s ease;
    }

    mat-card:hover {
      transform: translateX(-5px);
    }

    mat-card.pending {
      border-right-color: #ffc107;
    }

    mat-card.confirmed {
      border-right-color: #4caf50;
    }

    mat-card.cancelled {
      border-right-color: #f44336;
    }

    .booking-info {
      display: grid;
      gap: 8px;
    }

    .booking-info p {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
    }

    .price {
      font-weight: 500;
      color: #3f51b5;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 8px;
    }

    ::-webkit-scrollbar {
      width: 6px;
    }

    ::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }

    ::-webkit-scrollbar-thumb {
      background: rgba(63, 81, 181, 0.5);
      border-radius: 3px;
    }
  `]
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];

  constructor() {
    // هنا يمكنك جلب البيانات من localStorage أو من API
    this.loadBookings();
  }

  ngOnInit(): void {}

  loadBookings() {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      this.bookings = JSON.parse(savedBookings).map((booking: any) => ({
        ...booking,
        checkIn: new Date(booking.checkIn),
        checkOut: new Date(booking.checkOut),
        createdAt: new Date(booking.createdAt)
      }));
      this.pendingBookings = this.bookings.filter(b => b.status === 'pending');
    }
  }

  confirmBooking(bookingId: string) {
    const index = this.bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      this.bookings[index].status = 'confirmed';
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      this.loadBookings();
    }
  }

  cancelBooking(bookingId: string) {
    const index = this.bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      this.bookings[index].status = 'cancelled';
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      this.loadBookings();
    }
  }
} 