/**
 * Компонент отображения текущей цены Bitcoin
 */

'use client';

import React, { useEffect, useState } from 'react';
import { getBTCPrice, BTCPrice as BTCPriceType } from '@/shared/lib/api/cryptoApi';

interface BTCPriceProps {
  showChange?: boolean;
  compact?: boolean;
  className?: string;
}

export const BTCPrice: React.FC<BTCPriceProps> = ({
  showChange = true,
  compact = false,
  className = '',
}) => {
  const [price, setPrice] = useState<BTCPriceType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      const data = await getBTCPrice();
      setPrice(data);
      setLoading(false);
    };

    fetchPrice();

    // Обновлять каждые 60 секунд
    const interval = setInterval(fetchPrice, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !price) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
    );
  }

  const isPositive = price.usd_24h_change >= 0;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm font-medium text-gray-900">
          ${price.usd.toLocaleString()}
        </span>
        {showChange && (
          <span
            className={`text-xs font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? '+' : ''}
            {price.usd_24h_change.toFixed(2)}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Bitcoin (BTC)</p>
          <p className="text-2xl font-bold text-gray-900">
            ${price.usd.toLocaleString()}
          </p>
        </div>
        {showChange && (
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isPositive
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {isPositive ? '↗' : '↘'} {isPositive ? '+' : ''}
            {price.usd_24h_change.toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
};

