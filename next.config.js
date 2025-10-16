/**
 * Next.js конфигурация с PWA поддержкой
 * 
 * Использует next-pwa для генерации Service Worker и реализации офлайн-режима
 */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  
  // Стратегии кеширования для разных типов ресурсов
  runtimeCaching: [
    {
      // Кеширование страниц приложения (HTML)
      urlPattern: /^https?.*\.(html)$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60 // 24 часа
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      // Кеширование статических ресурсов (JS, CSS)
      urlPattern: /^https?.*\.(js|css)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
        }
      }
    },
    {
      // Кеширование изображений и иконок
      urlPattern: /^https?.*\.(png|jpg|jpeg|svg|gif|webp|ico)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 дней
        }
      }
    },
    {
      // Кеширование шрифтов
      urlPattern: /^https?.*\.(woff|woff2|ttf|otf|eot)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 год
        }
      }
    },
    {
      // Кеширование API запросов (с приоритетом сети)
      urlPattern: /^https?.*\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60 // 5 минут
        },
        networkTimeoutSeconds: 5
      }
    },
    {
      // Stale-While-Revalidate для данных займа (показываем старые, обновляем в фоне)
      urlPattern: /^https?.*\/api\/(loans|repayment).*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'loan-data-cache',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 // 1 час
        }
      }
    }
  ],
  
  // Офлайн fallback страница
  fallbacks: {
    document: '/_offline'
  },
  
  // Дополнительные настройки
  buildExcludes: [/middleware-manifest\.json$/],
  
  // Публичные исключения (не кешировать)
  publicExcludes: ['!robots.txt', '!sitemap.xml']
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withPWA(nextConfig);

