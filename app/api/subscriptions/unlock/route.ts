import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { claimPromptUnlock, getUserSubscription } from "@/lib/db/subscription-repo";
import { getDbPromptBySlug } from "@/lib/db/neon";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in with Google." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { promptId, promptSlug } = body;

    if (!promptId || !promptSlug) {
      return NextResponse.json(
        { error: "Missing promptId or promptSlug" },
        { status: 400 }
      );
    }

    const result = await claimPromptUnlock(session.user.id, promptId, promptSlug);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 403 });
    }

    const updatedSub = await getUserSubscription(session.user.id);
    const fullPrompt = await getDbPromptBySlug(promptSlug);

    return NextResponse.json({
      success: true,
      message: result.message,
      monthlyUnlocksUsed: updatedSub.monthlyUnlocksUsed,
      remainingUnlocks: result.remainingUnlocks,
      unlockedPromptIds: updatedSub.unlockedPromptIds,
      promptText: fullPrompt?.promptText,
      negativePrompt: fullPrompt?.negativePrompt,
      variations: fullPrompt?.variations,
    });
  } catch (err: any) {
    console.error("[Unlock Prompt API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to unlock prompt" },
      { status: 500 }
    );
  }
}
