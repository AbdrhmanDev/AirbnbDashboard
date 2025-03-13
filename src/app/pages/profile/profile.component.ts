import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
})
export class ProfileComponent implements OnInit {
  user: UserResponse | null = null;
  isLoading = true;
  error: string | null = null;
  profileForm: FormGroup;
  isEditing = false;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^(01)(0|1|2|5)\d{8}$/)]],
      address: this.fb.group({
        country: ['', [Validators.required]],
        city: ['', [Validators.required]],
      }),
    });
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const token = this.loginService.getToken();
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.id;

        if (userId) {
          this.userService.getUserById(userId).subscribe({
            next: (user) => {
              this.user = user;
              this.profileForm.patchValue({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || '',
                address: {
                  country: user.address?.country || '',
                  city: user.address?.city || '',
                },
              });
              this.imagePreview = user.profileImage || null;
              this.isLoading = false;
            },
            error: (error) => {
              this.error = error.message;
              this.isLoading = false;
              this.snackBar.open(
                'Error loading profile: ' + error.message,
                'Close',
                {
                  duration: 3000,
                  horizontalPosition: 'end',
                  verticalPosition: 'top',
                }
              );
            },
          });
        }
      } catch (error) {
        this.error = 'Invalid token';
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  onEdit(): void {
    this.isEditing = true;
  }

  onCancel(): void {
    this.isEditing = false;
    this.loadUser(); // Reset form to original values
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.user) {
      const formData = new FormData();
      formData.append('firstName', this.profileForm.get('firstName')?.value);
      formData.append('lastName', this.profileForm.get('lastName')?.value);
      formData.append('email', this.profileForm.get('email')?.value);
      formData.append('phone', this.profileForm.get('phone')?.value);
      formData.append(
        'address',
        JSON.stringify(this.profileForm.get('address')?.value)
      );

      if (this.selectedFile) {
        formData.append('profileImage', this.selectedFile);
      }

      const userData = {
        firstName: this.profileForm.get('firstName')?.value,
        lastName: this.profileForm.get('lastName')?.value,
        email: this.profileForm.get('email')?.value,
        phone: this.profileForm.get('phone')?.value,
        address: this.profileForm.get('address')?.value
      };

      this.userService.updateUser(this.user?._id || '', userData).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.isEditing = false;
          this.snackBar.open('Profile updated successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        },
        error: (error) => {
          this.snackBar.open(
            'Error updating profile: ' + error.message,
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            }
          );
        },
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      return `Minimum length is ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('maxlength')) {
      return `Maximum length is ${control.errors?.['maxlength'].requiredLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }
}
