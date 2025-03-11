import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';

type NotificationType = 'hotel' | 'booking' | 'system' | 'alert';

interface ColorMap {
  hotel: string;
  booking: string;
  system: string;
  alert: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-dropdown">
      <div class="notifications-header">
        <h3>الإشعارات</h3>
        <button class="btn-clear" (click)="markAllAsRead()">
          تحديد الكل كمقروء
        </button>
      </div>

      <div class="notifications-list">
        <div *ngFor="let notification of notifications" 
             class="notification-item"
             [class.unread]="!notification.read"
             (click)="markAsRead(notification.id)">
          <div class="notification-icon">
            <span class="material-icons" [ngStyle]="getIconStyle(notification.type)">
              {{notification.icon}}
            </span>
          </div>
          <div class="notification-content">
            <div class="notification-title">{{notification.title}}</div>
            <div class="notification-message">{{notification.message}}</div>
            <div class="notification-time">{{notification.time | date:'shortTime'}}</div>
          </div>
          <button class="btn-delete" (click)="clearNotification(notification.id, $event)">
            <span class="material-icons">close</span>
          </button>
        </div>

        <div *ngIf="notifications.length === 0" class="no-notifications">
          لا توجد إشعارات جديدة
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-dropdown {
      width: 320px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .notifications-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #eee;
    }

    .notifications-header h3 {
      margin: 0;
      font-size: 16px;
      color: #2c3e50;
    }

    .btn-clear {
      border: none;
      background: none;
      color: #1976d2;
      cursor: pointer;
      font-size: 13px;
    }

    .notifications-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .notification-item {
      display: flex;
      align-items: start;
      padding: 15px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      transition: background 0.3s ease;
      position: relative;
    }

    .notification-item:hover {
      background: #f8f9fa;
    }

    .notification-item.unread {
      background: #e3f2fd;
    }

    .notification-item.unread:hover {
      background: #bbdefb;
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: 500;
      margin-bottom: 5px;
      color: #2c3e50;
    }

    .notification-message {
      font-size: 13px;
      color: #666;
      margin-bottom: 5px;
    }

    .notification-time {
      font-size: 12px;
      color: #999;
    }

    .btn-delete {
      border: none;
      background: none;
      padding: 5px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .notification-item:hover .btn-delete {
      opacity: 1;
    }

    .no-notifications {
      padding: 20px;
      text-align: center;
      color: #666;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  private colors: ColorMap = {
    hotel: '#1976d2',
    booking: '#2e7d32',
    system: '#ed6c02',
    alert: '#c62828'
  };

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  getIconStyle(type: NotificationType) {
    return {
      color: this.colors[type] || '#666'
    };
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  clearNotification(id: number, event: Event) {
    event.stopPropagation();
    this.notificationService.clearNotification(id);
  }
} 