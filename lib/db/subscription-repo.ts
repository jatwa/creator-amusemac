import { queryNeon } from "./neon";
import { BASIC_TIER_MONTHLY_LIMIT } from "@/lib/payment/razorpay-subscription";

export { BASIC_TIER_MONTHLY_LIMIT };

export type SubscriptionTier = "free" | "basic" | "pro";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "past_due";
export type BillingCycle = "monthly" | "yearly";

export interface UserSubscriptionInfo {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  razorpaySubscriptionId: string | null;
  monthlyUnlocksUsed: number;
  monthlyUnlocksLimit: number; // 25 for basic, infinity for pro, 0 for free
  unlockedPromptIds: string[];
}

/**
 * Fetch or initialize a user's subscription profile and usage
 */
export async function getUserSubscription(userId: string): Promise<UserSubscriptionInfo> {
  const defaultFreeInfo: UserSubscriptionInfo = {
    tier: "free",
    status: "active",
    billingCycle: "monthly",
    currentPeriodStart: null,
    currentPeriodEnd: null,
    razorpaySubscriptionId: null,
    monthlyUnlocksUsed: 0,
    monthlyUnlocksLimit: 0,
    unlockedPromptIds: [],
  };

  if (!userId) return defaultFreeInfo;

  try {
    // 1. Query active subscription
    const subRes = await queryNeon<any>(
      `SELECT * FROM subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    let tier: SubscriptionTier = "free";
    let status: SubscriptionStatus = "active";
    let billingCycle: BillingCycle = "monthly";
    let currentPeriodStart: string | null = null;
    let currentPeriodEnd: string | null = null;
    let razorpaySubscriptionId: string | null = null;

    if (subRes && subRes.rows.length > 0) {
      const sub = subRes.rows[0];
      const now = new Date();
      const end = sub.current_period_end ? new Date(sub.current_period_end) : null;

      // Verify expiration
      if (end && now > end && sub.status === "active") {
        status = "expired";
        tier = "free";
      } else {
        tier = (sub.tier as SubscriptionTier) || "free";
        status = (sub.status as SubscriptionStatus) || "active";
      }

      billingCycle = (sub.billing_cycle as BillingCycle) || "monthly";
      currentPeriodStart = sub.current_period_start ? new Date(sub.current_period_start).toISOString() : null;
      currentPeriodEnd = sub.current_period_end ? new Date(sub.current_period_end).toISOString() : null;
      razorpaySubscriptionId = sub.razorpay_subscription_id || null;
    }

    // 2. Query prompt unlocks
    const unlocksRes = await queryNeon<any>(
      `SELECT prompt_id, unlocked_date, billing_period_start 
       FROM prompt_unlocks 
       WHERE user_id = $1`,
      [userId]
    );

    const unlockedPromptIds: string[] = [];
    let monthlyUnlocksCount = 0;

    if (unlocksRes && unlocksRes.rows.length > 0) {
      const periodStartDate = currentPeriodStart ? new Date(currentPeriodStart) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

      for (const row of unlocksRes.rows) {
        unlockedPromptIds.push(row.prompt_id);
        const unlockDate = new Date(row.unlocked_date || row.billing_period_start);
        if (unlockDate >= periodStartDate) {
          monthlyUnlocksCount++;
        }
      }
    }

    const monthlyLimit = tier === "pro" ? 999999 : tier === "basic" ? BASIC_TIER_MONTHLY_LIMIT : 0;

    return {
      tier,
      status,
      billingCycle,
      currentPeriodStart,
      currentPeriodEnd,
      razorpaySubscriptionId,
      monthlyUnlocksUsed: monthlyUnlocksCount,
      monthlyUnlocksLimit: monthlyLimit,
      unlockedPromptIds,
    };
  } catch (err: any) {
    console.warn("[Subscription Repo Error]:", err.message);
    return defaultFreeInfo;
  }
}

/**
 * Claim/unlock a prompt for a user under Basic or Pro tier
 */
export async function claimPromptUnlock(
  userId: string,
  promptId: string,
  promptSlug: string
): Promise<{ success: boolean; message: string; remainingUnlocks?: number }> {
  const sub = await getUserSubscription(userId);

  if (sub.tier === "free") {
    return {
      success: false,
      message: "Please upgrade to Basic or Pro to unlock this recipe.",
    };
  }

  // If already unlocked
  if (sub.unlockedPromptIds.includes(promptId)) {
    return {
      success: true,
      message: "Recipe already unlocked in your library.",
      remainingUnlocks: Math.max(0, sub.monthlyUnlocksLimit - sub.monthlyUnlocksUsed),
    };
  }

  // Check limit for Basic tier
  if (sub.tier === "basic" && sub.monthlyUnlocksUsed >= BASIC_TIER_MONTHLY_LIMIT) {
    return {
      success: false,
      message: `Monthly limit reached (${BASIC_TIER_MONTHLY_LIMIT}/${BASIC_TIER_MONTHLY_LIMIT} prompts used). Upgrade to Pro for unlimited unlocks.`,
    };
  }

  const unlockId = `unl_${userId.substring(0, 8)}_${promptId}_${Date.now()}`;
  const periodStart = sub.currentPeriodStart || new Date().toISOString();

  await queryNeon(
    `INSERT INTO prompt_unlocks (id, user_id, prompt_id, prompt_slug, billing_period_start, unlocked_date)
     VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, prompt_id) DO NOTHING`,
    [unlockId, userId, promptId, promptSlug, periodStart]
  );

  const newCount = sub.monthlyUnlocksUsed + 1;
  const remaining = sub.tier === "pro" ? 999999 : Math.max(0, BASIC_TIER_MONTHLY_LIMIT - newCount);

  return {
    success: true,
    message: `Recipe unlocked! ${sub.tier === "basic" ? `(${newCount}/${BASIC_TIER_MONTHLY_LIMIT} used this billing cycle)` : ""}`,
    remainingUnlocks: remaining,
  };
}

/**
 * Upsert or update subscription from Razorpay webhook / checkout events
 */
export async function upsertSubscriptionRecord(data: {
  userId: string;
  tier: SubscriptionTier;
  billingCycle: BillingCycle;
  status: SubscriptionStatus;
  razorpaySubscriptionId?: string;
  razorpayCustomerId?: string;
  razorpayPlanId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}): Promise<boolean> {
  const subId = `sub_${data.userId}_${Date.now()}`;
  const periodStart = data.currentPeriodStart || new Date();
  
  // Default 1 month or 1 year from now if not given
  const periodEnd =
    data.currentPeriodEnd ||
    new Date(
      periodStart.getTime() +
        (data.billingCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000
    );

  const res = await queryNeon(
    `INSERT INTO subscriptions (
      id, user_id, tier, billing_cycle, status, 
      razorpay_customer_id, razorpay_subscription_id, razorpay_plan_id,
      current_period_start, current_period_end, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
      tier = EXCLUDED.tier,
      billing_cycle = EXCLUDED.billing_cycle,
      status = EXCLUDED.status,
      razorpay_subscription_id = EXCLUDED.razorpay_subscription_id,
      razorpay_plan_id = EXCLUDED.razorpay_plan_id,
      current_period_start = EXCLUDED.current_period_start,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = CURRENT_TIMESTAMP`,
    [
      subId,
      data.userId,
      data.tier,
      data.billingCycle,
      data.status,
      data.razorpayCustomerId || null,
      data.razorpaySubscriptionId || null,
      data.razorpayPlanId || null,
      periodStart.toISOString(),
      periodEnd.toISOString(),
    ]
  );

  return res !== null;
}
