/**
 * Страница истории платежей
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, MobileNav, MobileHeader, DesktopHeader } from '@/shared/ui';
import { useUserStore } from '@/entities/user';
import { usePaymentStore } from '@/entities/payment';
import { usePWAInstall } from '@/shared/lib/hooks';
import { ROUTES } from '@/shared/config/constants';
import { formatBTC, formatDate } from '@/shared/lib/utils/format';

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useUserStore();
  const getPaymentHistory = usePaymentStore((state) => state.getPaymentHistory);
  const { handleInstall } = usePWAInstall();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  if (!isAuthenticated) {
    return null;
  }

  const payments = getPaymentHistory();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'scheduled':
        return 'Плановый платеж';
      case 'partial':
        return 'Частичное погашение';
      case 'full':
        return 'Полное погашение';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'full':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Head>
        <title>История платежей | Bitcoin Loan App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Mobile Header */}
        <MobileHeader title="История" onInstallClick={handleInstall} />

        {/* Desktop Header */}
        <DesktopHeader title="История платежей" />

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14 md:mt-0">
          {/* Summary Card */}
          <Card className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Всего платежей</p>
                <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Общая сумма</p>
                <p className="text-2xl font-bold text-bitcoin-600">
                  {formatBTC(payments.reduce((sum, p) => sum + p.amount, 0))}
                </p>
              </div>
              <div className="col-span-2 md:col-span-1">
                <p className="text-sm text-gray-600">Последний платеж</p>
                <p className="text-lg font-semibold text-gray-900">
                  {payments.length > 0 ? formatDate(payments[0].date) : '-'}
                </p>
              </div>
            </div>
          </Card>

          {/* Payments List */}
          {payments.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-4 text-xl font-medium text-gray-900">
                  История пуста
                </h3>
                <p className="mt-2 text-gray-600">
                  У вас пока нет завершенных платежей
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                            payment.type
                          )}`}
                        >
                          {getTypeLabel(payment.type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          Месяц #{payment.scheduledMonth}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-gray-600">Сумма</p>
                          <p className="font-semibold text-gray-900">
                            {formatBTC(payment.amount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Основной долг</p>
                          <p className="font-semibold text-gray-900">
                            {formatBTC(payment.principal)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Проценты</p>
                          <p className="font-semibold text-gray-900">
                            {formatBTC(payment.interest)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Дата</p>
                          <p className="font-semibold text-gray-900">
                            {formatDate(payment.date)}
                          </p>
                        </div>
                      </div>

                      {payment.transactionHash && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-600">Transaction Hash</p>
                          <p className="text-xs font-mono text-gray-900 mt-1 truncate">
                            {payment.transactionHash}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="ml-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.status === 'completed'
                            ? 'bg-green-100'
                            : payment.status === 'pending'
                            ? 'bg-yellow-100'
                            : 'bg-red-100'
                        }`}
                      >
                        {payment.status === 'completed' ? (
                          <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : payment.status === 'pending' ? (
                          <svg
                            className="w-6 h-6 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </>
  );
}

