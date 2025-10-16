# 🚀 Инструкция по деплою

## Быстрый деплой на Vercel (Рекомендуется)

### 1. Через веб-интерфейс (Самый простой способ)

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите **"Sign Up"** или **"Log In"** через GitHub
3. Нажмите **"Add New Project"**
4. Выберите репозиторий `Finantial-Application`
5. Vercel автоматически определит Next.js
6. Нажмите **"Deploy"**

✅ **Готово!** Через 1-2 минуты ваше приложение будет доступно по адресу:
- `https://finantial-application.vercel.app`
- Или кастомный домен, который вы можете настроить

### 2. Через Vercel CLI

```bash
# Установить Vercel CLI
npm i -g vercel

# Войти в аккаунт
vercel login

# Деплой
vercel

# Production деплой
vercel --prod
```

---

## Альтернативные варианты

### Netlify

1. Перейдите на [netlify.com](https://netlify.com)
2. Sign Up через GitHub
3. **"Add new site"** → **"Import from Git"**
4. Выберите репозиторий
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Framework: `Next.js`
6. **Deploy**

### Railway

1. [railway.app](https://railway.app)
2. Sign up через GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Выберите репозиторий
5. Railway автоматически определит Next.js
6. **Deploy**

### Render

1. [render.com](https://render.com)
2. Sign up через GitHub
3. **"New"** → **"Web Service"**
4. Подключите GitHub repo
5. Settings:
   - Environment: `Node`
   - Build Command: `npm run build`
   - Start Command: `npm start`
6. **Create Web Service**

---

## 🌐 Бесплатные возможности

### Vercel (✅ Рекомендуется)
- ✅ **Бесплатно**: 100 GB bandwidth
- ✅ Автоматический HTTPS
- ✅ Глобальный CDN
- ✅ Автоматические деплои из GitHub
- ✅ Preview deployments для PR
- ✅ Serverless Functions
- ✅ Аналитика

### Netlify
- ✅ **Бесплатно**: 100 GB bandwidth
- ✅ Автоматический HTTPS
- ✅ Глобальный CDN
- ✅ Continuous deployment
- ✅ Forms и Functions

### Railway
- ✅ **Бесплатно**: $5 кредитов/месяц
- ✅ Автоматический HTTPS
- ✅ Database поддержка
- ✅ Простой деплой

### Render
- ✅ **Бесплатно**: 750 часов/месяц
- ✅ Автоматический HTTPS
- ✅ Continuous deployment
- ✅ Databases

---

## ⚙️ Environment Variables

После деплоя добавьте переменные окружения в настройках проекта:

```bash
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME="Bitcoin Loan App"
NEXT_PUBLIC_PWA_ENABLED=true
```

### Vercel
1. Project Settings → Environment Variables
2. Добавьте переменные
3. Redeploy

### Netlify
1. Site settings → Environment variables
2. Добавьте переменные
3. Trigger deploy

---

## 🔧 Настройка кастомного домена

### Vercel
1. Project Settings → Domains
2. Добавьте ваш домен
3. Обновите DNS записи (Vercel покажет инструкции)
4. Готово! HTTPS настроится автоматически

### Бесплатные домены
- **Freenom** - .tk, .ml, .ga, .cf, .gq домены
- **DuckDNS** - поддомен .duckdns.org
- **No-IP** - поддомен .ddns.net

---

## 📱 PWA на production

После деплоя:
1. ✅ HTTPS будет работать автоматически (обязательно для PWA)
2. ✅ Service Worker будет активен
3. ✅ Установка приложения станет доступна
4. ✅ Офлайн режим будет работать

### Проверка PWA
1. Откройте ваш сайт на телефоне
2. Chrome DevTools → Lighthouse
3. Запустите PWA аудит
4. Должно быть 90+ баллов

---

## 🚀 Автоматические деплои

### Настройка GitHub Actions (опционально)

Vercel/Netlify уже делают автоматические деплои, но можно настроить дополнительно:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint
      - run: npm run type-check
```

---

## 📊 Мониторинг

После деплоя:
- **Vercel Analytics** - встроенная аналитика
- **Google Analytics** - добавьте GA_ID
- **Sentry** - мониторинг ошибок
- **LogRocket** - session replay

---

## 🎯 Чеклист перед деплоем

- [x] Проект собирается без ошибок (`npm run build`)
- [x] TypeScript проверка пройдена (`npm run type-check`)
- [x] Линтер пройден (`npm run lint`)
- [x] PWA manifest настроен
- [x] Service Worker работает
- [x] Иконки созданы
- [x] README обновлен
- [x] Environment variables заданы
- [x] Git repository создан

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте Build Logs в Vercel/Netlify
2. Убедитесь что все зависимости установлены
3. Проверьте Node.js версию (должна быть 18+)
4. Очистите кеш: `npm clean-install`

---

**Удачного деплоя! 🚀**

