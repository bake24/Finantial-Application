/**
 * Toast уведомления для мобильных устройств
 * Автоматически исчезают через заданное время
 */

'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  children: React.ReactNode;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  isOpen,
  onClose,
  duration = 5000,
  children,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-50 animate-slide-down ${className}`}
      style={{
        top: 'calc(env(safe-area-inset-top) + 1rem)',
      }}
    >
      <div className="bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

interface InstallToastProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
}

export const InstallToast: React.FC<InstallToastProps> = ({
  isOpen,
  onClose,
  onInstall,
}) => {
  return (
    <Toast isOpen={isOpen} onClose={onClose} duration={5000}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-bitcoin-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-bitcoin-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm">Установить приложение?</h3>
            <p className="text-xs text-gray-600 mt-1">
              Быстрый доступ к Bitcoin займам
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={onInstall}
                className="px-4 py-2 bg-bitcoin-500 text-white text-sm font-medium rounded-lg hover:bg-bitcoin-600 active:bg-bitcoin-700 transition-colors"
              >
                Установить
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
              >
                Позже
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Toast>
  );
};

