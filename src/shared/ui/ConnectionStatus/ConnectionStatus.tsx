/**
 * Компонент индикатора статуса подключения
 * 
 * Показывает пользователю текущий статус соединения с интернетом
 */

'use client';

import React from 'react';
import { useOnlineStatus } from '@/shared/lib/hooks';

interface ConnectionStatusProps {
  /** Показывать только при офлайн */
  onlyOffline?: boolean;
  /** Компактный режим */
  compact?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  onlyOffline = false,
  compact = false,
}) => {
  const isOnline = useOnlineStatus();

  // Если onlyOffline=true и мы онлайн - не показываем
  if (onlyOffline && isOnline) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
        <span className="text-xs text-gray-600">
          {isOnline ? 'Онлайн' : 'Офлайн'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
        isOnline
          ? 'bg-green-50 border-green-200'
          : 'bg-red-50 border-red-200'
      }`}
    >
      {isOnline ? (
        <svg
          className="w-5 h-5 text-green-600 flex-shrink-0"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-red-600 flex-shrink-0"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
        </svg>
      )}

      <div className="flex-1">
        <p
          className={`text-sm font-medium ${
            isOnline ? 'text-green-900' : 'text-red-900'
          }`}
        >
          {isOnline ? '🟢 Подключено к интернету' : '🔴 Нет подключения'}
        </p>
        {!isOnline && (
          <p className="text-xs text-red-700 mt-1">
            Некоторые функции могут быть недоступны
          </p>
        )}
      </div>
    </div>
  );
};

