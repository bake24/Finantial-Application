# PWA Файлы

Эта директория содержит файлы для Progressive Web App (PWA) функциональности.

## Основные файлы

### `manifest.json`
Web App Manifest - JSON файл с метаданными о приложении.

**Ключевые поля**:
- `name`: Полное название приложения
- `short_name`: Сокращенное название (до 12 символов)
- `start_url`: URL при запуске с ярлыка (`/?source=pwa`)
- `scope`: Диапазон URL под контролем PWA (`/`)
- `display`: Режим отображения (`standalone`)
- `background_color`: Цвет фона загрузочного экрана
- `theme_color`: Цвет темы (`#f7931a` - Bitcoin orange)
- `orientation`: Ориентация экрана (`portrait`)
- `lang`: Язык интерфейса (`ru-RU`)
- `icons`: Массив иконок разных размеров
- `shortcuts`: Быстрые действия (Android)

### `browserconfig.xml`
Конфигурация для Windows (плитки в меню Пуск)

### `sw.js` (генерируется автоматически)
Service Worker файл, создаваемый `next-pwa` при сборке production.

**Функции**:
- Кеширование ресурсов
- Офлайн поддержка
- Обработка запросов с разными стратегиями
- Background Sync

### `sw-example.js`
Документированный пример Service Worker для понимания архитектуры.

## Иконки (`/icons/`)

Требуемые размеры:
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png` (Windows tiles)
- `icon-152x152.png` (iOS)
- `icon-192x192.png` (Android, основная)
- `icon-384x384.png`
- `icon-512x512.png` (Android, splash)

**Требования к иконкам**:
- Квадратный формат
- PNG с прозрачностью или без
- `purpose: "maskable any"` для адаптивных иконок
- Тематика: Bitcoin + займы

## Стратегии кеширования

### 1. Network First (HTML страницы)
```
Сеть → Кеш → Офлайн страница
```
Для страниц приложения. Приоритет - свежие данные.

### 2. Cache First (Статические ресурсы)
```
Кеш → Сеть
```
Для JS, CSS, изображений. Быстрая загрузка.

### 3. Stale-While-Revalidate (API данные)
```
Кеш сразу + Обновление в фоне
```
Для данных займа. Мгновенный ответ + актуальность.

## Установка PWA

### Android (Chrome)
1. Откройте сайт
2. Появится баннер "Добавить на главный экран"
3. Или: Меню → "Установить приложение"

### iOS (Safari)
1. Откройте сайт
2. Поделиться → "На экран Домой"
3. Иконка появится на Home Screen

### Desktop (Chrome/Edge)
1. Откройте сайт
2. Иконка "Установить" в адресной строке
3. Или: Меню → "Установить Bitcoin Loan App"

## Критерии установки

PWA должно соответствовать:
- ✅ HTTPS (в production)
- ✅ Web App Manifest
- ✅ Service Worker
- ✅ Иконки 192x192 и 512x512
- ✅ `start_url` и `display`

## Офлайн функциональность

### Что работает офлайн:
- ✅ Просмотр ранее загруженных страниц
- ✅ Просмотр кешированных данных займа
- ✅ Навигация по приложению
- ✅ Офлайн fallback страница

### Что требует онлайн:
- ❌ Авторизация
- ❌ Создание нового займа
- ❌ Досрочное погашение (с Background Sync может работать)
- ❌ Обновление данных

## Background Sync

Позволяет отложить операции до восстановления сети.

**Поддержка**:
- ✅ Chrome/Edge (Android, Desktop)
- ❌ Safari (iOS, macOS)
- ❌ Firefox

**Пример использования**:
```typescript
// Сохранить операцию для синхронизации
await savePendingRequest('repayment', { amount: 0.1 });
await registerBackgroundSync('sync-repayment');

// SW выполнит при восстановлении сети
```

## Обновление приложения

При выпуске новой версии:

1. Обновить `CACHE_VERSION` в SW (автоматически через next-pwa)
2. Пересобрать: `npm run build`
3. Задеплоить

SW автоматически:
- Обнаружит новую версию
- Установит в фоне
- Активирует при перезагрузке
- Очистит старый кеш

## Отладка

### Chrome DevTools
1. Application → Service Workers
2. Application → Cache Storage
3. Network → Offline (эмуляция)

### Тестирование
```bash
# Production build
npm run build
npm start

# Открыть http://localhost:3000
# DevTools → Application → Manifest
# Lighthouse → PWA audit
```

## Полезные ссылки

- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [next-pwa документация](https://github.com/shadowwalker/next-pwa)
- [PWA Builder](https://www.pwabuilder.com/)

