# Архитектура приложения

## 📋 Обзор

Bitcoin Loan App построен на основе архитектуры **Feature-Sliced Design (FSD)** с адаптацией под специфику Next.js. Приоритет отдан плану проекта, где это необходимо.

## 🏗️ Структура слоев

### 1. App Layer (Инициализация)

**Расположение**: `src/pages/_app.tsx`, `src/pages/_document.tsx`

**Назначение**: Глобальная инициализация приложения, провайдеры, настройка метатегов.

```typescript
// _app.tsx - корневой компонент
// _document.tsx - настройка HTML документа
```

### 2. Pages Layer (Страницы)

**Расположение**: `src/pages/`

**Назначение**: Next.js страницы (маршруты) и API endpoints.

#### Страницы:
- `/` → `index.tsx` - Главная (редирект)
- `/login` → `login.tsx` - Авторизация
- `/loan` → `loan.tsx` - Оформление займа
- `/dashboard` → `dashboard.tsx` - Личный кабинет
- `/_offline` → `_offline.tsx` - Офлайн-страница

#### API Routes:
- `/api/auth` → Mock авторизации
- `/api/loans` → Mock создания займа
- `/api/repayment` → Mock погашения

### 3. Widgets Layer (Виджеты)

**Расположение**: `src/widgets/`

**Назначение**: Крупные самостоятельные блоки интерфейса, композиция нескольких features.

```
widgets/
├── Dashboard/           # Полная панель пользователя
│   └── ui/
│       └── Dashboard.tsx
├── PaymentSchedule/     # Таблица графика платежей
│   └── ui/
│       └── PaymentSchedule.tsx
├── ScheduleChart/       # Визуальный график
│   └── ui/
│       └── ScheduleChart.tsx
└── OfflineFallback/     # Офлайн-страница
    └── ui/
        └── OfflineFallback.tsx
```

**Правила слоя Widgets:**
- Может использовать: features, entities, shared
- Не может использовать: другие widgets, pages

### 4. Features Layer (Фичи)

**Расположение**: `src/features/`

**Назначение**: Бизнес-функциональность приложения.

```
features/
├── auth/                # Авторизация
│   ├── ui/
│   │   └── LoginForm.tsx
│   ├── api/
│   │   └── authApi.ts
│   └── index.ts
├── loan-application/    # Оформление займа
│   ├── ui/
│   │   └── LoanForm.tsx
│   ├── api/
│   │   └── loanApi.ts
│   └── index.ts
└── repayment/          # Досрочное погашение
    ├── ui/
    │   └── RepaymentModal.tsx
    ├── api/
    │   └── repaymentApi.ts
    └── index.ts
```

**Правила слоя Features:**
- Может использовать: entities, shared
- Не может использовать: features, widgets, pages

### 5. Entities Layer (Сущности)

**Расположение**: `src/entities/`

**Назначение**: Бизнес-сущности приложения с их состоянием и типами.

```
entities/
├── user/               # Пользователь
│   ├── model/
│   │   ├── types.ts    # Типы пользователя
│   │   └── store.ts    # Zustand хранилище
│   └── index.ts
├── loan/               # Займ
│   ├── model/
│   │   ├── types.ts
│   │   └── store.ts
│   └── index.ts
└── payment/            # Платеж
    ├── model/
    │   └── types.ts
    └── index.ts
```

**Правила слоя Entities:**
- Может использовать: shared
- Не может использовать: features, widgets, pages

### 6. Shared Layer (Общий код)

**Расположение**: `src/shared/`

**Назначение**: Переиспользуемый код без привязки к бизнес-логике.

```
shared/
├── ui/                 # UI компоненты
│   ├── Button/
│   ├── Input/
│   ├── Card/
│   ├── Modal/
│   └── index.ts
├── lib/
│   ├── utils/          # Утилиты
│   │   ├── format.ts       # Форматирование
│   │   ├── calculations.ts # Расчеты
│   │   └── validation.ts   # Валидация
│   └── api/
│       └── client.ts   # API клиент
└── config/
    └── constants.ts    # Константы приложения
```

**Правила слоя Shared:**
- Не может использовать ничего, кроме других shared модулей
- Полностью переиспользуемый код

## 📊 Диаграмма зависимостей

```
┌─────────────────────────────────────────┐
│            Pages Layer                   │
│  (Next.js routes + API endpoints)       │
└───────────────┬─────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────┐
│          Widgets Layer                   │
│  (Dashboard, Charts, Tables)            │
└───────────────┬─────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────┐
│         Features Layer                   │
│  (Auth, LoanApp, Repayment)             │
└───────────────┬─────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────┐
│         Entities Layer                   │
│  (User, Loan, Payment)                  │
└───────────────┬─────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────┐
│          Shared Layer                    │
│  (UI, Utils, API, Config)               │
└─────────────────────────────────────────┘
```

