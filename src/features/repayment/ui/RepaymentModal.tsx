/**
 * Модальное окно досрочного погашения
 * 
 * Позволяет пользователю:
 * 1. Частично погасить займ (любая сумма до остатка долга)
 * 2. Полностью закрыть займ (кнопка "Погасить полностью")
 * 
 * После погашения:
 * - Обновляется остаток долга
 * - Пересчитывается график платежей
 * - Может сократиться срок или уменьшиться ежемесячный платеж
 * - Dashboard автоматически обновляется
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Button, Input, Modal } from '@/shared/ui';
import { validateRepaymentAmount } from '@/shared/lib/utils/validation';
import { formatBTC } from '@/shared/lib/utils/format';
import { makeRepayment } from '../api/repaymentApi';

interface RepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  remainingBalance: number;      // Текущий остаток долга
  onSuccess: () => void;          // Callback после успешного погашения
}

/**
 * Компонент модального окна для досрочного погашения займа
 * 
 * Функциональность:
 * - Ввод суммы погашения с валидацией
 * - Быстрое заполнение полной суммы
 * - Предпросмотр эффекта погашения
 * - Предупреждения о превышении лимита
 */
export const RepaymentModal: React.FC<RepaymentModalProps> = ({
  isOpen,
  onClose,
  loanId,
  remainingBalance,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Парсим введенную сумму
  const amountNum = parseFloat(amount) || 0;
  
  // Определяем тип погашения
  const repaymentType = amountNum >= remainingBalance ? 'full' : 'partial';
  const isFullRepayment = repaymentType === 'full';
  
  // Рассчитываем новый остаток после погашения
  const newBalance = useMemo(() => {
    if (!amountNum || amountNum <= 0) return remainingBalance;
    return Math.max(0, remainingBalance - amountNum);
  }, [amountNum, remainingBalance]);

  /**
   * Заполнение поля полной суммой долга
   * Удобная функция для полного закрытия займа одной кнопкой
   */
  const handleFullRepayment = () => {
    setAmount(remainingBalance.toFixed(8));
    setError(''); // Очищаем ошибки
  };

  /**
   * Обработка отправки формы погашения
   * 
   * Процесс:
   * 1. Валидация введенной суммы
   * 2. Отправка запроса на сервер
   * 3. Обновление данных займа
   * 4. Пересчет графика платежей
   * 5. Закрытие модального окна
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация: сумма должна быть > 0 и <= остатку долга
    const validation = validateRepaymentAmount(amountNum, remainingBalance);

    if (!validation.isValid) {
      setError(validation.error || 'Ошибка валидации');
      return;
    }

    setLoading(true);

    try {
      // Отправка запроса на досрочное погашение
      const response = await makeRepayment({
        loanId,
        amount: amountNum,
        type: repaymentType,
      });

      if (response.success) {
        // Вызываем callback для обновления данных займа в Dashboard
        // Это приведет к пересчету графика платежей
        onSuccess();
        
        // Закрываем модалку и очищаем поле
        onClose();
        setAmount('');
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка погашения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Досрочное погашение"
      size="md"
    >
      <div className="space-y-4">
        {/* Текущий остаток долга */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Текущий остаток долга:</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatBTC(remainingBalance)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Максимальная сумма</p>
              <p className="text-xs text-gray-500">для погашения</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Поле ввода суммы погашения */}
          <Input
            label="Сумма погашения (BTC)"
            type="number"
            step="0.00000001"
            min="0.00000001"
            max={remainingBalance}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Например: 0.1"
            error={error}
            helperText={`Введите сумму от 0.00000001 до ${formatBTC(remainingBalance)}`}
            disabled={loading}
            required
          />

          {/* Предпросмотр эффекта погашения */}
          {amountNum > 0 && !error && (
            <div className={`p-4 rounded-lg border-2 ${
              isFullRepayment 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {isFullRepayment ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm mb-2 ${
                    isFullRepayment ? 'text-green-900' : 'text-blue-900'
                  }`}>
                    {isFullRepayment ? '✓ Полное погашение' : '→ Частичное погашение'}
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className={isFullRepayment ? 'text-green-700' : 'text-blue-700'}>
                        Сумма погашения:
                      </span>
                      <span className={`font-semibold ${isFullRepayment ? 'text-green-900' : 'text-blue-900'}`}>
                        {formatBTC(amountNum)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isFullRepayment ? 'text-green-700' : 'text-blue-700'}>
                        Новый остаток:
                      </span>
                      <span className={`font-semibold ${isFullRepayment ? 'text-green-900' : 'text-blue-900'}`}>
                        {formatBTC(newBalance)}
                      </span>
                    </div>
                  </div>
                  {isFullRepayment ? (
                    <p className="mt-2 text-xs text-green-700">
                      🎉 Займ будет полностью закрыт
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-blue-700">
                      📊 График платежей будет пересчитан с новым остатком долга
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Кнопка быстрого заполнения полной суммы */}
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleFullRepayment}
            disabled={loading}
          >
            💰 Погасить полностью ({formatBTC(remainingBalance)})
          </Button>

          {/* Информационное сообщение */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>ℹ️ Важно:</strong> После досрочного погашения график платежей будет 
              автоматически пересчитан. В зависимости от суммы погашения может измениться 
              срок займа или размер оставшихся платежей.
            </p>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={onClose}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              fullWidth 
              loading={loading}
              disabled={!amountNum || amountNum <= 0}
            >
              {isFullRepayment ? 'Закрыть займ' : 'Погасить частично'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

