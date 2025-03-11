import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>المدفوعات</h1>
      <!-- محتوى الصفحة -->
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
    h1 {
      margin-bottom: 20px;
      color: #2c3e50;
    }
  `]
})
export class PaymentsComponent {} 