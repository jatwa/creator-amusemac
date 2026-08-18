import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
