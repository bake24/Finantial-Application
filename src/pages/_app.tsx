/**
 * Корневой компонент приложения Next.js
 * 
 * Отвечает за:
 * - Восстановление пользовательской сессии
 * - Регистрацию Service Worker для PWA
 * - Глобальные мета-теги
 */

import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useUserStore } from '@/entities/user';
import { getSavedUser } from '@/features/auth';
import { UpdatePrompt } from '@/shared/ui';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const setUser = useUserStore((state) => state.setUser);

  // Восстановление сессии при загрузке приложения
  useEffect(() => {
    const savedUser = getSavedUser();
    if (savedUser) {
      // Восстанавливаем данные пользователя из localStorage
      setUser(savedUser);
    }
  }, [setUser]);

  // Регистрация Service Worker для PWA
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('✅ Service Worker зарегистрирован:', registration);

            // Обработка обновлений Service Worker
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (
                    newWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    // Новая версия доступна
                    console.log('🔄 Доступна новая версия приложения');
                    // Можно показать пользователю уведомление об обновлении
                    // if (confirm('Доступна новая версия. Обновить?')) {
                    //   window.location.reload();
                    // }
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('❌ Ошибка регистрации Service Worker:', error);
          });
      });
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f7931a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>
      <Component {...pageProps} />
      
      {/* Уведомление об обновлении PWA */}
      <UpdatePrompt />
    </>
  );
}

