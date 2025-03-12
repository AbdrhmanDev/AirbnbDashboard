export interface UserAddress {
  country: string;
  city: string;
}

export interface HostDetails {
  isSuperHost: boolean;
  reviews: any[]; // You can create a specific Review interface if needed
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string;
  dateOfBirth: string;
  gender: string;
  role: string;
  address: UserAddress;
  hostDetails: HostDetails;
  bookings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id?: string;
  userId: string | User; // Can be either the ID or the populated user object
  hostId: string | User; // Can be either the ID or the populated user object
  propertyId: string;
  companions: number;
  petsAllowed: boolean;
  startDate: Date | string;
  endDate: Date | string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateBookingDTO {
  userId: string;
  hostId: string;
  propertyId: string;
  companions: number;
  petsAllowed: boolean;
  startDate: string;
  endDate: string;
  totalPrice: number;
}

export interface UpdateBookingDTO {
  companions?: number;
  petsAllowed?: boolean;
  startDate?: string;
  endDate?: string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  totalPrice?: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
