"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Prompt } from "@/data/types";
import { PromptCustomizer } from "@/components/prompt-customizer";
import { BASIC_TIER_MONTHLY_LIMIT } from "@/lib/payment/razorpay-subscription";

interface GatedPromptViewProps {
  prompt: Prompt;
}

export function GatedPromptView({ prompt }: GatedPromptViewProps) {
  const { data: session, status } = useSession();
  const [unlocksUsed, setUnlocksUsed] = useState<number>(0);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [unlockSuccess, setUnlockSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasCheckedDb, setHasCheckedDb] = useState(false);

  const tier = session?.user?.tier || "free";
  const isAuthenticated = status === "authenticated";

  // Check if this prompt is already unlocked
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchUserUnlocks() {
      try {
        const res = await fetch("/api/subscriptions/me");
        if (res.ok) {
          const data = await res.json();
          if (data.subscription) {
            setUnlocksUsed(data.subscription.monthlyUnlocksUsed || 0);
            setUnlockedIds(data.subscription.unlockedPromptIds || []);
          }
        }
      } catch (err) {
        console.warn("[Fetch user subscription error]:", err);
      } finally {
        setHasCheckedDb(true);
      }
    }

    fetchUserUnlocks();
  }, [isAuthenticated, prompt.id]);

  const isAlreadyUnlocked =
    tier === "pro" ||
    unlockedIds.includes(prompt.id) ||
    unlockedIds.includes(prompt.slug) ||
    unlockSuccess;

  const remainingBasicUnlocks = Math.max(0, BASIC_TIER_MONTHLY_LIMIT - unlocksUsed);

  const handleUnlockPrompt = async () => {
    setErrorMsg(null);
    setIsUnlocking(true);

    try {
      const res = await fetch("/api/subscriptions/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: prompt.id,
          promptSlug: prompt.slug,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to unlock prompt");
      }

      setUnlockSuccess(true);
      setUnlockedIds((prev) => [...prev, prompt.id, prompt.slug]);
      if (typeof data.monthlyUnlocksUsed === "number") {
        setUnlocksUsed(data.monthlyUnlocksUsed);
      }
    } catch (err: any) {
      console.error("[Unlock Error]:", err);
      setErrorMsg(err.message || "An error occurred while unlocking");
    } finally {
      setIsUnlocking(false);
    }
  };

  // 1. If Unlocked (Pro or Claimed Basic)
  if (isAlreadyUnlocked) {
    return (
      <div className="space-y-6">
        {tier === "pro" ? (
          <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/10 px-5 py-3 text-xs">
            <span className="flex items-center gap-2 font-medium text-accent">
              <span>⚡</span> Studio Pro Unlimited Access Active
            </span>
            <span className="font-mono text-tertiary">All 65+ recipes unlocked</span>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-xs">
            <span className="flex items-center gap-2 font-medium text-emerald-400">
              <span>✓</span> Recipe Unlocked &amp; Saved to Your Library
            </span>
            <span className="font-mono text-secondary">
              {remainingBasicUnlocks} of {BASIC_TIER_MONTHLY_LIMIT} unlocks left this cycle
            </span>
          </div>
        )}

        <PromptCustomizer prompt={prompt} />
      </div>
    );
  }

  // Preview snippet (first 2-3 lines of prompt)
  const lines = prompt.promptText.split("\n");
  const previewLines = lines.slice(0, 2).join("\n") || prompt.promptText.substring(0, 120);

  return (
    <div className="space-y-8">
      {/* Gated Preview Container */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-subtle">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
          <div className="flex items-center gap-2 font-mono text-xs text-secondary">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="font-semibold uppercase tracking-wider">Director Prompt Recipe</span>
          </div>
          <span className="rounded-full bg-surface-elevated border border-border px-3 py-1 font-mono text-[11px] text-tertiary">
            PRO VAULT SPECIFICATION
          </span>
        </div>

        {/* Partial Text & Blurred Area */}
        <div className="relative space-y-4">
          <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 font-mono text-sm leading-relaxed text-secondary select-none">
            <p>{previewLines}...</p>
            <p className="mt-2 text-tertiary blur-[6px] select-none filter opacity-40">
              anamorphic lens bokeh, ARRI Alexa LF sensor calibration, 35mm optical flare, volumetric atmospheric haze, octane render 8k detail, negative prompt matrix
            </p>
            <p className="mt-2 text-tertiary blur-[7px] select-none filter opacity-30">
              shutter angle 180 degrees, Cooke S4 prime aperture f/2.8, cinematic color grade LUT, kodak vision3 500T 5219 grain structure
            </p>
          </div>

          {/* Gating Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/85 backdrop-blur-md p-6 text-center transition-all">
            {/* Case A: Unauthenticated */}
            {!isAuthenticated && (
              <div className="max-w-md space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent text-xl">
                  🔒
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    Sign in to Unlock Full Recipe
                  </h3>
                  <p className="mt-1.5 text-xs text-secondary leading-relaxed">
                    Access this cinematic prompt syntax, variable controls, optical lens tokens, and negative blueprints.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: `/prompts/${prompt.slug}` })}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-primary px-6 py-3 text-xs font-semibold text-background shadow-md hover:bg-primary/90 transition"
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
                  <Link
                    href="/pricing"
                    className="w-full sm:w-auto rounded-2xl border border-border bg-surface px-5 py-3 text-xs font-semibold text-secondary hover:text-primary transition text-center"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
            )}

            {/* Case B: Logged in as Free Tier */}
            {isAuthenticated && tier === "free" && (
              <div className="max-w-md space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent text-xl">
                  ✨
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    Upgrade to Director Basic or Studio Pro
                  </h3>
                  <p className="mt-1.5 text-xs text-secondary leading-relaxed">
                    You are on the Starter Studio tier. Upgrade to unlock 25 recipes every month or get unlimited Studio Pro access.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href="/pricing"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-accent px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-accent/90 transition"
                  >
                    Upgrade Plan →
                  </Link>
                  <Link
                    href="/prompts"
                    className="w-full sm:w-auto rounded-2xl border border-border bg-surface px-5 py-3 text-xs font-semibold text-secondary hover:text-primary transition text-center"
                  >
                    Browse Free Catalog
                  </Link>
                </div>
              </div>
            )}

            {/* Case C: Logged in as Basic Tier (Needs to Claim) */}
            {isAuthenticated && tier === "basic" && (
              <div className="max-w-md space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20 text-accent text-xl">
                  🎬
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">
                    Director Basic Recipe Claim
                  </h3>
                  <p className="mt-1.5 text-xs text-secondary leading-relaxed">
                    You have <span className="font-bold text-accent font-mono">{remainingBasicUnlocks}</span> of {BASIC_TIER_MONTHLY_LIMIT} unlocks remaining in your current billing cycle.
                  </p>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl font-mono">
                    {errorMsg}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  {remainingBasicUnlocks > 0 ? (
                    <button
                      type="button"
                      disabled={isUnlocking}
                      onClick={handleUnlockPrompt}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-accent/90 transition disabled:opacity-50"
                    >
                      {isUnlocking ? (
                        <>
                          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Unlocking recipe...
                        </>
                      ) : (
                        "Unlock Recipe (Use 1 of 25)"
                      )}
                    </button>
                  ) : (
                    <Link
                      href="/pricing"
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-accent px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-accent/90 transition"
                    >
                      Limit Reached — Upgrade to Pro
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="w-full sm:w-auto rounded-2xl border border-border bg-surface px-5 py-3 text-xs font-semibold text-secondary hover:text-primary transition text-center"
                  >
                    My Library
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
