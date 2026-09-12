import { CurrencyCode } from "@/lib/geo/types";
import { convertPrice, VAULT_PRICING_PLANS } from "@/lib/geo/currency";

export interface CreateOrderParams {
  planId: string;
  currency: CurrencyCode;
  customerEmail?: string;
  customerName?: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number; // in smallest unit (e.g. paise/cents)
  displayAmount: number; // in major unit (e.g. 49, 3999)
  currency: CurrencyCode;
  keyId: string;
  planName: string;
  isMock: boolean;
}

/**
 * Creates or prepares a Razorpay order in the localized currency
 */
export async function createRazorpayOrder(
  params: CreateOrderParams
): Promise<RazorpayOrderResponse> {
  const plan = VAULT_PRICING_PLANS.find((p) => p.id === params.planId) || VAULT_PRICING_PLANS[0];
  const targetCurrency = params.currency || "USD";

  // Calculate clean localized major amount
  const displayAmount = convertPrice(plan.priceUSD, targetCurrency, plan.customPrices);

  // Subunit conversion (100 subunits per major unit for INR/USD/GBP/EUR/AED)
  const subunitAmount = Math.round(displayAmount * 100);

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "rzp_test_creator_intel_demo";
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  // If live Razorpay credentials exist, create official order via Razorpay API
  if (keySecret && !keyId.includes("demo")) {
    try {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: subunitAmount,
          currency: targetCurrency,
          receipt: `rcpt_${plan.id}_${Date.now()}`,
          notes: {
            planId: plan.id,
            planName: plan.name,
            platform: "Creator Intel Pro Vault",
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          orderId: data.id,
          amount: data.amount,
          displayAmount,
          currency: targetCurrency,
          keyId,
          planName: plan.name,
          isMock: false,
        };
      }
    } catch (err) {
      console.warn("[Razorpay Live API Error, falling back to simulated order]:", err);
    }
  }

  // Fallback simulated order for test/preview/demo
  const simulatedOrderId = `order_${targetCurrency}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  return {
    orderId: simulatedOrderId,
    amount: subunitAmount,
    displayAmount,
    currency: targetCurrency,
    keyId,
    planName: plan.name,
    isMock: true,
  };
}
