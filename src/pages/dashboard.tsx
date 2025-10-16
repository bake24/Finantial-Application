/**
 * Страница личного кабинета
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Dashboard } from '@/widgets/Dashboard';
import { useUserStore } from '@/entities/user';
import { useLoanStore } from '@/entities/loan';
import { Button, BTCPrice, InstallPrompt, MobileNav, MobileHeader, DesktopHeader, FloatingActionButton, InstallToast } from '@/shared/ui';
import { ROUTES } from '@/shared/config/constants';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useUserStore();
  const { loans, currentLoan, getActiveLoans, setCurrentLoan } = useLoanStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showInstallToast, setShowInstallToast] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Выбираем активный займ для отображения
  const displayLoan = currentLoan || getActiveLoans()[0];

  useEffect(() => {
    // Проверка авторизации
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    // TODO: Загрузить займы пользователя с API
    // const userLoans = await fetchUserLoans();
    // setLoans(userLoans);
    
    setIsLoading(false);
  }, [isAuthenticated, router]);

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Показываем toast через 2 секунды после загрузки
      setTimeout(() => {
        setShowInstallToast(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const handleNewLoan = () => {
    router.push(ROUTES.LOAN);
  };

  const handleLoanUpdate = () => {
    // Обновление данных займа после погашения
    // В реальном приложении здесь будет запрос к API
    console.log('Loan updated');
  };

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Для iOS показываем инструкции
      alert('Для установки на iOS:\n1. Нажмите кнопку "Поделиться" внизу экрана\n2. Выберите "На экран Домой"\n3. Нажмите "Добавить"');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA установлено');
    }
    
    setDeferredPrompt(null);
    setShowInstallToast(false);
  };

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bitcoin-500 mx-auto" />
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Личный кабинет | Bitcoin Loan App</title>
      </Head>
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Mobile Header */}
        <MobileHeader title="Личный кабинет" onInstallClick={handleInstall} />

        {/* Desktop Header */}
        <DesktopHeader title="Личный кабинет" />

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14 md:mt-0">
          {/* PWA Install Prompt - скрыть на мобильных */}
          <InstallPrompt variant="banner" className="mb-6 hidden md:block" />
          
          {/* Bitcoin цена */}
          <div className="mb-6">
            <BTCPrice />
          </div>

          {displayLoan ? (
            <Dashboard loan={displayLoan} onLoanUpdate={handleLoanUpdate} />
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">
                У вас нет активных займов
              </h3>
              <p className="mt-2 text-gray-600">
                Оформите свой первый займ в Bitcoin
              </p>
              <div className="mt-6">
                <Button onClick={handleNewLoan}>Оформить займ</Button>
              </div>
            </div>
          )}
        </main>

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Floating Action Button для нового займа */}
        <FloatingActionButton 
          onClick={handleNewLoan}
          label="Новый займ"
        />

        {/* Install Toast для мобильных (5 секунд) */}
        <InstallToast 
          isOpen={showInstallToast}
          onClose={() => setShowInstallToast(false)}
          onInstall={handleInstall}
        />
      </div>
    </>
  );
}

