import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // Retrieve the token from localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    });
  }
  // Get all categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl,{
        headers: this.getAuthHeaders(),
      });
  }

  // Get category by ID
  //   getCategoryById(id: string): Observable<Category> {
  //     return this.http.get<Category>(`${this.apiUrl}/${id}`);
  //   }

  // Create new category
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update category
  updateCategory(
    id: string,
    category: Partial<Category>
  ): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, {
      headers: this.getAuthHeaders(),
    });
  }

  // Delete category
  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get hotels by category
  getHotelsByCategory(categoryId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${categoryId}/hotels`);
  }
}
