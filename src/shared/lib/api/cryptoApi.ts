/**
 * API для работы с криптовалютами
 * Использует CoinGecko API (бесплатный, без ключа)
 */

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

export interface BTCPrice {
  usd: number;
  usd_24h_change: number;
  last_updated_at: number;
}

export interface CryptoStats {
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  last_updated: string;
}

/**
 * Получить текущую цену Bitcoin в USD
 */
export async function getBTCPrice(): Promise<BTCPrice> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch BTC price');
    }

    const data = await response.json();
    
    return {
      usd: data.bitcoin.usd,
      usd_24h_change: data.bitcoin.usd_24h_change,
      last_updated_at: data.bitcoin.last_updated_at,
    };
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    // Возвращаем fallback значение
    return {
      usd: 45000,
      usd_24h_change: 0,
      last_updated_at: Date.now() / 1000,
    };
  }
}

/**
 * Получить детальную статистику Bitcoin
 */
export async function getBTCStats(): Promise<CryptoStats> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&ids=bitcoin`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch BTC stats');
    }

    const data = await response.json();
    const btc = data[0];

    return {
      current_price: btc.current_price,
      market_cap: btc.market_cap,
      total_volume: btc.total_volume,
      high_24h: btc.high_24h,
      low_24h: btc.low_24h,
      price_change_24h: btc.price_change_24h,
      price_change_percentage_24h: btc.price_change_percentage_24h,
      last_updated: btc.last_updated,
    };
  } catch (error) {
    console.error('Error fetching BTC stats:', error);
    throw error;
  }
}

/**
 * Конвертировать BTC в USD
 */
export async function convertBTCtoUSD(btcAmount: number): Promise<number> {
  const price = await getBTCPrice();
  return btcAmount * price.usd;
}

/**
 * Конвертировать USD в BTC
 */
export async function convertUSDtoBTC(usdAmount: number): Promise<number> {
  const price = await getBTCPrice();
  return usdAmount / price.usd;
}

