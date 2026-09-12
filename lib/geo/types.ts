export type CurrencyCode = "INR" | "USD" | "GBP" | "EUR" | "AED";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rateFromUSD: number;
  symbolPosition: "prefix" | "suffix";
  razorpaySupported: boolean;
  subunitRatio: number; // 100 for cents/paise
}

export interface GeoDetectionResult {
  country: string;
  countryName: string;
  currency: CurrencyCode;
  symbol: string;
  isAutoDetected: boolean;
  source: "vercel_geo" | "cloudflare" | "custom_header" | "fallback";
}

export interface PricingPlanTier {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  priceUSD: number;
  period: "month" | "year" | "lifetime";
  customPrices?: Partial<Record<CurrencyCode, number>>;
  features: string[];
}
