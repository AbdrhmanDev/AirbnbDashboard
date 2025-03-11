import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'ar' | 'en';

// تصدير النوع ليمكن استخدامه في المكونات الأخرى
export interface TranslationKeys {
  // القائمة الجانبية
  home: string;
  analytics: string;
  products: string;
  users: string;
  subscribers: string;
  payments: string;
  settings: string;

  // الناف بار
  balance: string;
  notifications: string;
  markAllAsRead: string;
  noNotifications: string;
  profile: string;
  logout: string;

  // الإحصائيات
  totalHotels: string;
  monthlyBookings: string;
  activeSubscribers: string;
  totalRevenue: string;
  increase: string;
  decrease: string;
  lastMonth: string;

  // المنتجات والفنادق
  hotels: string;
  addHotel: string;
  manageHotels: string;
  allCategories: string;
  available: string;
  unavailable: string;
  price: string;
  status: string;
  actions: string;
  location: string;
  rating: string;
  reviews: string;
  bookNow: string;
  viewDetails: string;
  perNight: string;
  roomsAvailable: string;

  // المستخدمين
  newUsers: string;
  activeUsers: string;
  totalUsers: string;
  userStatus: string;
  lastActive: string;
  joinDate: string;
  userRole: string;
  email: string;
  phone: string;
  edit: string;
  delete: string;
  block: string;
  unblock: string;

  // المشتركين
  subscriptionPlan: string;
  subscriptionStatus: string;
  startDate: string;
  endDate: string;
  autoRenew: string;
  cancelSubscription: string;
  upgradeSubscription: string;
  subscriptionHistory: string;
  
  // أدوار المستخدمين
  admin: string;
  manager: string;
  user: string;

  // رسائل النظام
  success: string;
  error: string;
  warning: string;
  info: string;
  loading: string;
  confirmDelete: string;
  cancel: string;
  save: string;
  update: string;
  confirm: string;

  // إضافة فندق
  basicInfo: string;
  hotelName: string;
  category: string;
  luxury: string;
  business: string;
  resort: string;
  boutique: string;
  stars: string;
  roomsInfo: string;
  totalRooms: string;
  bathrooms: string;
  pricePerNight: string;
  hotelDescription: string;
  images: string;
  dragDropImages: string;
  next: string;
  back: string;
  submit: string;

  // صفحة المنتجات
  all: string;
  manageYourHotels: string;
  searchProducts: string;
  description: string;
  editHotel: string;
  deleteHotel: string;
  confirmDeleteHotel: string;
  hotelDeleted: string;
  hotelUpdated: string;
  hotelAdded: string;

  // رسائل التحقق
  fieldRequired: string;
  minLength: string;
  minValue: string;
}

interface Translations {
  ar: TranslationKeys;
  en: TranslationKeys;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLang = new BehaviorSubject<Language>('ar');

