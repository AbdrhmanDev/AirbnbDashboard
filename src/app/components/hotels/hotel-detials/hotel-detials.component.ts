import { Component } from '@angular/core';
import { Hotel } from '../../../models/hotel';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HotelsService } from '../../../services/hotels.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';



@Component({
  selector: 'app-hotel-detials',
  imports: [      CommonModule,
    RouterModule,
    HttpClientModule,
    CardModule,
    GalleriaModule,
    ButtonModule,
    TagModule,
    
    MatCardModule, MatButtonModule, MatIconModule,CarouselModule

    

    ],
  templateUrl: './hotel-detials.component.html',
  styleUrl: './hotel-detials.component.css',
})
export class HotelDetialsComponent {
  hotel!: Hotel;
  errorMessage!: string;
  isLoading = true;
  carouselOptions: OwlOptions = {
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      1000: { items: 3 }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private hotelsService: HotelsService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hotelsService.getHotelById(id).subscribe({
        next: (hotel) => {
          this.hotel = hotel;
          this.isLoading = false;
          console.log('Hotel loaded:', hotel);
        },
        error: (err) => {
          this.errorMessage = 'Failed to load hotel details.';
          this.isLoading = false;
        },
      });
    }
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
