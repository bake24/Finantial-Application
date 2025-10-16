/**
 * Утилиты для расчётов займов
 */

import { APP_CONFIG } from '@/shared/config/constants';

/**
 * Элемент графика платежей
 */
export interface PaymentScheduleItem {
  month: number;              // Номер месяца (1, 2, 3...)
  date: Date;                 // Дата платежа
  payment: number;            // Общая сумма платежа (основной долг + проценты)
  principal: number;          // Часть основного долга в платеже
  interest: number;           // Часть процентов в платеже
  remainingBalance: number;   // Остаток долга после платежа
}

/**
 * Расчёт графика платежей по методу аннуитетных платежей
 * 
 * Аннуитетный платеж - равные ежемесячные платежи на протяжении всего срока кредита.
 * Каждый платеж состоит из двух частей:
 * 1. Основной долг (principal) - уменьшается остаток займа
 * 2. Проценты (interest) - плата за пользование деньгами
 * 
 * Формула аннуитетного платежа:
 * P = S × [r × (1 + r)^n] / [(1 + r)^n - 1]
 * где:
 * P - ежемесячный платеж
 * S - сумма займа (principal)
 * r - месячная процентная ставка (годовая ставка / 12)
 * n - количество месяцев
 * 
 * @param principal - Сумма займа в BTC
 * @param months - Срок займа в месяцах
 * @param startDate - Дата начала займа (по умолчанию - текущая дата)
 * @returns Массив платежей с разбивкой по месяцам
 * 
 * @example
 * // Займ 0.5 BTC на 12 месяцев под 5% годовых
 * const schedule = calculatePaymentSchedule(0.5, 12);
 * // Результат: 12 платежей по ~0.04387 BTC каждый
 */
export function calculatePaymentSchedule(
  principal: number,
  months: number,
  startDate: Date = new Date()
): PaymentScheduleItem[] {
  // Месячная процентная ставка (годовая ставка делится на 12 месяцев)
  const monthlyRate = APP_CONFIG.INTEREST_RATE / 12;
  
  // Расчет фиксированного ежемесячного платежа по формуле аннуитета
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const schedule: PaymentScheduleItem[] = [];
  let remainingBalance = principal;

  // Формируем график платежей для каждого месяца
  for (let month = 1; month <= months; month++) {
    // Проценты начисляются на остаток долга
    const interestPayment = remainingBalance * monthlyRate;
    
    // Остальная часть платежа идет на погашение основного долга
    const principalPayment = monthlyPayment - interestPayment;
    
    // Уменьшаем остаток долга
    remainingBalance -= principalPayment;

    // Рассчитываем дату платежа (текущий месяц + N месяцев)
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + month);

    schedule.push({
      month,
      date: paymentDate,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance), // Избегаем отрицательных значений
    });
  }

  return schedule;
}

/**
 * Расчёт общей суммы выплат
 * 
 * Суммирует все ежемесячные платежи для определения полной стоимости займа
 * (основной долг + все проценты за весь период)
 * 
 * @param principal - Сумма займа в BTC
 * @param months - Срок займа в месяцах
 * @returns Общая сумма к выплате в BTC
 * 
 * @example
 * // Займ 1 BTC на 12 месяцев
 * const total = calculateTotalPayment(1, 12);
 * // Результат: ~1.0265 BTC (переплата ~0.0265 BTC)
 */
export function calculateTotalPayment(principal: number, months: number): number {
  const schedule = calculatePaymentSchedule(principal, months);
  return schedule.reduce((sum, item) => sum + item.payment, 0);
}

/**
 * Расчёт размера ежемесячного платежа
 * 
 * Быстрый расчет без создания полного графика платежей.
 * Используется для предварительного просмотра при заполнении формы займа.
 * 
 * @param principal - Сумма займа в BTC
 * @param months - Срок займа в месяцах
 * @returns Размер ежемесячного платежа в BTC
 * 
 * @example
 * // Займ 0.5 BTC на 6 месяцев
 * const payment = calculateMonthlyPayment(0.5, 6);
 * // Результат: ~0.08607 BTC/месяц
 */
export function calculateMonthlyPayment(principal: number, months: number): number {
  const monthlyRate = APP_CONFIG.INTEREST_RATE / 12;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );
}