  private translations: Translations = {
    ar: {
      // القائمة الجانبية
      home: 'الرئيسية',
      analytics: 'التحليلات',
      products: 'المنتجات',
      users: 'المستخدمين',
      subscribers: 'المشتركين',
      payments: 'المدفوعات',
      settings: 'الإعدادات',

      // الناف بار
      balance: 'الرصيد',
      notifications: 'الإشعارات',
      markAllAsRead: 'تحديد الكل كمقروء',
      noNotifications: 'لا توجد إشعارات جديدة',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',

      // الإحصائيات
      totalHotels: 'إجمالي الفنادق',
      monthlyBookings: 'الحجوزات الشهرية',
      activeSubscribers: 'المشتركين النشطين',
      totalRevenue: 'إجمالي الإيرادات',
      increase: 'زيادة',
      decrease: 'انخفاض',
      lastMonth: 'الشهر الماضي',

      // المنتجات والفنادق
      hotels: 'الفنادق',
      addHotel: 'إضافة فندق',
      manageHotels: 'إدارة الفنادق',
      allCategories: 'كل الفئات',
      available: 'متاح',
      unavailable: 'غير متاح',
      price: 'السعر',
      status: 'الحالة',
      actions: 'الإجراءات',
      location: 'الموقع',
      rating: 'التقييم',
      reviews: 'التقييمات',
      bookNow: 'احجز الآن',
      viewDetails: 'عرض التفاصيل',
      perNight: 'لليلة',
      roomsAvailable: 'الغرف المتاحة',

      // المستخدمين
      newUsers: 'المستخدمين الجدد',
      activeUsers: 'المستخدمين النشطين',
      totalUsers: 'إجمالي المستخدمين',
      userStatus: 'حالة المستخدم',
      lastActive: 'آخر نشاط',
      joinDate: 'تاريخ الانضمام',
      userRole: 'دور المستخدم',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      edit: 'تعديل',
      delete: 'حذف',
      block: 'حظر',
      unblock: 'إلغاء الحظر',

      // المشتركين
      subscriptionPlan: 'خطة الاشتراك',
      subscriptionStatus: 'حالة الاشتراك',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ الانتهاء',
      autoRenew: 'تجديد تلقائي',
      cancelSubscription: 'إلغاء الاشتراك',
      upgradeSubscription: 'ترقية الاشتراك',
      subscriptionHistory: 'سجل الاشتراكات',

      // أدوار المستخدمين
      admin: 'مدير النظام',
      manager: 'مدير',
      user: 'مستخدم',

      // رسائل النظام
      success: 'تم بنجاح',
      error: 'حدث خطأ',
      warning: 'تنبيه',
      info: 'معلومات',
      loading: 'جاري التحميل',
      confirmDelete: 'هل أنت متأكد من الحذف؟',
      cancel: 'إلغاء',
      save: 'حفظ',
      update: 'تحديث',
      confirm: 'تأكيد',

      // إضافة فندق
      basicInfo: 'المعلومات الأساسية',
      hotelName: 'اسم الفندق',
      category: 'الفئة',
      luxury: 'فاخر',
      business: 'أعمال',
      resort: 'منتجع',
      boutique: 'بوتيك',
      stars: 'نجوم',
      roomsInfo: 'معلومات الغرف',
      totalRooms: 'عدد الغرف',
      bathrooms: 'عدد الحمامات',
      pricePerNight: 'السعر لليلة',
      hotelDescription: 'وصف الفندق',
      images: 'الصور',
      dragDropImages: 'اسحب وأفلت الصور هنا أو انقر للاختيار',
      next: 'التالي',
      back: 'السابق',
      submit: 'إرسال',

      // صفحة المنتجات
      all: 'الكل',
      manageYourHotels: 'إدارة الفنادق',
      searchProducts: 'البحث عن المنتجات',
      description: 'الوصف',
      editHotel: 'تعديل الفندق',
      deleteHotel: 'حذف الفندق',
      confirmDeleteHotel: 'هل أنت متأكد من حذف هذا الفندق؟',
      hotelDeleted: 'تم حذف الفندق بنجاح',
      hotelUpdated: 'تم تحديث الفندق بنجاح',
      hotelAdded: 'تم إضافة الفندق بنجاح',

      // رسائل التحقق
      fieldRequired: 'هذا الحقل مطلوب',
      minLength: 'النص قصير جداً',
      minValue: 'القيمة صغيرة جداً'
    },
    en: {
      // Sidebar
      home: 'Home',
      analytics: 'Analytics',
      products: 'Products',
      users: 'Users',
      subscribers: 'Subscribers',
      payments: 'Payments',
      settings: 'Settings',

      // Navbar
      balance: 'Balance',
      notifications: 'Notifications',
      markAllAsRead: 'Mark all as read',
      noNotifications: 'No new notifications',
      profile: 'Profile',
      logout: 'Logout',

      // Statistics
      totalHotels: 'Total Hotels',
      monthlyBookings: 'Monthly Bookings',
      activeSubscribers: 'Active Subscribers',
      totalRevenue: 'Total Revenue',
      increase: 'Increase',
      decrease: 'Decrease',
      lastMonth: 'Last Month',

      // Products & Hotels
      hotels: 'Hotels',
      addHotel: 'Add Hotel',
      manageHotels: 'Manage Hotels',
      allCategories: 'All Categories',
      available: 'Available',
      unavailable: 'Unavailable',
      price: 'Price',
      status: 'Status',
      actions: 'Actions',
      location: 'Location',
      rating: 'Rating',
      reviews: 'Reviews',
      bookNow: 'Book Now',
      viewDetails: 'View Details',
      perNight: 'per night',
      roomsAvailable: 'Rooms Available',

      // Users
      newUsers: 'New Users',
      activeUsers: 'Active Users',
      totalUsers: 'Total Users',
      userStatus: 'User Status',
      lastActive: 'Last Active',
      joinDate: 'Join Date',
      userRole: 'User Role',
      email: 'Email',
      phone: 'Phone',
      edit: 'Edit',
      delete: 'Delete',
      block: 'Block',
      unblock: 'Unblock',

      // Subscribers
      subscriptionPlan: 'Subscription Plan',
      subscriptionStatus: 'Subscription Status',
      startDate: 'Start Date',
      endDate: 'End Date',
      autoRenew: 'Auto Renew',
      cancelSubscription: 'Cancel Subscription',
      upgradeSubscription: 'Upgrade Subscription',
      subscriptionHistory: 'Subscription History',

      // User Roles
      admin: 'Admin',
      manager: 'Manager',
      user: 'User',

      // System Messages
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      info: 'Info',
      loading: 'Loading',
      confirmDelete: 'Are you sure you want to delete?',
      cancel: 'Cancel',
      save: 'Save',
      update: 'Update',
      confirm: 'Confirm',

      // إضافة فندق
      basicInfo: 'Basic Information',
      hotelName: 'Hotel Name',
      category: 'Category',
      luxury: 'Luxury',
      business: 'Business',
      resort: 'Resort',
      boutique: 'Boutique',
      stars: 'stars',
      roomsInfo: 'Rooms Information',
      totalRooms: 'Total Rooms',
      bathrooms: 'Bathrooms',
      pricePerNight: 'Price per Night',
      hotelDescription: 'Hotel Description',
      images: 'Images',
      dragDropImages: 'Drag and drop images here or click to select',
      next: 'Next',
      back: 'Back',
      submit: 'Submit',

      // Products Page
      all: 'All',
      manageYourHotels: 'Manage Hotels',
      searchProducts: 'Search Products',
      description: 'Description',
      editHotel: 'Edit Hotel',
      deleteHotel: 'Delete Hotel',
      confirmDeleteHotel: 'Are you sure you want to delete this hotel?',
      hotelDeleted: 'Hotel deleted successfully',
      hotelUpdated: 'Hotel updated successfully',
      hotelAdded: 'Hotel added successfully',

      // Validation Messages
      fieldRequired: 'This field is required',
      minLength: 'Text is too short',
      minValue: 'Value is too small'
    }
  };

  constructor() {
    // تحقق من اللغة المحفوظة
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      this.currentLang.next(savedLang);
      this.setDirection(savedLang);
    }
  }

  getCurrentLang() {
    return this.currentLang.asObservable();
  }

  setLanguage(lang: Language) {
    localStorage.setItem('language', lang);
    this.currentLang.next(lang);
    this.setDirection(lang);
  }

  private setDirection(lang: Language) {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }

  translate(key: keyof TranslationKeys): string {
    const lang = this.currentLang.value;
    return this.translations[lang][key] || key;
  }
} 