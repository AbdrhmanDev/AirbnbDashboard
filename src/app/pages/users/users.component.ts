import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'نشط' | 'غير نشط';
  joinDate: string;
  lastLogin: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>إدارة المستخدمين</h1>
        <button class="btn-primary">
          <span class="material-icons">person_add</span>
          إضافة مستخدم
        </button>
      </div>

      <div class="filters-bar">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            placeholder="بحث عن مستخدم..."
          >
        </div>
        <div class="filters">
          <select [(ngModel)]="roleFilter">
            <option value="">كل الأدوار</option>
            <option value="admin">مدير</option>
            <option value="user">مستخدم</option>
            <option value="editor">محرر</option>
          </select>
          <select [(ngModel)]="statusFilter">
            <option value="">كل الحالات</option>
            <option value="نشط">نشط</option>
            <option value="غير نشط">غير نشط</option>
          </select>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الدور</th>
              <th>الحالة</th>
              <th>تاريخ الانضمام</th>
              <th>آخر تسجيل دخول</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td>{{user.name}}</td>
              <td>{{user.email}}</td>
              <td>{{user.role}}</td>
              <td>
                <span class="status-badge" [class.active]="user.status === 'نشط'">
                  {{user.status}}
                </span>
              </td>
              <td>{{user.joinDate}}</td>
              <td>{{user.lastLogin}}</td>
              <td class="actions">
                <button class="btn-icon" title="تعديل">
                  <span class="material-icons">edit</span>
                </button>
                <button class="btn-icon" title="حذف">
                  <span class="material-icons">delete</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
    }

    .filters-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: white;
      padding: 8px 15px;
      border-radius: 8px;
      border: 1px solid #dee2e6;
    }

    .search-box input {
      border: none;
      outline: none;
      margin-right: 10px;
      width: 250px;
    }

    .filters {
      display: flex;
      gap: 10px;
    }

    select {
      padding: 8px 15px;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      outline: none;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 15px;
      text-align: right;
      border-bottom: 1px solid #dee2e6;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
    }

    .status-badge {
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      background: #dc3545;
      color: white;
    }

    .status-badge.active {
      background: #28a745;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      border: none;
      background: none;
      padding: 5px;
      cursor: pointer;
      border-radius: 4px;
    }

    .btn-icon:hover {
      background: #f8f9fa;
    }
  `]
})
export class UsersComponent {
  users: User[] = [
    {
      id: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      role: 'مدير',
      status: 'نشط',
      joinDate: '2024-01-15',
      lastLogin: '2024-03-15 09:30'
    },
    {
      id: 2,
      name: 'سارة أحمد',
      email: 'sara@example.com',
      role: 'محرر',
      status: 'نشط',
      joinDate: '2024-02-01',
      lastLogin: '2024-03-14 14:20'
    },
    {
      id: 3,
      name: 'محمد علي',
      email: 'mohamed@example.com',
      role: 'مستخدم',
      status: 'غير نشط',
      joinDate: '2024-02-15',
      lastLogin: '2024-03-10 11:45'
    },
    // ... المزيد من المستخدمين
  ];

  searchTerm: string = '';
  roleFilter: string = '';
  statusFilter: string = '';

  get filteredUsers() {
    return this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.roleFilter || user.role === this.roleFilter;
      const matchesStatus = !this.statusFilter || user.status === this.statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }
} 