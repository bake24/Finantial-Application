/**
 * Компонент уведомления об обновлении PWA
 * 
 * Показывает пользователю баннер, когда доступна новая версия приложения
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../Button/Button';

export const UpdatePrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('serviceWorker' in navigator) ||
      process.env.NODE_ENV !== 'production'
    ) {
      return;
    }

    // Проверка наличия ожидающего Service Worker
    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;

        // Если уже есть ожидающий SW
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setShowPrompt(true);
        }

        // Слушаем событие обновления
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // Новая версия установлена и ждет активации
                setWaitingWorker(newWorker);
                setShowPrompt(true);
              }
            });
          }
        });

        // Слушаем сообщение от SW о готовности обновления
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'UPDATE_AVAILABLE') {
            setShowPrompt(true);
          }
        });
      } catch (error) {
        console.error('Ошибка проверки обновлений:', error);
      }
    };

    checkForUpdates();
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Отправляем сообщение SW для немедленной активации
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });

      // Слушаем событие контроля
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Перезагружаем страницу для применения обновления
        window.location.reload();
      });
    } else {
      // Если нет waiting worker, просто перезагружаем
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-bitcoin-500 overflow-hidden">
        {/* Заголовок с градиентом */}
        <div className="bg-gradient-to-r from-bitcoin-500 to-orange-500 px-4 py-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-white flex-shrink-0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h3 className="text-white font-bold text-lg">
              Доступна новая версия
            </h3>
          </div>
        </div>

        {/* Контент */}
        <div className="p-4">
          <p className="text-gray-700 text-sm mb-4">
            Обновление включает новые функции и улучшения производительности.
            Обновите приложение для лучшего опыта.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={handleUpdate}
              variant="primary"
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Обновить сейчас
            </Button>

            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

