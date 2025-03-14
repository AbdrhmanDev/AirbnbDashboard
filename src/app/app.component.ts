import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AsideComponent } from './components/aside/aside.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    AsideComponent,
    DashboardComponent,
  ],
})
export class AppComponent {
  title = 'your-app-name';
  constructor(private router: Router) {}

  get showLayout(): boolean {
    return this.router.url !== '/login'; // Hide navbar & sidebar on login page
  }
}
