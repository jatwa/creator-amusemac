import { NextRequest, NextResponse } from "next/server";
import { checkAdminApiAuth } from "@/lib/auth/admin-auth";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await checkAdminApiAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const startTime = Date.now();
  let dbStatus = "HEALTHY";
  let latencyMs = 0;

  try {
    const res = await queryNeon<{ now: string }>("SELECT NOW() as now");
    if (!res || res.rows.length === 0) {
      dbStatus = "DEGRADED";
    }
    latencyMs = Date.now() - startTime;
  } catch {
    dbStatus = "UNAVAILABLE";
  }

  return NextResponse.json({
    status: "ok",
    environment: process.env.NODE_ENV || "production",
    database: {
      status: dbStatus,
      latencyMs,
    },
    integrations: {
      googleAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      paddle: !!process.env.PADDLE_API_KEY,
      paddleWebhooks: !!process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET,
    },
    timestamp: new Date().toISOString(),
  });
}
