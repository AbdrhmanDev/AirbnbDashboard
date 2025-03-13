import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationService } from '../../services/notification.service';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { UserStateService } from '../../services/user-state.service';
import { BookingService } from '../../services/booking.service';
import { UserResponse } from '../../models/user';
import {
  LanguageService,
  Language,
  TranslationKeys,
} from '../../services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NotificationsComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
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

  totalRevenue = 0;
  unreadNotifications = 3;
  currentLang: Language = 'ar';
  user: UserResponse | null = null;
  showNotifications = false;
  unreadCount = 0;
  private userSubscription: Subscription | null = null;

  constructor(
    private notificationService: NotificationService,
    private languageService: LanguageService,
    private loginService: LoginService,
    private userService: UserService,
    private userStateService: UserStateService,
    private bookingService: BookingService,
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

    // Subscribe to user state changes
    this.userSubscription = this.userStateService.user$.subscribe((user) => {
      this.user = user;
      console.log('User state updated in navbar:', user);
      if (user && user._id) {
        this.loadTotalRevenue(user._id);
      }
    });

    this.loadUser();
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadTotalRevenue(userId: string) {
    // If user is a host, get their bookings
    if (this.user?.role === 'Host') {
      this.bookingService.getHostBookings(userId).subscribe({
        next: (bookings) => {
          this.totalRevenue = bookings
            .filter((booking) => booking.status === 'confirmed')
            .reduce((total, booking) => {
              return total + (booking.totalPrice || 0);
            }, 0);
          console.log(
            'Total Revenue from confirmed bookings:',
            this.totalRevenue
          );
        },
        error: (error) => {
          console.error('Error loading total revenue:', error);
        },
      });
    }
    // If user is an admin, get all bookings
    else if (this.user?.role === 'Admin') {
      this.bookingService.getBookings().subscribe({
        next: (bookings) => {
          this.totalRevenue = bookings
            .filter((booking) => booking.status === 'confirmed')
            .reduce((total, booking) => {
              return total + (booking.totalPrice || 0);
            }, 0);
          console.log(
            'Total Revenue from confirmed bookings:',
            this.totalRevenue
          );
        },
        error: (error) => {
          console.error('Error loading total revenue:', error);
        },
      });
    }
  }

  loadUser() {
    // First try to get user data from localStorage
    const userData = this.loginService.getUserData();
    if (userData) {
      this.userStateService.setUser(userData);
      console.log('User loaded from localStorage:', userData);
    }

    // Then try to get fresh data from the server
    const token = this.loginService.getToken();
    if (token) {
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.id;
        console.log('Token payload:', tokenPayload);
        console.log('User ID:', userId);

        if (userId) {
          this.userService.getUserById(userId).subscribe({
            next: (user) => {
              this.userStateService.setUser(user);
              this.loginService.saveUserData(user);
              console.log('User loaded from server:', user);
            },
            error: (error) => {
              console.error('Error loading user:', error);
              this.logout();
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
    this.loginService.logout();
    this.userStateService.clearUser();
    window.location.href = '/login';
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
    return this.user?.profileImage || 'assets/avatar.png';
  }

  navigateToProfile(): void {
    if (this.user) {
      this.router.navigate(['/profile']);
    }
  }
}
