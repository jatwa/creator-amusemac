import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserSubscription } from "@/lib/db/subscription-repo";
import { getPaddleInstance } from "@/lib/paddle/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const sub = await getUserSubscription(session.user.id);

    if (!sub.paddleCustomerId) {
      return NextResponse.json(
        { error: "No Paddle customer profile found for this account." },
        { status: 404 }
      );
    }

    const paddle = getPaddleInstance();
    const subscriptionIds = sub.paddleSubscriptionId
      ? [sub.paddleSubscriptionId]
      : [];

    const portalSession = await paddle.customerPortalSessions.create(
      sub.paddleCustomerId,
      subscriptionIds
    );

    return NextResponse.json({
      success: true,
      url: portalSession.urls.general.overview,
    });
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Failed to create customer portal session";
    console.error("[Paddle Portal Error]:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
