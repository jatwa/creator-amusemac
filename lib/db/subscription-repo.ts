import { queryNeon } from "./neon";
import { BASIC_TIER_MONTHLY_LIMIT } from "@/lib/payment/razorpay-subscription";
import {
  resolveTierFromPaddlePrice,
  resolveBillingCycleFromPaddlePrice,
} from "@/lib/paddle/config";

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
  paddleSubscriptionId?: string | null;
  paddleCustomerId?: string | null;
  provider?: "razorpay" | "paddle" | "free";
  monthlyUnlocksUsed: number;
  monthlyUnlocksLimit: number; // 25 for basic, infinity for pro, 0 for free
  unlockedPromptIds: string[];
}

/**
 * Fetch or initialize a user's subscription profile and usage.
 * Preserves backward compatibility across both Razorpay and Paddle subscriptions.
 */
export async function getUserSubscription(userId: string): Promise<UserSubscriptionInfo> {
  const defaultFreeInfo: UserSubscriptionInfo = {
    tier: "free",
    status: "active",
    billingCycle: "monthly",
    currentPeriodStart: null,
    currentPeriodEnd: null,
    razorpaySubscriptionId: null,
    paddleSubscriptionId: null,
    paddleCustomerId: null,
    provider: "free",
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
    let paddleSubscriptionId: string | null = null;
    let paddleCustomerId: string | null = null;
    let provider: "razorpay" | "paddle" | "free" = "free";

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
      paddleSubscriptionId = sub.paddle_subscription_id || null;
      paddleCustomerId = sub.paddle_customer_id || null;
      provider = (sub.provider as "razorpay" | "paddle") || (sub.paddle_subscription_id ? "paddle" : sub.razorpay_subscription_id ? "razorpay" : "free");
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
      paddleSubscriptionId,
      paddleCustomerId,
      provider,
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
      id, user_id, tier, billing_cycle, status, provider,
      razorpay_customer_id, razorpay_subscription_id, razorpay_plan_id,
      current_period_start, current_period_end, updated_at
    ) VALUES ($1, $2, $3, $4, $5, 'razorpay', $6, $7, $8, $9, $10, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
      tier = EXCLUDED.tier,
      billing_cycle = EXCLUDED.billing_cycle,
      status = EXCLUDED.status,
      provider = 'razorpay',
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

/**
 * Upsert Paddle Customer mirror
 */
export async function upsertPaddleCustomer(
  customerId: string,
  email: string,
  userId?: string
): Promise<boolean> {
  if (!customerId || !email) return false;

  const res = await queryNeon(
    `INSERT INTO paddle_customers (customer_id, email, user_id, updated_at)
     VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
     ON CONFLICT (customer_id) DO UPDATE SET
       email = EXCLUDED.email,
       user_id = COALESCE(EXCLUDED.user_id, paddle_customers.user_id),
       updated_at = CURRENT_TIMESTAMP`,
    [customerId, email.toLowerCase(), userId || null]
  );

  return res !== null;
}

/**
 * Link any unlinked Paddle subscriptions matching a user's verified email.
 */
export async function linkPendingSubscriptionsToUser(
  userId: string,
  email: string
): Promise<void> {
  if (!userId || !email) return;

  try {
    // 1. Check if user is linked in paddle_customers
    await queryNeon(
      `UPDATE paddle_customers SET user_id = $1 WHERE LOWER(email) = LOWER($2) AND (user_id IS NULL OR user_id = $1)`,
      [userId, email]
    );

    // 2. Link unlinked subscriptions matching this email/customer
    await queryNeon(
      `UPDATE subscriptions s
       SET user_id = $1, updated_at = CURRENT_TIMESTAMP
       FROM paddle_customers pc
       WHERE s.paddle_customer_id = pc.customer_id
         AND LOWER(pc.email) = LOWER($2)
         AND (s.user_id LIKE 'unlinked_%' OR s.user_id = $1)`,
      [userId, email]
    );
  } catch (err: any) {
    console.warn("[Link Pending Subscriptions Warning]:", err.message);
  }
}

/**
 * Idempotent upsert for Paddle Subscriptions across all lifecycle events.
 * Keyed deterministically on `sub_pdl_${paddleSubscriptionId}` to prevent duplicate records.
 */
export async function upsertPaddleSubscriptionRecord(data: {
  paddleSubscriptionId: string;
  paddleCustomerId: string;
  status: string; // 'active', 'trialing', 'past_due', 'paused', 'canceled'
  userId?: string;
  customerEmail?: string;
  tier?: SubscriptionTier;
  billingCycle?: BillingCycle;
  paddlePriceId?: string;
  paddleTransactionId?: string;
  paddleScheduledChange?: Date | null;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  customData?: Record<string, any>;
}): Promise<boolean> {
  const {
    paddleSubscriptionId,
    paddleCustomerId,
    status: paddleStatus,
    customerEmail,
    customData = {},
  } = data;

  if (!paddleSubscriptionId || !paddleCustomerId) {
    console.error("[Paddle Subscription Repo] Missing subscriptionId or customerId");
    return false;
  }

  // 1. Resolve or lookup user ID
  let resolvedUserId = data.userId || customData?.userId;

  if (!resolvedUserId && customerEmail) {
    const userRes = await queryNeon<any>(
      `SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`,
      [customerEmail]
    );
    if (userRes && userRes.rows.length > 0) {
      resolvedUserId = userRes.rows[0].id;
    }
  }

  if (!resolvedUserId) {
    // Check if paddle_customers mirror already knows this user
    const pcRes = await queryNeon<any>(
      `SELECT user_id FROM paddle_customers WHERE customer_id = $1 AND user_id IS NOT NULL LIMIT 1`,
      [paddleCustomerId]
    );
    if (pcRes && pcRes.rows.length > 0 && pcRes.rows[0].user_id) {
      resolvedUserId = pcRes.rows[0].user_id;
    }
  }

  // If still unlinked, store a deterministic unlinked ID that will auto-link upon user login
  const finalUserId = resolvedUserId || `unlinked_${paddleCustomerId}`;

  // 2. Resolve Tier and Billing Cycle
  const resolvedTier: SubscriptionTier =
    data.tier ||
    resolveTierFromPaddlePrice(data.paddlePriceId, customData?.tier);

  const resolvedBillingCycle: BillingCycle =
    data.billingCycle ||
    resolveBillingCycleFromPaddlePrice(
      data.paddlePriceId,
      customData?.billingCycle
    );

  // 3. Map Paddle status to internal SubscriptionStatus
  let internalStatus: SubscriptionStatus = "active";
  if (paddleStatus === "canceled" || paddleStatus === "cancelled") {
    internalStatus = "cancelled";
  } else if (paddleStatus === "past_due") {
    internalStatus = "past_due";
  } else if (paddleStatus === "paused") {
    internalStatus = "cancelled";
  } else if (paddleStatus === "active" || paddleStatus === "trialing") {
    internalStatus = "active";
  }

  // 4. Default Period Dates
  const periodStart = data.currentPeriodStart || new Date();
  const periodEnd =
    data.currentPeriodEnd ||
    new Date(
      periodStart.getTime() +
        (resolvedBillingCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000
    );

  const deterministicSubId = `sub_pdl_${paddleSubscriptionId}`;

  // 5. Mirror customer table if email is present
  if (customerEmail) {
    await upsertPaddleCustomer(paddleCustomerId, customerEmail, resolvedUserId);
  }

  // 6. Idempotent Upsert to subscriptions table
  const res = await queryNeon(
    `INSERT INTO subscriptions (
      id, user_id, tier, billing_cycle, status, provider,
      paddle_customer_id, paddle_subscription_id, paddle_price_id, paddle_transaction_id,
      paddle_status, paddle_scheduled_change, paddle_custom_data,
      current_period_start, current_period_end, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, 'paddle',
      $6, $7, $8, $9,
      $10, $11, $12,
      $13, $14, CURRENT_TIMESTAMP
    )
    ON CONFLICT (id) DO UPDATE SET
      user_id = CASE WHEN EXCLUDED.user_id NOT LIKE 'unlinked_%' THEN EXCLUDED.user_id ELSE subscriptions.user_id END,
      tier = EXCLUDED.tier,
      billing_cycle = EXCLUDED.billing_cycle,
      status = EXCLUDED.status,
      provider = 'paddle',
      paddle_customer_id = EXCLUDED.paddle_customer_id,
      paddle_subscription_id = EXCLUDED.paddle_subscription_id,
      paddle_price_id = EXCLUDED.paddle_price_id,
      paddle_transaction_id = COALESCE(EXCLUDED.paddle_transaction_id, subscriptions.paddle_transaction_id),
      paddle_status = EXCLUDED.paddle_status,
      paddle_scheduled_change = EXCLUDED.paddle_scheduled_change,
      paddle_custom_data = EXCLUDED.paddle_custom_data,
      current_period_start = EXCLUDED.current_period_start,
      current_period_end = EXCLUDED.current_period_end,
      updated_at = CURRENT_TIMESTAMP`,
    [
      deterministicSubId,
      finalUserId,
      resolvedTier,
      resolvedBillingCycle,
      internalStatus,
      paddleCustomerId,
      paddleSubscriptionId,
      data.paddlePriceId || null,
      data.paddleTransactionId || null,
      paddleStatus,
      data.paddleScheduledChange ? data.paddleScheduledChange.toISOString() : null,
      JSON.stringify(customData),
      periodStart.toISOString(),
      periodEnd.toISOString(),
    ]
  );

  return res !== null;
}
