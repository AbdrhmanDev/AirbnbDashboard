import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '../../../services/user.service';
import { UserResponse } from '../../../models/user';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
})
export class UserDetailsComponent implements OnInit {
  user: UserResponse | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['id'];
    this.loadUser(userId);
  }

  loadUser(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
        this.snackBar.open('Error loading user: ' + error.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  onEdit(): void {
    if (this.user) {
      this.router.navigate(['/users/edit', this.user._id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/users']);
  }
}
