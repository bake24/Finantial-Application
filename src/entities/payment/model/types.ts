/**
 * Типы для сущности платежа
 */

export interface Payment {
  id: string;
  loanId: string;
  amount: number;
  principal: number;
  interest: number;
  dueDate: Date | string;
  paidDate?: Date | string;
  status: 'pending' | 'paid' | 'overdue';
  month: number;
}

export interface PaymentSchedule {
  loanId: string;
  payments: Payment[];
  totalPaid: number;
  remainingBalance: number;
}

export interface RepaymentRequest {
  loanId: string;
  amount: number;
  type: 'partial' | 'full';
}

export interface RepaymentResponse {
  success: boolean;
  newBalance: number;
  message: string;
}

