import { NextRequest, NextResponse } from "next/server";
import { checkAdminApiAuth } from "@/lib/auth/admin-auth";
import { queryNeon } from "@/lib/db/neon";
import { resolveUserEntitlements } from "@/lib/entitlements/resolver";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const auth = await checkAdminApiAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email or user ID" }, { status: 400 });
    }

    const userRes = await queryNeon<any>(
      `SELECT * FROM users WHERE LOWER(email) = LOWER($1) OR id = $1 LIMIT 1`,
      [email]
    );

    if (!userRes || userRes.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userRes.rows[0];

    const subRes = await queryNeon<any>(
      `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [user.id]
    );
    const sub = subRes?.rows[0] || null;

    const unlRes = await queryNeon<any>(
      `SELECT * FROM prompt_unlocks WHERE user_id = $1`,
      [user.id]
    );
    const unlocks = unlRes?.rows || [];

    const resolution = resolveUserEntitlements(
      sub?.tier || "free",
      sub?.status || "active",
      unlocks.length
    );

    return NextResponse.json({
      user,
      subscription: sub,
      unlocksCount: unlocks.length,
      resolution,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
