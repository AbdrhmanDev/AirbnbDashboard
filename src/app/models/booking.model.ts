export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  guestEmail: string;
  guestPhone: string;
  createdAt: Date;
  roomCount: number;
} 