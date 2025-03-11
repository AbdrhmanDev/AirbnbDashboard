import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService, TranslationKeys } from '../../services/language.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <div class="sidebar">
      <mat-nav-list>
        <a mat-list-item routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <mat-icon>dashboard</mat-icon>
          <span>{{translate('home')}}</span>
        </a>
        
        <a mat-list-item routerLink="/add-hotel" routerLinkActive="active">
          <mat-icon>add_business</mat-icon>
          <span>{{translate('addHotel')}}</span>
        </a>

        <a mat-list-item routerLink="/bookings" routerLinkActive="active">
          <mat-icon>book_online</mat-icon>
          <span>الحجوزات</span>
        </a>

        <!-- ... باقي عناصر القائمة ... -->
      </mat-nav-list>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100%;
      background: white;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }

    mat-nav-list {
      padding-top: 16px;
    }

    mat-list-item {
      height: 48px;
      margin: 8px 0;
    }

    .active {
      background: #e3f2fd;
      color: #1976d2;
    }

    mat-icon {
      margin-right: 16px;
    }

    [dir="rtl"] mat-icon {
      margin-right: 0;
      margin-left: 16px;
    }
  `]
})
export class SidebarComponent {
  constructor(private languageService: LanguageService) {}

  translate(key: keyof TranslationKeys): string {
    return this.languageService.translate(key);
  }
} 