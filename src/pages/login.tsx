/**
 * Страница авторизации
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { LoginForm } from '@/features/auth';
import { useUserStore } from '@/entities/user';
import { ROUTES } from '@/shared/config/constants';

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем на dashboard
    if (isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Head>
        <title>Вход | Bitcoin Loan App</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-bitcoin-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bitcoin Loan App
            </h1>
            <p className="text-gray-600">
              Займы в Bitcoin с прозрачными условиями
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
}

