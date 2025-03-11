export interface HostDetails {
  isSuperHost: boolean;
  reviews: any[]; // You can create a Review interface if needed
}

export interface Host {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  profileImage: string;
  role: string;
  address: {
    country: string;
    city: string;
  };
  bookings: any[]; // You can create a Booking interface if needed
  hostDetails: HostDetails;
  createdAt: string;
  updatedAt: string;
}
