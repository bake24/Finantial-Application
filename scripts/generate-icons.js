#!/usr/bin/env node

/**
 * Скрипт для генерации placeholder иконок PWA
 * 
 * Использование:
 *   node scripts/generate-icons.js
 * 
 * Создает SVG иконки нужных размеров в public/icons/
 * В production замените на настоящие PNG иконки с логотипом
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

// Размеры иконок для PWA
const ICON_SIZES = [
  72, 96, 128, 144, 152, 167, 180, 192, 384, 512
];

// Размеры splash screens для iOS
const SPLASH_SIZES = [
  { width: 640, height: 1136, name: 'splash-640x1136' },   // iPhone 5/SE
  { width: 750, height: 1334, name: 'splash-750x1334' },   // iPhone 6/7/8
  { width: 1242, height: 2208, name: 'splash-1242x2208' }, // iPhone 6+/7+/8+
  { width: 1125, height: 2436, name: 'splash-1125x2436' }, // iPhone X/XS
  { width: 1242, height: 2688, name: 'splash-1242x2688' }, // iPhone XS Max
];

// Создаем директорию, если не существует
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
  console.log('✅ Создана директория:', ICONS_DIR);
}

/**
 * Генерация SVG иконки с логотипом Bitcoin
 */
function generateSVGIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Фон -->
  <rect width="${size}" height="${size}" fill="#f7931a" rx="${size * 0.15}"/>
  
  <!-- Bitcoin символ -->
  <g transform="translate(${size * 0.25}, ${size * 0.25})">
    <!-- Внешний круг -->
    <circle cx="${size * 0.25}" cy="${size * 0.25}" r="${size * 0.22}" fill="white"/>
    
    <!-- Bitcoin символ ₿ -->
    <path d="M ${size * 0.25} ${size * 0.1} 
             L ${size * 0.25} ${size * 0.4}
             L ${size * 0.35} ${size * 0.4}
             C ${size * 0.4} ${size * 0.4}, ${size * 0.42} ${size * 0.35}, ${size * 0.42} ${size * 0.3}
             C ${size * 0.42} ${size * 0.25}, ${size * 0.4} ${size * 0.2}, ${size * 0.35} ${size * 0.2}
             L ${size * 0.25} ${size * 0.2}
             M ${size * 0.25} ${size * 0.2}
             L ${size * 0.37} ${size * 0.2}
             C ${size * 0.43} ${size * 0.2}, ${size * 0.45} ${size * 0.15}, ${size * 0.45} ${size * 0.1}
             C ${size * 0.45} ${size * 0.05}, ${size * 0.43} ${size * 0}, ${size * 0.37} ${size * 0}
             L ${size * 0.25} ${size * 0}"
          fill="#f7931a" stroke="#f7931a" stroke-width="${size * 0.03}"/>
  </g>
  
  <!-- Текст -->
  <text x="${size * 0.5}" y="${size * 0.85}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.12}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle">
    BTC LOAN
  </text>
</svg>`;
}

/**
 * Генерация SVG splash screen
 */
function generateSVGSplash(width, height) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Градиентный фон -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f7931a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff6b35;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="${width}" height="${height}" fill="url(#grad)"/>
  
  <!-- Логотип в центре -->
  <g transform="translate(${width * 0.3}, ${height * 0.35})">
    <circle cx="${width * 0.2}" cy="${height * 0.15}" r="${Math.min(width, height) * 0.15}" fill="white"/>
    <path d="M ${width * 0.2} ${height * 0.05} 
             L ${width * 0.2} ${height * 0.25}"
          stroke="#f7931a" stroke-width="${Math.min(width, height) * 0.03}" stroke-linecap="round"/>
  </g>
  
  <!-- Название приложения -->
  <text x="${width * 0.5}" y="${height * 0.65}" 
        font-family="Arial, sans-serif" 
        font-size="${Math.min(width, height) * 0.08}" 
        font-weight="bold" 
        fill="white" 
        text-anchor="middle">
    Bitcoin Loan App
  </text>
</svg>`;
}

/**
 * Сохранение SVG в файл
 */
function saveSVG(filename, content) {
  const filepath = path.join(ICONS_DIR, filename);
  fs.writeFileSync(filepath, content, 'utf8');
  console.log(`✅ Создан: ${filename}`);
}

// Генерация иконок
console.log('\n📱 Генерация PWA иконок...\n');

ICON_SIZES.forEach(size => {
  const svg = generateSVGIcon(size);
  saveSVG(`icon-${size}x${size}.png.svg`, svg);
});

// Генерация splash screens
console.log('\n🎨 Генерация iOS splash screens...\n');

SPLASH_SIZES.forEach(({ width, height, name }) => {
  const svg = generateSVGSplash(width, height);
  saveSVG(`${name}.png.svg`, svg);
});

console.log('\n✨ Готово!\n');
console.log('⚠️  ВАЖНО: Это placeholder файлы в формате SVG.');
console.log('📌 Для production конвертируйте их в PNG или создайте настоящие иконки.');
console.log('\nРекомендации:');
console.log('1. Используйте https://realfavicongenerator.net/ для генерации');
console.log('2. Или конвертируйте SVG в PNG: https://cloudconvert.com/svg-to-png');
console.log('3. Убедитесь, что иконки имеют прозрачный фон или белый');
console.log('4. Размеры должны быть точными (без масштабирования)');
console.log('\n');

