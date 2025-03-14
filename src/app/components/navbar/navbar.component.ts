import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationService } from '../../services/notification.service';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { UserStateService } from '../../services/user-state.service';
import { BookingService } from '../../services/booking.service';
import { UserResponse } from '../../models/user';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NotificationsComponent, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('notificationsContainer') notificationsContainer!: ElementRef;

  notifications = [
    {
      id: 1,
      icon: 'payment',
      message: 'Payment completed successfully',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: 2,
      icon: 'shopping_cart',
      message: 'Your order #12345 has been confirmed',
      time: '1 hour ago',
      unread: false,
    },
    {
      id: 3,
      icon: 'local_offer',
      message: 'New offer available',
      time: '3 hours ago',
      unread: false,
    },
  ];

  totalRevenue = 0;
  unreadNotifications = 3;
  user: UserResponse | null = null;
  showNotifications = false;
  unreadCount = 0;
  private userSubscription: Subscription | null = null;

  // UI state properties
  isUserMenuOpen = false;
  searchQuery = '';

  constructor(
    private notificationService: NotificationService,
    private loginService: LoginService,
    private userService: UserService,
    private userStateService: UserStateService,
    private bookingService: BookingService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    // Load initial user state
    this.user = this.userStateService.getUser();
    if (this.user?._id) {
      this.loadTotalRevenue(this.user._id);
    }

    // Subscribe to user state changes
    this.userSubscription = this.userStateService.user$.subscribe((user) => {
      this.user = user;
      console.log('User state updated in navbar:', user);
      if (user?._id) {
        this.loadTotalRevenue(user._id);
      }
    });

    // Load notifications
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.unreadCount = notifications.filter((n) => !n.read).length;
    });

    // Try to load fresh user data if we have a token
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showNotifications) {
      const notificationsElement = this.notificationsContainer?.nativeElement;
      if (
        notificationsElement &&
        !notificationsElement.contains(event.target)
      ) {
        this.showNotifications = false;
      }
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.showNotifications) {
      this.showNotifications = false;
    }
  }

  toggleNotifications(event: Event) {
    event.stopPropagation(); // Prevent the click from immediately closing the dropdown
    this.showNotifications = !this.showNotifications;
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
    this.unreadCount = 0;
  }

  logout() {
    this.loginService.logout();
    this.userStateService.clearUser();
    this.router.navigate(['/login']);
  }

  // Computed properties for user information
  get userName(): string {
    return this.user ? `${this.user.firstName} ${this.user.lastName}` : 'Guest';
  }

  get userRole(): string {
    if (!this.user) return 'Guest';
    return this.user.role;
  }

  get userAvatar(): string {
    return this.user?.profileImage || 'assets/images/default-avatar.png';
  }

  navigateToProfile(): void {
    if (this.user) {
      this.router.navigate(['/profile']);
    }
  }

  // UI interaction methods
  toggleSidebar(): void {
    // Implement sidebar toggle logic
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onSearch(): void {
    // Implement search logic
    console.log('Searching for:', this.searchQuery);
  }
}
