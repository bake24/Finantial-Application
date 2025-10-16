/**
 * API endpoint для работы с займами (mock)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { LoanCreateResponse } from '@/entities/loan';
import { APP_CONFIG } from '@/shared/config/constants';
import {
  calculateMonthlyPayment,
  calculateTotalPayment,
} from '@/shared/lib/utils/calculations';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoanCreateResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, term } = req.body;

  // Валидация
  if (
    !amount ||
    !term ||
    amount < APP_CONFIG.MIN_LOAN_BTC ||
    amount > APP_CONFIG.MAX_LOAN_BTC ||
    term < APP_CONFIG.MIN_LOAN_MONTHS ||
    term > APP_CONFIG.MAX_LOAN_MONTHS
  ) {
    return res.status(400).json({ error: 'Некорректные параметры займа' });
  }

  const monthlyPayment = calculateMonthlyPayment(amount, term);
  const totalPayment = calculateTotalPayment(amount, term);

  const response: LoanCreateResponse = {
    loan: {
      id: 'loan-' + Date.now(),
      userId: '1',
      amount,
      term,
      interestRate: APP_CONFIG.INTEREST_RATE,
      monthlyPayment,
      totalPayment,
      remainingBalance: amount,
      status: 'active',
      createdAt: new Date(),
      startDate: new Date(),
    },
    message: 'Займ успешно оформлен',
  };

  return res.status(200).json(response);
}

