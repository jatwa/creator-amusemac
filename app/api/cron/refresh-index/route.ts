import { NextRequest, NextResponse } from "next/server";
import { generateSearchIndex } from "@/lib/search/indexer";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const indexStats = generateSearchIndex();

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    indexStats,
  });
}
