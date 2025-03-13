import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationService } from '../../services/notification.service';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user';
import {
  LanguageService,
  Language,
  TranslationKeys,
} from '../../services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NotificationsComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  notifications = [
    {
      id: 1,
      icon: 'payment',
      message: 'تم إتمام عملية الدفع بنجاح',
      time: 'منذ 5 دقائق',
      unread: true,
    },
    {
      id: 2,
      icon: 'shopping_cart',
      message: 'تم تأكيد طلبك #12345',
      time: 'منذ ساعة',
      unread: false,
    },
    {
      id: 3,
      icon: 'local_offer',
      message: 'عرض جديد متاح',
      time: 'منذ 3 ساعات',
      unread: false,
    },
  ];

  balance = 2450.0;
  unreadNotifications = 3;
  currentLang: Language = 'ar';
  user: UserResponse | null = null;
  showNotifications = false;
  unreadCount = 0;

  constructor(
    private notificationService: NotificationService,
    private languageService: LanguageService,
    private loginService: LoginService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.languageService.getCurrentLang().subscribe((lang) => {
      this.currentLang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.unreadCount = notifications.filter((n) => !n.read).length;
    });
    this.loadUser();
  }

  loadUser() {
    // First try to get user data from localStorage
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        console.log('User loaded from localStorage:', this.user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user_data');
      }
    }

    // Then try to get fresh data from the server
    const token = this.loginService.getToken();
    if (token) {
      try {
        // Extract user ID from token payload
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.id;
        console.log('Token payload:', tokenPayload);
        console.log('User ID:', userId);

        if (userId) {
          this.userService.getUserById(userId).subscribe({
            next: (user) => {
              this.user = user;
              console.log('User loaded from server:', user);
              // Update localStorage with fresh data
              localStorage.setItem('user_data', JSON.stringify(user));
            },
            error: (error) => {
              console.error('Error loading user:', error);
              this.logout(); // Logout if there's an error loading user data
            },
          });
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        this.logout();
      }
    }
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

  markAllAsRead() {
    this.notificationService.markAllAsRead();
    this.unreadCount = 0;
  }

  logout() {
    localStorage.removeItem('user_data');
    localStorage.removeItem('access_token');
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  // Computed properties for user information
  get userName(): string {
    return this.user ? `${this.user.firstName} ${this.user.lastName}` : '';
  }

  get userRole(): keyof TranslationKeys {
    if (!this.user) return 'user';
    const roleMap: Record<string, keyof TranslationKeys> = {
      Admin: 'admin',
      Host: 'manager',
      Guest: 'user',
    };
    return roleMap[this.user.role] || 'user';
  }

  get userAvatar(): string {
    console.log(this.user?.profileImage);
    return this.user?.profileImage || 'assets/avatar.png';
  }
}
