/**
 * Хук для установки PWA
 * Предоставляет общую функцию для установки приложения
 */

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Проверка, установлено ли приложение
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandaloneMode || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Обработчик beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Обработчик установки
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    console.log('[PWA Install] Попытка установки');
    
    if (deferredPrompt) {
      // Android Chrome с событием beforeinstallprompt
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA Install] Выбор пользователя:', outcome);
        setDeferredPrompt(null);
      } catch (error) {
        console.error('[PWA Install] Ошибка:', error);
      }
    } else {
      // Показываем инструкцию
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isIOS) {
        alert('Для установки на iOS:\n\n1. Нажмите кнопку "Поделиться" (📤) внизу экрана\n2. Прокрутите вниз и выберите "На экран Домой"\n3. Нажмите "Добавить"');
      } else if (isAndroid) {
        alert('Для установки приложения:\n\n1. Нажмите ⋮ (три точки) в правом верхнем углу\n2. Выберите "Установить приложение" или "Добавить на главный экран"\n3. Подтвердите установку');
      } else {
        alert('Для установки используйте меню браузера:\n\nНажмите ⋮ (три точки) → "Установить приложение"');
      }
    }
  };

  return {
    handleInstall,
    isInstalled,
    canInstall: !isInstalled,
  };
};

