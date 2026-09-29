import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { getCreatorIntelligenceUsage } from "@/lib/db/creator-intelligence-usage-repo";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false, usage: null });
  }

  const usage = await getCreatorIntelligenceUsage(session.user.id);
  return NextResponse.json({ authenticated: true, usage });
}
