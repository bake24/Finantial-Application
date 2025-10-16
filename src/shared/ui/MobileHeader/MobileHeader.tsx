/**
 * Компактный header для мобильных устройств
 * С гамбургер-меню и основными действиями
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../Button/Button';
import { useUserStore } from '@/entities/user';

interface MobileHeaderProps {
  title?: string;
  showMenu?: boolean;
  actions?: React.ReactNode;
  onInstallClick?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'Bitcoin Loan',
  showMenu = true,
  actions,
  onInstallClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    {
      label: 'Главная',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      onClick: () => {
        router.push('/dashboard');
        setIsMenuOpen(false);
      },
    },
    {
      label: 'Новый займ',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      onClick: () => {
        router.push('/loan');
        setIsMenuOpen(false);
      },
    },
    ...(onInstallClick ? [{
      label: 'Установить приложение',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      onClick: () => {
        onInstallClick();
        setIsMenuOpen(false);
      },
      special: true,
    }] : []),
    {
      label: 'Выйти',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 md:hidden max-w-full"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div className="flex items-center justify-between px-3 sm:px-4 h-14 max-w-full">
          {/* Logo/Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-8 h-8 bg-bitcoin-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">₿</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">{title}</h1>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {actions}
            {showMenu && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 active:bg-gray-100 rounded-lg transition-colors"
                aria-label="Меню"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* User info bar */}
        {user && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-600">
              👋 Привет, <span className="font-semibold">{user.username}</span>
            </p>
          </div>
        )}
      </header>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-30 bg-black bg-opacity-25 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed top-14 right-0 z-40 w-64 bg-white shadow-lg rounded-bl-2xl md:hidden animate-slide-down">
            <div className="py-2">
              {menuItems.map((item: any, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                    item.danger
                      ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
                      : item.special
                      ? 'text-bitcoin-600 hover:bg-bitcoin-50 active:bg-bitcoin-100 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

