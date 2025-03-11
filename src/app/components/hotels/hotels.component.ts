import { Component } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { HotelsService } from '../../services/hotels.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { catchError, Observable, of, tap } from 'rxjs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatError } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotels',
  imports: [
    MatIconModule,
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,

    MatChipsModule,
    MatError,
    MatChipsModule,
  ],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.css',
})
export class HotelsComponent {
  hotels$!: Observable<Hotel[]>;
  errorMessage!: string;
  isLoading = true;
  constructor(private hotelsService: HotelsService, private router: Router) {}

  ngOnInit(): void {
    this.hotels$ = this.hotelsService.getHotels().pipe(
      tap(() => (this.isLoading = false)),
      catchError((err) => {
        this.errorMessage = 'Failed to load hotels. Please try again later.';
        this.isLoading = false;
        return of([]);
      })
    );
    console.log(
      this.hotels$.subscribe((hotels) => console.log('Loaded hotels:', hotels))
    );
  }

  getFirstImageUrl(images: string[]): string {
    return images && images.length > 0 ? images[0] : 'assets/placeholder.jpg';
  }
  onUpdate(id: string): void {
    console.log('Update hotel with ID:', id);
    // Navigate to update form or open modal
  }

  onDelete(id: string): void {
    console.log('Delete hotel with ID:', id);
    this.hotelsService.deleteHotel(id).subscribe({
      next: () => {
        console.log('Hotel deleted successfully');
        this.ngOnInit();
      },
      error: (err) => console.error('Failed to delete hotel:', err),
    });
  }

  onDetails(id: string): void {
    this.router.navigate(['/hotels', id]); // Navigate to details component
  }
}
