# 📱 Руководство по мобильной версии

## Возможности мобильной версии

### ✨ Современная навигация

#### Bottom Navigation (как в Instagram, Telegram)
- 📍 **Всегда видима** - закреплена внизу экрана
- 🎯 **4 основные секции**: Главная, Займ, История, Профиль
- 🎨 **Активные иконки** - визуальная индикация текущей страницы
- ⚡ **Быстрый доступ** - одно касание к любой секции

#### Mobile Header
- 🍔 **Гамбургер-меню** - доступ к дополнительным опциям
- 👋 **Приветствие** - информация о пользователе
- 📱 **Компактный дизайн** - экономия пространства

#### Floating Action Button (FAB)
- ➕ **Главное действие** - "Новый займ" всегда под рукой
- 🎯 **Удобное расположение** - в правом нижнем углу
- ✨ **Анимация** - плавное появление и масштабирование

### 📐 Адаптивный дизайн

```
Мобильные (< 768px):
├── Bottom Navigation - всегда видна
├── Mobile Header - компактный заголовок
├── FAB - для быстрых действий
└── Install Prompt - умное расположение

Планшеты/Desktop (>= 768px):
├── Обычная навигация
├── Полный header
└── Стандартное меню
```

### 🎨 Touch-Friendly интерфейс

- ✅ **Минимум 44x44px** для всех кликабельных элементов
- ✅ **Safe Area** поддержка для iPhone с вырезом
- ✅ **Active states** - визуальная обратная связь при нажатии
- ✅ **Оптимизированные отступы** - комфорт использования одной рукой

### 🚀 PWA Install на мобильных

#### Android (Chrome)
1. Откройте сайт
2. Автоматически появится баннер внизу экрана
3. Нажмите "Установить"

#### iOS (Safari)
1. Откройте сайт
2. Всплывающая подсказка с инструкциями
3. Следуйте шагам: Поделиться → На экран Домой → Добавить

### 💡 Лучшие практики

#### Навигация
- **Bottom Tab Navigation** - как в Instagram, Twitter
- **4-5 основных пунктов** - не перегружаем
- **Иконки + текст** - двойная индикация
- **Активное состояние** - всегда понятно где находишься

#### Действия
- **FAB для главного действия** - "Новый займ"
- **Гамбургер-меню** - для дополнительных опций
- **Swipe gestures** - готово к добавлению

#### Контент
- **Padding Bottom 80px** - место для Bottom Nav
- **Margin Top 56px** - место для Mobile Header
- **Responsive spacing** - адаптивные отступы

### 🛠 Технические детали

#### Компоненты

**MobileNav** (`src/shared/ui/MobileNav/MobileNav.tsx`)
```tsx
<MobileNav />
// Bottom navigation с 4 пунктами
// Автоматически скрывается на desktop (md:hidden)
```

**MobileHeader** (`src/shared/ui/MobileHeader/MobileHeader.tsx`)
```tsx
<MobileHeader title="Заголовок" />
// Компактный header с меню
// Поддержка safe-area-inset
```

**FloatingActionButton** (`src/shared/ui/FloatingActionButton/FloatingActionButton.tsx`)
```tsx
<FloatingActionButton 
  onClick={handleAction}
  label="Действие"
/>
// FAB для главного действия
// Позиционируется над Bottom Nav
```

**InstallPrompt** (обновлен)
```tsx
<InstallPrompt variant="floating" className="md:hidden" />
// Адаптирован для мобильных
// Умное расположение над Bottom Nav
```

#### CSS классы

```css
/* Padding для контента */
.pb-20 md:pb-0  /* 80px внизу на мобильных */

/* Margin для контента под header */
.mt-14 md:mt-0  /* 56px сверху на мобильных */

/* Скрытие на мобильных/десктопе */
.md:hidden      /* Скрыть на desktop */
.hidden md:block /* Показать только на desktop */
```

#### Анимации

```css
/* Slide Down для меню */
@keyframes slide-down {
  from { transform: translateY(-10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Slide Up для промптов */
@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

### 📊 Метрики производительности

- ⚡ **First Contentful Paint**: < 1.5s
- 🎯 **Time to Interactive**: < 3s  
- 📱 **Touch Target Size**: >= 44px
- 🎨 **Smooth Animations**: 60 FPS
- 💾 **App Shell**: Кешируется для офлайн

### 🎯 UX лучшие практики

#### Навигация
- ✅ Всегда видимая bottom navigation
- ✅ Максимум 5 пунктов в bottom nav
- ✅ Иконки + текст для ясности
- ✅ Активное состояние четко выделено

#### Действия
- ✅ FAB только для главного действия
- ✅ Минимум 44x44px для touch targets
- ✅ Visual feedback при нажатии
- ✅ Логичная иерархия действий

#### Контент
- ✅ Достаточно padding внизу/вверху
- ✅ Адаптивная типографика
- ✅ Читаемость на маленьких экранах
- ✅ Оптимизация изображений

### 🔧 Настройка

#### Изменить пункты Bottom Nav
```tsx
// src/shared/ui/MobileNav/MobileNav.tsx
const navItems: NavItem[] = [
  { id: 'home', label: 'Главная', href: '/dashboard', icon: ... },
  // Добавьте свои пункты
];
```

#### Изменить FAB позицию
```tsx
<FloatingActionButton 
  position="bottom-right" // или "bottom-center"
  onClick={handleAction}
/>
```

#### Настроить высоту header
```tsx
// src/shared/ui/MobileHeader/MobileHeader.tsx
<div className="h-14"> // Измените высоту
```

### 📱 Поддержка устройств

- ✅ **iPhone SE** (320px) и больше
- ✅ **iPhone 14 Pro Max** с Dynamic Island
- ✅ **Android** всех размеров
- ✅ **iPad** - переключается на desktop режим
- ✅ **Landscape режим** - полностью поддерживается

### 🎨 Дизайн-система

#### Цвета
- **Primary**: Bitcoin Orange (#f7931a)
- **Active**: Bitcoin 600
- **Inactive**: Gray 600
- **Background**: White/Gray 50

#### Отступы
- **Bottom Nav height**: 64px (16 Tailwind units)
- **Mobile Header height**: 56px (14 Tailwind units)
- **FAB size**: 56x56px minimum
- **Safe areas**: автоматически учитываются

#### Анимации
- **Duration**: 200-300ms
- **Easing**: ease-out
- **Transform**: scale, translateY
- **Transitions**: colors, opacity

---

**Создано с ❤️ для идеального мобильного UX**

