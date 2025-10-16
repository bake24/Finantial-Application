/**
 * Экспорт утилит
 */

export {
  formatBTC,
  formatDate,
  formatDateShort,
  formatNumber,
} from './format';

export {
  calculatePaymentSchedule,
  calculateTotalPayment,
  calculateMonthlyPayment,
} from './calculations';

export type { PaymentScheduleItem } from './calculations';

export {
  validateLoanAmount,
  validateLoanTerm,
  validateLoginData,
  validateRepaymentAmount,
} from './validation';

export type { ValidationResult } from './validation';

export {
  initDB,
  savePendingRequest,
  getPendingRequests,
  deletePendingRequest,
  clearPendingRequests,
  supportsBackgroundSync,
  registerBackgroundSync,
  cacheLoanData,
  getCachedLoanData,
} from './storage';

export {
  getCurrentPaymentMonth,
  getPaidMonthsCount,
  isPaymentOverdue,
  getNextPaymentDate,
  getDaysUntilNextPayment,
  getLoanStatus,
  getRepaymentProgress,
  getRemainingMonths,
} from './loanHelpers';

