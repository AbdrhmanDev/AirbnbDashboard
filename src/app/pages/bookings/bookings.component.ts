import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus, PaymentStatus } from '../../models/booking';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css'],
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
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
  ],
})
export class BookingsComponent implements OnInit {
  displayedColumns: string[] = [
    'propertyId',
    'companions',
    'startDate',
    'endDate',
    'status',
    'paymentStatus',
    'totalPrice',
    'actions',
  ];

  dataSource = new MatTableDataSource<Booking>();
  isLoading = true;
  selectedStatus: BookingStatus | 'all' = 'all';
  selectedPaymentStatus: PaymentStatus | 'all' = 'all';
  searchTerm: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;

  bookingStatuses: BookingStatus[] = [
    'pending',
    'confirmed',
    'cancelled',
    'completed',
  ];
  paymentStatuses: PaymentStatus[] = ['pending', 'paid', 'failed'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();
  }

  loadBookings() {
    this.isLoading = true;
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.dataSource.data = bookings;
        console.log(this.dataSource.data);
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open(
          'Error loading bookings: ' + error.message,
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );
        this.isLoading = false;
      },
    });
  }

  createFilter(): (data: Booking, filter: string) => boolean {
    return (data: Booking, filter: string): boolean => {
      if (!filter) return true;

      try {
        const searchStr = JSON.parse(filter);

        // Search term filter
        const searchTermMatch =
          !searchStr.searchTerm ||
          data.propertyId
            ?.toString()
            .toLowerCase()
            .includes(searchStr.searchTerm.toLowerCase()) ||
          data._id
            ?.toString()
            .toLowerCase()
            .includes(searchStr.searchTerm.toLowerCase()) ||
          (typeof data.userId !== 'string' &&
            data.userId?.firstName
              ?.toLowerCase()
              .includes(searchStr.searchTerm.toLowerCase())) ||
          (typeof data.userId !== 'string' &&
            data.userId?.lastName
              ?.toLowerCase()
              .includes(searchStr.searchTerm.toLowerCase()));

        // Status filter
        const statusMatch =
          !searchStr.status ||
          searchStr.status === 'all' ||
          data.status === searchStr.status;

        // Payment status filter
        const paymentStatusMatch =
          !searchStr.paymentStatus ||
          searchStr.paymentStatus === 'all' ||
          data.paymentStatus === searchStr.paymentStatus;

        // Date range filter
        const startDate = searchStr.startDate
          ? new Date(searchStr.startDate)
          : null;
        const endDate = searchStr.endDate ? new Date(searchStr.endDate) : null;
        const bookingStart = new Date(data.startDate);
        const bookingEnd = new Date(data.endDate);

        const dateRangeMatch =
          (!startDate || bookingStart >= startDate) &&
          (!endDate || bookingEnd <= endDate);

        return (
          searchTermMatch && statusMatch && paymentStatusMatch && dateRangeMatch
        );
      } catch (error) {
        console.error('Error parsing filter:', error);
        return true;
      }
    };
  }

  viewBooking(id: string) {
    console.log(id);
    this.router.navigate(['/bookings/details', id]);
  }

  applyFilter() {
    const filterValue = JSON.stringify({
      searchTerm: this.searchTerm?.trim() || '',
      status: this.selectedStatus,
      paymentStatus: this.selectedPaymentStatus,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
    });

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedStatus = 'all';
    this.selectedPaymentStatus = 'all';
    this.startDate = null;
    this.endDate = null;
    this.applyFilter();
  }

  getStatusClass(status: BookingStatus): string {
    const statusClasses: { [key in BookingStatus]: string } = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      cancelled: 'status-cancelled',
      completed: 'status-completed',
    };
    return statusClasses[status];
  }

  getPaymentStatusClass(status: PaymentStatus): string {
    const statusClasses: { [key in PaymentStatus]: string } = {
      pending: 'payment-pending',
      paid: 'payment-paid',
      failed: 'payment-failed',
    };
    return statusClasses[status];
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  confirmBooking(id: string) {
    this.bookingService.confirmBooking(id).subscribe({
      next: () => {
        this.snackBar.open('Booking confirmed successfully', 'Close', {
          duration: 3000,
        });
        this.loadBookings();
      },
      error: (error) => {
        this.snackBar.open(
          'Error confirming booking: ' + error.message,
          'Close',
          {
            duration: 3000,
          }
        );
      },
    });
  }

  cancelBooking(id: string) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(id).subscribe({
        next: () => {
          this.snackBar.open('Booking cancelled successfully', 'Close', {
            duration: 3000,
          });
          this.loadBookings();
        },
        error: (error) => {
          this.snackBar.open(
            'Error cancelling booking: ' + error.message,
            'Close',
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }

  deleteBooking(id: string) {
    if (
      confirm(
        'Are you sure you want to delete this booking? This action cannot be undone.'
      )
    ) {
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.snackBar.open('Booking deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadBookings();
        },
        error: (error) => {
          this.snackBar.open(
            'Error deleting booking: ' + error.message,
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
