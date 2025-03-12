import { Routes } from '@angular/router';

import { HotelsComponent } from './components/hotels/hotels.component';
import { LoginComponent } from './commponent/login/login.component';
import { HotelDetialsComponent } from './components/hotels/hotel-detials/hotel-detials.component';
import { CreateHotelComponent } from './components/hotels/create-hotel/create-hotel.component';
import { UpdateHotelComponent } from './components/hotels/update-hotel/update-hotel.component';
import { UserCreateComponent } from './pages/users/user-create/user-create.component';

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
  },
  {
    path: 'add-hotel',
    component: CreateHotelComponent,
  },
  {
    path: 'hotels/:id',
    component: UpdateHotelComponent,
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./pages/analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      ),
  },
  {
    path: 'products',
    component: HotelsComponent,
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'create-users',
    component: UserCreateComponent,
  },
  {
    path: 'users/edit/:id',
    loadComponent: () =>
      import('./pages/users/user-edit/user-edit.component').then(
        (m) => m.UserEditComponent
      ),
  },
  {
    path: 'users/:id',
    loadComponent: () =>
      import('./pages/users/user-details/user-details.component').then(
        (m) => m.UserDetailsComponent
      ),
  },
  {
    path: 'subscribers',
    loadComponent: () =>
      import('./pages/subscribers/subscribers.component').then(
        (m) => m.SubscribersComponent
      ),
  },
  {
    path: 'payments',
    loadComponent: () =>
      import('./pages/payments/payments.component').then(
        (m) => m.PaymentsComponent
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings/settings.component').then(
        (m) => m.SettingsComponent
      ),
  },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'hotels',
    component: HotelsComponent,
  },
  {
    path: 'hotels/:id',
    component: HotelDetialsComponent,
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
