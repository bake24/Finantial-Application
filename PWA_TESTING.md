# Тестирование PWA на мобильных устройствах

## 📋 Предварительные требования

### 1. HTTPS обязателен
⚠️ **PWA работают только на HTTPS** (кроме localhost)

**Для тестирования локально**:
```bash
# Используйте ngrok или локальный HTTPS сертификат
npx ngrok http 3000

# Или с mkcert:
brew install mkcert
mkcert -install
mkcert localhost
```

**Для production**:
- Убедитесь, что хостинг использует HTTPS
- Vercel/Netlify/Railway автоматически дают HTTPS
- Let's Encrypt для собственного сервера

### 2. Production build
```bash
npm run build
npm start
# или
npm run build && npx serve out
```

---

## 🤖 Android (Chrome/Edge)

### Установка

1. **Откройте сайт в Chrome**
   - Перейдите на `https://your-app.com`
   - Используйте несколько секунд (Chrome проверяет engagement)

2. **Баннер "Add to Home Screen"**
   - Появится автоматически после использования
   - Или вручную: Меню (⋮) → "Установить приложение"

3. **Проверка установки**
   - Иконка появится на главном экране
   - Название: "BTC Loan"
   - Иконка: Bitcoin orange

### Тестирование

#### ✅ Запуск PWA
```
1. Нажмите на иконку "BTC Loan"
2. Приложение откроется в standalone режиме
3. Нет адресной строки браузера
4. Splash screen с Bitcoin логотипом
```

#### ✅ Навигация
```
1. Перейдите /login → /loan → /dashboard
2. Проверьте, что навигация работает без открытия браузера
3. Кнопка "Назад" работает внутри приложения
4. Нет переходов в Chrome
```

#### ✅ Shortcuts (Android 7.1+)
```
1. Долгое нажатие на иконку PWA
2. Должны появиться shortcuts:
   - "Оформить займ" → /loan
   - "Личный кабинет" → /dashboard
3. Нажмите на shortcut
4. Приложение откроется на нужной странице
```

#### ✅ Офлайн режим
```
1. Откройте PWA
2. Авторизуйтесь и посмотрите Dashboard
3. Включите Airplane Mode
4. Закройте и откройте PWA снова
5. Должна загрузиться офлайн-страница или кешированный Dashboard
6. Индикатор "🔴 Офлайн" должен показываться
```

#### ✅ Обновление
```
1. Измените код (например, текст на главной)
2. Сделайте новый build: npm run build
3. Задеплойте
4. Откройте PWA
5. Через несколько секунд должен появиться баннер:
   "Доступна новая версия"
6. Нажмите "Обновить сейчас"
7. Приложение перезагрузится с новой версией
```

### Chrome DevTools (для отладки)

```bash
# На компьютере
1. Подключите Android через USB
2. Включите USB Debugging на телефоне
3. Chrome → chrome://inspect
4. Выберите устройство
5. Инспектируйте PWA
```

**Проверки в DevTools**:
- Application → Manifest (проверить JSON)
- Application → Service Workers (статус)
- Application → Cache Storage (содержимое кеша)
- Lighthouse → PWA audit (оценка)

---

## 🍎 iOS (Safari)

### ⚠️ Ограничения iOS

iOS имеет меньшую поддержку PWA:
- ❌ Нет автоматического баннера установки
- ❌ Нет Background Sync
- ❌ Нет Push Notifications
- ❌ Кеш ограничен ~50MB
- ✅ Работает standalone режим
- ✅ Работает Service Worker (частично)
- ✅ Работает офлайн кеширование

### Установка

1. **Откройте Safari**
   - Перейдите на `https://your-app.com`
   - ⚠️ Работает ТОЛЬКО в Safari, не в Chrome iOS

2. **Поделиться → На экран "Домой"**
   ```
   1. Нажмите кнопку "Поделиться" (квадрат со стрелкой)
   2. Прокрутите вниз
   3. Нажмите "На экран "Домой""
   4. Отредактируйте название (если нужно)
   5. Нажмите "Добавить"
   ```

3. **Проверка установки**
   - Иконка на Home Screen
   - Название: "BTC Loan"
   - Иконка: 180x180px (apple-touch-icon)

### Тестирование

#### ✅ Запуск PWA
```
1. Нажмите иконку "BTC Loan"
2. Splash screen (генерируется iOS автоматически)
3. Приложение открывается без Safari UI
4. Статус-бар виден сверху
```

#### ✅ Навигация
```
1. Переходы между страницами работают
2. Кнопка назад iOS работает
3. Проверьте, что внешние ссылки открывают Safari
```

#### ✅ Офлайн режим
```
1. Откройте PWA и посмотрите несколько страниц
2. Включите Airplane Mode
3. Закройте PWA (свайп вверх)
4. Откройте снова
5. Должна загрузиться офлайн-страница
```

#### ⚠️ Особенности iOS

**Проблемы**:
- Кеш может очищаться через 7 дней неиспользования
- При нехватке памяти iOS может удалить кеш
- Service Worker может не работать в Low Power Mode

**Решения**:
- Попросите пользователей регулярно открывать PWA
- Храните критические данные в localStorage
- Проверяйте наличие кеша и показывайте предупреждение

### Safari Web Inspector (для отладки)

