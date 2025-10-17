/**
 * Страница оформления займа
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LoanForm } from '@/features/loan-application';
import { useUserStore } from '@/entities/user';
import { usePWAInstall } from '@/shared/lib/hooks';
import { InstallPrompt, MobileNav, MobileHeader, DesktopHeader } from '@/shared/ui';
import { ROUTES } from '@/shared/config/constants';

export default function LoanPage() {
  const router = useRouter();
  const { isAuthenticated, logout } = useUserStore();
  const { handleInstall } = usePWAInstall();

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
        <MobileHeader title="Новый займ" onInstallClick={handleInstall} />

        {/* Desktop Header */}
        <DesktopHeader title="Оформление займа" />

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

