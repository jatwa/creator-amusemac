import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/repository";

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

  // Find tools not verified in > 14 days
  const staleTools = db.getStaleTools(14);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    staleCount: staleTools.length,
    staleTools: staleTools.map((s) => ({
      id: s.tool.id,
      name: s.tool.name,
      verifiedAt: s.tool.verifiedAt,
      daysSinceVerification: s.daysSinceVerification,
    })),
  });
}
