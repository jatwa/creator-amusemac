import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NeonPostgresAdapter } from "./neon-adapter";
import { getUserSubscription, SubscriptionTier, SubscriptionStatus } from "@/lib/db/subscription-repo";

export const authOptions: NextAuthOptions = {
  adapter: NeonPostgresAdapter(),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "demo-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "demo-google-client-secret",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "creator-intel-secret-key-production-jwt-2026",
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }
      
      // Update token subscription data when session triggers or on initial token creation
      if (token.id) {
        const sub = await getUserSubscription(token.id as string);
        token.tier = sub.tier;
        token.status = sub.status;
        token.billingCycle = sub.billingCycle;
        token.monthlyUnlocksUsed = sub.monthlyUnlocksUsed;
        token.monthlyUnlocksLimit = sub.monthlyUnlocksLimit;
        token.currentPeriodEnd = sub.currentPeriodEnd;
      }

      if (trigger === "update" && session?.tier) {
        token.tier = session.tier;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.tier = (token.tier as SubscriptionTier) || "free";
        session.user.status = (token.status as SubscriptionStatus) || "active";
        session.user.billingCycle = (token.billingCycle as "monthly" | "yearly") || "monthly";
        session.user.monthlyUnlocksUsed = (token.monthlyUnlocksUsed as number) || 0;
        session.user.monthlyUnlocksLimit = (token.monthlyUnlocksLimit as number) || 0;
        session.user.currentPeriodEnd = (token.currentPeriodEnd as string) || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/pricing",
    signOut: "/",
    error: "/pricing",
  },
};
