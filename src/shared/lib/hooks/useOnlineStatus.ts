/**
 * Хук для отслеживания статуса подключения к интернету
 * 
 * @returns {boolean} true если онлайн, false если офлайн
 * 
 * @example
 * ```tsx
 * const isOnline = useOnlineStatus();
 * 
 * return (
 *   <div>
 *     {isOnline ? '🟢 Онлайн' : '🔴 Офлайн'}
 *   </div>
 * );
 * ```
 */

import { useState, useEffect } from 'react';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Обработчики для событий online/offline
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Подписка на события
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Отписка при размонтировании
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

