import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/auth-options";
import { getUserSubscription } from "@/lib/db/subscription-repo";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({
        tier: "free",
        status: "unauthenticated",
        monthlyUnlocksUsed: 0,
        monthlyUnlocksLimit: 0,
        unlockedPromptIds: [],
      });
    }

    const sub = await getUserSubscription(session.user.id);

    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
      subscription: sub,
    });
  } catch (err: any) {
    console.error("[Get User Subscription API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch user subscription" },
      { status: 500 }
    );
  }
}
