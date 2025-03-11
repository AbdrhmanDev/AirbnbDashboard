// import { Component, OnInit, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, Router } from '@angular/router';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatTableModule } from '@angular/material/table';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import {
//   MatDialogModule,
//   MatDialog,
//   MatDialogRef,
//   MAT_DIALOG_DATA,
// } from '@angular/material/dialog';
// import { MatSelectModule } from '@angular/material/select';
// import {
//   FormsModule,
//   ReactiveFormsModule,
//   FormBuilder,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
// import {
//   LanguageService,
//   Language,
//   TranslationKeys,
// } from '../../services/language.service';
// import { HotelsService } from '../../services/hotels.service';
// import { Observable } from 'rxjs';

// interface Hotel {
//   title: string;
//   location: string;
//   image: string;
//   rating: number;
//   reviews: number;
//   price: number;
//   status: 'available' | 'unavailable';
//   category: string;
//   totalRooms: number;
//   bathrooms: number;
//   description: string;
// }

// @Component({
//   selector: 'app-edit-hotel-dialog',
//   template: `
//     <div class="dialog-container">
//       <h2 mat-dialog-title>
//         <mat-icon>edit</mat-icon>
//         تعديل الفندق
//       </h2>

//       <mat-dialog-content>
//         <form [formGroup]="editForm" class="edit-form">
//           <!-- معلومات أساسية -->
//           <div class="form-section">
//             <h3>
//               <mat-icon>info</mat-icon>
//               المعلومات الأساسية
//             </h3>
//             <div class="form-row">
//               <mat-form-field appearance="outline">
//                 <mat-label>اسم الفندق</mat-label>
//                 <input matInput formControlName="title" required />
//                 <mat-error *ngIf="editForm.get('title')?.hasError('required')">
//                   هذا الحقل مطلوب
//                 </mat-error>
//               </mat-form-field>

//               <mat-form-field appearance="outline">
//                 <mat-label>الموقع</mat-label>
//                 <input matInput formControlName="location" required />
//                 <mat-icon matSuffix>location_on</mat-icon>
//                 <mat-error
//                   *ngIf="editForm.get('location')?.hasError('required')"
//                 >
//                   هذا الحقل مطلوب
//                 </mat-error>
//               </mat-form-field>
//             </div>

//             <div class="form-row">
//               <mat-form-field appearance="outline">
//                 <mat-label>الفئة</mat-label>
//                 <mat-select formControlName="category" required>
//                   <mat-option value="luxury">
//                     <mat-icon>stars</mat-icon>
//                     فاخر
//                   </mat-option>
//                   <mat-option value="business">
//                     <mat-icon>business</mat-icon>
//                     أعمال
//                   </mat-option>
//                   <mat-option value="resort">
//                     <mat-icon>beach_access</mat-icon>
//                     منتجع
//                   </mat-option>
//                   <mat-option value="boutique">
//                     <mat-icon>hotel</mat-icon>
//                     بوتيك
//                   </mat-option>
//                 </mat-select>
//               </mat-form-field>

//               <mat-form-field appearance="outline">
//                 <mat-label>التقييم</mat-label>
//                 <mat-select formControlName="rating" required>
//                   <mat-option
//                     *ngFor="let rating of [1, 2, 3, 4, 5]"
//                     [value]="rating"
//                   >
//                     <span class="rating-option">
//                       <mat-icon
//                         *ngFor="let star of [].constructor(rating)"
//                         class="star-icon"
//                       >
//                         star
//                       </mat-icon>
//                     </span>
//                   </mat-option>
//                 </mat-select>
//               </mat-form-field>
//             </div>
//           </div>

//           <!-- معلومات الغرف -->
//           <div class="form-section">
//             <h3>
//               <mat-icon>meeting_room</mat-icon>
//               معلومات الغرف
//             </h3>
//             <div class="form-row">
//               <mat-form-field appearance="outline">
//                 <mat-label>عدد الغرف</mat-label>
//                 <input
//                   matInput
//                   type="number"
//                   formControlName="totalRooms"
//                   required
//                 />
//                 <mat-icon matSuffix>hotel</mat-icon>
//                 <mat-error *ngIf="editForm.get('totalRooms')?.hasError('min')">
//                   يجب أن يكون العدد أكبر من 0
//                 </mat-error>
//               </mat-form-field>

