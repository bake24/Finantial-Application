/**
 * Вспомогательные функции для работы с займами
 */

import { Loan } from '@/entities/loan';

/**
 * Рассчитать текущий месяц платежа
 * Основано на дате создания займа и текущей дате
 */
export function getCurrentPaymentMonth(loan: Loan): number {
  const now = new Date();
  const startDate = new Date(loan.startDate);
  
  // Разница в месяцах
  const monthsDiff =
    (now.getFullYear() - startDate.getFullYear()) * 12 +
    (now.getMonth() - startDate.getMonth());

  // Текущий месяц платежа (1-based)
  const currentMonth = Math.min(Math.max(monthsDiff + 1, 1), loan.term);
  
  return currentMonth;
}

/**
 * Рассчитать количество оплаченных месяцев
 * Основано на remainingBalance
 */
export function getPaidMonthsCount(loan: Loan): number {
  const totalPaid = loan.amount - loan.remainingBalance;
  const paidMonths = Math.floor(totalPaid / loan.monthlyPayment);
  
  return Math.min(paidMonths, loan.term);
}

/**
 * Проверить, просрочен ли платеж
 */
export function isPaymentOverdue(loan: Loan, paymentMonth: number): boolean {
  const currentMonth = getCurrentPaymentMonth(loan);
  const paidMonths = getPaidMonthsCount(loan);
  
  // Платеж просрочен, если текущий месяц больше paymentMonth,
  // но платеж еще не оплачен
  return currentMonth > paymentMonth && paidMonths < paymentMonth;
}

/**
 * Получить дату следующего платежа
 */
export function getNextPaymentDate(loan: Loan): Date {
  const paidMonths = getPaidMonthsCount(loan);
  const nextMonth = paidMonths + 1;
  
  const startDate = typeof loan.startDate === 'string' ? new Date(loan.startDate) : loan.startDate;
  const nextPaymentDate = new Date(startDate);
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + nextMonth);
  
  return nextPaymentDate;
}

/**
 * Получить количество дней до следующего платежа
 */
export function getDaysUntilNextPayment(loan: Loan): number {
  const nextDate = getNextPaymentDate(loan);
  const now = new Date();
  
  const diffTime = nextDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(diffDays, 0);
}

/**
 * Получить статус займа с деталями
 */
export function getLoanStatus(loan: Loan): {
  status: 'active' | 'completed' | 'overdue';
  message: string;
  daysOverdue?: number;
} {
  if (loan.status === 'completed' || loan.remainingBalance <= 0.00000001) {
    return {
      status: 'completed',
      message: 'Займ погашен полностью',
    };
  }

  const currentMonth = getCurrentPaymentMonth(loan);
  const paidMonths = getPaidMonthsCount(loan);
  
  if (currentMonth > paidMonths + 1) {
    // Есть просроченные платежи
    const monthsOverdue = currentMonth - paidMonths - 1;
    const daysOverdue = monthsOverdue * 30; // Приблизительно
    
    return {
      status: 'overdue',
      message: `Просрочено ${monthsOverdue} платеж(а/ей)`,
      daysOverdue,
    };
  }

  return {
    status: 'active',
    message: 'Займ активен',
  };
}

/**
 * Рассчитать прогресс погашения в процентах
 */
export function getRepaymentProgress(loan: Loan): number {
  const totalPaid = loan.amount - loan.remainingBalance;
  const progress = (totalPaid / loan.amount) * 100;
  
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Получить оставшиеся месяцы до полного погашения
 */
export function getRemainingMonths(loan: Loan): number {
  const paidMonths = getPaidMonthsCount(loan);
  return Math.max(loan.term - paidMonths, 0);
}

