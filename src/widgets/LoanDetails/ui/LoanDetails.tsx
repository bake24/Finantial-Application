/**
 * Виджет детальной информации о займе
 * 
 * Показывает:
 * - Основную информацию о займе
 * - График платежей (таблица и визуализация)
 * - Действия (досрочное погашение)
 * - Навигацию (breadcrumbs, кнопка назад)
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Breadcrumbs, Tabs } from '@/shared/ui';
import { formatBTC, formatDate } from '@/shared/lib/utils/format';
import { calculatePaymentSchedule } from '@/shared/lib/utils/calculations';
import { getPaidMonthsCount, getRepaymentProgress } from '@/shared/lib/utils';
import { Loan } from '@/entities/loan';
import { PaymentSchedule } from '@/widgets/PaymentSchedule';
import { ScheduleChart } from '@/widgets/ScheduleChart';
import { RepaymentModal } from '@/features/repayment';

interface LoanDetailsProps {
  loan: Loan;
  onLoanUpdate: () => void;
}

export const LoanDetails: React.FC<LoanDetailsProps> = ({ loan, onLoanUpdate }) => {
  const router = useRouter();
  const [isRepaymentModalOpen, setIsRepaymentModalOpen] = useState(false);

  // Рассчитываем график платежей
  const schedule = calculatePaymentSchedule(
    loan.amount,
    loan.term,
    typeof loan.startDate === 'string' ? new Date(loan.startDate) : loan.startDate
  );

  // Рассчитываем прогресс
  const totalPaid = loan.amount - loan.remainingBalance;
  const progress = getRepaymentProgress(loan);

  // Определяем текущий месяц платежа (сколько месяцев оплачено)
  const currentMonth = getPaidMonthsCount(loan);

  // Ближайший платеж
  const nextPayment = schedule.find((item) => item.month > currentMonth);

  // Вкладки
  const tabs = [
    {
      id: 'table',
      label: 'Таблица платежей',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      id: 'chart',
      label: 'Визуализация',
      icon: (
        <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumbs и кнопка назад */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: `Займ ${formatBTC(loan.amount)}` },
          ]}
        />

        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад
        </Button>
      </div>

      {/* Основная информация о займе (шапка) */}
      <Card>
        <div className="space-y-6">
          {/* Заголовок и статус */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Займ {formatBTC(loan.amount)} на {loan.term} месяцев
              </h1>
              <p className="text-gray-600">
                Процентная ставка: <span className="font-semibold">{(loan.interestRate * 100).toFixed(1)}% годовых</span>
              </p>
                <p className="text-sm text-gray-500 mt-1">
                  Выдан {formatDate(loan.createdAt)} • 
                  {loan.status === 'active' ? ` Окончание ${formatDate(new Date(new Date(loan.startDate).getTime() + loan.term * 30 * 24 * 60 * 60 * 1000))}` : ' Закрыт'}
                </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                loan.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {loan.status === 'active' ? '✓ Активен' : '✕ Завершен'}
            </span>
          </div>

          {/* Ключевые метрики */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <p className="text-xs text-blue-600 font-medium mb-1">Ежемесячный платеж</p>
              <p className="text-xl font-bold text-blue-900">{formatBTC(loan.monthlyPayment)}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <p className="text-xs text-green-600 font-medium mb-1">Выплачено</p>
              <p className="text-xl font-bold text-green-900">{formatBTC(totalPaid)}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
              <p className="text-xs text-orange-600 font-medium mb-1">Остаток долга</p>
              <p className="text-xl font-bold text-orange-900">{formatBTC(loan.remainingBalance)}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
              <p className="text-xs text-purple-600 font-medium mb-1">Общая сумма</p>
              <p className="text-xl font-bold text-purple-900">{formatBTC(loan.totalPayment)}</p>
            </div>
          </div>

          {/* Прогресс-бар */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">Прогресс выплат</span>
              <span className="text-gray-900 font-bold">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-bitcoin-500 to-orange-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progress}%` }}
              >
                {progress > 10 && (
                  <span className="text-xs text-white font-bold">{progress.toFixed(0)}%</span>
                )}
              </div>
            </div>
          </div>

          {/* Ближайший платеж */}
          {nextPayment && loan.status === 'active' && (
            <div className="bg-bitcoin-50 border-2 border-bitcoin-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-bitcoin-600 flex-shrink-0 mt-0.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-bitcoin-900 mb-1">Следующий платеж</p>
                  <p className="text-sm text-bitcoin-700">
                    <span className="font-bold">{formatBTC(nextPayment.payment)}</span> до {formatDate(nextPayment.date)}
                  </p>
                  <p className="text-xs text-bitcoin-600 mt-1">
                    Из них: {formatBTC(nextPayment.principal)} основной долг + {formatBTC(nextPayment.interest)} проценты
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Действия по займу */}
      {loan.status === 'active' && (
        <div className="flex flex-wrap gap-4">
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

          <Button
            variant="secondary"
            className="flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Скачать график
          </Button>
        </div>
      )}

      {/* Вкладки: Таблица / График */}
      <Tabs tabs={tabs}>
        {(activeTab) => (
          <>
            {activeTab === 'table' && (
              <PaymentSchedule schedule={schedule} currentMonth={currentMonth} />
            )}
            {activeTab === 'chart' && (
              <ScheduleChart schedule={schedule} />
            )}
          </>
        )}
      </Tabs>

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