//               <mat-form-field appearance="outline">
//                 <mat-label>عدد الحمامات</mat-label>
//                 <input
//                   matInput
//                   type="number"
//                   formControlName="bathrooms"
//                   required
//                 />
//                 <mat-icon matSuffix>bathroom</mat-icon>
//                 <mat-error *ngIf="editForm.get('bathrooms')?.hasError('min')">
//                   يجب أن يكون العدد أكبر من 0
//                 </mat-error>
//               </mat-form-field>
//             </div>
//           </div>

//           <!-- معلومات السعر والحالة -->
//           <div class="form-section">
//             <h3>
//               <mat-icon>payments</mat-icon>
//               السعر والحالة
//             </h3>
//             <div class="form-row">
//               <mat-form-field appearance="outline">
//                 <mat-label>السعر</mat-label>
//                 <input
//                   matInput
//                   type="number"
//                   formControlName="price"
//                   required
//                 />
//                 <span matSuffix>ريال</span>
//                 <mat-error *ngIf="editForm.get('price')?.hasError('min')">
//                   يجب أن يكون السعر أكبر من 0
//                 </mat-error>
//               </mat-form-field>

//               <mat-form-field appearance="outline">
//                 <mat-label>الحالة</mat-label>
//                 <mat-select formControlName="status" required>
//                   <mat-option value="available" class="status-option available">
//                     <mat-icon>check_circle</mat-icon>
//                     متاح
//                   </mat-option>
//                   <mat-option
//                     value="unavailable"
//                     class="status-option unavailable"
//                   >
//                     <mat-icon>cancel</mat-icon>
//                     غير متاح
//                   </mat-option>
//                 </mat-select>
//               </mat-form-field>
//             </div>
//           </div>

//           <!-- الوصف -->
//           <div class="form-section">
//             <h3>
//               <mat-icon>description</mat-icon>
//               الوصف
//             </h3>
//             <mat-form-field appearance="outline" class="full-width">
//               <mat-label>وصف الفندق</mat-label>
//               <textarea
//                 matInput
//                 formControlName="description"
//                 rows="4"
//                 required
//               ></textarea>
//               <mat-error
//                 *ngIf="editForm.get('description')?.hasError('minlength')"
//               >
//                 يجب أن يكون الوصف 50 حرف على الأقل
//               </mat-error>
//             </mat-form-field>
//           </div>
//         </form>
//       </mat-dialog-content>

//       <mat-dialog-actions align="end">
//         <button mat-button mat-dialog-close class="cancel-button">
//           <mat-icon>close</mat-icon>
//           إلغاء
//         </button>
//         <button
//           mat-raised-button
//           color="primary"
//           [disabled]="!editForm.valid"
//           (click)="save()"
//           class="save-button"
//         >
//           <mat-icon>save</mat-icon>
//           حفظ التغييرات
//         </button>
//       </mat-dialog-actions>
//     </div>
//   `,
//   styles: [
//     `
//       .dialog-container {
//         padding: 20px;
//         max-width: 800px;
//       }

//       mat-dialog-title {
//         display: flex;
//         align-items: center;
//         gap: 8px;
//         color: #1976d2;
//         margin-bottom: 20px;
//       }

//       .form-section {
//         margin-bottom: 24px;
//         background: #f8f9fa;
//         padding: 16px;
//         border-radius: 8px;
//       }

//       .form-section h3 {
//         display: flex;
//         align-items: center;
//         gap: 8px;
//         color: #2c3e50;
//         margin-bottom: 16px;
//         font-size: 1.1rem;
//       }

//       .form-row {
//         display: grid;
//         grid-template-columns: 1fr 1fr;
//         gap: 16px;
//         margin-bottom: 16px;
//       }

//       .full-width {
//         grid-column: 1 / -1;
//       }

//       mat-form-field {
//         width: 100%;
//       }

//       .rating-option {
//         display: flex;
//         align-items: center;
//       }

//       .star-icon {
//         color: #ffc107;
//         font-size: 20px;
//         width: 20px;
//         height: 20px;
//       }

//       .status-option {
//         display: flex;
//         align-items: center;
//         gap: 8px;
//       }

//       .status-option.available mat-icon {
//         color: #4caf50;
//       }

//       .status-option.unavailable mat-icon {
//         color: #f44336;
//       }

//       mat-dialog-actions {
//         margin-top: 24px;
//         padding: 16px 0 0;
//         border-top: 1px solid #eee;
//       }

