import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-bookings-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="bookings-page">
      <div class="page-header">
        <h2>إدارة الحجوزات</h2>
        <div class="filters">
          <mat-form-field>
            <mat-label>بحث</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="ابحث عن حجز...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <div class="status-filters">
            <button mat-button [class.active]="currentFilter === 'all'" (click)="filterBookings('all')">
              الكل
            </button>
            <button mat-button [class.active]="currentFilter === 'pending'" (click)="filterBookings('pending')">
              معلق
            </button>
            <button mat-button [class.active]="currentFilter === 'confirmed'" (click)="filterBookings('confirmed')">
              مؤكد
            </button>
            <button mat-button [class.active]="currentFilter === 'cancelled'" (click)="filterBookings('cancelled')">
              ملغي
            </button>
          </div>
        </div>
      </div>

      <table mat-table [dataSource]="filteredBookings" class="bookings-table">
        <!-- صورة الفندق -->
        <ng-container matColumnDef="hotel">
          <th mat-header-cell *matHeaderCellDef>الفندق</th>
          <td mat-cell *matCellDef="let booking">
            <div class="hotel-info">
              <span class="hotel-name">{{booking.hotelName}}</span>
            </div>
          </td>
        </ng-container>

        <!-- معلومات الحجز -->
        <ng-container matColumnDef="guest">
          <th mat-header-cell *matHeaderCellDef>معلومات الحاجز</th>
          <td mat-cell *matCellDef="let booking">
            <div class="guest-info">
              <span class="guest-name">{{booking.guestName}}</span>
              <span class="guest-contact">
                {{booking.guestEmail}} | {{booking.guestPhone}}
              </span>
            </div>
          </td>
        </ng-container>

        <!-- تاريخ الحجز -->
        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef>تاريخ الحجز</th>
          <td mat-cell *matCellDef="let booking">
            <div class="dates-info">
              <div>من: {{booking.checkIn | date:'shortDate'}}</div>
              <div>إلى: {{booking.checkOut | date:'shortDate'}}</div>
            </div>
          </td>
        </ng-container>

        <!-- التفاصيل -->
        <ng-container matColumnDef="details">
          <th mat-header-cell *matHeaderCellDef>التفاصيل</th>
          <td mat-cell *matCellDef="let booking">
            <div class="booking-details">
              <div>عدد الغرف: {{booking.roomCount}}</div>
              <div class="price">{{booking.totalPrice}} ريال</div>
            </div>
          </td>
        </ng-container>

        <!-- الحالة -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>الحالة</th>
          <td mat-cell *matCellDef="let booking">
            <span class="status-badge" [class]="booking.status">
              {{getStatusText(booking.status)}}
            </span>
          </td>
        </ng-container>

        <!-- الإجراءات -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
          <td mat-cell *matCellDef="let booking">
            <div class="actions">
              <button mat-icon-button color="primary" *ngIf="booking.status === 'pending'"
                      (click)="confirmBooking(booking.id)">
                <mat-icon>check_circle</mat-icon>
              </button>
              <button mat-icon-button color="warn" *ngIf="booking.status === 'pending'"
                      (click)="cancelBooking(booking.id)">
                <mat-icon>cancel</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="viewDetails(booking)">
                <mat-icon>visibility</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: [`
    .bookings-page {
      padding: 20px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      min-height: calc(100vh - 100px);
    }

    .page-header {
      margin-bottom: 20px;
    }

    .page-header h2 {
      color: #3f51b5;
      margin-bottom: 16px;
    }

    .filters {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .status-filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .status-filters button.active {
      background: rgba(63, 81, 181, 0.1);
      color: #3f51b5;
    }

    .bookings-table {
      width: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .hotel-info, .guest-info, .dates-info, .booking-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .hotel-name {
      font-weight: 500;
      color: #3f51b5;
    }

    .guest-name {
      font-weight: 500;
    }

    .guest-contact {
      font-size: 0.9em;
      color: #666;
    }

    .price {
      font-weight: 500;
      color: #3f51b5;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.9em;
    }

    .status-badge.pending {
      background: rgba(255, 193, 7, 0.1);
      color: #ffc107;
    }

    .status-badge.confirmed {
      background: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    .status-badge.cancelled {
      background: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    th.mat-header-cell {
      background: #f5f5f5;
      font-weight: 500;
      color: #2c3e50;
      text-align: right;
    }

    td.mat-cell {
      text-align: right;
    }

    tr.mat-row:hover {
      background: #f8f9fa;
    }

    mat-paginator {
      background: transparent;
    }
  `]
})
export class BookingsPageComponent {
  displayedColumns: string[] = ['hotel', 'guest', 'dates', 'details', 'status', 'actions'];
  bookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  currentFilter: 'all' | 'pending' | 'confirmed' | 'cancelled' = 'all';

  constructor() {
    this.loadBookings();
  }

  loadBookings() {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      this.bookings = JSON.parse(savedBookings).map((booking: any) => ({
        ...booking,
        checkIn: new Date(booking.checkIn),
        checkOut: new Date(booking.checkOut),
        createdAt: new Date(booking.createdAt)
      }));
      this.filteredBookings = this.bookings;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredBookings = this.bookings.filter(booking => 
      booking.hotelName.toLowerCase().includes(filterValue) ||
      booking.guestName.toLowerCase().includes(filterValue) ||
      booking.guestEmail.toLowerCase().includes(filterValue)
    );
  }

  filterBookings(status: 'all' | 'pending' | 'confirmed' | 'cancelled') {
    this.currentFilter = status;
    if (status === 'all') {
      this.filteredBookings = this.bookings;
    } else {
      this.filteredBookings = this.bookings.filter(b => b.status === status);
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'معلق',
      'confirmed': 'مؤكد',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  }

  confirmBooking(bookingId: string) {
    const index = this.bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      this.bookings[index].status = 'confirmed';
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      this.filterBookings(this.currentFilter);
    }
  }

  cancelBooking(bookingId: string) {
    const index = this.bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
      this.bookings[index].status = 'cancelled';
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
      this.filterBookings(this.currentFilter);
    }
  }

  viewDetails(booking: Booking) {
    console.log('View booking details:', booking);
    // يمكن إضافة منطق لعرض التفاصيل في نافذة منبثقة
  }
} 