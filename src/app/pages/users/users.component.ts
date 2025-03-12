import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';

import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
  ],
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    'profileImage',
    'name',
    'email',
    'phone',
    'role',
    'actions',
  ];
  filteredUsers = new MatTableDataSource<UserResponse>();
  searchTerm: string = '';
  selectedRole: string = 'all';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.filteredUsers.paginator = this.paginator;
    this.filteredUsers.sort = this.sort;
  }

  loadUsers() {
    const filters: any = {};
    if (this.selectedRole !== 'all') filters.role = this.selectedRole;

    this.userService.getUsers(filters).subscribe({
      next: (users) => {
        this.filteredUsers.data = users;
      },
      error: (error) => {
        this.snackBar.open('Error loading users: ' + error.message, 'Close', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }

  onSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredUsers.filter = filterValue.trim().toLowerCase();
  }

  onRoleFilter(role: string) {
    this.selectedRole = role;
    this.loadUsers();
  }

  getFullName(user: UserResponse): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getRoleClass(role: string): string {
    return `role-${role.toLowerCase()}`;
  }

  viewUserDetails(userId: string) {
    this.router.navigate(['/users', userId]);
  }

  editUser(userId: string) {
    this.router.navigate(['/users/edit', userId]);
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open('Error deleting user: ' + error.message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          });
        },
      });
    }
  }
}
