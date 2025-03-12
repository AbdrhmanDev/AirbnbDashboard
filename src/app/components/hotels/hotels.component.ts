import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { HotelsService } from '../../services/hotels.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  BehaviorSubject,
  catchError,
  Observable,
  of,
  combineLatest,
  map,
  tap,
} from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatError } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatError,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css'],
})
export class HotelsComponent implements OnInit {
  private hotelsSubject = new BehaviorSubject<Hotel[]>([]);
  hotels$!: Observable<Hotel[]>;
  errorMessage!: string;
  isLoading = true;

  // Search and filter state
  searchQuery = '';
  selectedStatus = 'all';
  private searchSubject = new BehaviorSubject<string>('');
  private filterSubject = new BehaviorSubject<string>('all');

  constructor(
    private hotelsService: HotelsService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    // Initialize the filtered hotels observable
    this.hotels$ = combineLatest([
      this.hotelsSubject,
      this.searchSubject,
      this.filterSubject,
    ]).pipe(
      map(([hotels, search, filter]) => {
        return this.filterHotels(hotels, search, filter);
      })
    );
  }

  ngOnInit(): void {
    this.loadHotels();
  }

  private loadHotels(): void {
    this.hotelsService
      .getHotels()
      .pipe(
        tap((hotels) => {
          this.hotelsSubject.next(hotels);
          this.isLoading = false;
        }),
        catchError((err) => {
          this.errorMessage = 'Failed to load hotels. Please try again later.';
          this.isLoading = false;
          return of([]);
        })
      )
      .subscribe();
  }

  // Search handler
  onSearch(event: Event): void {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchValue.toLowerCase());
  }

  // Filter handler
  onFilterChange(status: string): void {
    this.filterSubject.next(status);
  }

  private filterHotels(
    hotels: Hotel[],
    search: string,
    filter: string
  ): Hotel[] {
    return hotels.filter((hotel) => {
      const matchesSearch =
        search === '' ||
        hotel.title.toLowerCase().includes(search) ||
        hotel.address.city.toLowerCase().includes(search) ||
        hotel.address.country.toLowerCase().includes(search);

      const matchesFilter = filter === 'all' || hotel.status === filter;

      return matchesSearch && matchesFilter;
    });
  }

  getFirstImageUrl(images: string[]): string {
    return images && images.length > 0 ? images[0] : 'assets/placeholder.jpg';
  }

  onUpdate(id: string): void {
    this.router.navigate(['/hotels/', id]);
  }

  onDelete(hotel: Hotel): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '400px',
      data: { hotelName: hotel.title },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.hotelsService.deleteHotel(hotel._id).subscribe({
          next: () => {
            this.loadHotels();
            this.snackBar.open('Hotel deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            });
          },
          error: (err) => {
            console.error('Failed to delete hotel:', err);
            this.snackBar.open('Failed to delete hotel', 'Close', {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar'],
            });
          },
        });
      }
    });
  }

  onDetails(id: string): void {
    this.router.navigate(['/hotels', id]);
  }
}
