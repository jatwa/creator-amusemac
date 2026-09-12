"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { CurrencyCode, CurrencyConfig, GeoDetectionResult } from "@/lib/geo/types";
import {
  SUPPORTED_CURRENCIES,
  convertPrice,
  formatCurrencyPrice,
} from "@/lib/geo/currency";

const STORAGE_KEY = "creator_intel_currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  detectedCountry: string;
  countryName: string;
  isAutoDetected: boolean;
  isLoading: boolean;
  supportedCurrencies: CurrencyConfig[];
  setCurrency: (code: CurrencyCode) => void;
  resetToAutoDetect: () => void;
  formatPrice: (usdAmount: number, customOverrides?: Partial<Record<CurrencyCode, number>>) => string;
  getPrice: (usdAmount: number, customOverrides?: Partial<Record<CurrencyCode, number>>) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [detectedCountry, setDetectedCountry] = useState<string>("US");
  const [countryName, setCountryName] = useState<string>("United States");
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize geo-detection & localStorage preference
  useEffect(() => {
    let isMounted = true;

    async function initCurrency() {
      try {
        const storedCurrency = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
        
        if (storedCurrency && SUPPORTED_CURRENCIES[storedCurrency]) {
          if (isMounted) {
            setCurrencyState(storedCurrency);
            setIsAutoDetected(false);
            setIsLoading(false);
          }
          return;
        }

        // Call our lightweight geo endpoint
        const res = await fetch("/api/geo");
        if (res.ok) {
          const data: GeoDetectionResult = await res.json();
          if (isMounted) {
            setCurrencyState(data.currency);
            setDetectedCountry(data.country);
            setCountryName(data.countryName);
            setIsAutoDetected(true);
          }
        }
      } catch (err) {
        console.warn("[Currency Detection Warning]:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initCurrency();

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyState(code);
      setIsAutoDetected(false);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch (e) {
        // Storage might be restricted
      }
    }
  }, []);

  const resetToAutoDetect = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setIsLoading(true);
      const res = await fetch("/api/geo");
      if (res.ok) {
        const data: GeoDetectionResult = await res.json();
        setCurrencyState(data.currency);
        setDetectedCountry(data.country);
        setCountryName(data.countryName);
        setIsAutoDetected(true);
      }
    } catch (err) {
      console.warn("[Reset Geo Currency Warning]:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatPrice = useCallback(
    (usdAmount: number, customOverrides?: Partial<Record<CurrencyCode, number>>) => {
      const converted = convertPrice(usdAmount, currency, customOverrides);
      return formatCurrencyPrice(converted, currency);
    },
    [currency]
  );

  const getPrice = useCallback(
    (usdAmount: number, customOverrides?: Partial<Record<CurrencyCode, number>>) => {
      return convertPrice(usdAmount, currency, customOverrides);
    },
    [currency]
  );

  const currencyConfig = useMemo(
    () => SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD,
    [currency]
  );

  const supportedCurrenciesList = useMemo(
    () => Object.values(SUPPORTED_CURRENCIES),
    []
  );

  const value = useMemo(
    () => ({
      currency,
      currencyConfig,
      detectedCountry,
      countryName,
      isAutoDetected,
      isLoading,
      supportedCurrencies: supportedCurrenciesList,
      setCurrency,
      resetToAutoDetect,
      formatPrice,
      getPrice,
    }),
    [
      currency,
      currencyConfig,
      detectedCountry,
      countryName,
      isAutoDetected,
      isLoading,
      supportedCurrenciesList,
      setCurrency,
      resetToAutoDetect,
      formatPrice,
      getPrice,
    ]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      currency: "USD",
      currencyConfig: SUPPORTED_CURRENCIES.USD,
      detectedCountry: "US",
      countryName: "United States",
      isAutoDetected: true,
      isLoading: false,
      supportedCurrencies: Object.values(SUPPORTED_CURRENCIES),
      setCurrency: () => {},
      resetToAutoDetect: () => {},
      formatPrice: (usd) => `$${usd}`,
      getPrice: (usd) => usd,
    };
  }
  return context;
}
