/**
 * Страница деталей конкретного займа
 * 
 * Маршрут: /loan/[id]
 * Показывает полную информацию о займе, график платежей, действия
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useLoanStore } from '@/entities/loan';
import { useUserStore } from '@/entities/user';
import { LoanDetails } from '@/widgets/LoanDetails';
import { MobileNav, MobileHeader, DesktopHeader } from '@/shared/ui';

export default function LoanDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const { currentLoan, getLoanById, setCurrentLoan, isLoading, setLoading } = useLoanStore();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  useEffect(() => {
    // Проверка авторизации
    if (!user) {
      router.push('/login');
      return;
    }

    if (!id) return;

    // Пытаемся найти займ в store
    const loanId = id as string;
    const foundLoan = getLoanById(loanId);

    if (foundLoan) {
      setCurrentLoan(foundLoan);
      setLoading(false);
    } else {
      // TODO: Загрузить займ по ID с API
      // const loanData = await fetchLoan(loanId);
      // setCurrentLoan(loanData);
      
      // Пока редирект на dashboard
      router.push('/dashboard');
    }
  }, [id, user, router, getLoanById, setCurrentLoan, setLoading]);

  const handleLoanUpdate = async () => {
    // Обновление данных займа после погашения
    if (!id) return;
    
    setLoading(true);
    
    // TODO: Перезагрузить займ с API
    // const updatedLoan = await fetchLoan(id as string);
    // updateLoan(id as string, updatedLoan);
    
    // Пока просто перезагружаем из store
    const loanId = id as string;
    const refreshedLoan = getLoanById(loanId);
    if (refreshedLoan) {
      setCurrentLoan(refreshedLoan);
    }
    
    setLoading(false);
  };

  if (isLoading || !currentLoan) {
    return (
      <>
        <Head>
          <title>Загрузка... | Bitcoin Loan App</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-bitcoin-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Загрузка данных займа...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Займ {currentLoan.amount} BTC | Bitcoin Loan App</title>
        <meta name="description" content={`Детали займа на ${currentLoan.amount} BTC`} />
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Mobile Header */}
        <MobileHeader title="Детали займа" />

        {/* Desktop Header */}
        <DesktopHeader title="Детали займа" />

        {/* Content */}
        <div className="mt-14 md:mt-0">
          <LoanDetails loan={currentLoan} onLoanUpdate={handleLoanUpdate} />
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </>
  );
}

