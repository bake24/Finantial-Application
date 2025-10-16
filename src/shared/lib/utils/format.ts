/**
 * Утилиты для форматирования данных
 */

/**
 * Форматирование BTC суммы
 */
export function formatBTC(amount: number): string {
  return `${amount.toFixed(8)} BTC`;
}

/**
 * Форматирование даты
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Форматирование даты (короткий формат)
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Форматирование числа с разделителями тысяч
 */
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toLocaleString('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

