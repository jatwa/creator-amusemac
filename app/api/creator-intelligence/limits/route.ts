import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserSubscription } from "@/lib/db/subscription-repo";
import { getCreatorIntelligencePlan } from "@/lib/creator-intelligence-plans";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const tier = session?.user?.id ? (await getUserSubscription(session.user.id)).tier : "free";
    const plan = getCreatorIntelligencePlan(tier);
    return NextResponse.json({
      tier,
      label: plan.label,
      maxFileBytes: plan.maxFileBytes,
      maxTextChars: plan.maxTextChars,
      maxPages: plan.maxPages,
      aiTokensPerPeriod: plan.aiTokensPerPeriod,
      aiUsesPerPeriod: plan.aiUsesPerPeriod,
    });
  } catch (error) {
    console.error("[Creator Intelligence Limits Error]", error);
    const plan = getCreatorIntelligencePlan("free");
    return NextResponse.json({
      tier: "free",
      label: plan.label,
      maxFileBytes: plan.maxFileBytes,
      maxTextChars: plan.maxTextChars,
      maxPages: plan.maxPages,
      aiTokensPerPeriod: plan.aiTokensPerPeriod,
      aiUsesPerPeriod: plan.aiUsesPerPeriod,
    });
  }
}
