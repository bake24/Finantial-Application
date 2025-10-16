/**
 * Хук для работы с авторизацией
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '@/entities/user';
import { ROUTES } from '@/shared/config/constants';

interface UseAuthOptions {
  redirectTo?: string;
  redirectIfFound?: boolean;
}

/**
 * Хук для защиты страниц авторизацией
 */
export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter();
  const { isAuthenticated, user } = useUserStore();
  const { redirectTo = ROUTES.LOGIN, redirectIfFound = false } = options;

  useEffect(() => {
    if (!redirectTo) return;

    if (
      // Если требуется редирект для найденного пользователя и пользователь авторизован
      (redirectIfFound && isAuthenticated) ||
      // Или если пользователь не авторизован и не нужен редирект для найденного
      (!isAuthenticated && !redirectIfFound)
    ) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, redirectTo, redirectIfFound, router]);

  return { isAuthenticated, user };
}