//       .cancel-button,
//       .save-button {
//         display: flex;
//         align-items: center;
//         gap: 8px;
//       }

//       .save-button {
//         background: #1976d2;
//       }

//       .save-button[disabled] {
//         background: rgba(0, 0, 0, 0.12);
//       }

//       [dir='rtl'] .form-row {
//         direction: rtl;
//       }
//     `,
//   ],
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatDialogModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule,
//     MatButtonModule,
//     MatIconModule,
//     ReactiveFormsModule,
//   ],
// })
// export class EditHotelDialogComponent {
//   editForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private dialogRef: MatDialogRef<EditHotelDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: Hotel
//   ) {
//     this.editForm = this.fb.group({
//       title: [data.title, [Validators.required, Validators.minLength(3)]],
//       location: [data.location, [Validators.required, Validators.minLength(3)]],
//       category: [data.category, Validators.required],
//       rating: [data.rating, Validators.required],
//       totalRooms: [data.totalRooms, [Validators.required, Validators.min(1)]],
//       bathrooms: [data.bathrooms, [Validators.required, Validators.min(1)]],
//       price: [data.price, [Validators.required, Validators.min(0)]],
//       status: [data.status, Validators.required],
//       description: [
//         data.description,
//         [Validators.required, Validators.minLength(50)],
//       ],
//     });
//   }

//   save() {
//     if (this.editForm.valid) {
//       this.dialogRef.close({
//         ...this.data,
//         ...this.editForm.value,
//       });
//     }
//   }
// }

// @Component({
//   selector: 'app-products',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     MatButtonModule,
//     MatIconModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDialogModule,
//     FormsModule,
//     ReactiveFormsModule,
//   ],
//   templateUrl:'./products.Component.html',
//   styleUrls: ['./products.Component.css']
// })
// export class ProductsComponent implements OnInit {
//    hotels$!:Hotel[;]
//   displayedColumns: string[] = [
//     'image',
//     'title',
//     'location',
//     'price',
//     'status',
//     'actions',
//   ];
//   hotels: Hotel[] = [];
//   filteredHotels: Hotel[] = [];
//   currentFilter: 'all' | 'available' | 'unavailable' = 'all';

//   constructor(private dialog: MatDialog, private router: Router,private hotelsService:HotelsService) {
//     this.loadHotels();
//   }

//   ngOnInit(): void {}

//   loadHotels() {
//     this.hotelsService.getHotels().subscribe(hotels => {
//       this.hotels$ = hotels;
//       this.filteredHotels = this.hotels;
//       localStorage.setItem('hotels', JSON.stringify(this.hotels));
//     });
//     if (savedHotels) {
    
//       this.filteredHotels = this.hotels;
//     }
//   }

//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
//     this.filteredHotels = this.hotels.filter(
//       (hotel) =>
//         hotel.title.toLowerCase().includes(filterValue) ||
//         hotel.location.toLowerCase().includes(filterValue)
//     );
//   }

//   filterHotels(filter: 'all' | 'available' | 'unavailable') {
//     this.currentFilter = filter;
//     if (filter === 'all') {
//       this.filteredHotels = this.hotels;
//     } else {
//       this.filteredHotels = this.hotels.filter(
//         (hotel) => hotel.status === filter
//       );
//     }
//   }

//   editHotel(hotel: Hotel, index: number) {
//     const dialogRef = this.dialog.open(EditHotelDialogComponent, {
//       data: { ...hotel },
//     });

//     dialogRef.afterClosed().subscribe((result) => {
//       if (result) {
//         this.hotels[index] = result;
//         localStorage.setItem('hotels', JSON.stringify(this.hotels));
//         this.filterHotels(this.currentFilter);
//       }
//     });
//   }

//   deleteHotel(index: number) {
//     if (confirm('هل أنت متأكد من حذف هذا الفندق؟')) {
//       this.hotels.splice(index, 1);
//       localStorage.setItem('hotels', JSON.stringify(this.hotels));
//       this.filterHotels(this.currentFilter);
//     }
//   }

//   getCategoryLabel(category: string): string {
//     const categories = {
//       luxury: 'فاخر',
//       business: 'أعمال',
//       resort: 'منتجع',
//       boutique: 'بوتيك',
//     };
//     return categories[category as keyof typeof categories] || category;
//   }
// }
