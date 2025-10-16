/**
 * Компонент для защиты маршрутов авторизацией
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '@/entities/user';
import { ROUTES } from '@/shared/config/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Оборачивает страницу и перенаправляет неавторизованных пользователей
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = ROUTES.LOGIN,
}) => {
  const router = useRouter();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  // Показываем загрузку пока проверяем авторизацию
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bitcoin-500 mx-auto" />
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

