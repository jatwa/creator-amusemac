import { queryNeon } from "@/lib/db/neon";
import { getUserSubscription } from "@/lib/db/subscription-repo";
import { getCreatorIntelligencePlan } from "@/lib/creator-intelligence-plans";
import type { SubscriptionTier } from "@/lib/db/subscription-repo";
import type { CreatorIntelligenceActionId } from "@/lib/creator-intelligence-actions";

type UsageRow = {
  period_start: string;
  period_end: string | null;
  tier: SubscriptionTier;
  token_limit: number;
  use_limit: number;
  tokens_used: number;
  uses_used: number;
};

export type CreatorIntelligenceUsage = {
  tier: SubscriptionTier;
  periodStart: string;
  periodEnd: string | null;
  tokenLimit: number;
  useLimit: number;
  tokensUsed: number;
  usesUsed: number;
  tokensRemaining: number;
  usesRemaining: number;
};

let schemaReady = false;

export async function ensureCreatorIntelligenceUsageTables(): Promise<boolean> {
  if (schemaReady) return true;
  const result = await queryNeon(`
    CREATE TABLE IF NOT EXISTS creator_intelligence_usage (
      user_id VARCHAR(128) NOT NULL,
      period_start TIMESTAMP WITH TIME ZONE NOT NULL,
      period_end TIMESTAMP WITH TIME ZONE,
      tier VARCHAR(16) NOT NULL DEFAULT 'free',
      token_limit INTEGER NOT NULL,
      use_limit INTEGER NOT NULL,
      tokens_used INTEGER NOT NULL DEFAULT 0,
      uses_used INTEGER NOT NULL DEFAULT 0,
      reserved_tokens INTEGER NOT NULL DEFAULT 0,
      reserved_uses INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, period_start)
    );

    CREATE TABLE IF NOT EXISTS creator_intelligence_usage_events (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) NOT NULL,
      period_start TIMESTAMP WITH TIME ZONE NOT NULL,
      action_id VARCHAR(64) NOT NULL,
      status VARCHAR(32) NOT NULL,
      estimated_tokens INTEGER NOT NULL DEFAULT 0,
      actual_tokens INTEGER NOT NULL DEFAULT 0,
      provider VARCHAR(64),
      model VARCHAR(128),
      error_code VARCHAR(128),
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_ci_usage_events_user_period
      ON creator_intelligence_usage_events(user_id, period_start, created_at DESC);
  `);
  schemaReady = result !== null;
  return schemaReady;
}

function periodStartForSubscription(subscription: Awaited<ReturnType<typeof getUserSubscription>>) {
  return subscription.currentPeriodStart
    ? new Date(subscription.currentPeriodStart)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
}

async function ensureUsageRow(userId: string) {
  const subscription = await getUserSubscription(userId);
  const plan = getCreatorIntelligencePlan(subscription.tier);
  const periodStart = periodStartForSubscription(subscription);
  const periodEnd = subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null;

  await ensureCreatorIntelligenceUsageTables();

  await queryNeon(
    `INSERT INTO creator_intelligence_usage (
      user_id, period_start, period_end, tier, token_limit, use_limit
    ) VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (user_id, period_start) DO UPDATE SET
      period_end = EXCLUDED.period_end,
      tier = EXCLUDED.tier,
      token_limit = EXCLUDED.token_limit,
      use_limit = EXCLUDED.use_limit,
      updated_at = CURRENT_TIMESTAMP`,
    [
      userId,
      periodStart.toISOString(),
      periodEnd?.toISOString() || null,
      subscription.tier,
      plan.aiTokensPerPeriod,
      plan.aiUsesPerPeriod,
    ]
  );

  return { subscription, plan, periodStart };
}

export async function getCreatorIntelligenceUsage(userId: string): Promise<CreatorIntelligenceUsage | null> {
  if (!userId) return null;
  const { plan, periodStart } = await ensureUsageRow(userId);
  const result = await queryNeon<UsageRow>(
    `SELECT period_start, period_end, tier, token_limit, use_limit, tokens_used, uses_used
     FROM creator_intelligence_usage
     WHERE user_id = $1 AND period_start = $2`,
    [userId, periodStart.toISOString()]
  );
  if (!result?.rows[0]) return null;
  const row = result.rows[0];

  return {
    tier: row.tier,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    tokenLimit: row.token_limit || plan.aiTokensPerPeriod,
    useLimit: row.use_limit || plan.aiUsesPerPeriod,
    tokensUsed: row.tokens_used,
    usesUsed: row.uses_used,
    tokensRemaining: Math.max(0, row.token_limit - row.tokens_used),
    usesRemaining: Math.max(0, row.use_limit - row.uses_used),
  };
}

