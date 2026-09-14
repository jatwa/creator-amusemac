export interface PaddlePriceConfig {
  directorMonthly: string;
  directorYearly: string;
  proMonthly: string;
  proYearly: string;
}

/**
 * Returns configured Paddle Price IDs from environment variables.
 */
export function getPaddlePriceIds(): PaddlePriceConfig {
  return {
    directorMonthly:
      process.env.NEXT_PUBLIC_PADDLE_DIRECTOR_MONTHLY_PRICE_ID ||
      process.env.PADDLE_DIRECTOR_MONTHLY_PRICE_ID ||
      "",
    directorYearly:
      process.env.NEXT_PUBLIC_PADDLE_DIRECTOR_YEARLY_PRICE_ID ||
      process.env.PADDLE_DIRECTOR_YEARLY_PRICE_ID ||
      "",
    proMonthly:
      process.env.NEXT_PUBLIC_PADDLE_PRO_MONTHLY_PRICE_ID ||
      process.env.PADDLE_PRO_MONTHLY_PRICE_ID ||
      "",
    proYearly:
      process.env.NEXT_PUBLIC_PADDLE_PRO_YEARLY_PRICE_ID ||
      process.env.PADDLE_PRO_YEARLY_PRICE_ID ||
      "",
  };
}

/**
 * Resolve subscription tier ("basic" | "pro") from Paddle Price ID or customData.
 */
export function resolveTierFromPaddlePrice(
  priceId?: string,
  customTier?: string
): "basic" | "pro" {
  if (customTier === "pro" || customTier === "basic") {
    return customTier;
  }

  const prices = getPaddlePriceIds();
  if (
    priceId &&
    (priceId === prices.proMonthly || priceId === prices.proYearly)
  ) {
    return "pro";
  }

  if (
    priceId &&
    (priceId === prices.directorMonthly || priceId === prices.directorYearly)
  ) {
    return "basic";
  }

  return "basic";
}

/**
 * Resolve billing cycle ("monthly" | "yearly") from Paddle Price ID or customData.
 */
export function resolveBillingCycleFromPaddlePrice(
  priceId?: string,
  customCycle?: string,
  interval?: string
): "monthly" | "yearly" {
  if (customCycle === "yearly" || customCycle === "monthly") {
    return customCycle;
  }

  const prices = getPaddlePriceIds();
  if (
    priceId &&
    (priceId === prices.directorYearly || priceId === prices.proYearly)
  ) {
    return "yearly";
  }

  if (interval === "year") {
    return "yearly";
  }

  return "monthly";
}

/**
 * Get appropriate Paddle Price ID for a given tier and billing cycle.
 */
export function getPaddlePriceIdForTier(
  tier: "basic" | "pro",
  billingCycle: "monthly" | "yearly"
): string {
  const prices = getPaddlePriceIds();
  if (tier === "pro") {
    return billingCycle === "yearly" ? prices.proYearly : prices.proMonthly;
  }
  return billingCycle === "yearly"
    ? prices.directorYearly
    : prices.directorMonthly;
}
