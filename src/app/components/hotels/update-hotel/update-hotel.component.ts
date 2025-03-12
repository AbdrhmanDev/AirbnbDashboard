import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelsService } from '../../../services/hotels.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-update-hotel',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './update-hotel.component.css',
  styleUrls: ['./update-hotel.component.css'],
})
export class UpdateHotelComponent implements OnInit {
  hotelForm!: FormGroup;
  hotelId: string = '';
  imageFiles: File[] = [];
  base64Images: string[] = [];
  previewUrls: string[] = [];
  categories: Category[] = [];
  existingImages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private hotelsService: HotelsService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.route.params.subscribe((params) => {
      this.hotelId = params['id'];
      this.loadHotelData();
    });
  }

  private loadHotelData(): void {
    this.hotelsService.getHotelById(this.hotelId).subscribe({
      next: (hotel) => {
        this.hotelForm.patchValue({
          title: hotel.title,
          description: hotel.description,
          pricePerNight: hotel.pricePerNight,
          rooms: hotel.rooms,
          bathrooms: hotel.bathrooms,
          path: hotel.path,
          status: hotel.status,
          categoryId: hotel.categoryId,
          address: {
            country: hotel.address.country,
            city: hotel.address.city,
          },
        });
        this.existingImages = hotel.images || [];
        this.previewUrls = [...this.existingImages];
        this.base64Images = [...this.existingImages];
      },
      error: (error) => {
        console.error('Error loading hotel:', error);
        this.snackBar.open('Failed to load hotel data', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackBar.open('Failed to load categories', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  private initForm(): void {
    this.hotelForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      pricePerNight: ['', [Validators.required, Validators.min(0)]],
      rooms: ['', [Validators.required, Validators.min(1)]],
      bathrooms: ['', [Validators.required, Validators.min(1)]],
      path: ['', [Validators.required, Validators.min(1)]],
      status: ['available', Validators.required],
      categoryId: ['', Validators.required],
      address: this.fb.group({
        country: ['', Validators.required],
        city: ['', Validators.required],
      }),
      images: [[], Validators.required],
    });
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      files.forEach((file) => {
        if (file.type.startsWith('image/')) {
          this.imageFiles.push(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              const base64String = e.target.result as string;
              this.base64Images.push(base64String);
              this.previewUrls.push(base64String);
              this.hotelForm.patchValue({
                images: this.base64Images,
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removeImage(index: number): void {
    if (index < this.existingImages.length) {
      // Removing an existing image
      this.existingImages.splice(index, 1);
    } else {
      // Removing a newly added image
      const newIndex = index - this.existingImages.length;
      this.imageFiles.splice(newIndex, 1);
      this.base64Images.splice(index, 1);
    }
    this.previewUrls.splice(index, 1);
    this.hotelForm.patchValue({
      images: this.base64Images,
    });
  }

  onSubmit(): void {
    if (
      this.hotelForm.valid &&
      (this.base64Images.length > 0 || this.existingImages.length > 0)
    ) {
      const formValue = this.hotelForm.value;

      // Create the final form data object
      const hotelData = {
        ...formValue,
        images: [
          ...this.existingImages,
          ...this.base64Images.slice(this.existingImages.length),
        ],
      };

      this.hotelsService.updateHotel(this.hotelId, hotelData).subscribe({
        next: (response) => {
          this.snackBar.open('Hotel updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/hotels']);
        },
        error: (error) => {
          this.snackBar.open(
            'Failed to update hotel. Please try again.',
            'Close',
            {
              duration: 3000,
              panelClass: ['error-snackbar'],
            }
          );
          console.error('Error updating hotel:', error);
        },
      });
    } else {
      this.markFormGroupTouched(this.hotelForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.hotelForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('min')) {
      return `Value must be greater than ${control.errors?.['min'].min}`;
    }
    return '';
  }
}
