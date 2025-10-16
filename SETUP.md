# Инструкция по установке и настройке

## 📋 Требования

- **Node.js**: 18.x или выше
- **npm**: 9.x или выше (или yarn/pnpm)
- **Браузер**: Современный браузер с поддержкой PWA

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

### 3. Вход в систему

Используйте демо-учетные данные:
- **Логин**: `demo`
- **Пароль**: `demo123`

## 📦 Скрипты

```bash
# Разработка
npm run dev          # Запуск dev-сервера

# Production
npm run build        # Сборка приложения
npm start            # Запуск production-сервера

# Проверки
npm run lint         # Линтинг кода
npm run type-check   # Проверка TypeScript типов
```

## 🎨 Настройка иконок PWA

### Требуемые размеры иконок

Разместите иконки в папке `public/icons/` со следующими размерами:

- `icon-72x72.png` (72×72px)
- `icon-96x96.png` (96×96px)
- `icon-128x128.png` (128×128px)
- `icon-144x144.png` (144×144px)
- `icon-152x152.png` (152×152px)
- `icon-192x192.png` (192×192px)
- `icon-384x384.png` (384×384px)
- `icon-512x512.png` (512×512px)

### Генерация иконок

#### Способ 1: Онлайн-генератор

1. Создайте базовую иконку 512×512px
2. Используйте сервис [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Загрузите иконку и выберите платформу PWA
4. Скачайте готовые иконки

#### Способ 2: С помощью ImageMagick

```bash
# Установите ImageMagick (если не установлен)
# macOS:
brew install imagemagick

# Linux:
sudo apt-get install imagemagick

# Windows: скачайте с официального сайта

# Генерация иконок из базовой (icon-512x512.png)
cd public/icons/
convert icon-512x512.png -resize 72x72 icon-72x72.png
convert icon-512x512.png -resize 96x96 icon-96x96.png
convert icon-512x512.png -resize 128x128 icon-128x128.png
convert icon-512x512.png -resize 144x144 icon-144x144.png
convert icon-512x512.png -resize 152x152 icon-152x152.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 384x384 icon-384x384.png
```

#### Способ 3: Плейсхолдер иконки

Для быстрого старта можно использовать временные иконки:

```bash
# Создайте простые цветные квадраты с помощью ImageMagick
cd public/icons/
for size in 72 96 128 144 152 192 384 512; do
  convert -size ${size}x${size} xc:#f7931a icon-${size}x${size}.png
done
```

### Рекомендации по дизайну иконок

- **Формат**: PNG с прозрачностью
- **Цвет фона**: Прозрачный или #f7931a (Bitcoin оранжевый)
- **Дизайн**: Простой, узнаваемый, хорошо читается в малых размерах
- **Safe zone**: Оставьте 10% отступ от краев для iOS

## 🔧 Переменные окружения

### Создание .env.local

```bash
cp .env.example .env.local
```

### Доступные переменные

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Bitcoin Loan App
NEXT_PUBLIC_MAX_LOAN_BTC=1
NEXT_PUBLIC_MAX_LOAN_MONTHS=24
```

### Production переменные

Для production настройте:

```env
NEXT_PUBLIC_API_URL=https://your-api.com/api
NODE_ENV=production
```

## 🌐 Настройка PWA

### Тестирование PWA локально

PWA отключен в режиме разработки. Для тестирования:

```bash
# 1. Соберите приложение
npm run build

# 2. Запустите production сервер
npm start

# 3. Откройте http://localhost:3000 в Chrome/Edge

# 4. Проверьте PWA:
# - DevTools → Application → Manifest
# - DevTools → Application → Service Workers
# - DevTools → Lighthouse (запустите аудит PWA)
```

### Установка PWA на устройство

#### Desktop (Chrome/Edge):
1. Откройте приложение
2. Нажмите иконку установки в адресной строке
3. Или: Меню → Установить приложение

#### Mobile (iOS Safari):
1. Откройте приложение в Safari
2. Нажмите кнопку "Поделиться"
3. Выберите "На экран Домой"

#### Mobile (Android Chrome):
1. Откройте приложение
2. Нажмите меню (три точки)
3. Выберите "Установить приложение"

## 📱 Тестирование на мобильных устройствах

### Локальная сеть

```bash
# Узнайте свой локальный IP
# macOS/Linux:
ifconfig | grep "inet "

# Windows:
ipconfig

# Запустите dev-сервер
npm run dev

# Откройте на мобильном устройстве:
# http://YOUR_IP:3000
```

### Используя ngrok

```bash
# Установите ngrok
npm install -g ngrok

# Запустите приложение
npm run dev

# В другом терминале:
ngrok http 3000

# Используйте предоставленный URL
```

## 🔍 Отладка

### DevTools

```bash
# Chrome/Edge DevTools
F12 или Cmd+Option+I (Mac) / Ctrl+Shift+I (Win)

# Полезные вкладки:
# - Console: логи и ошибки
# - Network: HTTP запросы
# - Application: PWA, Storage, Manifest
# - Lighthouse: аудит производительности и PWA
```

### Логирование

Добавьте в код для отладки:

```typescript
console.log('Debug info:', data);
```

### React DevTools

```bash
# Установите расширение React Developer Tools
# Chrome: https://chrome.google.com/webstore
# Firefox: https://addons.mozilla.org/firefox
```

## 🚀 Деплой

### Vercel (рекомендуется)

```bash
# 1. Установите Vercel CLI
npm i -g vercel

# 2. Войдите
vercel login

# 3. Деплой
vercel

# Production деплой:
vercel --prod
```

### Netlify

```bash
# 1. Установите Netlify CLI
npm i -g netlify-cli

# 2. Войдите
netlify login

# 3. Инициализируйте
netlify init

# 4. Деплой
netlify deploy --prod
```

### Docker

```bash
# Создайте Dockerfile
# (добавьте Dockerfile в корень проекта)

# Соберите образ
docker build -t bitcoin-loan-app .

# Запустите контейнер
docker run -p 3000:3000 bitcoin-loan-app
```

## 🐛 Решение проблем

### Ошибка: Module not found

```bash
# Очистите кеш и переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

### Ошибка: Port 3000 already in use

```bash
# Используйте другой порт
PORT=3001 npm run dev

# Или освободите порт 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### PWA не регистрируется

```bash
# 1. Проверьте, что приложение в production режиме
npm run build && npm start

# 2. Очистите Service Workers в DevTools
# Application → Service Workers → Unregister

# 3. Очистите кеш браузера
# Настройки → Конфиденциальность → Очистить данные

# 4. Проверьте манифест
# Application → Manifest (должен показывать данные из manifest.json)
```

### TypeScript ошибки

```bash
# Проверьте типы
npm run type-check

# Пересоберите типы Next.js
rm -rf .next
npm run dev
```

### Проблемы со стилями

```bash
# Убедитесь, что Tailwind настроен
# Проверьте tailwind.config.js

# Перезапустите dev сервер
# Ctrl+C, затем npm run dev
```

## 📚 Дополнительные ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Полезные советы

1. **Hot Reload**: Изменения автоматически отображаются в браузере
2. **TypeScript**: Используйте типизацию для всех переменных
3. **Tailwind**: Используйте утилитарные классы вместо custom CSS
4. **Components**: Создавайте переиспользуемые компоненты
5. **Git**: Делайте коммиты после каждой завершенной фичи

## 🎓 Следующие шаги

1. ✅ Установите зависимости
2. ✅ Запустите приложение
3. ✅ Добавьте иконки PWA
4. ✅ Настройте переменные окружения
5. 🚀 Начните разработку!

---

Если у вас возникли вопросы или проблемы, создайте Issue в репозитории проекта.

