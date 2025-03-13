import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserResponse } from '../models/user';

interface LoginResponse {
  token: string;
  user: UserResponse;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/users'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  saveUserData(user: UserResponse): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserData(): UserResponse | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }
}
