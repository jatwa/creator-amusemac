import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { queryNeon } from "@/lib/db/neon";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Update status in Neon DB to cancelled
    await queryNeon(
      `UPDATE subscriptions 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
      [session.user.id]
    );

    return NextResponse.json({
      success: true,
      message: "Your subscription has been cancelled. You retain access until the end of your billing cycle.",
    });
  } catch (err: any) {
    console.error("[Cancel Subscription API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
