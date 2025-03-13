import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoginService } from '../../services/login.service';
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
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.loginServ.login(email, password).subscribe({
        next: (res) => {
          console.log('response', res);
          this.loginServ.saveToken(res.token);
          console.log(res.token);
          if (this.loginForm.get('rememberMe')?.value) {
            localStorage.setItem('rememberMe', 'true');
          }
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error:', error);
          alert('Login failed. Please check your credentials.');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      alert('Please enter valid email and password.');
    }
  }
}
