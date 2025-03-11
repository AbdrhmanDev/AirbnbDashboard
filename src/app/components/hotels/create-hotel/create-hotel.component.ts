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
import { Router } from '@angular/router';
import { HotelsService } from '../../../services/hotels.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category';

@Component({
  selector: 'app-create-hotel',
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
  templateUrl: './create-hotel.component.html',
  styleUrls: ['./create-hotel.component.css'],
})
export class CreateHotelComponent implements OnInit {
  hotelForm!: FormGroup;
  imageFiles: File[] = [];
  previewUrls: string[] = [];
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private hotelsService: HotelsService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log(this.categories);
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
              this.previewUrls.push(e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removeImage(index: number): void {
    this.imageFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.hotelForm.valid && this.imageFiles.length > 0) {
      const formData = new FormData();
      const formValue = this.hotelForm.value;
      console.log(formValue);

      // Append form data
      Object.keys(formValue).forEach((key) => {
        if (key === 'address') {
          formData.append(key, JSON.stringify(formValue[key]));
        } else {
          formData.append(key, formValue[key]);
        }
      });

      // Append images
      this.imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      this.hotelsService.createHotel(formValue).subscribe({
        next: (response) => {
          this.snackBar.open('Hotel created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/hotels']);
        },
        error: (error) => {
          this.snackBar.open(
            'Failed to create hotel. Please try again.',
            'Close',
            {
              duration: 3000,
              panelClass: ['error-snackbar'],
            }
          );
          console.error('Error creating hotel:', error);
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
