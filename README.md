# Bitcoin Loan App

PWA-приложение для получения и управления займами в Bitcoin.

## 🚀 Быстрый старт

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## 🔑 Вход в систему

**Демо-аккаунт:**
- Логин: `demo`
- Пароль: `demo123`

## 📱 Основные функции

### Авторизация
- **Страница:** `/login`
- Вход без регистрации
- Сохранение сессии (JWT в localStorage)

### Оформление займа
- **Страница:** `/loan`
- Сумма: до 1 BTC
- Срок: до 24 месяцев
- Автоматический расчет платежей

### Личный кабинет
- **Страница:** `/dashboard`
- Информация о займе
- График платежей с визуализацией
- Текущий курс BTC (CoinGecko API)
- Досрочное/частичное погашение

### История платежей
- **Страница:** `/history`
- Все завершенные платежи
- Детальная информация по каждому платежу

### Профиль
- **Страница:** `/profile`
- Информация о пользователе
- Настройки аккаунта

## 🛠 Технологии

- **Frontend:** Next.js 14, React, TypeScript
- **Стилизация:** Tailwind CSS
- **Состояние:** Zustand
- **Графики:** Recharts
- **PWA:** next-pwa, Service Worker
- **API:** CoinGecko (курс BTC)

## 📦 Структура проекта

```
src/
├── pages/          # Next.js страницы и API routes
├── features/       # Функциональные модули (auth, loan, repayment)
├── entities/       # Бизнес-сущности (user, loan, payment)
├── widgets/        # Сложные UI-блоки (Dashboard, LoanDetails)
└── shared/         # Общие компоненты, утилиты, хуки
```

## 🌐 PWA Установка

### Android
1. Откройте приложение в Chrome
2. Нажмите ☰ (бургер-меню) → "Установить приложение"
3. Или через меню браузера: ⋮ → "Установить приложение"

### iOS
1. Откройте приложение в Safari
2. Нажмите Поделиться (📤)
3. Выберите "На экран Домой"

**⚠️ Важно:** PWA работает только на HTTPS (deployed версия)

## 🚀 Деплой

```bash
# Production build
npm run build

# Деплой на Vercel
vercel
```

## 📄 API Routes

- `POST /api/auth` - Авторизация
- `GET /api/loans` - Список займов
- `POST /api/loans` - Создать займ
- `POST /api/repayment` - Погашение займа

## 🔧 Команды

```bash
npm run dev          # Запуск dev сервера
npm run build        # Production сборка
npm run start        # Запуск production
npm run lint         # ESLint проверка
```

## 📱 Адаптивность

- Мобильная навигация (bottom bar)
- Бургер-меню с установкой PWA
- Responsive дизайн для всех экранов
- Минимальная ширина: 320px

---

**Deployed:** https://crypto-application.vercel.app
