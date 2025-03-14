import { Routes } from '@angular/router';
import { HotelsComponent } from './components/hotels/hotels.component';
import { LoginComponent } from './commponent/login/login.component';
import { HotelDetialsComponent } from './components/hotels/hotel-detials/hotel-detials.component';
import { CreateHotelComponent } from './components/hotels/create-hotel/create-hotel.component';
import { UpdateHotelComponent } from './components/hotels/update-hotel/update-hotel.component';
import { UserCreateComponent } from './pages/users/user-create/user-create.component';
import { BookingDetailsComponent } from './pages/bookings/booking-details/booking-details.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
    
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-hotel',
    component: CreateHotelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'hotels/edit/:id',
    component: UpdateHotelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./pages/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'bookings',
    loadComponent: () =>
      import('./pages/bookings/bookings.component').then(
        (m) => m.BookingsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'bookings/details/:id',
    component: BookingDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./pages/payments/payments.component').then(
        (m) => m.PaymentsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    component: HotelsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then((m) => m.UsersComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'create-users',
    component: UserCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users/edit/:id',
    loadComponent: () =>
      import('./pages/users/user-edit/user-edit.component').then(
        (m) => m.UserEditComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./pages/users/user-details/user-details.component').then(
        (m) => m.UserDetailsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'subscribers',
    loadComponent: () =>
      import('./pages/subscribers/subscribers.component').then(
        (m) => m.SubscribersComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'hotels',
    component: HotelsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'hotels/:id',
    component: HotelDetialsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'My Profile',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
