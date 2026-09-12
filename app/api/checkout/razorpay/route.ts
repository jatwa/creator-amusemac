import { NextResponse } from "next/server";
import { createRazorpayOrder, CreateOrderParams } from "@/lib/payment/razorpay";
import { CurrencyCode } from "@/lib/geo/types";
import { SUPPORTED_CURRENCIES } from "@/lib/geo/currency";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, currency, customerEmail, customerName } = body;

    if (!planId) {
      return NextResponse.json({ error: "Missing planId parameter" }, { status: 400 });
    }

    const validatedCurrency: CurrencyCode =
      currency && SUPPORTED_CURRENCIES[currency as CurrencyCode]
        ? (currency as CurrencyCode)
        : "USD";

    const params: CreateOrderParams = {
      planId,
      currency: validatedCurrency,
      customerEmail,
      customerName,
    };

    const order = await createRazorpayOrder(params);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (err: any) {
    console.error("[Checkout API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to initiate checkout" },
      { status: 500 }
    );
  }
}
