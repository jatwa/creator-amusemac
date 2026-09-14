import { NextRequest, NextResponse } from "next/server";
import { checkAdminApiAuth } from "@/lib/auth/admin-auth";
import { getPaddlePriceIds } from "@/lib/paddle/config";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await checkAdminApiAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  const prices = getPaddlePriceIds();
  const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox";

  let subscriptionCounts = { active: 0, pastDue: 0, cancelled: 0 };
  try {
    const res = await queryNeon<any>(
      `SELECT status, COUNT(*) as count FROM subscriptions GROUP BY status`
    );
    if (res && res.rows) {
      for (const r of res.rows) {
        if (r.status === "active") subscriptionCounts.active += parseInt(r.count, 10);
        if (r.status === "past_due") subscriptionCounts.pastDue += parseInt(r.count, 10);
        if (r.status === "cancelled" || r.status === "canceled") subscriptionCounts.cancelled += parseInt(r.count, 10);
      }
    }
  } catch {}

  return NextResponse.json({
    environment: paddleEnv,
    configuredPrices: {
      directorMonthly: !!prices.directorMonthly,
      directorYearly: !!prices.directorYearly,
      proMonthly: !!prices.proMonthly,
      proYearly: !!prices.proYearly,
    },
    subscriptionCounts,
  });
}
