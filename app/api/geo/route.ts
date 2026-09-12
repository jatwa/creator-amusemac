import { NextResponse } from "next/server";
import { getCurrencyForCountry, SUPPORTED_CURRENCIES } from "@/lib/geo/currency";
import { CurrencyCode, GeoDetectionResult } from "@/lib/geo/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // Allow manual simulation or override via query parameter (e.g. ?country=IN, ?currency=INR)
  const queryCountry = searchParams.get("country");
  const queryCurrency = searchParams.get("currency") as CurrencyCode | null;

  // Extract IP country from hosting platform headers
  const headerCountry =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code") ||
    req.headers.get("x-geo-country");

  let source: GeoDetectionResult["source"] = "fallback";
  let countryCode = "US";

  if (queryCountry) {
    countryCode = queryCountry;
    source = "custom_header";
  } else if (headerCountry) {
    countryCode = headerCountry;
    source = req.headers.get("x-vercel-ip-country") ? "vercel_geo" : "cloudflare";
  }

  const { currency: detectedCurrency, country, countryName } = getCurrencyForCountry(countryCode);
  
  const finalCurrency: CurrencyCode =
    queryCurrency && SUPPORTED_CURRENCIES[queryCurrency]
      ? queryCurrency
      : detectedCurrency;

  const symbol = SUPPORTED_CURRENCIES[finalCurrency]?.symbol || "$";

  const result: GeoDetectionResult = {
    country,
    countryName,
    currency: finalCurrency,
    symbol,
    isAutoDetected: !queryCountry && !queryCurrency,
    source,
  };

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
