import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-container">
      <!-- بطاقات الإحصائيات -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">people</span>
          </div>
          <div class="stat-details">
            <h3>إجمالي المستضيفين</h3>
            <div class="stat-value">2,450</div>
            <div class="stat-change">
              <span class="material-icons">trending_up</span>
              15% زيادة
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">shopping_cart</span>
          </div>
          <div class="stat-details">
            <h3>إجمالي المشتريات</h3>
            <div class="stat-value">1,280</div>
            <div class="stat-change">
              <span class="material-icons">trending_up</span>
              23% زيادة
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">attach_money</span>
          </div>
          <div class="stat-details">
            <h3>إجمالي الإيرادات</h3>
            <div class="stat-value">45,260 ريال</div>
            <div class="stat-change">
              <span class="material-icons">trending_up</span>
              18% زيادة
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">group_add</span>
          </div>
          <div class="stat-details">
            <h3>مستخدمين جدد</h3>
            <div class="stat-value">384</div>
            <div class="stat-change">
              <span class="material-icons">trending_up</span>
              12% زيادة
            </div>
          </div>
        </div>
      </div>

      <!-- جداول التحليلات -->
      <div class="analytics-tables">
        <div class="table-card">
          <h3>أحدث المبيعات</h3>
          <table>
            <thead>
              <tr>
                <th>المنتج</th>
                <th>السعر</th>
                <th>التاريخ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let sale of latestSales">
                <td>{{sale.product}}</td>
                <td>{{sale.price}} ريال</td>
                <td>{{sale.date}}</td>
                <td><span [class]="'status ' + sale.status">{{sale.status}}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-card">
          <h3>أفضل المنتجات مبيعاً</h3>
          <table>
            <thead>
              <tr>
                <th>المنتج</th>
                <th>المبيعات</th>
                <th>الإيرادات</th>
                <th>التقييم</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of topProducts">
                <td>{{product.name}}</td>
                <td>{{product.sales}}</td>
                <td>{{product.revenue}} ريال</td>
                <td>{{product.rating}}/5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e3f2fd;
    }

    .stat-icon .material-icons {
      font-size: 24px;
      color: #1976d2;
    }

    .stat-details h3 {
      margin: 0;
      font-size: 14px;
      color: #666;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 600;
      color: #2c3e50;
      margin: 5px 0;
    }

    .stat-change {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #388e3c;
      font-size: 14px;
    }

    .analytics-tables {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 20px;
    }

    .table-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .table-card h3 {
      margin: 0 0 20px 0;
      color: #2c3e50;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 12px;
      text-align: right;
      border-bottom: 1px solid #eee;
    }

    th {
      font-weight: 600;
      color: #666;
    }

    .status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
    }

    .status.completed {
      background: #e8f5e9;
      color: #388e3c;
    }

    .status.pending {
      background: #fff3e0;
      color: #f57c00;
    }

    @media (max-width: 768px) {
      .analytics-tables {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  latestSales = [
    { product: 'لابتوب HP', price: 3999, date: '2024-03-15', status: 'completed' },
    { product: 'آيفون 13', price: 4299, date: '2024-03-14', status: 'completed' },
    { product: 'سماعات سوني', price: 599, date: '2024-03-14', status: 'pending' },
    { product: 'شاشة سامسونج', price: 2199, date: '2024-03-13', status: 'completed' },
    { product: 'ماوس لوجيتك', price: 199, date: '2024-03-13', status: 'pending' }
  ];

  topProducts = [
    { name: 'آيفون 13', sales: 145, revenue: 623355, rating: 4.8 },
    { name: 'لابتوب HP', sales: 98, revenue: 391902, rating: 4.6 },
    { name: 'سماعات سوني', sales: 245, revenue: 146755, rating: 4.7 },
    { name: 'شاشة سامسونج', sales: 156, revenue: 342744, rating: 4.5 },
    { name: 'ماوس لوجيتك', sales: 387, revenue: 77213, rating: 4.9 }
  ];

  constructor() {}

  ngOnInit() {}
} 