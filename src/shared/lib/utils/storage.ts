/**
 * Утилиты для работы с IndexedDB и localStorage
 * 
 * Используется для хранения данных офлайн и синхронизации
 */

const DB_NAME = 'bitcoin-loan-db';
const DB_VERSION = 1;
const STORE_NAME = 'pending-requests';

/**
 * Инициализация IndexedDB
 */
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB не поддерживается'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Создаем хранилище для отложенных запросов
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
}

/**
 * Сохранить запрос для последующей синхронизации
 */
export async function savePendingRequest(
  type: 'repayment' | 'loan',
  data: any
): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  const request = {
    type,
    data,
    timestamp: Date.now(),
  };

  return new Promise((resolve, reject) => {
    const addRequest = store.add(request);
    addRequest.onsuccess = () => resolve();
    addRequest.onerror = () => reject(addRequest.error);
  });
}

/**
 * Получить все отложенные запросы
 */
export async function getPendingRequests(): Promise<any[]> {
  const db = await initDB();
  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Удалить отложенный запрос после успешной синхронизации
 */
export async function deletePendingRequest(id: number): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Очистить все отложенные запросы
 */
export async function clearPendingRequests(): Promise<void> {
  const db = await initDB();
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/**
 * Проверка поддержки Background Sync API
 */
export function supportsBackgroundSync(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'sync' in (window as any).ServiceWorkerRegistration.prototype
  );
}

/**
 * Регистрация Background Sync
 */
export async function registerBackgroundSync(tag: string): Promise<void> {
  if (!supportsBackgroundSync()) {
    console.warn('Background Sync не поддерживается');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register(tag);
    console.log(`Background Sync зарегистрирован: ${tag}`);
  } catch (error) {
    console.error('Ошибка регистрации Background Sync:', error);
  }
}

/**
 * Кеширование данных займа в localStorage
 */
export function cacheLoanData(loanId: string, data: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = `loan_cache_${loanId}`;
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Ошибка кеширования данных займа:', error);
  }
}

/**
 * Получение закешированных данных займа
 */
export function getCachedLoanData(loanId: string): any | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = `loan_cache_${loanId}`;
    const cached = localStorage.getItem(key);
    
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    
    // Проверяем, не устарели ли данные (например, старше 1 часа)
    const maxAge = 60 * 60 * 1000; // 1 час
    if (Date.now() - parsed.timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error('Ошибка получения закешированных данных:', error);
    return null;
  }
}

