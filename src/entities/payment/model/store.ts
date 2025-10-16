/**
 * Хранилище истории платежей
 * 
 * Отслеживает фактические платежи по займам
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Payment {
  id: string;
  loanId: string;
  amount: number;              // Сумма платежа в BTC
  type: 'scheduled' | 'partial' | 'full';  // Тип платежа
  date: Date | string;         // Дата платежа
  scheduledMonth: number;      // Какой месяц платежа (1, 2, 3...)
  principal: number;           // Часть основного долга
  interest: number;            // Часть процентов
  status: 'completed' | 'pending' | 'failed';
  transactionHash?: string;    // BTC transaction hash (для реального приложения)
  createdAt: Date | string;
}

interface PaymentStore {
  payments: Payment[];
  
  addPayment: (payment: Payment) => void;
  getPaymentsByLoan: (loanId: string) => Payment[];
  getCompletedPayments: (loanId: string) => Payment[];
  getTotalPaid: (loanId: string) => number;
  getLastPayment: (loanId: string) => Payment | undefined;
  getPaymentHistory: () => Payment[];
  clearPayments: () => void;
}

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
  payments: [],

  addPayment: (payment) =>
    set((state) => ({
      payments: [...state.payments, payment],
    })),

  getPaymentsByLoan: (loanId) => {
    const state = get();
    return state.payments.filter((p) => p.loanId === loanId);
  },

  getCompletedPayments: (loanId) => {
    const state = get();
    return state.payments.filter(
      (p) => p.loanId === loanId && p.status === 'completed'
    );
  },

  getTotalPaid: (loanId) => {
    const state = get();
    return state.payments
      .filter((p) => p.loanId === loanId && p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  },

  getLastPayment: (loanId) => {
    const state = get();
    const loanPayments = state.payments
      .filter((p) => p.loanId === loanId)
      .sort((a, b) => {
        const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
        const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
        return dateB.getTime() - dateA.getTime();
      });
    
    return loanPayments[0];
  },

  getPaymentHistory: () => {
    const state = get();
    // Возвращаем все платежи, отсортированные по дате (новые первые)
    return state.payments
      .filter((p) => p.status === 'completed')
      .sort((a, b) => {
        const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
        const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
        return dateB.getTime() - dateA.getTime();
      });
  },

  clearPayments: () => set({ payments: [] }),
}),
    {
      name: 'btc-loan-payments',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

