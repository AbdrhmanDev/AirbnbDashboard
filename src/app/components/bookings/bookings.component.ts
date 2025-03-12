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
    MatBadgeModule,
  ],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  pendingBookings: Booking[] = [];

  constructor() {
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
        createdAt: new Date(booking.createdAt),
      }));
      this.pendingBookings = this.bookings.filter(
        (b) => b.status === 'pending'
      );
    }
  }

  confirmBooking(bookingId: string) {
    const index = this.bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      this.bookings[index].status = 'confirmed';
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      this.loadBookings();
    }
  }

  cancelBooking(bookingId: string) {
    const index = this.bookings.findIndex((b) => b.id === bookingId);
    if (index !== -1) {
      this.bookings[index].status = 'cancelled';
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      this.loadBookings();
    }
  }
}
