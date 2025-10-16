/**
 * Десктопный хедер с единой навигацией для всех страниц
 */

import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '../Button/Button';
import { useUserStore } from '@/entities/user';

interface DesktopHeaderProps {
  title: string;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ title }) => {
  const router = useRouter();
  const { logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="hidden md:block bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className={router.pathname === '/dashboard' ? 'bg-gray-100' : ''}
            >
              Главная
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/loan')}
              className={router.pathname === '/loan' ? 'bg-gray-100' : ''}
            >
              Новый займ
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/history')}
              className={router.pathname === '/history' ? 'bg-gray-100' : ''}
            >
              История
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push('/profile')}
              className={router.pathname === '/profile' ? 'bg-gray-100' : ''}
            >
              Профиль
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

