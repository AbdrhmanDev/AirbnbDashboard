import { User } from './booking';

export interface Payment {
  _id?: string;
  bookingId: string;
  userId: string | User;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'bank_transfer';

export interface PaymentSummary {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  refundedPayments: number;
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
  refundedAmount: number;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  bookingId?: string;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
}
