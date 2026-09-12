import { NextResponse } from "next/server";
import crypto from "crypto";
import { upsertSubscriptionRecord } from "@/lib/db/subscription-repo";
import { queryNeon } from "@/lib/db/neon";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if secret configured
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const entity = payload.payload?.subscription?.entity || payload.payload?.payment?.entity;

    console.log(`[Razorpay Webhook Event Received]: ${event}`);

    if (entity) {
      const notes = entity.notes || {};
      const userId = notes.userId;
      const tier = notes.tier || "basic";
      const billingCycle = notes.billingCycle || "monthly";
      const subId = entity.id || entity.subscription_id;

      if (userId) {
        if (event === "subscription.activated" || event === "subscription.charged") {
          const start = entity.current_start ? new Date(entity.current_start * 1000) : new Date();
          const end = entity.current_end ? new Date(entity.current_end * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

          await upsertSubscriptionRecord({
            userId,
            tier,
            billingCycle,
            status: "active",
            razorpaySubscriptionId: subId,
            razorpayCustomerId: entity.customer_id,
            razorpayPlanId: entity.plan_id,
            currentPeriodStart: start,
            currentPeriodEnd: end,
          });
        } else if (event === "subscription.cancelled" || event === "subscription.completed") {
          await queryNeon(
            `UPDATE subscriptions 
             SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
             WHERE razorpay_subscription_id = $1 OR user_id = $2`,
            [subId, userId]
          );
        } else if (event === "payment.failed") {
          await queryNeon(
            `UPDATE subscriptions 
             SET status = 'past_due', updated_at = CURRENT_TIMESTAMP
             WHERE razorpay_subscription_id = $1 OR user_id = $2`,
            [subId, userId]
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[Razorpay Webhook Error]:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
