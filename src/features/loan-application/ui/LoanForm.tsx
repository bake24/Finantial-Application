/**
 * Форма заявки на займ
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Card } from '@/shared/ui';
import { APP_CONFIG } from '@/shared/config/constants';
import {
  validateLoanAmount,
  validateLoanTerm,
} from '@/shared/lib/utils/validation';
import {
  calculateMonthlyPayment,
  calculateTotalPayment,
} from '@/shared/lib/utils/calculations';
import { formatBTC } from '@/shared/lib/utils/format';
import { createLoan } from '../api/loanApi';
import { useLoanStore } from '@/entities/loan';

export const LoanForm: React.FC = () => {
  const router = useRouter();
  const addLoan = useLoanStore((state) => state.addLoan);

  // Состояние формы
  const [amount, setAmount] = useState<string>('');
  const [term, setTerm] = useState<string>('12');
  const [errors, setErrors] = useState<{ amount?: string; term?: string }>({});
  const [loading, setLoading] = useState(false);

  // Преобразование строковых значений в числа
  const amountNum = parseFloat(amount);
  const termNum = parseInt(term, 10);
  
  // Проверка валидности данных для включения кнопки отправки
  const isValid =
    !isNaN(amountNum) &&
    !isNaN(termNum) &&
    validateLoanAmount(amountNum).isValid &&
    validateLoanTerm(termNum).isValid;

  // Динамический расчет ежемесячного платежа при изменении полей
  const monthlyPayment = isValid
    ? calculateMonthlyPayment(amountNum, termNum)
    : 0;
  const totalPayment = isValid ? calculateTotalPayment(amountNum, termNum) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Валидация введенных данных
    const amountValidation = validateLoanAmount(amountNum);
    const termValidation = validateLoanTerm(termNum);

    // Проверка всех ограничений:
    // - Сумма > 0 и <= 1 BTC
    // - Срок >= 1 и <= 24 месяцев
    if (!amountValidation.isValid || !termValidation.isValid) {
      setErrors({
        amount: amountValidation.error,
        term: termValidation.error,
      });
      return;
    }

    setLoading(true);

    try {
      // Отправка заявки на сервер
      const response = await createLoan({
        amount: amountNum,
        term: termNum,
      });
      
      // Добавление займа в глобальное состояние
      addLoan(response.loan);
      
      // Перенаправление на страницу деталей займа
      router.push(`/loan/${response.loan.id}`);
    } catch (err: any) {
      // Отображение ошибки при неудачном создании займа
      setErrors({ amount: err.message || 'Ошибка создания займа' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Заявка на займ</h2>
        <p className="mt-2 text-sm text-gray-600">
          Заполните форму для оформления займа в Bitcoin
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Поле ввода суммы займа с точностью до сатоши (8 знаков после запятой) */}
        <Input
          label="Сумма займа (BTC)"
          type="number"
          step="0.00000001"
          min={APP_CONFIG.MIN_LOAN_BTC}
          max={APP_CONFIG.MAX_LOAN_BTC}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Например: 0.5"
          error={errors.amount}
          helperText={`Введите сумму от ${APP_CONFIG.MIN_LOAN_BTC} до ${APP_CONFIG.MAX_LOAN_BTC} BTC`}
          disabled={loading}
          required
        />

        {/* Слайдер для выбора срока займа (1-24 месяцев) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Срок займа: <span className="font-bold text-bitcoin-600">{term}</span> мес.
          </label>
          <input
            type="range"
            min={APP_CONFIG.MIN_LOAN_MONTHS}
            max={APP_CONFIG.MAX_LOAN_MONTHS}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-bitcoin-500"
            disabled={loading}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{APP_CONFIG.MIN_LOAN_MONTHS} мес.</span>
            <span>{APP_CONFIG.MAX_LOAN_MONTHS} мес.</span>
          </div>
          {errors.term && (
            <p className="mt-1 text-sm text-red-600">{errors.term}</p>
          )}
        </div>

        {/* Динамический расчет параметров займа при изменении полей */}
        {isValid && (
          <div className="bg-gradient-to-br from-bitcoin-50 to-orange-50 p-5 rounded-lg border border-bitcoin-200 space-y-3">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-bitcoin-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="font-bold text-gray-900">Расчет параметров займа</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-gray-600 text-xs mb-1">Ежемесячный платеж:</p>
                <p className="font-bold text-lg text-bitcoin-600">
                  {formatBTC(monthlyPayment)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-gray-600 text-xs mb-1">Общая сумма выплат:</p>
                <p className="font-bold text-lg text-gray-900">
                  {formatBTC(totalPayment)}
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-gray-600 text-xs mb-1">Процентная ставка:</p>
                <p className="font-bold text-gray-900">
                  {(APP_CONFIG.INTEREST_RATE * 100).toFixed(1)}% годовых
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-gray-600 text-xs mb-1">Переплата:</p>
                <p className="font-bold text-gray-900">
                  {formatBTC(totalPayment - amountNum)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              💡 Расчет обновляется автоматически при изменении суммы или срока
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => router.back()}
            disabled={loading}
          >
            Назад
          </Button>
          <Button type="submit" fullWidth loading={loading} disabled={!isValid}>
            Оформить займ
          </Button>
        </div>
      </form>
    </Card>
  );
};

