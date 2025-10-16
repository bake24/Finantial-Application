/**
 * Компонент с инструкциями по установке PWA для iOS Safari
 */

'use client';

import React, { useState } from 'react';
import { Button, Modal } from '../';

interface InstallInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallInstructions: React.FC<InstallInstructionsProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Откройте меню Safari',
      description: 'Нажмите на кнопку "Поделиться" в нижней части экрана',
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      ),
    },
    {
      title: 'Найдите "На экран Домой"',
      description: 'Прокрутите вниз и найдите опцию "На экран Домой"',
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
    },
    {
      title: 'Добавьте на главный экран',
      description: 'Нажмите "Добавить" в правом верхнем углу',
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      title: 'Готово!',
      description: 'Приложение установлено и готово к использованию',
      icon: (
        <svg className="w-8 h-8 text-bitcoin-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Установка приложения" size="lg">
      <div className="space-y-6">
        {/* Прогресс */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Шаг {currentStep + 1} из {steps.length}
          </span>
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentStep ? 'bg-bitcoin-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Текущий шаг */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {currentStepData.icon}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600">
            {currentStepData.description}
          </p>
        </div>

        {/* Скриншот для iOS */}
        {currentStep === 0 && (
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 mb-2">
              Ищите эту кнопку внизу экрана:
            </div>
            <div className="inline-flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Поделиться
            </div>
          </div>
        )}

        {/* Кнопки навигации */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Назад
          </Button>
          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? 'Закрыть' : 'Далее'}
          </Button>
        </div>

        {/* Дополнительная информация */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-blue-900 text-sm">После установки:</h4>
              <ul className="text-xs text-blue-800 mt-1 space-y-1">
                <li>• Приложение появится на главном экране</li>
                <li>• Будет работать в полноэкранном режиме</li>
                <li>• Доступно офлайн после первого посещения</li>
                <li>• Поддерживает push-уведомления</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
