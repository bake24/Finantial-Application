/**
 * Виджет панели пользователя
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, ConnectionStatus } from '@/shared/ui';
import { formatBTC, formatDate } from '@/shared/lib/utils/format';
import { calculatePaymentSchedule } from '@/shared/lib/utils/calculations';
import { getPaidMonthsCount, getRepaymentProgress } from '@/shared/lib/utils';
import { Loan } from '@/entities/loan';
import { PaymentSchedule } from '@/widgets/PaymentSchedule';
import { ScheduleChart } from '@/widgets/ScheduleChart';
import { RepaymentModal } from '@/features/repayment';

interface DashboardProps {
  loan: Loan;
  onLoanUpdate: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ loan, onLoanUpdate }) => {
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);

  const schedule = calculatePaymentSchedule(
    loan.amount,
    loan.term,
    loan.startDate
  );

  const totalPaid = loan.amount - loan.remainingBalance;
  const progress = getRepaymentProgress(loan);
  const currentMonth = getPaidMonthsCount(loan);

  return (
    <div className="space-y-6">
      {/* Индикатор подключения (показывать только при офлайн) */}
      <ConnectionStatus onlyOffline />

      {/* Общая информация о займе */}
      <Card>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Информация о займе
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Дата оформления: {formatDate(loan.createdAt)}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              loan.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {loan.status === 'active' ? 'Активен' : 'Завершен'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600">Сумма займа</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatBTC(loan.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Остаток долга</p>
            <p className="text-2xl font-bold text-bitcoin-600">
              {formatBTC(loan.remainingBalance)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ежемесячный платеж</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatBTC(loan.monthlyPayment)}
            </p>
          </div>
        </div>

        {/* Прогресс-бар */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Прогресс выплат</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-bitcoin-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Срок займа</p>
            <p className="font-semibold text-gray-900">{loan.term} мес.</p>
          </div>
          <div>
            <p className="text-gray-600">Процентная ставка</p>
            <p className="font-semibold text-gray-900">
              {(loan.interestRate * 100).toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-600">Общая сумма выплат</p>
            <p className="font-semibold text-gray-900">
              {formatBTC(loan.totalPayment)}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Выплачено</p>
            <p className="font-semibold text-green-600">
              {formatBTC(totalPaid)}
            </p>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href={`/loan/${loan.id}`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Подробности
            </Button>
          </Link>

          {loan.status === 'active' && (
            <Button
              onClick={() => setIsRepaymentModalOpen(true)}
              variant="primary"
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Досрочное погашение
            </Button>
          )}
        </div>
      </Card>

      {/* График динамики */}
      <ScheduleChart schedule={schedule} />

      {/* Таблица платежей */}
      <PaymentSchedule schedule={schedule} currentMonth={currentMonth} />

      {/* Модальное окно погашения */}
      <RepaymentModal
        isOpen={isRepaymentModalOpen}
        onClose={() => setIsRepaymentModalOpen(false)}
        loanId={loan.id}
        remainingBalance={loan.remainingBalance}
        onSuccess={onLoanUpdate}
      />
    </div>
  );
};

