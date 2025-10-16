/**
 * Виджет графика платежей (табличное представление)
 * 
 * Отображает детальный список всех платежей по займу в виде таблицы.
 * Каждая строка содержит информацию об одном платеже:
 * - Номер месяца
 * - Дата платежа
 * - Общая сумма платежа
 * - Разбивка на основной долг и проценты
 * - Остаток задолженности после платежа
 * 
 * Таблица визуально выделяет:
 * - ✓ Оплаченные месяцы (зеленый фон)
 * - → Текущий месяц (оранжевый фон)
 * - Предстоящие платежи (белый фон)
 */

'use client';

import React from 'react';
import { Card } from '@/shared/ui';
import { formatBTC, formatDateShort } from '@/shared/lib/utils/format';
import { PaymentScheduleItem } from '@/shared/lib/utils/calculations';

interface PaymentScheduleProps {
  schedule: PaymentScheduleItem[];      // График платежей для отображения
  currentMonth?: number;                 // Текущий месяц платежа (для подсветки)
}

/**
 * Компонент таблицы графика платежей
 * 
 * Формирует табличное представление всех платежей с детализацией
 * по каждому месяцу. Автоматически рассчитывается при создании займа.
 */
export const PaymentSchedule: React.FC<PaymentScheduleProps> = ({
  schedule,
  currentMonth = 0,
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">График платежей</h3>
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-gray-600">Оплачено</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-bitcoin-50 border border-bitcoin-200 rounded"></div>
            <span className="text-gray-600">Текущий</span>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Месяц
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Платеж
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Основной долг
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Проценты
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Остаток
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schedule.map((item) => {
              // Определяем статус платежа для визуального выделения
              const isPaid = item.month < currentMonth;        // Уже оплачен
              const isCurrent = item.month === currentMonth;   // Текущий платеж
              
              return (
                <tr
                  key={item.month}
                  className={`
                    transition-colors duration-150
                    ${isPaid ? 'bg-green-50 hover:bg-green-100' : ''}
                    ${isCurrent ? 'bg-bitcoin-50 hover:bg-bitcoin-100 font-semibold' : ''}
                    ${!isPaid && !isCurrent ? 'hover:bg-gray-50' : ''}
                  `}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.month}
                    {isPaid && ' ✓'}
                    {isCurrent && ' →'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDateShort(item.date)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 font-semibold">
                    {formatBTC(item.payment)}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">
                    {formatBTC(item.principal)}
                  </td>
                  <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-sm text-right text-gray-600">
                    {formatBTC(item.interest)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    {formatBTC(item.remainingBalance)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    {isPaid && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Оплачен
                      </span>
                    )}
                    {isCurrent && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bitcoin-100 text-bitcoin-800">
                        → Текущий
                      </span>
                    )}
                    {!isPaid && !isCurrent && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        ⏳ Ожидается
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Мобильное примечание */}
      <div className="md:hidden mt-4 px-2">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          На мобильном скрыты колонки "Основной долг" и "Проценты". Для полной таблицы используйте планшет или ПК.
        </p>
      </div>
    </Card>
  );
};

