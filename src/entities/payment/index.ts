/**
 * Экспорт сущности платежа
 */

export type {
  Payment as PaymentType,
  PaymentSchedule,
  RepaymentRequest,
  RepaymentResponse,
} from './model/types';

export type { Payment } from './model/store';
export { usePaymentStore } from './model/store';

