import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get users', () => {
    const mockUsers = [
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'Guest',
      },
    ];

    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should create a user', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'Guest',
      dateOfBirth: new Date(),
      address: {
        country: 'USA',
        city: 'New York',
      },
    };

    service.createUser(mockUser).subscribe((user) => {
      expect(user).toBeTruthy();
      expect(user.firstName).toBe(mockUser.firstName);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    req.flush({ ...mockUser, _id: '1' });
  });
});
