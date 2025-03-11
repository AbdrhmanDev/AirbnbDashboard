import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Subscriber {
  id: number;
  name: string;
  email: string;
  plan: 'مجاني' | 'أساسي' | 'احترافي' | 'أعمال';
  startDate: string;
  endDate: string;
  status: 'نشط' | 'منتهي' | 'ملغي';
  amount: number;
  autoRenew: boolean;
}

@Component({
  selector: 'app-subscribers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <!-- إحصائيات سريعة -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: #e3f2fd;">
            <span class="material-icons">people</span>
          </div>
          <div class="stat-info">
            <h3>إجمالي المشتركين</h3>
            <div class="stat-value">2,584</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #e8f5e9;">
            <span class="material-icons">verified</span>
          </div>
          <div class="stat-info">
            <h3>المشتركين النشطين</h3>
            <div class="stat-value">1,856</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fff3e0;">
            <span class="material-icons">pending</span>
          </div>
          <div class="stat-info">
            <h3>اشتراكات تنتهي قريباً</h3>
            <div class="stat-value">124</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #fce4ec;">
            <span class="material-icons">payments</span>
          </div>
          <div class="stat-info">
            <h3>إيرادات الاشتراكات</h3>
            <div class="stat-value">45,690 ريال</div>
          </div>
        </div>
      </div>

      <!-- أدوات البحث والفلترة -->
      <div class="filters-bar">
        <div class="search-box">
          <span class="material-icons">search</span>
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            placeholder="بحث عن مشترك..."
          >
        </div>
        <div class="filters">
          <select [(ngModel)]="planFilter">
            <option value="">كل الخطط</option>
            <option value="مجاني">مجاني</option>
            <option value="أساسي">أساسي</option>
            <option value="احترافي">احترافي</option>
            <option value="أعمال">أعمال</option>
          </select>
          <select [(ngModel)]="statusFilter">
            <option value="">كل الحالات</option>
            <option value="نشط">نشط</option>
            <option value="منتهي">منتهي</option>
            <option value="ملغي">ملغي</option>
          </select>
        </div>
      </div>

      <!-- جدول المشتركين -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>المشترك</th>
              <th>الخطة</th>
              <th>تاريخ البدء</th>
              <th>تاريخ الانتهاء</th>
              <th>المبلغ</th>
              <th>الحالة</th>
              <th>التجديد التلقائي</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let subscriber of filteredSubscribers">
              <td>
                <div class="subscriber-info">
                  <span class="name">{{subscriber.name}}</span>
                  <span class="email">{{subscriber.email}}</span>
                </div>
              </td>
              <td>
                <span class="plan-badge" [class]="subscriber.plan">
                  {{subscriber.plan}}
                </span>
              </td>
              <td>{{subscriber.startDate}}</td>
              <td>{{subscriber.endDate}}</td>
              <td>{{subscriber.amount}} ريال</td>
              <td>
                <span class="status-badge" [class]="subscriber.status">
                  {{subscriber.status}}
                </span>
              </td>
              <td>
                <span class="auto-renew" [class.active]="subscriber.autoRenew">
                  {{subscriber.autoRenew ? 'مفعل' : 'غير مفعل'}}
                </span>
              </td>
              <td class="actions">
                <button class="btn-icon" title="تجديد">
                  <span class="material-icons">refresh</span>
                </button>
                <button class="btn-icon" title="تعديل">
                  <span class="material-icons">edit</span>
                </button>
                <button class="btn-icon" title="إلغاء">
                  <span class="material-icons">block</span>
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #2c3e50;
      margin-top: 5px;
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

    .subscriber-info {
      display: flex;
      flex-direction: column;
    }

    .subscriber-info .name {
      font-weight: 500;
    }

    .subscriber-info .email {
      font-size: 12px;
      color: #6c757d;
    }

    .plan-badge {
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      background: #e9ecef;
    }

    .plan-badge.مجاني { background: #e9ecef; color: #495057; }
    .plan-badge.أساسي { background: #e3f2fd; color: #1976d2; }
    .plan-badge.احترافي { background: #f3e5f5; color: #7b1fa2; }
    .plan-badge.أعمال { background: #fce4ec; color: #c2185b; }

    .status-badge {
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
    }

    .status-badge.نشط { background: #e8f5e9; color: #2e7d32; }
    .status-badge.منتهي { background: #fff3e0; color: #f57c00; }
    .status-badge.ملغي { background: #ffebee; color: #c62828; }

    .auto-renew {
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
      background: #ffebee;
      color: #c62828;
    }

    .auto-renew.active {
      background: #e8f5e9;
      color: #2e7d32;
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
      transition: all 0.3s ease;
    }

    .btn-icon:hover {
      background: #f8f9fa;
    }
  `]
})
export class SubscribersComponent {
  subscribers: Subscriber[] = [
    {
      id: 1,
      name: 'محمد أحمد',
      email: 'mohammed@example.com',
      plan: 'احترافي',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'نشط',
      amount: 999,
      autoRenew: true
    },
    {
      id: 2,
      name: 'فاطمة علي',
      email: 'fatima@example.com',
      plan: 'أساسي',
      startDate: '2024-02-15',
      endDate: '2024-05-15',
      status: 'نشط',
      amount: 499,
      autoRenew: true
    },
    {
      id: 3,
      name: 'عمر خالد',
      email: 'omar@example.com',
      plan: 'أعمال',
      startDate: '2024-01-10',
      endDate: '2024-04-10',
      status: 'منتهي',
      amount: 1499,
      autoRenew: false
    },
    {
      id: 4,
      name: 'سارة محمد',
      email: 'sara@example.com',
      plan: 'مجاني',
      startDate: '2024-03-01',
      endDate: '2024-04-01',
      status: 'نشط',
      amount: 0,
      autoRenew: false
    },
    {
      id: 5,
      name: 'أحمد حسن',
      email: 'ahmed@example.com',
      plan: 'احترافي',
      startDate: '2024-02-01',
      endDate: '2024-03-01',
      status: 'ملغي',
      amount: 999,
      autoRenew: false
    }
  ];

  searchTerm: string = '';
  planFilter: string = '';
  statusFilter: string = '';

  get filteredSubscribers() {
    return this.subscribers.filter(subscriber => {
      const matchesSearch = 
        subscriber.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        subscriber.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesPlan = !this.planFilter || subscriber.plan === this.planFilter;
      const matchesStatus = !this.statusFilter || subscriber.status === this.statusFilter;
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }
} 