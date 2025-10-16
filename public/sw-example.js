/**
 * Пример Service Worker для Bitcoin Loan App
 * 
 * ВАЖНО: Этот файл создан для документации и понимания работы SW.
 * Фактический sw.js генерируется автоматически через next-pwa.
 * 
 * Основные функции:
 * 1. Кеширование ресурсов (install)
 * 2. Очистка старого кеша (activate)
 * 3. Обработка запросов с разными стратегиями (fetch)
 * 4. Background Sync для офлайн-операций
 */

// Версия кеша (увеличивать при обновлении приложения)
const CACHE_VERSION = 'v1';
const CACHE_NAME = `bitcoin-loan-${CACHE_VERSION}`;

// Список критических ресурсов для кеширования (App Shell)
const CRITICAL_ASSETS = [
  '/',
  '/_offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

/**
 * INSTALL EVENT
 * Срабатывает при первой установке или обновлении SW
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching critical assets');
      return cache.addAll(CRITICAL_ASSETS);
    })
  );

  // Немедленно активировать новый SW (не ждать закрытия вкладок)
  self.skipWaiting();
});

/**
 * ACTIVATE EVENT
 * Срабатывает после установки, когда SW становится активным
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    // Удаляем старые версии кеша
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Захватываем контроль над всеми клиентами
  self.clients.claim();
});

/**
 * FETCH EVENT
 * Перехватываем все сетевые запросы
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Игнорируем некоторые запросы
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  /**
   * Стратегия 1: Network First для HTML страниц
   * Пытаемся загрузить с сети, при неудаче - из кеша
   */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Сохраняем успешный ответ в кеш
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // При ошибке сети проверяем кеш
          return caches.match(request).then((cachedResponse) => {
            // Если в кеше нет - показываем офлайн страницу
            return cachedResponse || caches.match('/_offline');
          });
        })
    );
    return;
  }

  /**
   * Стратегия 2: Cache First для статических ресурсов
   * Сначала проверяем кеш, потом сеть
   */
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        // Если в кеше нет - загружаем из сети и кешируем
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  /**
   * Стратегия 3: Stale-While-Revalidate для API запросов
   * Отдаем из кеша сразу, параллельно обновляем
   */
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });

        // Возвращаем кешированный ответ или ждем сеть
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }
});

/**
 * BACKGROUND SYNC EVENT
 * Синхронизация отложенных операций при восстановлении сети
 */
self.addEventListener('sync', (event) => {
  console.log('[SW] Background Sync:', event.tag);

  if (event.tag === 'sync-repayment') {
    event.waitUntil(syncPendingRepayments());
  }

  if (event.tag === 'sync-loan-data') {
    event.waitUntil(syncLoanData());
  }
});

/**
 * Синхронизация отложенных погашений
 */
async function syncPendingRepayments() {
  try {
    // Получаем отложенные запросы из IndexedDB
    const db = await openDB();
    const requests = await getPendingRequests(db, 'repayment');

    for (const req of requests) {
      try {
        // Пытаемся выполнить запрос
        const response = await fetch('/api/repayment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.data),
        });

        if (response.ok) {
          // Удаляем успешно выполненный запрос
          await deletePendingRequest(db, req.id);
          console.log('[SW] Repayment synced:', req.id);
        }
      } catch (error) {
        console.error('[SW] Failed to sync repayment:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync error:', error);
  }
}

/**
 * Синхронизация данных займа
 */
async function syncLoanData() {
  try {
    const response = await fetch('/api/loans');
    if (response.ok) {
      const data = await response.json();
      // Кешируем свежие данные
      const cache = await caches.open(CACHE_NAME);
      cache.put('/api/loans', new Response(JSON.stringify(data)));
      console.log('[SW] Loan data synced');
    }
  } catch (error) {
    console.error('[SW] Failed to sync loan data:', error);
  }
}

/**
 * MESSAGE EVENT
 * Обработка сообщений от клиента (страницы)
 */
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

/**
 * PUSH EVENT (опционально)
 * Обработка push-уведомлений
 */
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const options = {
    body: data.body || 'Новое уведомление',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Bitcoin Loan App', options)
  );
});

/**
 * NOTIFICATION CLICK EVENT
 * Обработка клика по уведомлению
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Ищем открытую вкладку с приложением
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Открываем новую вкладку
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

/**
 * Вспомогательные функции для работы с IndexedDB
 * (упрощенные примеры)
 */

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bitcoin-loan-db', 1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getPendingRequests(db, type) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-requests'], 'readonly');
    const store = transaction.objectStore('pending-requests');
    const index = store.index('type');
    const request = index.getAll(type);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deletePendingRequest(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-requests'], 'readwrite');
    const store = transaction.objectStore('pending-requests');
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

