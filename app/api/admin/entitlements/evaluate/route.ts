import { NextResponse } from "next/server";
import { checkAdminApiAuth } from "@/lib/auth/admin-auth";
import { queryNeon } from "@/lib/db/neon";
import { resolveUserEntitlements } from "@/lib/entitlements/resolver";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await checkAdminApiAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { email, userId, rawTier, rawStatus, rawUnlockCount } = body;

    let tier = rawTier || "free";
    let status = rawStatus || "active";
    let unlockCount = typeof rawUnlockCount === "number" ? rawUnlockCount : 0;
    let resolvedUser: any = null;

    // If email or userId provided, fetch live user record from DB
    if (email || userId) {
      const userRes = await queryNeon<any>(
        `SELECT u.id, u.name, u.email, s.tier, s.status, COUNT(pu.id) as unlock_count
         FROM users u
         LEFT JOIN subscriptions s ON u.id = s.user_id
         LEFT JOIN prompt_unlocks pu ON u.id = pu.user_id
         WHERE u.id = $1 OR LOWER(u.email) = LOWER($1)
         GROUP BY u.id, u.name, u.email, s.tier, s.status
         LIMIT 1`,
        [(email || userId).trim()]
      );

      if (userRes && userRes.rows && userRes.rows.length > 0) {
        resolvedUser = userRes.rows[0];
        tier = resolvedUser.tier || "free";
        status = resolvedUser.status || "active";
        unlockCount = parseInt(resolvedUser.unlock_count || "0", 10);
      }
    }

    const entitlements = resolveUserEntitlements(tier, status, unlockCount);

    return NextResponse.json({
      success: true,
      user: resolvedUser,
      input: { tier, status, unlockCount },
      entitlements,
      evaluatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to evaluate entitlements" },
      { status: 500 }
    );
  }
}
