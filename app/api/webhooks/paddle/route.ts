import { NextRequest, NextResponse } from "next/server";
import { getPaddleInstance } from "@/lib/paddle/client";
import {
  EventName,
  type EventEntity,
} from "@paddle/paddle-node-sdk";
import {
  upsertPaddleSubscriptionRecord,
  upsertPaddleCustomer,
} from "@/lib/db/subscription-repo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("paddle-signature") || "";
    const webhookSecret = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET || "";

    if (!rawBody || !signature || !webhookSecret) {
      console.warn(
        "[PADDLE WEBHOOK] Missing raw body, paddle-signature header, or PADDLE_NOTIFICATION_WEBHOOK_SECRET"
      );
      return NextResponse.json(
        { error: "Missing required webhook verification parameters" },
        { status: 401 }
      );
    }

    const paddle = getPaddleInstance();

    let eventData: EventEntity | null = null;
    try {
      eventData = await paddle.webhooks.unmarshal(
        rawBody,
        webhookSecret,
        signature
      );
    } catch (unmarshalErr: unknown) {
      const errorMessage =
        unmarshalErr instanceof Error ? unmarshalErr.message : "Invalid signature";
      console.error(
        "[PADDLE WEBHOOK] Signature verification failed:",
        errorMessage
      );
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    if (!eventData) {
      console.error("[PADDLE WEBHOOK] Verification produced no event data");
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 401 }
      );
    }

    const { eventType, eventId, occurredAt } = eventData;

    // Development-safe logging (never logs secrets, API keys, or sensitive payment details)
    console.log(
      `[PADDLE WEBHOOK]\n` +
      `  event type: ${eventType}\n` +
      `  event id: ${eventId}\n` +
      `  occurred_at: ${occurredAt}`
    );

    // Process all subscription, customer, and transaction lifecycle events
    switch (eventType) {
      case EventName.SubscriptionCreated:
      case EventName.SubscriptionActivated:
      case EventName.SubscriptionUpdated:
      case EventName.SubscriptionCanceled:
      case EventName.SubscriptionPastDue:
      case EventName.SubscriptionPaused:
      case EventName.SubscriptionResumed: {
        const subData = eventData.data as any;
        const subId = subData.id;
        const customerId = subData.customerId;
        const subStatus = subData.status;
        const priceId = subData.items?.[0]?.price?.id || subData.items?.[0]?.priceId;
        const customData = subData.customData || {};
        const customerEmail = customData.userEmail;
        const scheduledChange = subData.scheduledChange?.effectiveAt
          ? new Date(subData.scheduledChange.effectiveAt)
          : null;
        const periodStart = subData.currentBillingPeriod?.startsAt
          ? new Date(subData.currentBillingPeriod.startsAt)
          : undefined;
        const periodEnd = subData.currentBillingPeriod?.endsAt
          ? new Date(subData.currentBillingPeriod.endsAt)
          : undefined;

        await upsertPaddleSubscriptionRecord({
          paddleSubscriptionId: subId,
          paddleCustomerId: customerId,
          status: subStatus,
          paddlePriceId: priceId,
          paddleScheduledChange: scheduledChange,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          customData,
          customerEmail,
        });
        break;
      }

      case EventName.TransactionCompleted: {
        const txnData = eventData.data as any;
        const txnId = txnData.id;
        const customerId = txnData.customerId;
        const subId = txnData.subscriptionId;
        const customData = txnData.customData || {};
        const customerEmail = customData.userEmail;
        const priceId =
          txnData.details?.lineItems?.[0]?.priceId ||
          txnData.items?.[0]?.price?.id ||
          txnData.items?.[0]?.priceId;

        if (subId) {
          await upsertPaddleSubscriptionRecord({
            paddleSubscriptionId: subId,
            paddleCustomerId: customerId,
            status: "active",
            paddlePriceId: priceId,
            paddleTransactionId: txnId,
            customData,
            customerEmail,
          });
        } else if (customerId && customerEmail) {
          await upsertPaddleCustomer(customerId, customerEmail, customData.userId);
        }
        break;
      }

      case EventName.CustomerCreated:
      case EventName.CustomerUpdated: {
        const custData = eventData.data as any;
        if (custData.id && custData.email) {
          await upsertPaddleCustomer(
            custData.id,
            custData.email,
            custData.customData?.userId
          );
        }
        break;
      }

      default:
        console.log(
          `[PADDLE WEBHOOK] Unhandled event acknowledged: ${eventType}`
        );
        break;
    }

    // Acknowledge promptly (within Paddle's 5s retry window)
    return NextResponse.json(
      {
        received: true,
        eventId,
        eventType,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error ? err.message : "Unexpected internal error";
    console.error("[PADDLE WEBHOOK] Server error processing webhook:", errorMsg);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 }
    );
  }
}
