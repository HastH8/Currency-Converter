export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface FavoriteConversion {
  id: string;
  from: string;
  to: string;
  timestamp: number;
}

export type Theme = 'light' | 'dark' | 'blue';