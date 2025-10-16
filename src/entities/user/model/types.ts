/**
 * Типы для сущности пользователя
 */

export interface User {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

