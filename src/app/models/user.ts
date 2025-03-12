export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  profileImage?: string;
  dateOfBirth: Date;
  gender?: 'Male' | 'Female';
  address: {
    country: string;
    city: string;
  };
  role: 'Guest' | 'Host' | 'Admin';
  status: 'active' | 'inactive';
  hostDetails?: {
    isSuperHost: boolean;
    reviews: string[]; // Review IDs
  };
  bookings?: string[]; // Booking IDs
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponse extends Omit<User, 'password'> {
  token?: string;
}

export interface CreateUserDTO
  extends Omit<User, '_id' | 'createdAt' | 'updatedAt'> {}

export interface UpdateUserDTO
  extends Partial<Omit<User, '_id' | 'createdAt' | 'updatedAt'>> {}
