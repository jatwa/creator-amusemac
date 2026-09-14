"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BASIC_TIER_MONTHLY_LIMIT } from "@/lib/payment/razorpay-subscription";

interface UnlockedPromptItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  useCase: string;
}

export function AccountView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subData, setSubData] = useState<any>(null);
  const [loadingSub, setLoadingSub] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [openingPortal, setOpeningPortal] = useState(false);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);
  const [unlockedPromptsList, setUnlockedPromptsList] = useState<UnlockedPromptItem[]>([]);

  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadAccountData() {
      try {
        const res = await fetch("/api/subscriptions/me");
        if (res.ok) {
          const data = await res.json();
          setSubData(data.subscription);
          
          // Also fetch prompt list details for claimed prompts
          if (data.subscription?.unlockedPromptIds?.length > 0) {
            try {
              const pRes = await fetch("/api/prompts");
              if (pRes.ok) {
                const pData = await pRes.json();
                const allPrompts: any[] = pData.prompts || [];
                const matched = allPrompts.filter((p) =>
                  data.subscription.unlockedPromptIds.includes(p.id) ||
                  data.subscription.unlockedPromptIds.includes(p.slug)
                );
                setUnlockedPromptsList(matched);
              }
            } catch (err) {
              console.warn("[Fetch claimed prompts list warning]:", err);
            }
          }
        }
      } catch (err) {
        console.warn("[Load account data error]:", err);
      } finally {
        setLoadingSub(false);
      }
    }

    loadAccountData();
  }, [isAuthenticated]);

  const handleOpenPaddlePortal = async () => {
    setOpeningPortal(true);
    setCancelNotice(null);

    try {
      const res = await fetch("/api/subscriptions/portal", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to open Paddle customer portal");
      }

      window.location.href = data.url;
    } catch (err: any) {
      setCancelNotice(`Portal Error: ${err.message}`);
      setOpeningPortal(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? Your access will remain active until the end of your current billing period.")) {
      return;
    }

    setCancelling(true);
    setCancelNotice(null);

    try {
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      setCancelNotice(data.message || "Your subscription has been cancelled.");
      // Refresh local sub data
      const refreshRes = await fetch("/api/subscriptions/me");
      if (refreshRes.ok) {
        const fresh = await refreshRes.json();
        setSubData(fresh.subscription);
      }
    } catch (err: any) {
      setCancelNotice(`Error: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  if (status === "loading" || (isAuthenticated && loadingSub)) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="font-mono text-xs text-tertiary">Loading your director profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="surface mx-auto max-w-lg rounded-3xl p-8 sm:p-10 text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent text-2xl">
          👤
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-primary">Director Sign-In Required</h2>
          <p className="text-xs text-secondary leading-relaxed">
            Please sign in with your Google account to manage your Prompt Vault subscription, billing cycle, and unlocked recipes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-3.5 text-xs font-semibold text-background shadow-md hover:bg-primary/90 transition"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign In with Google</span>
        </button>
      </div>
    );
  }

  const tier = subData?.tier || session?.user?.tier || "free";
  const billingCycle = subData?.billingCycle || "monthly";
  const unlocksUsed = subData?.monthlyUnlocksUsed || 0;
  const isBasic = tier === "basic";
  const isPro = tier === "pro";
  const isFree = tier === "free";
  const isPaddle = !!subData?.paddleCustomerId || subData?.provider === "paddle";
  const periodEnd = subData?.currentPeriodEnd ? new Date(subData.currentPeriodEnd).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Monthly renewal";

  const basicUsagePercentage = Math.min(100, Math.round((unlocksUsed / BASIC_TIER_MONTHLY_LIMIT) * 100));

  return (
    <div className="space-y-10">
      {/* Account Info Card */}
      <div className="surface rounded-3xl p-6 sm:p-8 border border-border-subtle">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border-subtle">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={56}
                height={56}
                className="rounded-full ring-2 ring-accent/30"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent font-bold text-lg font-mono">
                {session?.user?.name?.[0] || "U"}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold tracking-tight text-primary">{session?.user?.name || "Cinema Director"}</h2>
              <p className="text-xs text-secondary font-mono mt-0.5">{session?.user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3.5 py-1 text-xs font-semibold font-mono tracking-wide uppercase ${
                isPro
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : isBasic
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-surface-elevated text-secondary border border-border"
              }`}
            >
              {isPro ? "Studio Pro" : isBasic ? "Director Basic" : "Free Explorer"}
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-xl border border-border bg-surface-elevated px-3 py-1.5 text-xs text-secondary hover:text-primary transition font-mono"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Subscription Meta Grid */}
        <div className="grid gap-6 pt-6 sm:grid-cols-3">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-tertiary">Current Tier</span>
            <p className="text-base font-bold text-primary capitalize">
              {tier === "pro" ? "Studio Pro" : tier === "basic" ? "Director Basic" : "Free Plan"}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-tertiary">Billing Cadence</span>
            <p className="text-base font-bold text-primary capitalize">
              {isFree ? "None" : `${billingCycle} Plan`}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-tertiary">Renewal Date</span>
            <p className="text-base font-bold text-primary">
              {isFree ? "N/A" : periodEnd}
            </p>
          </div>
        </div>

        {/* Basic Tier Monthly Progress Bar */}
        {isBasic && (
          <div className="mt-8 rounded-2xl border border-border-subtle bg-surface/50 p-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">Monthly Recipe Unlocks</span>
              <span className="font-mono text-tertiary">
                <strong className="text-primary">{unlocksUsed}</strong> / {BASIC_TIER_MONTHLY_LIMIT} claimed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-elevated border border-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${basicUsagePercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-tertiary">
              <span>{Math.max(0, BASIC_TIER_MONTHLY_LIMIT - unlocksUsed)} unlocks remaining</span>
              <Link href="/pricing" className="text-accent hover:underline">
                Upgrade to Pro for Unlimited →
              </Link>
            </div>
          </div>
        )}

        {/* Free Tier Upgrade Banner */}
        {isFree && (
          <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-primary">Unlock Full Prompt Formulas &amp; Optics Lexicon</h3>
              <p className="text-xs text-secondary mt-1">
                Get 25 prompt unlocks per month with Director Basic ($9/mo) or unlimited access with Studio Pro ($29/mo).
              </p>
            </div>
            <Link
              href="/pricing"
              className="rounded-2xl bg-accent px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-accent/90 transition whitespace-nowrap"
            >
              Explore Plans →
            </Link>
          </div>
        )}

        {/* Action Controls & Cancellation */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border-subtle">
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-xs font-semibold text-primary hover:border-border-bright transition"
            >
              Change Plan
            </Link>
            <Link
              href="/prompts"
              className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-background hover:bg-primary/90 transition"
            >
              Browse Prompts
            </Link>
          </div>

          {(isBasic || isPro) && (
            <div className="flex items-center gap-4">
              {isPaddle ? (
                <button
                  type="button"
                  disabled={openingPortal}
                  onClick={handleOpenPaddlePortal}
                  className="rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-xs font-semibold text-primary hover:border-border-bright transition disabled:opacity-50"
                >
                  {openingPortal ? "Opening Portal..." : "Manage Billing & Invoices ↗"}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={cancelling}
                  onClick={handleCancelSubscription}
                  className="text-xs text-tertiary hover:text-red-400 underline transition disabled:opacity-50"
                >
                  {cancelling ? "Processing cancellation..." : "Cancel Subscription"}
                </button>
              )}
            </div>
          )}
        </div>

        {cancelNotice && (
          <div className="mt-4 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-xs text-blue-400">
            {cancelNotice}
          </div>
        )}
      </div>

      {/* Claimed / Unlocked Prompts Library */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Your Unlocked Recipes</h2>
            <p className="text-xs text-secondary mt-1">
              Direct access to all prompt recipes and camera formulas claimed under your account.
            </p>
          </div>
          <span className="font-mono text-xs text-tertiary">
            {isPro ? "All Prompts Unlocked" : `${unlockedPromptsList.length} Recipes Claimed`}
          </span>
        </div>

        {unlockedPromptsList.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlockedPromptsList.map((p) => (
              <Link
                key={p.id}
                href={`/prompts/${p.slug}`}
                className="surface rounded-2xl p-5 border border-border-subtle hover:border-border-bright transition group block space-y-3"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-accent uppercase font-semibold">{p.useCase || p.category}</span>
                  <span className="text-emerald-400 flex items-center gap-1">✓ Unlocked</span>
                </div>
                <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                  {p.title}
                </h3>
                <span className="text-xs text-secondary block font-mono">View full recipe →</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="surface rounded-3xl p-10 text-center border border-border-subtle space-y-3">
            <p className="text-sm font-medium text-secondary">
              {isPro
                ? "You have full Studio Pro access. Browse any recipe in the directory to view complete parameters."
                : "You haven't claimed any individual recipes yet this cycle."}
            </p>
            <Link
              href="/prompts"
              className="inline-flex rounded-2xl bg-surface-elevated border border-border px-5 py-2.5 text-xs font-semibold text-primary hover:border-border-bright transition"
            >
              Explore Prompt Catalog →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
