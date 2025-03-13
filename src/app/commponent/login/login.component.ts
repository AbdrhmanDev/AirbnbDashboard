import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { UserStateService } from '../../services/user-state.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private loginServ: LoginService,
    private userStateService: UserStateService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    if (this.loginServ.getToken()) {
      this.router.navigate(['/home']);
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.loginForm.valid) {

      const { email, password } = this.loginForm.value;

      this.loginServ.login(email, password).subscribe({
        next: (res) => {
          console.log('Login response:', res);
          if (res.token) {
            this.loginServ.saveToken(res.token);
            // Save user data if available
            if (res.user) {
              localStorage.setItem('user_data', JSON.stringify(res.user));
            }
            this.router.navigate(['/home']);
          }

        },
        error: (error) => {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials.');
        },



      });
    } else {
      alert('Please enter valid email and password.');
    }
  }
}
