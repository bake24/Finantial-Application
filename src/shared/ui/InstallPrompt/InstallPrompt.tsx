/**
 * Компонент для установки PWA
 * Показывает кнопку установки на поддерживаемых устройствах
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../Button/Button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPromptProps {
  className?: string;
  variant?: 'banner' | 'button' | 'floating';
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

export const InstallPrompt: React.FC<InstallPromptProps> = ({
  className = '',
  variant = 'banner',
  showOnMobile = true,
  showOnDesktop = true,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Проверяем, установлено ли приложение
    const checkInstalled = () => {
      // Проверка standalone режима
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(isStandaloneMode);

      // Проверка iOS
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);

      // Проверка, установлено ли PWA
      if (isStandaloneMode || (window.navigator as any).standalone) {
        setIsInstalled(true);
        return;
      }

      // Показываем prompt только если не установлено
      setShowPrompt(!isInstalled);
    };

    checkInstalled();

    // Обработчик beforeinstallprompt (Android Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    // Обработчик установки
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android Chrome - показываем встроенный prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA установлено пользователем');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } else if (isIOS) {
      // iOS Safari - показываем инструкции
      // Импортируем InstallInstructions динамически
      const { InstallInstructions } = await import('../InstallInstructions/InstallInstructions');
      // Здесь можно показать модальное окно с инструкциями
      alert('Для установки на iOS:\n1. Нажмите кнопку "Поделиться" внизу экрана\n2. Выберите "На экран Домой"\n3. Нажмите "Добавить"');
    }
  };

  // Не показываем если уже установлено
  if (isInstalled || isStandalone) {
    return null;
  }

  // Не показываем на мобильных если отключено
  if (!showOnMobile && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null;
  }

  // Не показываем на десктопе если отключено
  if (!showOnDesktop && !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null;
  }

  if (!showPrompt) {
    return null;
  }

  if (variant === 'floating') {
    return (
      <div
        className={`fixed left-4 right-4 z-30 md:right-4 md:left-auto md:max-w-sm ${className}`}
        style={{
          bottom: 'calc(4rem + env(safe-area-inset-bottom) + 0.5rem)',
        }}
      >
        <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-bitcoin-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-bitcoin-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">Установить приложение</h3>
              <p className="text-xs text-gray-600 mt-0.5 truncate">
                Быстрый доступ к займам
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleInstallClick}
              className="text-xs whitespace-nowrap"
            >
              Установить
            </Button>
            <button
              onClick={() => setShowPrompt(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        onClick={handleInstallClick}
        variant="secondary"
        className={`flex items-center gap-2 ${className}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Установить приложение
      </Button>
    );
  }

  // Banner variant (по умолчанию)
  return (
    <div className={`bg-gradient-to-r from-bitcoin-50 to-bitcoin-100 border border-bitcoin-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-bitcoin-500 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-bitcoin-900">Установите Bitcoin Loan App</h3>
            <p className="text-sm text-bitcoin-700">
              Быстрый доступ, офлайн режим, push-уведомления
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInstallClick}
            size="sm"
            className="bg-bitcoin-500 hover:bg-bitcoin-600 text-white"
          >
            Установить
          </Button>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-bitcoin-600 hover:text-bitcoin-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
