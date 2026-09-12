import { CurrencyCode } from "@/lib/geo/types";
import { convertPrice } from "@/lib/geo/currency";

export type SubscriptionPlanKey = "basic_monthly" | "basic_yearly" | "pro_monthly" | "pro_yearly";

export const BASIC_TIER_MONTHLY_LIMIT = 25;

export interface SubscriptionTierDetails {
  id: "free" | "basic" | "pro";
  name: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  monthlyUSD: number;
  yearlyUSD: number;
  monthlyCustomPrices?: Partial<Record<CurrencyCode, number>>;
  yearlyCustomPrices?: Partial<Record<CurrencyCode, number>>;
  monthlyUnlocksLimit: number; // 0 for free, 25 for basic, infinity for pro
  features: string[];
}

export const SUBSCRIPTION_TIERS: SubscriptionTierDetails[] = [
  {
    id: "free",
    name: "Starter Studio",
    tagline: "Free access to test standard recipes and explore camera optics lexicon.",
    isPopular: false,
    monthlyUSD: 0,
    yearlyUSD: 0,
    monthlyUnlocksLimit: 0,
    features: [
      "Access to all 24+ free catalog recipes",
      "Interactive Prompt Factory translator",
      "Camera & Lens optical lexicon access",
      "Community director workflows",
    ],
  },
  {
    id: "basic",
    name: "Director Basic",
    tagline: "25 Pro Vault recipe unlocks per month with verified model parameters.",
    badge: "Most Flexible",
    isPopular: false,
    monthlyUSD: 9,
    yearlyUSD: 79,
    monthlyCustomPrices: {
      USD: 9,
      INR: 499,
      GBP: 7,
      EUR: 8,
      AED: 35,
    },
    yearlyCustomPrices: {
      USD: 79,
      INR: 4499,
      GBP: 65,
      EUR: 75,
      AED: 299,
    },
    monthlyUnlocksLimit: 25,
    features: [
      "25 Pro Prompt Vault unlocks every month",
      "Monthly reset aligned with your billing cycle",
      "Tested on Runway Gen-3, Kling 1.5 & Veo",
      "Commercial production license for claimed prompts",
      "Direct copy-paste token builder access",
    ],
  },
  {
    id: "pro",
    name: "Studio Pro",
    tagline: "Unlimited access to all 65+ Pro recipes, negative sets & new weekly drops.",
    badge: "Best Value",
    isPopular: true,
    monthlyUSD: 29,
    yearlyUSD: 249,
    monthlyCustomPrices: {
      USD: 29,
      INR: 1499,
      GBP: 24,
      EUR: 27,
      AED: 109,
    },
    yearlyCustomPrices: {
      USD: 249,
      INR: 12999,
      GBP: 199,
      EUR: 229,
      AED: 949,
    },
    monthlyUnlocksLimit: 999999,
    features: [
      "Unlimited unlocks across all 65+ Pro Vault prompts",
      "Zero monthly limits — access everything instantly",
      "Master negative constraint formulas included",
      "ARRI, Panavision & Cooke lens token matrices",
      "All future model releases & weekly prompt drops",
      "Full commercial rights for client deliverables",
      "Priority Discord/VIP director channel access",
    ],
  },
];

// Razorpay Plan IDs mapping (configured via environment or dashboard)
export const RAZORPAY_PLAN_IDS: Record<SubscriptionPlanKey, string> = {
  basic_monthly: process.env.RAZORPAY_PLAN_BASIC_MONTHLY || "plan_basic_monthly_rzp",
  basic_yearly: process.env.RAZORPAY_PLAN_BASIC_YEARLY || "plan_basic_yearly_rzp",
  pro_monthly: process.env.RAZORPAY_PLAN_PRO_MONTHLY || "plan_pro_monthly_rzp",
  pro_yearly: process.env.RAZORPAY_PLAN_PRO_YEARLY || "plan_pro_yearly_rzp",
};

export interface CreateSubscriptionParams {
  tier: "basic" | "pro";
  billingCycle: "monthly" | "yearly";
  currency: CurrencyCode;
  userId: string;
  userEmail: string;
  userName?: string;
}

export interface RazorpaySubscriptionResponse {
  subscriptionId: string;
  planKey: SubscriptionPlanKey;
  amount: number; // in subunits
  displayAmount: number; // in major unit
  currency: CurrencyCode;
  keyId: string;
  shortUrl?: string;
  isMock: boolean;
}

/**
 * Initialize a recurring Razorpay subscription checkout
 */
export async function createRazorpaySubscription(
  params: CreateSubscriptionParams
): Promise<RazorpaySubscriptionResponse> {
  const planKey: SubscriptionPlanKey = `${params.tier}_${params.billingCycle}`;
  const tierConfig = SUBSCRIPTION_TIERS.find((t) => t.id === params.tier) || SUBSCRIPTION_TIERS[2];

  const customPrices =
    params.billingCycle === "yearly"
      ? tierConfig.yearlyCustomPrices
      : tierConfig.monthlyCustomPrices;

  const baseUSD =
    params.billingCycle === "yearly" ? tierConfig.yearlyUSD : tierConfig.monthlyUSD;

  const displayAmount = convertPrice(baseUSD, params.currency, customPrices);
  const subunitAmount = Math.round(displayAmount * 100);

  const keyId =
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID ||
    "rzp_test_creator_intel_demo";
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const razorpayPlanId = RAZORPAY_PLAN_IDS[planKey];

  // If live Razorpay credentials exist, create subscription via Razorpay API
  if (keySecret && !keyId.includes("demo") && !razorpayPlanId.includes("_rzp")) {
    try {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/subscriptions", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: razorpayPlanId,
          total_count: params.billingCycle === "yearly" ? 10 : 120, // 10 years or 10 years of months
          customer_notify: 1,
          quantity: 1,
          notes: {
            userId: params.userId,
            userEmail: params.userEmail,
            tier: params.tier,
            billingCycle: params.billingCycle,
            currency: params.currency,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          subscriptionId: data.id,
          planKey,
          amount: subunitAmount,
          displayAmount,
          currency: params.currency,
          keyId,
          shortUrl: data.short_url,
          isMock: false,
        };
      }
    } catch (err) {
      console.warn("[Razorpay Subscription API error, falling back to mock]:", err);
    }
  }

  // Simulated subscription for testing & development
  const simulatedSubId = `sub_${planKey}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    subscriptionId: simulatedSubId,
    planKey,
    amount: subunitAmount,
    displayAmount,
    currency: params.currency,
    keyId,
    isMock: true,
  };
}
