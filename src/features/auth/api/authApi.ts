/**
 * API для работы с авторизацией
 */

import { apiClient } from '@/shared/lib/api/client';
import { AuthCredentials, AuthResponse } from '@/entities/user';
import { API_ENDPOINTS } from '@/shared/config/constants';

const TOKEN_KEY = 'btc_loan_auth_token';
const USER_KEY = 'btc_loan_user';

/**
 * Вход в систему
 * Сохраняет JWT токен и данные пользователя в localStorage
 */
export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH, credentials);
  
  // Сохраняем токен и пользователя в localStorage для персистентности сессии
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
  }
  
  return response;
}

/**
 * Выход из системы
 * Очищает токен и данные пользователя
 */
export async function logout(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

/**
 * Получение сохраненного токена
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Получение сохраненных данных пользователя
 */
export function getSavedUser() {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem(USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Проверка наличия активной сессии
 */
export function hasActiveSession(): boolean {
  return !!getToken();
}

