import type { SubscriptionTier } from "@/lib/db/subscription-repo";

export type CreatorIntelligencePlan = {
  tier: SubscriptionTier;
  label: string;
  maxFileBytes: number;
  maxTextChars: number;
  maxPages: number;
  aiTokensPerPeriod: number;
  aiUsesPerPeriod: number;
};

export const CREATOR_INTELLIGENCE_PLANS: Record<SubscriptionTier, CreatorIntelligencePlan> = {
  free: {
    tier: "free",
    label: "Free",
    maxFileBytes: 5 * 1024 * 1024,
    maxTextChars: 15_000,
    maxPages: 30,
    aiTokensPerPeriod: 10_000,
    aiUsesPerPeriod: 20,
  },
  basic: {
    tier: "basic",
    label: "Basic",
    maxFileBytes: 25 * 1024 * 1024,
    maxTextChars: 100_000,
    maxPages: 150,
    aiTokensPerPeriod: 100_000,
    aiUsesPerPeriod: 100,
  },
  pro: {
    tier: "pro",
    label: "Pro",
    maxFileBytes: 100 * 1024 * 1024,
    maxTextChars: 500_000,
    maxPages: 500,
    aiTokensPerPeriod: 500_000,
    aiUsesPerPeriod: 500,
  },
};

export function getCreatorIntelligencePlan(tier: SubscriptionTier = "free") {
  return CREATOR_INTELLIGENCE_PLANS[tier] ?? CREATOR_INTELLIGENCE_PLANS.free;
}
