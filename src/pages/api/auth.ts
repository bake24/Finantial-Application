/**
 * API endpoint для авторизации (mock)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthResponse } from '@/entities/user';

// Mock данные пользователя
const MOCK_USER = {
  id: '1',
  username: 'demo',
  password: 'demo123',
  email: 'demo@example.com',
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AuthResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Простая проверка учетных данных
  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    const response: AuthResponse = {
      user: {
        id: MOCK_USER.id,
        username: MOCK_USER.username,
        email: MOCK_USER.email,
        createdAt: new Date(),
      },
      token: 'mock-jwt-token-' + Date.now(),
    };

    return res.status(200).json(response);
  }

  return res.status(401).json({ error: 'Неверные учетные данные' });
}

