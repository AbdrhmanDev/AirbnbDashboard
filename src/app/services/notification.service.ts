import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: 'hotel' | 'booking' | 'system' | 'alert';
  title: string;
  message: string;
  time: Date;
  read: boolean;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([
    {
      id: 1,
      type: 'hotel',
      title: 'فندق جديد',
      message: 'تم إضافة فندق "برج العرب" إلى النظام',
      time: new Date(),
      read: false,
      icon: 'hotel'
    },
    {
      id: 2,
      type: 'booking',
      title: 'حجز جديد',
      message: 'تم حجز غرفة في فندق الريتز كارلتون',
      time: new Date(Date.now() - 3600000),
      read: false,
      icon: 'book_online'
    },
    {
      id: 3,
      type: 'system',
      title: 'تحديث النظام',
      message: 'تم تحديث النظام إلى الإصدار الجديد',
      time: new Date(Date.now() - 7200000),
      read: false,
      icon: 'system_update'
    }
  ]);

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  addNotification(notification: Omit<Notification, 'id'>) {
    const currentNotifications = this.notifications.value;
    const newNotification = {
      ...notification,
      id: currentNotifications.length + 1
    };
    this.notifications.next([newNotification, ...currentNotifications]);
  }

  markAsRead(id: number) {
    const updatedNotifications = this.notifications.value.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    this.notifications.next(updatedNotifications);
  }

  markAllAsRead() {
    const updatedNotifications = this.notifications.value.map(notification => ({
      ...notification,
      read: true
    }));
    this.notifications.next(updatedNotifications);
  }

  clearNotification(id: number) {
    const updatedNotifications = this.notifications.value.filter(
      notification => notification.id !== id
    );
    this.notifications.next(updatedNotifications);
  }
} 