import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BookingsComponent } from '../bookings/bookings.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidebarComponent,
    BookingsComponent
  ],
  template: `
    <div class="dashboard-container">
      <app-navbar></app-navbar>
      <div class="content-wrapper">
        <app-sidebar></app-sidebar>
        <main>
          <router-outlet></router-outlet>
        </main>
        <aside class="bookings-aside">
          <app-bookings></app-bookings>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .content-wrapper {
      display: flex;
      flex: 1;
      overflow: hidden;
      direction: rtl;
    }

    main {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      direction: rtl;
    }

    .bookings-aside {
      width: 350px;
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      padding: 16px;
      direction: rtl;
    }

    app-sidebar {
      direction: rtl;
    }

    @media (max-width: 1200px) {
      .bookings-aside {
        width: 300px;
      }
    }

    @media (max-width: 992px) {
      .bookings-aside {
        display: none;
      }
    }
  `]
})
export class DashboardComponent {
  // إحصائيات نموذجية
  stats = [
    { title: 'المبيعات اليومية', value: '2,450', icon: 'trending_up', change: '+15%' },
    { title: 'الزيارات', value: '15,300', icon: 'people', change: '+5%' },
    { title: 'الطلبات', value: '450', icon: 'shopping_cart', change: '+20%' },
    { title: 'الإيرادات', value: '$15,000', icon: 'attach_money', change: '+10%' }
  ];

  // بيانات الجدول النموذجية
  recentOrders = [
    { id: '#1234', customer: 'أحمد محمد', date: '2024-03-20', status: 'completed', statusText: 'مكتمل', amount: '$150' },
    { id: '#1235', customer: 'سارة أحمد', date: '2024-03-19', status: 'pending', statusText: 'معلق', amount: '$280' },
    { id: '#1236', customer: 'محمد علي', date: '2024-03-19', status: 'processing', statusText: 'قيد المعالجة', amount: '$95' }
  ];

  getStatusClass(status: string): string {
    return `status ${status}`;
  }
} 