import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { Payment, PaymentSummary } from '../../models/payment';
import { UserService } from '../../services/user.service';
import { BookingService } from '../../services/booking.service';
import { HotelsService } from '../../services/hotels.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  totalUsers = 0;
  totalBookings = 0;
  totalRevenue = 0;
  totalHotels = 0;
  usersChange = 0;
  bookingsChange = 0;
  revenueChange = 0;
  hotelsChange = 0;
  latestPayments: Payment[] = [];
  paymentSummary: any[] = [];
  Math = Math;
  isLoading = true;
  error: string | null = null;

  constructor(
    private paymentService: PaymentService,
    private userService: UserService,
    private bookingService: BookingService,
    private hotelService: HotelsService
  ) {}

  ngOnInit() {
    this.loadAnalyticsData();
  }

  private loadAnalyticsData() {
    this.isLoading = true;
    this.error = null;

    // Load payment data
    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.latestPayments = payments.slice(0, 5); // Get latest 5 payments
        this.calculatePaymentSummary(payments);
      },
      error: (error) => {
        this.error = 'Failed to load payment data';
        console.error('Payment data error:', error);
      },
    });

    this.paymentService.getPaymentSummary().subscribe({
      next: (summary) => {
        this.totalRevenue = summary.totalAmount;
        this.revenueChange = summary.completedAmount;
      },
      error: (error) => {
        console.error('Payment summary error:', error);
      },
    });

    // Load user data
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        // Calculate user growth (you might want to implement this in your backend)
        this.usersChange = 0; // Placeholder
      },
      error: (error) => {
        console.error('User data error:', error);
      },
    });

    // Load booking data
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.totalBookings = bookings.length;
        // Calculate booking growth (you might want to implement this in your backend)
        this.bookingsChange = 0; // Placeholder
      },
      error: (error) => {
        console.error('Booking data error:', error);
      },
    });

    // Load hotel data
    this.hotelService.getHotels().subscribe({
      next: (hotels) => {
        this.totalHotels = hotels.length;
        // Calculate hotel growth (you might want to implement this in your backend)
        this.hotelsChange = 0; // Placeholder
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Hotel data error:', error);
        this.isLoading = false;
      },
    });
  }

  private calculatePaymentSummary(payments: Payment[]) {
    const summary = new Map<string, { count: number; totalAmount: number }>();

    payments.forEach((payment) => {
      const current = summary.get(payment.status) || {
        count: 0,
        totalAmount: 0,
      };
      summary.set(payment.status, {
        count: current.count + 1,
        totalAmount: current.totalAmount + payment.amount,
      });
    });

    const total = payments.length;
    this.paymentSummary = Array.from(summary.entries()).map(
      ([status, data]) => ({
        status,
        count: data.count,
        totalAmount: data.totalAmount,
        percentage: ((data.count / total) * 100).toFixed(1),
      })
    );
  }

  refreshData() {
    this.loadAnalyticsData();
  }
}
