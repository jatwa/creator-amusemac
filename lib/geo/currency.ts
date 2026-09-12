import { CurrencyCode, CurrencyConfig, GeoDetectionResult } from "./types";

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "🇮🇳",
    rateFromUSD: 84,
    symbolPosition: "prefix",
    razorpaySupported: true,
    subunitRatio: 100,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    rateFromUSD: 1,
    symbolPosition: "prefix",
    razorpaySupported: true,
    subunitRatio: 100,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "🇬🇧",
    rateFromUSD: 0.78,
    symbolPosition: "prefix",
    razorpaySupported: true,
    subunitRatio: 100,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "🇪🇺",
    rateFromUSD: 0.92,
    symbolPosition: "prefix",
    razorpaySupported: true,
    subunitRatio: 100,
  },
  AED: {
    code: "AED",
    symbol: "AED ",
    name: "UAE Dirham",
    flag: "🇦🇪",
    rateFromUSD: 3.67,
    symbolPosition: "prefix",
    razorpaySupported: true,
    subunitRatio: 100,
  },
};

// EU and EEA country codes that use EUR
export const EUR_COUNTRIES = new Set([
  "AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES", "HR",
  "BG", "CZ", "DK", "HU", "PL", "RO", "SE"
]);

/**
 * Determine display currency based on ISO 2-letter country code
 */
export function getCurrencyForCountry(countryCode?: string | null): {
  currency: CurrencyCode;
  country: string;
  countryName: string;
} {
  const code = (countryCode || "").toUpperCase().trim();

  if (code === "IN") {
    return { currency: "INR", country: "IN", countryName: "India" };
  }
  if (code === "US") {
    return { currency: "USD", country: "US", countryName: "United States" };
  }
  if (code === "GB" || code === "UK") {
    return { currency: "GBP", country: "GB", countryName: "United Kingdom" };
  }
  if (code === "AE") {
    return { currency: "AED", country: "AE", countryName: "United Arab Emirates" };
  }
  if (EUR_COUNTRIES.has(code)) {
    return { currency: "EUR", country: code, countryName: "European Union" };
  }

  // Fallback default is USD
  return { currency: "USD", country: code || "GLOBAL", countryName: "International" };
}

/**
 * Convert USD amount to target currency with clean marketing rounding
 */
export function convertPrice(
  usdAmount: number,
  targetCurrency: CurrencyCode,
  customOverrides?: Partial<Record<CurrencyCode, number>>
): number {
  if (customOverrides && customOverrides[targetCurrency] !== undefined) {
    return customOverrides[targetCurrency]!;
  }

  if (targetCurrency === "USD") {
    return usdAmount;
  }

  const config = SUPPORTED_CURRENCIES[targetCurrency];
  const converted = usdAmount * config.rateFromUSD;

  // Aesthetic pricing rounders
  if (targetCurrency === "INR") {
    // For INR, round to psychological numbers like ending in 99 or 499/999
    if (converted <= 1000) {
      return Math.round(converted / 50) * 50 - 1; // e.g. 749, 799
    }
    return Math.round(converted / 100) * 100 - 1; // e.g. 1499, 3999
  }

  if (targetCurrency === "AED") {
    return Math.round(converted);
  }

  if (targetCurrency === "GBP" || targetCurrency === "EUR") {
    return Math.ceil(converted);
  }

  return Math.round(converted);
}

/**
 * Format price in specified currency
 */
export function formatCurrencyPrice(
  amount: number,
  currency: CurrencyCode
): string {
  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.USD;
  const formattedNumber = new Intl.NumberFormat(
    currency === "INR" ? "en-IN" : "en-US",
    {
      maximumFractionDigits: 0,
    }
  ).format(amount);

  if (config.symbolPosition === "prefix") {
    return `${config.symbol}${formattedNumber}`;
  }
  return `${formattedNumber} ${config.symbol}`;
}

/**
 * Preset pricing configurations for Pro Prompts Vault & Creator Intel Memberships
 */
export const VAULT_PRICING_PLANS = [
  {
    id: "vault-lifetime",
    name: "Lifetime Director Access",
    tagline: "One-time investment. All future model updates, tokens & recipes included forever.",
    badge: "Most Popular",
    isPopular: true,
    priceUSD: 49,
    period: "lifetime" as const,
    customPrices: {
      USD: 49,
      INR: 3999,
      GBP: 39,
      EUR: 45,
      AED: 179,
    },
    features: [
      "Immediate unlock to all 65+ Pro Cinematic Prompts",
      "Negative prompt formulas for Runway Gen-3, Kling 1.5, Veo & Flux",
      "Camera & Lens optics token matrix (35mm, 70mm IMAX, Anamorphic)",
      "High-converting commercial lighting blueprints",
      "All future model releases & updates free forever",
      "Commercial rights for video production & client work",
      "Direct copy-paste prompt token builder",
    ],
  },
  {
    id: "vault-annual",
    name: "Pro Annual Pass",
    tagline: "Full access for 12 months with continuous weekly prompt drops.",
    badge: "Save 70%",
    isPopular: false,
    priceUSD: 29,
    period: "year" as const,
    customPrices: {
      USD: 29,
      INR: 2499,
      GBP: 24,
      EUR: 28,
      AED: 109,
    },
    features: [
      "Access to all 65+ Pro Prompts for 1 full year",
      "Weekly verified prompt drops for new model updates",
      "Cinematic lighting & director shot recipes",
      "Commercial usage license",
      "Priority editorial review & support",
    ],
  },
  {
    id: "vault-monthly",
    name: "Pro Monthly",
    tagline: "Flexible month-to-month access for active project productions.",
    isPopular: false,
    priceUSD: 9,
    period: "month" as const,
    customPrices: {
      USD: 9,
      INR: 799,
      GBP: 7,
      EUR: 8,
      AED: 35,
    },
    features: [
      "Monthly access to all Pro prompt recipes",
      "Standard camera & lens token syntax",
      "Commercial license during active subscription",
      "Cancel anytime with 1-click",
    ],
  },
];
