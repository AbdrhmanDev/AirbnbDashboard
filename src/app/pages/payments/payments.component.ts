import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  Payment,
  PaymentStatus,
  PaymentMethod,
  PaymentSummary,
  PaymentFilters,
} from '../../models/payment';
import { PaymentService } from '../../services/payment.service';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatSpinner
  ],
})
export class PaymentsComponent implements OnInit {
  displayedColumns: string[] = [
    'transactionId',
    'bookingId',
    'userId',
    'amount',
    'status',
    'paymentMethod',
    'createdAt',
    'actions',
  ];

  dataSource = new MatTableDataSource<Payment>();
  isLoading = true;
  summary: PaymentSummary | null = null;

  // Filters
  filters: PaymentFilters = {};
  selectedStatus: PaymentStatus | 'all' = 'all';
  selectedPaymentMethod: PaymentMethod | 'all' = 'all';
  searchTerm = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  minAmount: number | null = null;
  maxAmount: number | null = null;

  paymentStatuses: PaymentStatus[] = [
    'pending',
    'completed',
    'failed',
    'refunded',
  ];
  paymentMethods: PaymentMethod[] = [
    'credit_card',
    'debit_card',
    'paypal',
    'bank_transfer',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPayments();
    this.loadPaymentSummary();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();
  }

  loadPayments() {
    this.isLoading = true;
    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.dataSource.data = payments;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open(
          'Error loading payments: ' + error.message,
          'Close',
          {
            duration: 3000,
          }
        );
        this.isLoading = false;
      },
    });
  }

  loadPaymentSummary() {
    this.paymentService.getPaymentSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
      },
      error: (error) => {
        this.snackBar.open('Error loading payment summary', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  createFilter(): (data: Payment, filter: string) => boolean {
    return (data: Payment, filter: string): boolean => {
      if (!filter) return true;

      try {
        const searchStr = JSON.parse(filter);

        // Search term filter
        const searchTermMatch =
          !searchStr.searchTerm ||
          data.bookingId
            ?.toLowerCase()
            .includes(searchStr.searchTerm.toLowerCase()) ||
          data.transactionId
            ?.toLowerCase()
            .includes(searchStr.searchTerm.toLowerCase()) ||
          (typeof data.userId !== 'string' &&
            (data.userId?.firstName
              ?.toLowerCase()
              .includes(searchStr.searchTerm.toLowerCase()) ||
              data.userId?.lastName
                ?.toLowerCase()
                .includes(searchStr.searchTerm.toLowerCase())));

        // Status filter
        const statusMatch =
          !searchStr.status ||
          searchStr.status === 'all' ||
          data.status === searchStr.status;

        // Payment method filter
        const methodMatch =
          !searchStr.paymentMethod ||
          searchStr.paymentMethod === 'all' ||
          data.paymentMethod === searchStr.paymentMethod;

        // Amount range filter
        const amountMatch =
          (!searchStr.minAmount || data.amount >= searchStr.minAmount) &&
          (!searchStr.maxAmount || data.amount <= searchStr.maxAmount);

        // Date range filter
        const startDate = searchStr.startDate
          ? new Date(searchStr.startDate)
          : null;
        const endDate = searchStr.endDate ? new Date(searchStr.endDate) : null;
        const paymentDate = new Date(data.createdAt || '');

        const dateRangeMatch =
          (!startDate || paymentDate >= startDate) &&
          (!endDate || paymentDate <= endDate);

        return (
          searchTermMatch &&
          statusMatch &&
          methodMatch &&
          amountMatch &&
          dateRangeMatch
        );
      } catch (error) {
        console.error('Error parsing filter:', error);
        return true;
      }
    };
  }

  applyFilter() {
    const filterValue = JSON.stringify({
      searchTerm: this.searchTerm?.trim() || '',
      status: this.selectedStatus,
      paymentMethod: this.selectedPaymentMethod,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
      minAmount: this.minAmount,
      maxAmount: this.maxAmount,
    });

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedPaymentMethod = 'all';
    this.startDate = null;
    this.endDate = null;
    this.minAmount = null;
    this.maxAmount = null;
    this.applyFilter();
  }

  getStatusClass(status: PaymentStatus): string {
    const statusClasses: { [key in PaymentStatus]: string } = {
      pending: 'status-pending',
      completed: 'status-completed',
      failed: 'status-failed',
      refunded: 'status-refunded',
    };
    return statusClasses[status];
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  viewPaymentDetails(payment: Payment) {
    // Navigate to payment details page
  }

  processPayment(payment: Payment) {
    this.paymentService.processPayment(payment._id!).subscribe({
      next: () => {
        this.snackBar.open('Payment processed successfully', 'Close', {
          duration: 3000,
        });
        this.loadPayments();
        this.loadPaymentSummary();
      },
      error: (error) => {
        this.snackBar.open(
          'Error processing payment: ' + error.message,
          'Close',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  refundPayment(payment: Payment) {
    if (confirm('Are you sure you want to refund this payment?')) {
      this.paymentService.refundPayment(payment._id!).subscribe({
        next: () => {
          this.snackBar.open('Payment refunded successfully', 'Close', {
            duration: 3000,
          });
          this.loadPayments();
          this.loadPaymentSummary();
        },
        error: (error) => {
          this.snackBar.open(
            'Error refunding payment: ' + error.message,
            'Close',
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }
}
