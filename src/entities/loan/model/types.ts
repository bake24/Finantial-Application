/**
 * Типы для сущности займа
 */

export interface Loan {
  id: string;
  userId: string;
  amount: number; // BTC
  term: number; // месяцы
  interestRate: number;
  monthlyPayment: number;
  totalPayment: number;
  remainingBalance: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date | string;
  startDate: Date | string;
}

export interface LoanApplication {
  amount: number;
  term: number;
}

export interface LoanCreateResponse {
  loan: Loan;
  message: string;
}

