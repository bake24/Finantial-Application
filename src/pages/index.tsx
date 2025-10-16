/**
 * Главная страница приложения
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useUserStore } from '@/entities/user';
import { ROUTES } from '@/shared/config/constants';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Перенаправление на соответствующую страницу
    if (isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    } else {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Head>
        <title>Bitcoin Loan App</title>
      </Head>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bitcoin-500 mx-auto" />
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    </>
  );
}

