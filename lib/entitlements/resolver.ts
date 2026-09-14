import { SubscriptionTier, SubscriptionStatus } from "@/lib/db/subscription-repo";

export interface FeatureEntitlement {
  featureId: string;
  name: string;
  category: "Discovery" | "Directing" | "Vault" | "Toolkit" | "Commercial";
  description: string;
  free: boolean | string;
  basic: boolean | string;
  pro: boolean | string;
}

export const CANONICAL_FEATURE_MATRIX: FeatureEntitlement[] = [
  {
    featureId: "public_tool_intelligence",
    name: "AI Tool Intelligence & Scoring",
    category: "Discovery",
    description: "Full access to verified 11-question dossiers, creator verdict, strengths, limitations, and scorecards.",
    free: true,
    basic: true,
    pro: true,
  },
  {
    featureId: "tool_decision_engine",
    name: "Filmmaker Decision Engine",
    category: "Discovery",
    description: "4-question interactive wizard matching shot goals with optimal AI engines.",
    free: true,
    basic: true,
    pro: true,
  },
  {
    featureId: "head_to_head_comparisons",
    name: "Head-to-Head Comparisons",
    category: "Discovery",
    description: "Audited scenario breakdowns and side-by-side spec matrix.",
    free: true,
    basic: true,
    pro: true,
  },
  {
    featureId: "directors_studio_basic",
    name: "Director's Studio (Visual Prompting)",
    category: "Directing",
    description: "Interactive visual DoP workstation, optical rationale, recipe slip, and camera rig configurator.",
    free: true,
    basic: true,
    pro: true,
  },
  {
    featureId: "model_translators",
    name: "Engine-Specific Prompt Translators",
    category: "Directing",
    description: "Translates optical decisions into syntax for Runway Gen-3, Kling 1.5, Luma, Minimax, Flux.1, Midjourney.",
    free: true,
    basic: true,
    pro: true,
  },
  {
    featureId: "vault_recipe_access",
    name: "Director Recipe Vault Unlocks",
    category: "Vault",
    description: "Access to complete verified prompt syntax, lighting blueprints, variable controls, and negative tokens.",
    free: "Free previews only",
    basic: "25 unlocks / month",
    pro: "Unlimited unlocks (65+)",
  },
  {
    featureId: "negative_prompt_matrix",
    name: "Calibrated Negative Prompt Engine",
    category: "Directing",
    description: "Artifact-suppression negative prompts tuned per generation engine.",
    free: "Basic negatives",
    basic: true,
    pro: true,
  },
  {
    featureId: "private_film_projects",
    name: "Private Film Projects & Toolkit",
    category: "Toolkit",
    description: "Persist scenes, shot lists, visual language bible, festival submission checklist, and post pipeline.",
    free: "1 demo project",
    basic: "Up to 5 projects",
    pro: "Unlimited private projects",
  },
  {
    featureId: "shot_by_shot_breakdowns",
    name: "Shot-by-Shot Production Breakdowns",
    category: "Directing",
    description: "Real scene breakdowns with recommended models, prompt strategies, and common pitfalls.",
    free: true,
    basic: true,
    pro: true,
  },
  {
    featureId: "commercial_usage_rights",
    name: "Commercial Production License",
    category: "Commercial",
    description: "Commercial use of Director Recipes in broadcast, client, and theatrical productions.",
    free: false,
    basic: true,
    pro: true,
  },
];

export interface UserEntitlementResolution {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  monthlyUnlocksLimit: number;
  monthlyUnlocksUsed: number;
  canUnlockPrompt: boolean;
  canCreateProject: boolean;
  hasUnlimitedUnlocks: boolean;
  entitlements: Record<string, boolean | string>;
}

/**
 * Resolves user entitlement status based on their real subscription data.
 */
export function resolveUserEntitlements(
  tier: SubscriptionTier = "free",
  status: SubscriptionStatus = "active",
  monthlyUnlocksUsed: number = 0,
  unlockedPromptIds: string[] = []
): UserEntitlementResolution {
  const isExpired = status === "expired" || status === "cancelled";
  const effectiveTier: SubscriptionTier = isExpired ? "free" : tier;

  const monthlyLimit =
    effectiveTier === "pro" ? 999999 : effectiveTier === "basic" ? 25 : 0;

  const canUnlock =
    effectiveTier === "pro" ||
    (effectiveTier === "basic" && monthlyUnlocksUsed < 25);

  const entitlements: Record<string, boolean | string> = {};
  for (const feat of CANONICAL_FEATURE_MATRIX) {
    entitlements[feat.featureId] = feat[effectiveTier];
  }

  return {
    tier: effectiveTier,
    status,
    monthlyUnlocksLimit: monthlyLimit,
    monthlyUnlocksUsed,
    canUnlockPrompt: canUnlock,
    canCreateProject: effectiveTier === "pro" || effectiveTier === "basic",
    hasUnlimitedUnlocks: effectiveTier === "pro",
    entitlements,
  };
}
