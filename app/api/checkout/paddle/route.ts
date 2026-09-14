import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { getPaddlePriceIdForTier } from "@/lib/paddle/config";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { tier, billingCycle } = body;

    if (!tier || !["basic", "pro"].includes(tier)) {
      return NextResponse.json(
        { error: "Invalid subscription tier. Must be 'basic' or 'pro'." },
        { status: 400 }
      );
    }

    const validatedCycle = billingCycle === "yearly" ? "yearly" : "monthly";
    const priceId = getPaddlePriceIdForTier(tier as "basic" | "pro", validatedCycle);

    if (!priceId) {
      return NextResponse.json(
        {
          error: `Paddle Price ID not configured for tier '${tier}' (${validatedCycle}). Please verify environment variables (e.g. PADDLE_DIRECTOR_MONTHLY_PRICE_ID, etc.).`,
        },
        { status: 400 }
      );
    }

    const clientToken =
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ||
      process.env.PADDLE_CLIENT_TOKEN ||
      "";

    const environment =
      process.env.NEXT_PUBLIC_PADDLE_ENV ||
      process.env.PADDLE_ENV ||
      "sandbox";

    return NextResponse.json({
      success: true,
      priceId,
      tier,
      billingCycle: validatedCycle,
      clientToken,
      environment,
      userId: session.user.id,
      userEmail: session.user.email,
    });
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Failed to initialize checkout";
    console.error("[Paddle Checkout API Error]:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
