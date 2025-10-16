/**
 * API endpoint для досрочного погашения (mock)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { RepaymentResponse } from '@/entities/payment';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<RepaymentResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { loanId, amount, type } = req.body;

  // Валидация
  if (!loanId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Некорректные параметры погашения' });
  }

  // Mock ответ
  const response: RepaymentResponse = {
    success: true,
    newBalance: type === 'full' ? 0 : Math.random() * 0.5, // Случайный остаток для демо
    message:
      type === 'full'
        ? 'Займ погашен полностью'
        : 'Частичное погашение выполнено успешно',
  };

  return res.status(200).json(response);
}

