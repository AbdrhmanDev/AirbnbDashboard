import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Hotel {
  title: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  status: 'available' | 'unavailable';
  category: string;
  totalRooms: number;
  bathrooms: number;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  hotels: Hotel[] = [];

  constructor() {
    const savedHotels = localStorage.getItem('hotels');
    if (savedHotels) {
      this.hotels = JSON.parse(savedHotels);
    }
  }

  ngOnInit(): void {}

  getCategoryLabel(category: string): string {
    const categories = {
      'luxury': 'فاخر',
      'business': 'أعمال',
      'resort': 'منتجع',
      'boutique': 'بوتيك'
    };
    return categories[category as keyof typeof categories] || category;
  }
}
