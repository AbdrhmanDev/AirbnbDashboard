import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface HotelForm {
  title: string;
  location: string;
  category: string;
  rating: number;
  totalRooms: number;
  bathrooms: number;
  price: number;
  status: 'available' | 'unavailable';
  description: string;
  images: string[];
}

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="add-hotel-container">
      <div class="page-header">
        <h2>إضافة فندق جديد</h2>
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          رجوع
        </button>
      </div>
      
      <mat-stepper [linear]="true" #stepper>
        <!-- Basic Information Step -->
        <mat-step [stepControl]="basicInfoForm">
          <form [formGroup]="basicInfoForm">
            <ng-template matStepLabel>المعلومات الأساسية</ng-template>
            
            <div class="form-row">
              <mat-form-field>
                <mat-label>اسم الفندق</mat-label>
                <input matInput formControlName="title" required>
                <mat-error *ngIf="basicInfoForm.get('title')?.invalid">
                  {{getErrorMessage(basicInfoForm, 'title')}}
                </mat-error>
              </mat-form-field>

              <mat-form-field>
                <mat-label>الموقع</mat-label>
                <input matInput formControlName="location" required>
                <mat-error *ngIf="basicInfoForm.get('location')?.invalid">
                  {{getErrorMessage(basicInfoForm, 'location')}}
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field>
                <mat-label>الفئة</mat-label>
                <mat-select formControlName="category" required>
                  <mat-option value="luxury">فاخر</mat-option>
                  <mat-option value="business">أعمال</mat-option>
                  <mat-option value="resort">منتجع</mat-option>
                  <mat-option value="boutique">بوتيك</mat-option>
                </mat-select>
                <mat-error *ngIf="basicInfoForm.get('category')?.invalid">
                  {{getErrorMessage(basicInfoForm, 'category')}}
                </mat-error>
              </mat-form-field>

              <mat-form-field>
                <mat-label>التقييم</mat-label>
                <mat-select formControlName="rating" required>
                  <mat-option *ngFor="let rating of [1,2,3,4,5]" [value]="rating">
                    {{rating}} نجوم
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="basicInfoForm.get('rating')?.invalid">
                  {{getErrorMessage(basicInfoForm, 'rating')}}
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button matStepperNext [disabled]="!basicInfoForm.valid">
                التالي
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Rooms Information Step -->
        <mat-step [stepControl]="roomsForm">
          <form [formGroup]="roomsForm">
            <ng-template matStepLabel>معلومات الغرف</ng-template>
            
            <div class="form-row">
              <mat-form-field>
                <mat-label>عدد الغرف</mat-label>
                <input matInput type="number" formControlName="totalRooms" required>
                <mat-error *ngIf="roomsForm.get('totalRooms')?.invalid">
                  {{getErrorMessage(roomsForm, 'totalRooms')}}
                </mat-error>
              </mat-form-field>

              <mat-form-field>
                <mat-label>عدد الحمامات</mat-label>
                <input matInput type="number" formControlName="bathrooms" required>
                <mat-error *ngIf="roomsForm.get('bathrooms')?.invalid">
                  {{getErrorMessage(roomsForm, 'bathrooms')}}
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field>
                <mat-label>السعر لليلة</mat-label>
                <input matInput type="number" formControlName="price" required>
                <span matSuffix>ريال</span>
                <mat-error *ngIf="roomsForm.get('price')?.invalid">
                  {{getErrorMessage(roomsForm, 'price')}}
                </mat-error>
              </mat-form-field>

              <mat-form-field>
                <mat-label>الحالة</mat-label>
                <mat-select formControlName="status" required>
                  <mat-option value="available">متاح</mat-option>
                  <mat-option value="unavailable">غير متاح</mat-option>
                </mat-select>
                <mat-error *ngIf="roomsForm.get('status')?.invalid">
                  {{getErrorMessage(roomsForm, 'status')}}
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button matStepperPrevious>السابق</button>
              <button mat-button matStepperNext>التالي</button>
            </div>
          </form>
        </mat-step>

        <!-- Description Step -->
        <mat-step [stepControl]="descriptionForm">
          <form [formGroup]="descriptionForm">
            <ng-template matStepLabel>الوصف</ng-template>
            
            <div class="form-row full-width">
              <mat-form-field>
                <mat-label>وصف الفندق</mat-label>
                <textarea matInput formControlName="description" rows="6" required></textarea>
                <mat-error *ngIf="descriptionForm.get('description')?.invalid">
                  {{getErrorMessage(descriptionForm, 'description')}}
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button matStepperPrevious>السابق</button>
              <button mat-button matStepperNext>التالي</button>
            </div>
          </form>
        </mat-step>

        <!-- Images Step -->
        <mat-step [stepControl]="imagesForm">
          <form [formGroup]="imagesForm">
            <ng-template matStepLabel>الصور</ng-template>
            
            <div class="images-upload">
              <div class="upload-box" (click)="fileInput.click()">
                <input #fileInput type="file" hidden multiple accept="image/*" (change)="onFileSelected($event)">
                <mat-icon>cloud_upload</mat-icon>
                <p>اسحب وأفلت الصور هنا أو انقر للاختيار</p>
              </div>

              <div class="images-preview" *ngIf="selectedImages.length > 0">
                <div class="image-item" *ngFor="let image of selectedImages; let i = index">
                  <img [src]="image.preview" [alt]="'صورة ' + (i + 1)">
                  <button mat-icon-button (click)="removeImage(i)">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button matStepperPrevious>السابق</button>
              <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!isFormsValid()">
                حفظ
              </button>
            </div>
          </form>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .add-hotel-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    h2 {
      margin: 0;
      color: #2c3e50;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-row.full-width {
      flex-direction: column;
    }

    mat-form-field {
      flex: 1;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 24px;
    }

    .images-upload {
      margin: 20px 0;
    }

    .upload-box {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-box:hover {
      border-color: #1976d2;
      background: #f5f5f5;
    }

    .upload-box mat-icon {
      font-size: 48px;
      color: #666;
      margin-bottom: 12px;
    }

    .images-preview {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }

    .image-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
    }

    .image-item img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .image-item button {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(0,0,0,0.5);
      color: white;
    }

    /* RTL Support */
    [dir="rtl"] .form-actions {
      flex-direction: row-reverse;
    }

    [dir="rtl"] .image-item button {
      right: auto;
      left: 4px;
    }
  `]
})
export class AddHotelComponent implements OnInit {
  basicInfoForm!: FormGroup;
  roomsForm!: FormGroup;
  descriptionForm!: FormGroup;
  imagesForm!: FormGroup;
  selectedImages: Array<{file: File, preview: string}> = [];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.basicInfoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      rating: ['', Validators.required]
    });

    this.roomsForm = this.fb.group({
      totalRooms: ['', [Validators.required, Validators.min(1)]],
      bathrooms: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      status: ['available', Validators.required]
    });

    this.descriptionForm = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(50)]]
    });

    this.imagesForm = this.fb.group({
      images: [null, Validators.required]
    });
  }

  ngOnInit() {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.selectedImages.push({
              file: file,
              preview: e.target.result as string
            });
            this.updateImagesForm();
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  private updateImagesForm() {
    const files = this.selectedImages.map(img => img.file);
    this.imagesForm.patchValue({ images: files.length ? files : null });
    this.imagesForm.markAsDirty();
    this.imagesForm.markAsTouched();
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.updateImagesForm();
  }

  isFormsValid(): boolean {
    return (
      this.basicInfoForm.valid &&
      this.roomsForm.valid &&
      this.descriptionForm.valid &&
      this.selectedImages.length > 0
    );
  }

  onSubmit() {
    if (this.isFormsValid()) {
      const formData: HotelForm = {
        ...this.basicInfoForm.value,
        ...this.roomsForm.value,
        ...this.descriptionForm.value,
        images: this.selectedImages.map(img => img.preview)
      };

      const savedHotels = localStorage.getItem('hotels');
      const hotels = savedHotels ? JSON.parse(savedHotels) : [];

      hotels.push({
        ...formData,
        reviews: 0,
        image: this.selectedImages[0]?.preview || 'assets/images/placeholder.jpg'
      });

      localStorage.setItem('hotels', JSON.stringify(hotels));

      this.router.navigate(['/home']);
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return 'هذا الحقل مطلوب';
    }
    if (control.hasError('minlength')) {
      return 'النص قصير جداً';
    }
    if (control.hasError('min')) {
      return 'القيمة صغيرة جداً';
    }
    return '';
  }
} 