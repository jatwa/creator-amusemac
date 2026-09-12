import { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters";
import { queryNeon } from "@/lib/db/neon";
import { initAuthAndSubscriptionTables } from "@/lib/db/auth-schema";

let schemaInitialized = false;

async function ensureSchema() {
  if (!schemaInitialized) {
    await initAuthAndSubscriptionTables();
    schemaInitialized = true;
  }
}

export function NeonPostgresAdapter(): Adapter {
  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      await ensureSchema();
      const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const email = user.email ? user.email.toLowerCase() : null;
      
      const res = await queryNeon<any>(
        `INSERT INTO users (id, name, email, email_verified, image)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, email_verified, image`,
        [id, user.name || null, email, user.emailVerified || null, user.image || null]
      );

      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          emailVerified: row.email_verified,
          image: row.image,
        };
      }

      // Fallback
      return {
        id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
      };
    },

    async getUser(id: string) {
      await ensureSchema();
      const res = await queryNeon<any>(
        `SELECT id, name, email, email_verified, image FROM users WHERE id = $1 LIMIT 1`,
        [id]
      );
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          emailVerified: row.email_verified,
          image: row.image,
        };
      }
      return null;
    },

    async getUserByEmail(email: string) {
      await ensureSchema();
      const cleanEmail = email.toLowerCase();
      const res = await queryNeon<any>(
        `SELECT id, name, email, email_verified, image FROM users WHERE email = $1 LIMIT 1`,
        [cleanEmail]
      );
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          emailVerified: row.email_verified,
          image: row.image,
        };
      }
      return null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      await ensureSchema();
      const res = await queryNeon<any>(
        `SELECT u.id, u.name, u.email, u.email_verified, u.image 
         FROM users u
         JOIN accounts a ON u.id = a.user_id
         WHERE a.provider = $1 AND a.provider_account_id = $2
         LIMIT 1`,
        [provider, providerAccountId]
      );
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          emailVerified: row.email_verified,
          image: row.image,
        };
      }
      return null;
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      await ensureSchema();
      const res = await queryNeon<any>(
        `UPDATE users SET
          name = COALESCE($2, name),
          email = COALESCE($3, email),
          email_verified = COALESCE($4, email_verified),
          image = COALESCE($5, image),
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, name, email, email_verified, image`,
        [
          user.id,
          user.name || null,
          user.email ? user.email.toLowerCase() : null,
          user.emailVerified || null,
          user.image || null,
        ]
      );
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          name: row.name,
          email: row.email,
          emailVerified: row.email_verified,
          image: row.image,
        };
      }
      return user as AdapterUser;
    },

    async linkAccount(account: AdapterAccount) {
      await ensureSchema();
      const id = `acc_${account.provider}_${Date.now()}`;
      await queryNeon(
        `INSERT INTO accounts (
          id, user_id, type, provider, provider_account_id,
          refresh_token, access_token, expires_at, token_type, scope, id_token, session_state
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (provider, provider_account_id) DO NOTHING`,
        [
          id,
          account.userId,
          account.type,
          account.provider,
          account.providerAccountId,
          account.refresh_token || null,
          account.access_token || null,
          account.expires_at || null,
          account.token_type || null,
          account.scope || null,
          account.id_token || null,
          account.session_state || null,
        ]
      );
      return account;
    },

    async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      await ensureSchema();
      await queryNeon(
        `DELETE FROM accounts WHERE provider = $1 AND provider_account_id = $2`,
        [provider, providerAccountId]
      );
    },

    async createSession(session: { sessionToken: string; userId: string; expires: Date }) {
      await ensureSchema();
      const id = `ses_${Date.now()}`;
      await queryNeon(
        `INSERT INTO sessions (id, session_token, user_id, expires)
         VALUES ($1, $2, $3, $4)`,
        [id, session.sessionToken, session.userId, session.expires.toISOString()]
      );
      return session;
    },

    async getSessionAndUser(sessionToken: string) {
      await ensureSchema();
      const res = await queryNeon<any>(
        `SELECT s.session_token, s.user_id, s.expires,
                u.id as u_id, u.name, u.email, u.email_verified, u.image
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.session_token = $1 AND s.expires > CURRENT_TIMESTAMP
         LIMIT 1`,
        [sessionToken]
      );
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          session: {
            sessionToken: row.session_token,
            userId: row.user_id,
            expires: new Date(row.expires),
          },
          user: {
            id: row.u_id,
            name: row.name,
            email: row.email,
            emailVerified: row.email_verified,
            image: row.image,
          },
        };
      }
      return null;
    },

    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
      await ensureSchema();
      const res = await queryNeon<any>(
        `UPDATE sessions SET
          expires = COALESCE($2, expires)
         WHERE session_token = $1
         RETURNING session_token, user_id, expires`,
        [session.sessionToken, session.expires ? session.expires.toISOString() : null]
      );
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          sessionToken: row.session_token,
          userId: row.user_id,
          expires: new Date(row.expires),
        };
      }
      return null;
    },

    async deleteSession(sessionToken: string) {
      await ensureSchema();
      await queryNeon(`DELETE FROM sessions WHERE session_token = $1`, [sessionToken]);
    },

    async createVerificationToken(token: VerificationToken) {
      await ensureSchema();
      await queryNeon(
        `INSERT INTO verification_tokens (identifier, token, expires)
         VALUES ($1, $2, $3)`,
        [token.identifier, token.token, token.expires.toISOString()]
      );
      return token;
    },

    async useVerificationToken({ identifier, token }) {
      await ensureSchema();
      const res = await queryNeon<any>(
        `DELETE FROM verification_tokens 
         WHERE identifier = $1 AND token = $2 
         RETURNING identifier, token, expires`,
        [identifier, token]
      );
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        return {
          identifier: row.identifier,
          token: row.token,
          expires: new Date(row.expires),
        };
      }
      return null;
    },
  };
}
