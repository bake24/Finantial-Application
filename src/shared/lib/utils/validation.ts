/**
 * Утилиты для валидации
 */

import { APP_CONFIG } from '@/shared/config/constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Валидация суммы займа
 */
export function validateLoanAmount(amount: number): ValidationResult {
  if (isNaN(amount) || amount <= 0) {
    return {
      isValid: false,
      error: 'Сумма должна быть положительным числом',
    };
  }

  if (amount < APP_CONFIG.MIN_LOAN_BTC) {
    return {
      isValid: false,
      error: `Минимальная сумма займа: ${APP_CONFIG.MIN_LOAN_BTC} BTC`,
    };
  }

  if (amount > APP_CONFIG.MAX_LOAN_BTC) {
    return {
      isValid: false,
      error: `Максимальная сумма займа: ${APP_CONFIG.MAX_LOAN_BTC} BTC`,
    };
  }

  return { isValid: true };
}

/**
 * Валидация срока займа
 */
export function validateLoanTerm(months: number): ValidationResult {
  if (!Number.isInteger(months) || months <= 0) {
    return {
      isValid: false,
      error: 'Срок должен быть положительным целым числом',
    };
  }

  if (months < APP_CONFIG.MIN_LOAN_MONTHS) {
    return {
      isValid: false,
      error: `Минимальный срок займа: ${APP_CONFIG.MIN_LOAN_MONTHS} месяц`,
    };
  }

  if (months > APP_CONFIG.MAX_LOAN_MONTHS) {
    return {
      isValid: false,
      error: `Максимальный срок займа: ${APP_CONFIG.MAX_LOAN_MONTHS} месяцев`,
    };
  }

  return { isValid: true };
}

/**
 * Валидация данных для входа
 */
export function validateLoginData(username: string, password: string): ValidationResult {
  if (!username || username.trim().length === 0) {
    return {
      isValid: false,
      error: 'Введите имя пользователя',
    };
  }

  if (!password || password.length < 6) {
    return {
      isValid: false,
      error: 'Пароль должен содержать минимум 6 символов',
    };
  }

  return { isValid: true };
}

/**
 * Валидация суммы погашения
 */
export function validateRepaymentAmount(
  amount: number,
  remainingBalance: number
): ValidationResult {
  if (isNaN(amount) || amount <= 0) {
    return {
      isValid: false,
      error: 'Сумма должна быть положительным числом',
    };
  }

  if (amount > remainingBalance) {
    return {
      isValid: false,
      error: 'Сумма превышает остаток долга',
    };
  }

  return { isValid: true };
}

