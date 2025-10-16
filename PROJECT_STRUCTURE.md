# Структура проекта

Полная структура файлов и папок Bitcoin Loan App.

```
bitcoinApp/
├── .cursor/                          # Cursor IDE настройки
│   └── rules/
│       └── bitcoin-rules.mdc
├── .next/                            # Next.js build (генерируется)
├── node_modules/                     # Зависимости (генерируется)
├── public/                           # Статические файлы
│   ├── icons/                        # Иконки PWA
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   ├── manifest.json                 # PWA манифест
│   ├── robots.txt                    # Правила для поисковых роботов
│   └── favicon.ico                   # Favicon сайта
├── src/                              # Исходный код приложения
│   ├── entities/                     # [FSD] Бизнес-сущности
│   │   ├── loan/                     # Сущность займа
│   │   │   ├── model/
│   │   │   │   ├── types.ts          # TypeScript типы
│   │   │   │   └── store.ts          # Zustand store
│   │   │   └── index.ts              # Public API
│   │   ├── payment/                  # Сущность платежа
│   │   │   ├── model/
│   │   │   │   └── types.ts
│   │   │   └── index.ts
│   │   └── user/                     # Сущность пользователя
│   │       ├── model/
│   │       │   ├── types.ts
│   │       │   └── store.ts
│   │       └── index.ts
│   ├── features/                     # [FSD] Бизнес-функции
│   │   ├── auth/                     # Авторизация
│   │   │   ├── api/
│   │   │   │   └── authApi.ts        # API методы
│   │   │   ├── ui/
│   │   │   │   └── LoginForm.tsx     # Форма входа
│   │   │   └── index.ts
│   │   ├── loan-application/         # Оформление займа
│   │   │   ├── api/
│   │   │   │   └── loanApi.ts
│   │   │   ├── ui/
│   │   │   │   └── LoanForm.tsx      # Форма займа
│   │   │   └── index.ts
│   │   └── repayment/                # Досрочное погашение
│   │       ├── api/
│   │       │   └── repaymentApi.ts
│   │       ├── ui/
│   │       │   └── RepaymentModal.tsx # Модалка погашения
│   │       └── index.ts
│   ├── pages/                        # [Next.js] Страницы и маршруты
│   │   ├── api/                      # API Routes
│   │   │   ├── auth.ts               # Endpoint авторизации
│   │   │   ├── loans.ts              # Endpoint займов
│   │   │   └── repayment.ts          # Endpoint погашения
│   │   ├── _app.tsx                  # Корневой компонент App
│   │   ├── _document.tsx             # HTML Document
│   │   ├── _offline.tsx              # Офлайн-страница (PWA)
│   │   ├── dashboard.tsx             # Личный кабинет
│   │   ├── index.tsx                 # Главная страница
│   │   ├── loan.tsx                  # Оформление займа
│   │   └── login.tsx                 # Авторизация
│   ├── shared/                       # [FSD] Общий переиспользуемый код
│   │   ├── config/                   # Конфигурация
│   │   │   └── constants.ts          # Константы приложения
│   │   ├── lib/                      # Библиотеки и утилиты
│   │   │   ├── api/
│   │   │   │   └── client.ts         # HTTP клиент
│   │   │   ├── hooks/                # React хуки
│   │   │   │   ├── useAuth.ts        # Хук авторизации
│   │   │   │   ├── useMediaQuery.ts  # Хук media queries
│   │   │   │   └── index.ts
│   │   │   └── utils/                # Утилитарные функции
│   │   │       ├── calculations.ts   # Расчёты
│   │   │       ├── format.ts         # Форматирование
│   │   │       ├── validation.ts     # Валидация
│   │   │       └── index.ts
│   │   └── ui/                       # UI компоненты
│   │       ├── Button/
│   │       │   └── Button.tsx        # Кнопка
│   │       ├── Card/
│   │       │   └── Card.tsx          # Карточка
│   │       ├── Input/
│   │       │   └── Input.tsx         # Поле ввода
│   │       ├── Modal/
│   │       │   └── Modal.tsx         # Модальное окно
│   │       └── index.ts              # Public API
│   ├── styles/                       # Глобальные стили
│   │   └── globals.css               # Tailwind + кастомные стили
│   └── widgets/                      # [FSD] Крупные блоки UI
│       ├── Dashboard/                # Панель пользователя
│       │   ├── ui/
│       │   │   └── Dashboard.tsx
│       │   └── index.ts
│       ├── OfflineFallback/          # Офлайн-компонент
│       │   ├── ui/
│       │   │   └── OfflineFallback.tsx
│       │   └── index.ts
│       ├── PaymentSchedule/          # График платежей (таблица)
│       │   ├── ui/
│       │   │   └── PaymentSchedule.tsx
│       │   └── index.ts
│       └── ScheduleChart/            # График платежей (график)
│           ├── ui/
│           │   └── ScheduleChart.tsx
│           └── index.ts
├── .editorconfig                     # EditorConfig настройки
├── .eslintrc.json                    # ESLint конфигурация
├── .gitignore                        # Git ignore правила
├── .prettierrc.json                  # Prettier конфигурация
├── ARCHITECTURE.md                   # Документация архитектуры
├── CHANGELOG.md                      # История изменений
├── CONTRIBUTING.md                   # Руководство для контрибьюторов
├── FEATURES.md                       # Детальное описание функций
├── LICENSE                           # MIT лицензия
├── USER_GUIDE.md                     # Руководство пользователя
├── next.config.js                    # Next.js конфигурация
├── package.json                      # NPM зависимости
├── package-lock.json                 # Lockfile (генерируется)
├── postcss.config.js                 # PostCSS конфигурация
├── PROJECT_STRUCTURE.md              # Этот файл
├── README.md                         # Основная документация
├── SETUP.md                          # Инструкция по установке
├── tailwind.config.js                # Tailwind CSS конфигурация
└── tsconfig.json                     # TypeScript конфигурация
```

