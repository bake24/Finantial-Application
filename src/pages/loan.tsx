/**
 * Страница оформления займа
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LoanForm } from '@/features/loan-application';
import { useUserStore } from '@/entities/user';
import { Button, InstallPrompt, MobileNav, MobileHeader } from '@/shared/ui';
import { ROUTES } from '@/shared/config/constants';

export default function LoanPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useUserStore();

  useEffect(() => {
    // Проверка авторизации
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

  return (
    <>
      <Head>
        <title>Оформление займа | Bitcoin Loan App</title>
      </Head>
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Mobile Header */}
        <MobileHeader title="Новый займ" />

        {/* Desktop Header */}
        <header className="hidden md:block bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Оформление займа
              </h1>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                  Главная
                </Button>
                <Button variant="ghost" onClick={() => router.push('/history')}>
                  История
                </Button>
                <Button variant="ghost" onClick={() => router.push('/profile')}>
                  Профиль
                </Button>
                <Button variant="ghost" onClick={handleLogout}>
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14 md:mt-0">
          <div className="flex justify-center">
            <LoanForm />
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Install Prompt для мобильных */}
        <InstallPrompt variant="floating" className="md:hidden" />
      </div>
    </>
  );
}

