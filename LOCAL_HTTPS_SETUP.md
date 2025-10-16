# Локальный HTTPS для тестирования PWA

PWA требуют HTTPS для работы (кроме localhost). Для тестирования на реальных устройствах в локальной сети нужен HTTPS.

## 🚀 Вариант 1: ngrok (Быстрый старт)

### Установка

```bash
# macOS
brew install ngrok

# npm
npm install -g ngrok

# Или скачайте: https://ngrok.com/download
```

### Использование

```bash
# 1. Запустите приложение локально
npm run build
npm start

# 2. В новом терминале запустите ngrok
ngrok http 3000

# Вы получите:
# Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

### Преимущества
✅ Быстро (5 минут)
✅ Настоящий HTTPS сертификат
✅ Публичный URL (можно поделиться)
✅ Инспекция запросов через Web Interface

### Недостатки
❌ Временный URL (меняется при перезапуске)
❌ Лимит на бесплатном плане
❌ Требует интернет

---

## 🔒 Вариант 2: mkcert (Локальные сертификаты)

### Установка

```bash
# macOS
brew install mkcert
brew install nss  # для Firefox

# Linux
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/

# Windows (Chocolatey)
choco install mkcert
```

### Генерация сертификатов

```bash
# 1. Установите локальный CA
mkcert -install

# 2. Создайте сертификат для localhost
mkcert localhost 127.0.0.1 ::1

# 3. Для локальной сети (узнайте IP: ifconfig/ipconfig)
mkcert localhost 127.0.0.1 ::1 192.168.1.100

# Будут созданы:
# - localhost+3.pem (сертификат)
# - localhost+3-key.pem (приватный ключ)
```

### Использование с Next.js

Создайте `server.js`:

```javascript
const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./localhost+3-key.pem'),
  cert: fs.readFileSync('./localhost+3.pem'),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on https://localhost:3000');
  });
});
```

Добавьте скрипт в `package.json`:

```json
{
  "scripts": {
    "dev:https": "node server.js"
  }
}
```

Запустите:

```bash
npm run dev:https
```

### Мобильные устройства в локальной сети

```bash
# 1. Узнайте локальный IP
# macOS/Linux
ifconfig | grep "inet "
# Windows
ipconfig

# Пример: 192.168.1.100

# 2. Создайте сертификат с этим IP
mkcert 192.168.1.100

# 3. На мобильном устройстве:
# - Подключитесь к той же WiFi сети
# - Откройте https://192.168.1.100:3000
```

⚠️ **Важно**: Браузер может показать предупреждение. Это нормально для локальных сертификатов.

**Обойти на iOS**:
1. Settings → General → VPN & Device Management
2. Найдите mkcert сертификат
3. Включите доверие

**Обойти на Android**:
- Нажмите "Advanced" → "Proceed anyway"

### Преимущества
✅ Работает без интернета
✅ Стабильный URL
✅ Полный контроль
✅ Быстрая разработка

### Недостатки
❌ Настройка сложнее
❌ Нужно доверять сертификату на каждом устройстве
❌ Только для локальной сети

---

## 🌐 Вариант 3: Vercel/Netlify Preview

### Vercel

```bash
# 1. Установите Vercel CLI
npm i -g vercel

# 2. Авторизуйтесь
vercel login

# 3. Деплой
vercel

# Вы получите:
# https://your-app-abc123.vercel.app
```

### Преимущества
✅ Настоящий production environment
✅ Автоматический HTTPS
✅ CDN
✅ Простота

### Недостатки
❌ Требует деплой при каждом изменении
❌ Медленнее для разработки

---

## 📱 Тестирование на устройствах

### Android через USB (Chrome Remote Debugging)

```bash
# 1. На Android: Включите USB Debugging
# Settings → Developer Options → USB Debugging

# 2. Подключите телефон к компьютеру

# 3. Chrome на компьютере: chrome://inspect

# 4. Разрешите доступ на телефоне

# 5. Ваше устройство появится в списке

# 6. Включите Port Forwarding:
# localhost:3000 → localhost:3000

# 7. На телефоне откройте: http://localhost:3000
# Chrome автоматически перенаправит на ваш ПК
```

### iOS через USB (Safari Web Inspector)

```bash
# 1. На iPhone: 
# Settings → Safari → Advanced → Web Inspector (ON)

# 2. Подключите iPhone к Mac через кабель

# 3. Safari на Mac:
# Safari → Preferences → Advanced → 
# "Show Develop menu in menu bar" (включить)

# 4. Safari → Develop → [Ваш iPhone]

# 5. На iPhone откройте ваш сайт

# 6. В меню Develop выберите страницу

# Инспектор откроется
```

⚠️ **Для iOS требуется Mac**. На Windows используйте ngrok или деплой.

---

## 🧪 Проверка HTTPS

### В браузере

```
✅ Замок в адресной строке
✅ URL начинается с https://
✅ Сертификат валиден (зеленый)
```

### В консоли

```bash
# Проверка SSL
curl -I https://localhost:3000

# Проверка сертификата
openssl s_client -connect localhost:3000 -showcerts
```

### Service Worker

```javascript
// Проверка в консоли браузера
navigator.serviceWorker.ready.then(registration => {
  console.log('✅ Service Worker зарегистрирован');
  console.log('Scope:', registration.scope);
});

// Проверка HTTPS
console.log('Is secure:', window.isSecureContext);
// true - HTTPS работает
// false - требуется HTTPS
```

---

## 🔧 Устранение проблем

### "Service Worker не регистрируется"

```
Причина: Нет HTTPS
Решение: Используйте один из способов выше
```

### "NET::ERR_CERT_AUTHORITY_INVALID"

```
Причина: Локальный сертификат не доверен
Решение: 
1. mkcert -install
2. На мобильном: установите доверие к сертификату
```

### "Не могу открыть с мобильного"

```
Причина: Не в одной сети или firewall
Решение:
1. Проверьте, что устройства в одной WiFi
2. Отключите firewall на ПК
3. Используйте ngrok
```

### "PWA не устанавливается"

```
Причина: Не все требования выполнены
Проверьте:
✅ HTTPS
✅ manifest.json
✅ Service Worker
✅ Иконки 192x192 и 512x512
✅ start_url доступен офлайн

Используйте Lighthouse для диагностики
```

---

## 📋 Quick Start Checklist

```bash
# Вариант 1: ngrok (Рекомендуется для начала)
npm run build
npm start
# В новом терминале:
ngrok http 3000
# Откройте URL на мобильном

# Вариант 2: mkcert (для серьезной разработки)
mkcert -install
mkcert localhost
# Создайте server.js (см. выше)
npm run dev:https
# Откройте https://localhost:3000

# Вариант 3: Vercel (для production-like теста)
vercel
# Откройте полученный URL
```

---

## 🎯 Рекомендации

### Для быстрого теста
→ Используйте **ngrok**

### Для активной разработки
→ Используйте **mkcert**

### Для финального теста
→ Используйте **Vercel/Netlify**

---

## 📚 Полезные ссылки

- [mkcert GitHub](https://github.com/FiloSottile/mkcert)
- [ngrok Docs](https://ngrok.com/docs)
- [Chrome Remote Debugging](https://developer.chrome.com/docs/devtools/remote-debugging/)
- [Safari Web Inspector](https://developer.apple.com/safari/tools/)

---

✨ **Успешного тестирования!**

