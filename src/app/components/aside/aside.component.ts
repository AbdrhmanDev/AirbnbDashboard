import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AsideComponent {
  currentRoute: string = 'home';

  constructor(private router: Router) {
    // تحديث القائمة النشطة عند تغيير المسار
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url.split('/')[1] || 'home';
    });
  }

  navigate(route: string) {
    this.currentRoute = route;
    this.router.navigate([route]);
  }
} 