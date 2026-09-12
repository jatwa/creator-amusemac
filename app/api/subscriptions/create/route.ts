import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { createRazorpaySubscription } from "@/lib/payment/razorpay-subscription";
import { CurrencyCode } from "@/lib/geo/types";
import { SUPPORTED_CURRENCIES } from "@/lib/geo/currency";

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
    const { tier, billingCycle, currency } = body;

    if (!tier || !["basic", "pro"].includes(tier)) {
      return NextResponse.json({ error: "Invalid subscription tier" }, { status: 400 });
    }

    const validatedCycle = billingCycle === "yearly" ? "yearly" : "monthly";
    const validatedCurrency: CurrencyCode =
      currency && SUPPORTED_CURRENCIES[currency as CurrencyCode]
        ? (currency as CurrencyCode)
        : "USD";

    const subscription = await createRazorpaySubscription({
      tier,
      billingCycle: validatedCycle,
      currency: validatedCurrency,
      userId: session.user.id,
      userEmail: session.user.email || "",
      userName: session.user.name || undefined,
    });

    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (err: any) {
    console.error("[Subscription Create API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create subscription" },
      { status: 500 }
    );
  }
}
