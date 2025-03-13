import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BookingService } from '../../../services/booking.service';
import { HotelsService } from '../../../services/hotels.service';
import { Booking, User } from '../../../models/booking';
import { Hotel } from '../../../models/hotel';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
})
export class BookingDetailsComponent implements OnInit {
  booking: Booking | null = null;
  property: Hotel | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private hotelService: HotelsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      this.loadBookingDetails(bookingId);
    } else {
      this.error = 'Booking ID not found';
      this.isLoading = false;
    }
  }

  private loadBookingDetails(bookingId: string) {
    this.bookingService.getBookingById(bookingId).subscribe({
      next: (booking) => {
        this.booking = booking;
        console.log(this.booking);
        this.loadPropertyDetails(booking.propertyId);
      },
      error: (error) => {
        this.error = 'Error loading booking details';
        this.isLoading = false;
        this.snackBar.open('Error loading booking details', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  private loadPropertyDetails(propertyId: string) {
    this.hotelService.getHotelById(propertyId).subscribe({
      next: (property) => {
        this.property = property;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error loading property details';
        this.isLoading = false;
        this.snackBar.open('Error loading property details', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      cancelled: 'status-cancelled',
      completed: 'status-completed',
    };
    return statusClasses[status] || '';
  }

  getPaymentStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      pending: 'payment-pending',
      paid: 'payment-paid',
      failed: 'payment-failed',
    };
    return statusClasses[status] || '';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  calculateNights(): number {
    if (!this.booking) return 0;
    const start = new Date(this.booking.startDate);
    const end = new Date(this.booking.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  getUserFullName(user: User | string): string {
    if (typeof user === 'string') return 'Loading...';
    return `${user.firstName} ${user.lastName}`;
  }

  getUserProfileImage(user: User | string): string {
    if (typeof user === 'string') return 'assets/default-avatar.png';
    return user.profileImage || 'assets/default-avatar.png';
  }

  getUserEmail(user: User | string): string {
    if (typeof user === 'string') return 'Loading...';
    return user.email;
  }

  getUserPhone(user: User | string): string {
    if (typeof user === 'string') return 'Loading...';
    return user.phone;
  }

  getUserId(user: User | string): string {
    if (typeof user === 'string') return user;
    return user._id;
  }

  confirmBooking() {
    if (!this.booking?._id) return;
    this.bookingService.confirmBooking(this.booking._id).subscribe({
      next: (response: { message: string }) => {
        this.booking!.status = 'confirmed';
        this.snackBar.open('Booking confirmed successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        this.snackBar.open('Error confirming booking', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  cancelBooking() {
    if (!this.booking?._id) return;
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(this.booking._id).subscribe({
        next: (response: { message: string }) => {
          this.booking!.status = 'cancelled';
          this.snackBar.open('Booking cancelled successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          this.snackBar.open('Error cancelling booking', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }
}
