import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  User,
  UserResponse,
  CreateUserDTO,
  UpdateUserDTO,
} from '../models/user';

interface ApiResponse<T> {
  message?: string;
  user?: T;
  users?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Get all users with optional filters
  getUsers(filters?: {
    role?: string;
    status?: string;
  }): Observable<UserResponse[]> {
    let url = this.apiUrl;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      url += `?${params.toString()}`;
    }
    return this.http.get<UserResponse[]>(url, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get user by ID
  getUserById(id: string): Observable<UserResponse> {
    return this.http
      .get<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          if (!response.user) {
            throw new Error(response.message || 'User not found');
          }
          return response.user;
        })
      );
  }

  // Create new user
  createUser(user: CreateUserDTO): Observable<UserResponse> {
    return this.http
    .post<ApiResponse<UserResponse>>(`${this.apiUrl}/register`, user)
      .pipe(
        map((response) => {
          if (!response.user) {
            throw new Error(response.message || 'Failed to create user');
          }
          return response.user;
        })
      );
  }

  // Update user
  updateUser(id: string, user: UpdateUserDTO): Observable<UserResponse> {
    return this.http
      .patch<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}`, user, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          if (!response.user) {
            throw new Error(response.message || 'Failed to update user');
          }
          return response.user;
        })
      );
  }

  // Delete user
  deleteUser(id: string): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((response) => {
          if (response.message !== 'User deleted successfully') {
            throw new Error(response.message || 'Failed to delete user');
          }
        })
      );
  }

  // Update user profile image
  updateProfileImage(id: string, imageFile: File): Observable<UserResponse> {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    return this.http
      .put<ApiResponse<UserResponse>>(
        `${this.apiUrl}/${id}/profile-image`,
        formData,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map((response) => {
          if (!response.user) {
            throw new Error(
              response.message || 'Failed to update profile image'
            );
          }
          return response.user;
        })
      );
  }

  // Toggle user status (active/inactive)
  toggleUserStatus(id: string): Observable<UserResponse> {
    return this.http
      .patch<ApiResponse<UserResponse>>(
        `${this.apiUrl}/${id}/toggle-status`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map((response) => {
          if (!response.user) {
            throw new Error(response.message || 'Failed to toggle user status');
          }
          return response.user;
        })
      );
  }

  // Get user's bookings
  getUserBookings(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/bookings`, {
      headers: this.getAuthHeaders(),
    });
  }

  // For hosts: Get host's reviews
  getHostReviews(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/reviews`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Toggle superhost status
  toggleSuperHostStatus(id: string): Observable<UserResponse> {
    return this.http
      .patch<ApiResponse<UserResponse>>(
        `${this.apiUrl}/${id}/toggle-superhost`,
        {},
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map((response) => {
          if (!response.user) {
            throw new Error(
              response.message || 'Failed to toggle superhost status'
            );
          }
          return response.user;
        })
      );
  }

  // Change user password
  changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Observable<void> {
    return this.http
      .post<ApiResponse<void>>(
        `${this.apiUrl}/${id}/change-password`,
        {
          currentPassword,
          newPassword,
        },
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        map((response) => {
          if (response.error) {
            throw new Error(response.message || 'Failed to change password');
          }
        })
      );
  }

  // Search users
  searchUsers(query: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/search`, {
      params: { q: query },
      headers: this.getAuthHeaders(),
    });
  }
}
