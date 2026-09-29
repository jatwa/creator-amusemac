import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { CREATOR_INTELLIGENCE_ACTIONS, type CreatorIntelligenceActionId } from "@/lib/creator-intelligence-actions";
import { reserveCreatorIntelligenceUsage, settleCreatorIntelligenceUsage } from "@/lib/db/creator-intelligence-usage-repo";
import { runOpenAITextIntelligence } from "@/lib/ai/creator-intelligence-providers";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const actionId = body?.actionId as CreatorIntelligenceActionId;
  const prompt = String(body?.prompt || "").trim();
  const instruction = String(body?.instruction || "").trim();

  const action = CREATOR_INTELLIGENCE_ACTIONS[actionId];
  if (!action || !prompt) return NextResponse.json({ error: "A valid AI action and prompt are required." }, { status: 400 });

  const reservation = await reserveCreatorIntelligenceUsage(
    session.user.id,
    actionId,
    action.estimatedTokens,
    { mode: body?.mode || "manual" }
  );

  if (!reservation.ok) {
    const status = reservation.reason === "insufficient_tokens" ? 402 : 429;
    return NextResponse.json({ error: reservation.reason, estimatedTokens: action.estimatedTokens }, { status });
  }

  try {
    const result = await runOpenAITextIntelligence({
      system: instruction || "You are Creator Intel, a filmmaker-first creative intelligence system. Give structured, practical production reasoning. Do not invent source facts.",
      prompt,
    });

    await settleCreatorIntelligenceUsage({
      userId: session.user.id,
      eventId: reservation.eventId,
      actualTokens: result.totalTokens,
      status: "completed",
      provider: result.provider,
      model: result.model,
    });

    return NextResponse.json({
      ok: true,
      result: result.text,
      usage: {
        estimatedTokens: action.estimatedTokens,
        actualTokens: result.totalTokens,
        provider: result.provider,
        model: result.model,
      },
    });
  } catch (error: any) {
    await settleCreatorIntelligenceUsage({
      userId: session.user.id,
      eventId: reservation.eventId,
      actualTokens: 0,
      status: "failed",
      errorCode: error?.message?.slice(0, 120) || "provider_error",
    });

    return NextResponse.json({
      error: error?.message || "Creator Intelligence task failed.",
      chargedTokens: 0,
    }, { status: 502 });
  }
}
