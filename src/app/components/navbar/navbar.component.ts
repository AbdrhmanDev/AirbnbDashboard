import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationService } from '../../services/notification.service';
import { LanguageService, Language, TranslationKeys } from '../../services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  styleUrls: ['./navbar.component.css'],
  template: `
    <nav class="navbar">
      <div class="container-fluid">
        <!-- Logo and brand -->
        <div class="navbar-brand">
          <img src="assets/logo.png" alt="Logo">
        </div>

        <!-- Navbar items -->
        <div class="navbar-items">
          <!-- Language Switcher -->
          <div class="language-switcher">
            <button class="btn-icon" (click)="toggleLanguage()">
              <span class="material-icons">language</span>
              <span class="lang-text">{{currentLang === 'ar' ? 'English' : 'العربية'}}</span>
            </button>
          </div>

          <!-- Notifications -->
          <div class="notifications-wrapper">
            <button class="btn-icon" (click)="toggleNotifications()">
              <span class="material-icons">notifications</span>
              <span *ngIf="unreadCount > 0" class="notification-badge">
                {{unreadCount}}
              </span>
            </button>
            <div class="notifications-panel" *ngIf="showNotifications">
              <app-notifications></app-notifications>
            </div>
          </div>

          <!-- Balance -->
          <div class="balance-wrapper">
            <span class="material-icons">account_balance_wallet</span>
            <div class="balance-info">
              <span class="balance-label">{{translate('balance')}}</span>
              <span class="balance-amount">{{balance}} {{currentLang === 'ar' ? 'ريال' : 'SAR'}}</span>
            </div>
          </div>

          <!-- User Profile -->
          <div class="user-profile">
            <img src="assets/avatar.png" alt="User Avatar" class="avatar">
            <div class="user-info">
              <span class="user-name">{{userName}}</span>
              <span class="user-role">{{translate(userRole)}}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  notifications = [
    {
      id: 1,
      icon: 'payment',
      message: 'تم إتمام عملية الدفع بنجاح',
      time: 'منذ 5 دقائق',
      unread: true
    },
    {
      id: 2,
      icon: 'shopping_cart',
      message: 'تم تأكيد طلبك #12345',
      time: 'منذ ساعة',
      unread: false
    },
    {
      id: 3,
      icon: 'local_offer',
      message: 'عرض جديد متاح',
      time: 'منذ 3 ساعات',
      unread: false
    }
  ];

  balance = 2450.00;
  unreadNotifications = 3;
  currentLang: Language = 'ar';
  userName = 'أحمد محمد';
  userRole: keyof TranslationKeys = 'manager';

  showNotifications = false;
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.languageService.getCurrentLang().subscribe(lang => {
      this.currentLang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });
    this.notificationService.getNotifications().subscribe(notifications => {
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.languageService.setLanguage(newLang);
  }

  translate(key: keyof TranslationKeys): string {
    return this.languageService.translate(key);
  }
} 