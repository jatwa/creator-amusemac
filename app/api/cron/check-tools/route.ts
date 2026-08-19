import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/repository";
import { UpdateManager } from "@/lib/engine/update-manager";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  // Fail-closed in production: missing secret blocks execution
  if (isProd && !cronSecret) {
    return NextResponse.json(
      { error: "Server Configuration Error: CRON_SECRET is not configured in production." },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized: Invalid cron authorization." }, { status: 401 });
  }

  const allTools = db.getAllTools();

  // Run idempotent health checks concurrently across all tools for sub-second execution
  const results = await Promise.all(
    allTools.map((tool) => UpdateManager.checkToolHealth(tool.id))
  );

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    toolsChecked: results.length,
    summary: results,
  });
}