export async function reserveCreatorIntelligenceUsage(
  userId: string,
  actionId: CreatorIntelligenceActionId,
  estimatedTokens: number,
  metadata: Record<string, unknown> = {}
): Promise<{ ok: true; eventId: string; periodStart: string } | { ok: false; reason: "insufficient_tokens" | "usage_limit" | "database" }> {
  if (!userId || estimatedTokens <= 0) return { ok: false, reason: "database" };
  const { periodStart } = await ensureUsageRow(userId);
  const eventId = `ci_evt_${userId.slice(0, 8)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const result = await queryNeon(
    `UPDATE creator_intelligence_usage
     SET reserved_tokens = reserved_tokens + $3,
         reserved_uses = reserved_uses + 1,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1
       AND period_start = $2
       AND tokens_used + reserved_tokens + $3 <= token_limit
       AND uses_used + reserved_uses + 1 <= use_limit
     RETURNING user_id`,
    [userId, periodStart.toISOString(), estimatedTokens]
  );

  if (!result || result.rowCount === 0) {
    const usage = await getCreatorIntelligenceUsage(userId);
    if (!usage) return { ok: false, reason: "database" };
    return usage.tokensRemaining < estimatedTokens ? { ok: false, reason: "insufficient_tokens" } : { ok: false, reason: "usage_limit" };
  }

  const inserted = await queryNeon(
    `INSERT INTO creator_intelligence_usage_events (
      id, user_id, period_start, action_id, status, estimated_tokens, metadata
    ) VALUES ($1, $2, $3, $4, 'reserved', $5, $6)`,
    [eventId, userId, periodStart.toISOString(), actionId, estimatedTokens, JSON.stringify(metadata)]
  );

  if (!inserted) return { ok: false, reason: "database" };
  return { ok: true, eventId, periodStart: periodStart.toISOString() };
}

export async function settleCreatorIntelligenceUsage(args: {
  userId: string;
  eventId: string;
  actualTokens: number;
  status: "completed" | "failed" | "cancelled";
  provider?: string;
  model?: string;
  errorCode?: string;
  metadata?: Record<string, unknown>;
}) {
  await ensureCreatorIntelligenceUsageTables();
  const event = await queryNeon<any>(
    `SELECT estimated_tokens, period_start FROM creator_intelligence_usage_events
     WHERE id = $1 AND user_id = $2 LIMIT 1`,
    [args.eventId, args.userId]
  );
  if (!event?.rows[0]) return false;

  const estimated = Number(event.rows[0].estimated_tokens) || 0;
  const actual = Math.max(0, Math.round(args.actualTokens || 0));
  const periodStart = event.rows[0].period_start;

  await queryNeon(
    `UPDATE creator_intelligence_usage
     SET reserved_tokens = GREATEST(0, reserved_tokens - $3),
         reserved_uses = GREATEST(0, reserved_uses - 1),
         tokens_used = tokens_used + CASE WHEN $4 = 'completed' THEN $5 ELSE 0 END,
         uses_used = uses_used + CASE WHEN $4 = 'completed' THEN 1 ELSE 0 END,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $1 AND period_start = $2`,
    [args.userId, periodStart, estimated, args.status, actual]
  );

  await queryNeon(
    `UPDATE creator_intelligence_usage_events
     SET status = $3, actual_tokens = CASE WHEN $3 = 'completed' THEN $4 ELSE 0 END,
         provider = $5, model = $6, error_code = $7, metadata = $8
     WHERE id = $1 AND user_id = $2`,
    [
      args.eventId,
      args.userId,
      args.status,
      actual,
      args.provider || null,
      args.model || null,
      args.errorCode || null,
      JSON.stringify(args.metadata || {}),
    ]
  );

  return true;
}
