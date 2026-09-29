import { NextResponse } from "next/server";
import { checkAdminApiAuth } from "@/lib/auth/admin-auth";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await checkAdminApiAuth(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
  }

  const startTime = Date.now();
  let dbStatus = "unknown";
  let latencyMs = -1;
  let serverTime = new Date().toISOString();

  try {
    const res = await queryNeon<any>("SELECT 1 as ping, NOW() as current_time;");
    latencyMs = Date.now() - startTime;
    if (res && res.rows && res.rows.length > 0) {
      dbStatus = "connected";
      serverTime = res.rows[0].current_time || serverTime;
    } else {
      dbStatus = "empty_result";
    }
  } catch (err: any) {
    latencyMs = Date.now() - startTime;
    dbStatus = `error: ${err.message}`;
  }

  return NextResponse.json({
    status: dbStatus === "connected" ? "ok" : "degraded",
    db: dbStatus,
    latencyMs,
    timestamp: new Date().toISOString(),
    serverTime,
    environment: process.env.NODE_ENV || "development",
  });
}
