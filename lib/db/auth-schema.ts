import { queryNeon } from "./neon";

/**
 * Initialize all tables required for NextAuth.js authentication,
 * Razorpay recurring subscriptions, and prompt unlock tracking.
 */
export async function initAuthAndSubscriptionTables(): Promise<boolean> {
  const schemaSql = `
    -- 1. NEXTAUTH USERS
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(128) PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      email_verified TIMESTAMP WITH TIME ZONE,
      image VARCHAR(512),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. NEXTAUTH ACCOUNTS
    CREATE TABLE IF NOT EXISTS accounts (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(64) NOT NULL,
      provider VARCHAR(64) NOT NULL,
      provider_account_id VARCHAR(255) NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at BIGINT,
      token_type VARCHAR(64),
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unq_provider_account UNIQUE(provider, provider_account_id)
    );

    -- 3. NEXTAUTH SESSIONS
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(128) PRIMARY KEY,
      session_token VARCHAR(512) UNIQUE NOT NULL,
      user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMP WITH TIME ZONE NOT NULL
    );

    -- 4. NEXTAUTH VERIFICATION TOKENS
    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier VARCHAR(255) NOT NULL,
      token VARCHAR(512) NOT NULL,
      expires TIMESTAMP WITH TIME ZONE NOT NULL,
      PRIMARY KEY (identifier, token)
    );

    -- 5. SUBSCRIPTIONS TABLE (Recurring Razorpay Plans)
    CREATE TABLE IF NOT EXISTS subscriptions (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      tier VARCHAR(32) NOT NULL DEFAULT 'free', -- 'free' | 'basic' | 'pro'
      billing_cycle VARCHAR(32) NOT NULL DEFAULT 'monthly', -- 'monthly' | 'yearly'
      status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active' | 'cancelled' | 'expired' | 'past_due'
      razorpay_customer_id VARCHAR(128),
      razorpay_subscription_id VARCHAR(128),
      razorpay_plan_id VARCHAR(128),
      current_period_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      current_period_end TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- 6. PROMPT UNLOCKS TABLE (Basic Tier Monthly 25-Prompt Tracking)
    CREATE TABLE IF NOT EXISTS prompt_unlocks (
      id VARCHAR(128) PRIMARY KEY,
      user_id VARCHAR(128) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      prompt_id VARCHAR(128) NOT NULL,
      prompt_slug VARCHAR(128) NOT NULL,
      billing_period_start TIMESTAMP WITH TIME ZONE,
      unlocked_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unq_user_prompt_unlock UNIQUE(user_id, prompt_id)
    );

    CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
    CREATE INDEX IF NOT EXISTS idx_prompt_unlocks_user_id ON prompt_unlocks(user_id);
  `;

  const res = await queryNeon(schemaSql);
  return res !== null;
}
