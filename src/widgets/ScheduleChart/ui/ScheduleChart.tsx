/**
 * Виджет визуального графика платежей (динамика погашения)
 * 
 * Отображает графическую визуализацию процесса погашения займа.
 * График показывает три линии:
 * 
 * 1. Остаток долга (оранжевая) - уменьшается с каждым платежом
 * 2. Основной долг (зеленая) - часть платежа, идущая на погашение
 * 3. Проценты (красная) - часть платежа в виде процентов
 * 
 * Особенности аннуитетных платежей видны на графике:
 * - В начале большая часть платежа - это проценты
 * - К концу срока большая часть - основной долг
 * - Остаток долга уменьшается постепенно
 */

'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/shared/ui';
import { formatBTC } from '@/shared/lib/utils/format';
import { PaymentScheduleItem } from '@/shared/lib/utils/calculations';

interface ScheduleChartProps {
  schedule: PaymentScheduleItem[];  // График платежей для визуализации
}

/**
 * Компонент графической визуализации графика платежей
 * 
 * Использует библиотеку Recharts для построения линейного графика,
 * показывающего динамику погашения займа по месяцам.
 */
export const ScheduleChart: React.FC<ScheduleChartProps> = ({ schedule }) => {
  // Преобразуем данные для Recharts
  // Округляем до 8 знаков (точность BTC) для корректного отображения
  const chartData = schedule.map((item) => ({
    month: item.month,
    'Остаток долга': parseFloat(item.remainingBalance.toFixed(8)),
    'Основной долг': parseFloat(item.principal.toFixed(8)),
    'Проценты': parseFloat(item.interest.toFixed(8)),
  }));

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Динамика погашения займа
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          График показывает изменение остатка долга и структуру платежей по месяцам
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            label={{ value: 'Месяц', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: 'BTC', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={(value: number) => formatBTC(value)}
            labelFormatter={(label) => `Месяц ${label}`}
          />
          <Legend />
          {/* Остаток долга - главная линия (Bitcoin оранжевый) */}
          <Line
            type="monotone"
            dataKey="Остаток долга"
            stroke="#f7931a"
            strokeWidth={3}
            dot={{ r: 4, fill: '#f7931a' }}
            activeDot={{ r: 6 }}
          />
          {/* Основной долг - зеленая линия */}
          <Line
            type="monotone"
            dataKey="Основной долг"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3, fill: '#10b981' }}
            activeDot={{ r: 5 }}
          />
          {/* Проценты - красная линия */}
          <Line
            type="monotone"
            dataKey="Проценты"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 3, fill: '#ef4444' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

