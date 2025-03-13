import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserResponse } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private userSubject = new BehaviorSubject<UserResponse | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: UserResponse | null) {
    this.userSubject.next(user);
  }

  getUser(): UserResponse | null {
    return this.userSubject.value;
  }

  clearUser() {
    this.userSubject.next(null);
  }
}
