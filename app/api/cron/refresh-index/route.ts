import { NextRequest, NextResponse } from "next/server";
import { generateSearchIndex } from "@/lib/search/indexer";

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

  const indexStats = generateSearchIndex();

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    indexStats,
  });
}
