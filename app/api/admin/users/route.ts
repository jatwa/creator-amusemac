import { NextRequest, NextResponse } from "next/server";
import { checkAdminApiAuth } from "@/lib/auth/admin-auth";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await checkAdminApiAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  try {
    let sql = `
      SELECT u.id, u.name, u.email, u.image, u.created_at,
             s.tier, s.status as sub_status, s.provider as sub_provider
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
    `;
    const params: any[] = [];

    if (q) {
      sql += ` WHERE LOWER(u.name) LIKE $1 OR LOWER(u.email) LIKE $1 OR u.id LIKE $1`;
      params.push(`%${q}%`);
    }

    sql += ` ORDER BY u.created_at DESC LIMIT 50`;

    const res = await queryNeon<any>(sql, params);
    return NextResponse.json({ users: res?.rows || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
