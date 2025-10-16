/**
 * Хранилище состояния займов (Zustand)
 * 
 * Поддерживает:
 * - Множество займов для одного пользователя
 * - Текущий активный займ для просмотра
 * - CRUD операции
 */

import { create } from 'zustand';
import { Loan } from './types';

interface LoanStore {
  // Все займы пользователя
  loans: Loan[];
  
  // Текущий выбранный займ (для детальной страницы)
  currentLoan: Loan | null;
  
  // Загрузка
  isLoading: boolean;
  
  // Установить список займов
  setLoans: (loans: Loan[]) => void;
  
  // Добавить новый займ
  addLoan: (loan: Loan) => void;
  
  // Установить текущий займ
  setCurrentLoan: (loan: Loan | null) => void;
  
  // Обновить займ по ID
  updateLoan: (id: string, updates: Partial<Loan>) => void;
  
  // Удалить займ
  removeLoan: (id: string) => void;
  
  // Получить займ по ID
  getLoanById: (id: string) => Loan | undefined;
  
  // Получить активные займы
  getActiveLoans: () => Loan[];
  
  // Очистить все
  clearLoans: () => void;
  
  // Установить загрузку
  setLoading: (loading: boolean) => void;
}

export const useLoanStore = create<LoanStore>((set, get) => ({
  loans: [],
  currentLoan: null,
  isLoading: false,

  setLoans: (loans) => set({ loans }),

  addLoan: (loan) =>
    set((state) => ({
      loans: [...state.loans, loan],
      currentLoan: loan, // Новый займ становится текущим
    })),

  setCurrentLoan: (loan) => set({ currentLoan: loan }),

  updateLoan: (id, updates) =>
    set((state) => {
      const updatedLoans = state.loans.map((loan) =>
        loan.id === id ? { ...loan, ...updates } : loan
      );
      
      const updatedCurrent =
        state.currentLoan?.id === id
          ? { ...state.currentLoan, ...updates }
          : state.currentLoan;

      return {
        loans: updatedLoans,
        currentLoan: updatedCurrent,
      };
    }),

  removeLoan: (id) =>
    set((state) => ({
      loans: state.loans.filter((loan) => loan.id !== id),
      currentLoan: state.currentLoan?.id === id ? null : state.currentLoan,
    })),

  getLoanById: (id) => {
    const state = get();
    return state.loans.find((loan) => loan.id === id);
  },

  getActiveLoans: () => {
    const state = get();
    return state.loans.filter((loan) => loan.status === 'active');
  },

  clearLoans: () => set({ loans: [], currentLoan: null }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));

