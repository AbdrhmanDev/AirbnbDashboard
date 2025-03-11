import { Component } from '@angular/core';
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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loginServ: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      // role: ['host'], // Default role
    });
  }
  login(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loginServ.login(email, password).subscribe({
        next: (res) => {
          this.loginServ.saveToken(res.token);
          console.log(res.token);
          this.router.navigate(['/home']); // ✅ Redirect to home

          // alert('Login successful!');
          // Redirect logic here
        },
        error: () => {
          alert('Login failed. Please check your credentials.');
        },
      });
    } else {
      alert('Please enter valid email and password.');
    }
  }
}
