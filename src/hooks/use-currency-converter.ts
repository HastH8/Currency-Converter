'use client';

import { useState, useEffect, useCallback } from 'react';
import { Currency, ExchangeRate, HistoricalRate, FavoriteConversion, Theme } from '@/types/currency';
import { getCurrencyByCode } from '@/data/currencies';

interface UseCurrencyConverterReturn {
  amount: string;
  setAmount: (amount: string) => void;
  fromCurrency: string;
  setFromCurrency: (currency: string) => void;
  toCurrency: string;
  setToCurrency: (currency: string) => void;
  convertedAmount: number | null;
  isLoading: boolean;
  error: string | null;
  historicalRates: HistoricalRate[];
  favorites: FavoriteConversion[];
  theme: Theme;
  setTheme: (theme: Theme) => void;
  convert: () => Promise<void>;
  swapCurrencies: () => void;
  addToFavorites: () => void;
  removeFromFavorites: (id: string) => void;
  loadHistoricalRates: () => Promise<void>;
  selectFavoriteConversion: (favorite: FavoriteConversion) => void;
}

export function useCurrencyConverter(): UseCurrencyConverterReturn {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalRates, setHistoricalRates] = useState<HistoricalRate[]>([]);
  const [favorites, setFavorites] = useState<FavoriteConversion[]>([]);
  const [theme, setThemeState] = useState<Theme>('light');

  // Load saved data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('currency-favorites');
    const savedTheme = localStorage.getItem('currency-theme');
    const savedAmount = localStorage.getItem('currency-amount');
    const savedFrom = localStorage.getItem('currency-from');
    const savedTo = localStorage.getItem('currency-to');

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }

    if (savedTheme && ['light', 'dark', 'blue'].includes(savedTheme)) {
      setThemeState(savedTheme as Theme);
    }

    if (savedAmount) setAmount(savedAmount);
    if (savedFrom) setFromCurrency(savedFrom);
    if (savedTo) setToCurrency(savedTo);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('currency-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('currency-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('currency-amount', amount);
  }, [amount]);

  useEffect(() => {
    localStorage.setItem('currency-from', fromCurrency);
  }, [fromCurrency]);

  useEffect(() => {
    localStorage.setItem('currency-to', toCurrency);
  }, [toCurrency]);

  const convert = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/exchange-rates?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }

      const data = await response.json();
      
      if (data.rates && data.rates[toCurrency]) {
        setConvertedAmount(data.rates[toCurrency]);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setConvertedAmount(null);
    } finally {
      setIsLoading(false);
    }
  }, [amount, fromCurrency, toCurrency]);

  const swapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  }, [fromCurrency, toCurrency]);

  const addToFavorites = useCallback(() => {
    const newFavorite: FavoriteConversion = {
      id: `${fromCurrency}-${toCurrency}-${Date.now()}`,
      from: fromCurrency,
      to: toCurrency,
      timestamp: Date.now(),
    };

    const exists = favorites.some(
      (fav) => fav.from === fromCurrency && fav.to === toCurrency
    );

    if (!exists) {
      setFavorites((prev) => [...prev, newFavorite]);
    }
  }, [fromCurrency, toCurrency, favorites]);

  const removeFromFavorites = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  }, []);

  const loadHistoricalRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/exchange-rates?from=${fromCurrency}&to=${toCurrency}&historical=true`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch historical rates');
      }

      const data = await response.json();
      
      if (data.rates) {
        const rates: HistoricalRate[] = Object.entries(data.rates).map(([date, rateData]: [string, any]) => {
          // The rateData is an object with currency codes as keys
          const rate = rateData[toCurrency] || rateData;
          const parsedRate = typeof rate === 'number' ? rate : parseFloat(rate) || 0;
          return {
            date,
            rate: parsedRate,
          };
        }).filter(item => item.rate > 0); // Filter out zero rates
        setHistoricalRates(rates);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load historical data');
    } finally {
      setIsLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  const selectFavoriteConversion = useCallback((favorite: FavoriteConversion) => {
    setFromCurrency(favorite.from);
    setToCurrency(favorite.to);
    setConvertedAmount(null);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  // Auto-convert when inputs change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount && parseFloat(amount) > 0) {
        convert();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [amount, fromCurrency, toCurrency, convert]);

  // Load historical rates when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      loadHistoricalRates();
    }
  }, [fromCurrency, toCurrency, loadHistoricalRates]);

  return {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    convertedAmount,
    isLoading,
    error,
    historicalRates,
    favorites,
    theme,
    setTheme,
    convert,
    swapCurrencies,
    addToFavorites,
    removeFromFavorites,
    loadHistoricalRates,
    selectFavoriteConversion,
  };
}