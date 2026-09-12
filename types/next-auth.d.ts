import { DefaultSession } from "next-auth";
import { SubscriptionTier, SubscriptionStatus, BillingCycle } from "@/lib/db/subscription-repo";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tier: SubscriptionTier;
      status: SubscriptionStatus;
      billingCycle: BillingCycle;
      monthlyUnlocksUsed: number;
      monthlyUnlocksLimit: number;
      currentPeriodEnd: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    tier?: SubscriptionTier;
    status?: SubscriptionStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    tier?: SubscriptionTier;
    status?: SubscriptionStatus;
    billingCycle?: BillingCycle;
    monthlyUnlocksUsed?: number;
    monthlyUnlocksLimit?: number;
    currentPeriodEnd?: string | null;
  }
}
