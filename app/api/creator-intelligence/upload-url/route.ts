import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserSubscription } from "@/lib/db/subscription-repo";
import { getCreatorIntelligencePlan } from "@/lib/creator-intelligence-plans";
import { createPrivateObjectKey, createR2PresignedPutUrl, isR2Configured } from "@/lib/storage/r2";

const ALLOWED = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/markdown"]);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  if (!isR2Configured()) {
    return NextResponse.json({ error: "Private document storage is not configured yet." }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const fileName = String(body?.fileName || "");
  const contentType = String(body?.contentType || "");
  const size = Number(body?.size || 0);
  const projectId = String(body?.projectId || "intake");

  const subscription = await getUserSubscription(session.user.id);
  const plan = getCreatorIntelligencePlan(subscription.tier);

  if (!fileName || !ALLOWED.has(contentType)) {
    return NextResponse.json({ error: "Unsupported document type." }, { status: 400 });
  }
  if (!Number.isFinite(size) || size <= 0 || size > plan.maxFileBytes) {
    return NextResponse.json({ error: `File exceeds the ${Math.round(plan.maxFileBytes / (1024 * 1024))} MB limit for your plan.` }, { status: 413 });
  }

  const key = createPrivateObjectKey(session.user.id, projectId, fileName);
  const signed = createR2PresignedPutUrl({ key, contentType, expiresIn: 900 });

  return NextResponse.json({
    uploadUrl: signed.url,
    objectKey: signed.key,
    expiresIn: signed.expiresIn,
    tier: subscription.tier,
    maxFileBytes: plan.maxFileBytes,
  });
}