## 🔄 Потоки данных

### 1. Авторизация

```
LoginPage → LoginForm (feature) → authApi → useUserStore (entity) → redirect to Dashboard
```

### 2. Оформление займа

```
LoanPage → LoanForm (feature) → loanApi → useLoanStore (entity) → redirect to Dashboard
```

### 3. Просмотр займа

```
DashboardPage → Dashboard (widget) → PaymentSchedule + ScheduleChart (widgets)
                                   ↓
                         useLoanStore (entity)
```

### 4. Досрочное погашение

```
Dashboard → RepaymentModal (feature) → repaymentApi → update useLoanStore → re-render Dashboard
```

## 🎯 Принципы организации

### Public API

Каждый модуль экспортирует свой Public API через `index.ts`:

```typescript
// entities/user/index.ts
export { useUserStore } from './model/store';
export type { User, AuthCredentials } from './model/types';
```

### Именование файлов

- **Компоненты**: PascalCase (`LoginForm.tsx`)
- **Утилиты**: camelCase (`validation.ts`)
- **Типы**: camelCase (`types.ts`)
- **API**: camelCase + суффикс Api (`authApi.ts`)

### Импорты

Используйте alias-импорты:

```typescript
import { Button } from '@/shared/ui';
import { useUserStore } from '@/entities/user';
import { LoginForm } from '@/features/auth';
```

## 📦 State Management

### Zustand stores

- `useUserStore` - состояние пользователя
- `useLoanStore` - состояние займа

Stores находятся в слое Entities и управляют состоянием бизнес-сущностей.

## 🔌 API Integration

### Mock API

Текущая версия использует Next.js API Routes с mock-данными:

- `pages/api/auth.ts` - Mock авторизация
- `pages/api/loans.ts` - Mock создание займа  
- `pages/api/repayment.ts` - Mock погашение

### Real API Integration

Для интеграции с реальным API:

1. Обновите `API_ENDPOINTS` в `shared/config/constants.ts`
2. Настройте `apiClient` в `shared/lib/api/client.ts`
3. Добавьте обработку токенов и ошибок
4. Реализуйте middleware для защиты маршрутов

## 🎨 Styling

- **Tailwind CSS** для утилитарных классов
- Глобальные стили в `src/styles/globals.css`
- Кастомная цветовая палитра Bitcoin в `tailwind.config.js`

## 📱 PWA

- Service Worker генерируется next-pwa
- Манифест в `public/manifest.json`
- Офлайн fallback на `/_offline`
- Кеширование статических ресурсов

## 🧪 Testing Strategy

### Рекомендуемая структура тестов:

```
src/
├── shared/
│   └── ui/
│       └── Button/
│           ├── Button.tsx
│           └── Button.test.tsx
├── features/
│   └── auth/
│       └── ui/
│           ├── LoginForm.tsx
│           └── LoginForm.test.tsx
└── ...
```

### Типы тестов:

1. **Unit tests**: shared/ui компоненты, утилиты
2. **Integration tests**: features, widgets
3. **E2E tests**: полные пользовательские сценарии

## 🚀 Deployment

### Рекомендации:

1. **Vercel** - оптимален для Next.js
2. **Environment variables** - настройте для production
3. **PWA assets** - убедитесь, что иконки загружены
4. **API** - замените mock endpoints на реальные

## 📝 Расширение приложения

### Добавление новой фичи:

1. Создайте директорию в `features/`
2. Добавьте UI компоненты в `ui/`
3. Добавьте API методы в `api/`
4. Экспортируйте через `index.ts`
5. Используйте в widgets или pages

### Добавление новой сущности:

1. Создайте директорию в `entities/`
2. Определите типы в `model/types.ts`
3. Создайте store в `model/store.ts` (если нужно)
4. Экспортируйте через `index.ts`

### Добавление UI компонента:

1. Создайте директорию в `shared/ui/`
2. Реализуйте компонент с TypeScript типами
3. Добавьте в `shared/ui/index.ts`
4. Используйте в любом слое

## 🔒 Безопасность

⚠️ **Важно**: Текущая версия - демонстрационная!

В production необходимо:
- JWT токены с refresh mechanism
- HTTPS
- CSRF защита
- Rate limiting
- Input sanitization
- Серверная валидация

## 📚 Дополнительные ресурсы

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)