```bash
# На Mac + iPhone
1. iPhone: Настройки → Safari → Дополнения → Web Inspector
2. Подключите iPhone к Mac через кабель
3. Mac: Safari → Разработка → [Ваш iPhone] → PWA
4. Откроется инспектор
```

---

## 💻 Desktop (Chrome/Edge/Safari)

### Установка Chrome/Edge

```
1. Откройте сайт
2. Иконка "Установить" в адресной строке (справа)
3. Или: Меню → "Установить Bitcoin Loan App"
4. Нажмите "Установить"
```

### Установка Safari (macOS)

```
⚠️ Safari не поддерживает полноценные PWA на desktop
Можно добавить в Dock, но будет открывать в Safari
```

### Тестирование Desktop

```
✅ Отдельное окно приложения
✅ Своя иконка в панели задач/Dock
✅ Отдельная сессия (cookies)
✅ Работает офлайн
✅ Обновление приложения
```

---

## 🧪 Автоматизированное тестирование

### Lighthouse PWA Audit

```bash
# В Chrome DevTools
1. Откройте сайт
2. DevTools → Lighthouse
3. Категории: Performance, PWA, Best Practices
4. Выберите Mobile/Desktop
5. Generate Report
```

**Минимальные требования**:
- PWA Score: 90+
- Fast and reliable: ✅
- Installable: ✅
- PWA Optimized: ✅

### Checklist для PWA

```
✅ manifest.json существует и валиден
✅ Service Worker регистрируется
✅ HTTPS (или localhost)
✅ Иконки 192x192 и 512x512
✅ start_url доступен офлайн
✅ display: standalone/fullscreen/minimal-ui
✅ theme_color установлен
✅ Responsive на всех экранах
✅ Офлайн fallback работает
✅ Метатеги для iOS добавлены
```

### WebPageTest

```
1. Откройте https://www.webpagetest.org/
2. Введите URL приложения
3. Выберите Mobile устройство
4. Run Test
5. Проверьте First Contentful Paint, Speed Index
```

---

## 🐛 Распространенные проблемы

### 1. PWA не устанавливается на Android

**Причины**:
- ❌ Нет HTTPS
- ❌ manifest.json недоступен
- ❌ Service Worker не регистрируется
- ❌ Иконки отсутствуют или неправильные размеры
- ❌ start_url не доступен офлайн

**Решение**:
```bash
# Проверьте в Chrome DevTools
1. Application → Manifest
2. Application → Service Workers
3. Console (ошибки регистрации)
4. Network (статус manifest.json)
```

### 2. Офлайн режим не работает

**Причины**:
- ❌ Service Worker не кеширует ресурсы
- ❌ Стратегия кеширования неправильная
- ❌ Cache storage переполнен

**Решение**:
```javascript
// Проверьте кеш в DevTools
Application → Cache Storage → loan-app-v1

// Проверьте обработчик fetch в SW
self.addEventListener('fetch', ...)
```

### 3. Обновление не работает

**Причины**:
- ❌ Service Worker не обновляется
- ❌ Жесткий кеш (max-age слишком большой)
- ❌ skipWaiting не вызывается

**Решение**:
```javascript
// В next.config.js
skipWaiting: true,

// Или в SW
self.skipWaiting();
self.clients.claim();
```

### 4. iOS не показывает splash screen

**Причины**:
- ❌ Отсутствуют apple-touch-startup-image
- ❌ Неправильные размеры

**Решение**:
```html
<!-- Добавьте в _document.tsx -->
<link rel="apple-touch-startup-image" 
      href="/icons/splash-750x1334.png"
      media="...">
```

---

## 📊 Метрики производительности

### Цели для PWA

```
First Contentful Paint: < 1.8s
Time to Interactive: < 3.8s
Speed Index: < 3.4s
Total Blocking Time: < 300ms
Largest Contentful Paint: < 2.5s
Cumulative Layout Shift: < 0.1
```

### Оптимизация

```
✅ Минимизация JS/CSS
✅ Lazy loading изображений
✅ Code splitting
✅ Preload критических ресурсов
✅ CDN для статики
✅ Compression (gzip/brotli)
```

---

## 🎯 Финальный Checklist

### Перед релизом

```
✅ HTTPS настроен
✅ manifest.json валиден (используйте validator)
✅ Все иконки созданы (72-512px + iOS)
✅ Service Worker регистрируется
✅ Офлайн страница работает
✅ Тестирование на Android (Chrome)
✅ Тестирование на iOS (Safari)
✅ Lighthouse PWA score 90+
✅ Responsive на всех экранах
✅ Обновление PWA работает
✅ Meta теги для iOS добавлены
✅ browserconfig.xml для Windows
✅ robots.txt и sitemap.xml
```

### Пользовательское тестирование

```
1. Дайте тестерам ссылку
2. Попросите установить на телефон
3. Проверить основные сценарии:
   - Авторизация
   - Оформление займа
   - Просмотр Dashboard
   - Работа офлайн
4. Собрать отзывы об UX
5. Проверить аналитику установок
```

---

## 📚 Полезные ссылки

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Apple PWA Docs](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
- [Android PWA Guidelines](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Manifest Validator](https://manifest-validator.appspot.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

✨ **Удачного тестирования!**

