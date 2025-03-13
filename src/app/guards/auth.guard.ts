import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(): boolean {
    const token = this.loginService.getToken();

    if (token) {
      return true;
    }
    alert('pls login');
    // Redirect to login page if not authenticated
    this.router.navigate(['/login']);
    return false;
  }
}