## 📊 Статистика

### Слои FSD

| Слой | Папок | Файлов | Назначение |
|------|-------|--------|------------|
| **pages** | 1 | 9 | Next.js маршруты и API |
| **widgets** | 4 | 8 | Крупные UI блоки |
| **features** | 3 | 9 | Бизнес-функции |
| **entities** | 3 | 6 | Бизнес-сущности |
| **shared** | 8 | 15 | Общий код |

### Типы файлов

- **TypeScript/TSX**: ~47 файлов
- **Configuration**: 7 файлов
- **Documentation**: 8 файлов (MD)
- **JSON**: 3 файла
- **CSS**: 1 файл

## 🗂️ Описание ключевых директорий

### `/src/pages/`
Next.js страницы, определяющие маршруты приложения. Каждый файл автоматически становится маршрутом.

### `/src/widgets/`
Самостоятельные блоки интерфейса, объединяющие несколько features и entities. Например, Dashboard включает в себя информацию о займе, график и модалку погашения.

### `/src/features/`
Отдельные бизнес-функции приложения. Каждая feature изолирована и имеет собственные UI и API компоненты.

### `/src/entities/`
Бизнес-сущности с типами и состоянием. Entities не содержат UI, только модели данных и store.

### `/src/shared/`
Переиспользуемый код без привязки к конкретной бизнес-логике. Может использоваться везде в приложении.

## 📝 Соглашения об именовании

### Файлы компонентов
```
ComponentName/
├── ComponentName.tsx       # Основной компонент
├── ComponentName.test.tsx  # Тесты (если есть)
└── index.ts               # Public API экспорт
```

### Файлы утилит
```
utils/
├── functionName.ts        # Конкретная утилита
└── index.ts              # Агрегированный экспорт
```

### API файлы
```
api/
├── entityApi.ts          # API для сущности
└── index.ts             # Экспорт
```

## 🔄 Потоки импортов

```
pages → widgets → features → entities → shared
  ↓       ↓         ↓          ↓          ↓
  ✓       ✓         ✓          ✓          ✗
```

- ✓ Может импортировать из слоёв ниже
- ✗ Не может импортировать (нет зависимостей)

## 🎯 Быстрая навигация

### Хотите добавить новую страницу?
→ `src/pages/your-page.tsx`

### Хотите создать новый UI компонент?
→ `src/shared/ui/ComponentName/ComponentName.tsx`

### Хотите добавить бизнес-функцию?
→ `src/features/feature-name/`

### Хотите добавить бизнес-сущность?
→ `src/entities/entity-name/`

### Хотите создать крупный блок UI?
→ `src/widgets/widget-name/`

## 📚 Связанная документация

- [README.md](./README.md) - Основная документация проекта
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Детальное описание архитектуры FSD
- [FEATURES.md](./FEATURES.md) - Описание авторизации и оформления займа
- [USER_GUIDE.md](./USER_GUIDE.md) - Руководство пользователя
- [SETUP.md](./SETUP.md) - Инструкция по установке и настройке
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Руководство для разработчиков
- [CHANGELOG.md](./CHANGELOG.md) - История изменений
- [LICENSE](./LICENSE) - MIT лицензия

