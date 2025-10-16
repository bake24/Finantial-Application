/**
 * Floating Action Button (FAB)
 * Для главного действия на мобильных устройствах
 */

'use client';

import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-center';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label = 'Новый займ',
  className = '',
  position = 'bottom-right',
}) => {
  const positionClasses = {
    'bottom-right': 'right-4',
    'bottom-center': 'left-1/2 -translate-x-1/2',
  };

  return (
    <button
      onClick={onClick}
      className={`
        fixed z-40 md:hidden
        ${positionClasses[position]}
        flex items-center gap-2
        bg-bitcoin-500 hover:bg-bitcoin-600 active:bg-bitcoin-700
        text-white font-semibold
        px-6 py-4 rounded-full
        shadow-lg hover:shadow-xl
        transition-all duration-200
        transform hover:scale-105 active:scale-95
        ${className}
      `}
      style={{
        bottom: 'calc(4rem + env(safe-area-inset-bottom) + 1rem)',
      }}
    >
      {icon || (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )}
      <span className="text-sm">{label}</span>
    </button>
  );
};

