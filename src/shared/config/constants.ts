/**
 * Константы приложения
 */

export const APP_CONFIG = {
  MAX_LOAN_BTC: parseFloat(process.env.NEXT_PUBLIC_MAX_LOAN_BTC || '1'),
  MAX_LOAN_MONTHS: parseInt(process.env.NEXT_PUBLIC_MAX_LOAN_MONTHS || '24', 10),
  MIN_LOAN_BTC: 0.01,
  MIN_LOAN_MONTHS: 1,
  INTEREST_RATE: 0.05, // 5% годовых
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOAN: '/loan',
  DASHBOARD: '/dashboard',
  OFFLINE: '/_offline',
} as const;

export const API_ENDPOINTS = {
  AUTH: '/auth',
  LOANS: '/loans',
  PAYMENTS: '/payments',
  REPAYMENT: '/repayment',
} as const;

