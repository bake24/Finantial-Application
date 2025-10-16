/**
 * Страница профиля пользователя
 */

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button, Card, MobileNav, MobileHeader } from '@/shared/ui';
import { useUserStore } from '@/entities/user';
import { ROUTES } from '@/shared/config/constants';
import { formatDate } from '@/shared/lib/utils/format';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Профиль | Bitcoin Loan App</title>
      </Head>

      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {/* Mobile Header */}
        <MobileHeader title="Профиль" />

        {/* Desktop Header */}
        <header className="hidden md:block bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Профиль</h1>
              <Button variant="ghost" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-14 md:mt-0">
          {/* Avatar and Main Info */}
          <Card className="mb-6">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-bitcoin-400 to-bitcoin-600 rounded-full flex items-center justify-center">
                  <span className="text-2xl sm:text-4xl font-bold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{user.username}</h2>
                <p className="text-gray-600 mt-1 text-sm truncate">{user.email}</p>
                <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Верифицирован
                  </span>
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🏆 Premium
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Information */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Информация об аккаунте
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between gap-2 py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm flex-shrink-0">ID пользователя</span>
                <span className="font-medium text-gray-900 text-sm truncate">{user.id}</span>
              </div>
              <div className="flex justify-between gap-2 py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm flex-shrink-0">Email</span>
                <span className="font-medium text-gray-900 text-sm truncate">{user.email}</span>
              </div>
              <div className="flex justify-between gap-2 py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm flex-shrink-0">Дата регистрации</span>
                <span className="font-medium text-gray-900 text-sm text-right">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex justify-between gap-2 py-3 border-b border-gray-100">
                <span className="text-gray-600 text-sm flex-shrink-0">Статус</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Активен
                </span>
              </div>
              <div className="flex justify-between gap-2 py-3">
                <span className="text-gray-600 text-sm flex-shrink-0">Тип аккаунта</span>
                <span className="font-medium text-gray-900 text-sm">Premium</span>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Статистика
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-bitcoin-600">0</div>
                <div className="text-xs text-gray-600 mt-1">Активных займов</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-xs text-gray-600 mt-1">Закрытых займов</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-xs text-gray-600 mt-1">Всего платежей</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-xs text-gray-600 mt-1">Надежность</div>
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Настройки
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="font-medium text-gray-900 text-sm sm:text-base truncate">Сменить пароль</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="font-medium text-gray-900 text-sm sm:text-base truncate">Уведомления</span>
                </div>
                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0 ml-2">
                  Вкл.
                </span>
              </button>

              <button className="w-full flex items-center justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-medium text-gray-900 text-sm sm:text-base truncate">Безопасность</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </Card>

          {/* Logout Button */}
          <Card>
            <Button
              variant="ghost"
              fullWidth
              onClick={handleLogout}
              className="text-red-600 hover:bg-red-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Выйти из аккаунта
            </Button>
          </Card>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </>
  );
}

