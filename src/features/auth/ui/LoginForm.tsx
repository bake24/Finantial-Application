/**
 * Форма авторизации
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Input, Card } from '@/shared/ui';
import { validateLoginData } from '@/shared/lib/utils/validation';
import { useUserStore } from '@/entities/user';
import { login } from '../api/authApi';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация на стороне клиента
    const validation = validateLoginData(username, password);
    if (!validation.isValid) {
      setError(validation.error || 'Ошибка валидации');
      return;
    }

    setLoading(true);

    try {
      // Отправка учетных данных на сервер
      const response = await login({ username, password });
      
      // Сохранение пользователя в глобальном состоянии
      setUser(response.user);
      
      // Перенаправление в личный кабинет после успешной авторизации
      router.push('/dashboard');
    } catch (err: any) {
      // Отображение ошибки авторизации
      setError(err.message || 'Неверные учетные данные');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Вход в систему</h2>
        <p className="mt-2 text-sm text-gray-600">
          Введите свои учетные данные для входа
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Имя пользователя"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Введите имя пользователя"
          disabled={loading}
          required
        />

        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          disabled={loading}
          required
        />

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Войти
        </Button>
      </form>
    </Card>
  );
};

