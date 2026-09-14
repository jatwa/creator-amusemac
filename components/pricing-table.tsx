"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/context/currency-context";
import { SUBSCRIPTION_TIERS, SubscriptionTierDetails } from "@/lib/payment/razorpay-subscription";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { initializePaddle, type Paddle, type Environments, CheckoutEventNames } from "@paddle/paddle-js";

export function PricingTable() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currency, formatPrice } = useCurrency();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const paddleRef = useRef<Paddle | null>(null);

  const currentTier = session?.user?.tier || "free";

  // Pre-initialize Paddle.js client on mount if client token is available in bundle
  useEffect(() => {
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    const paddleEnv =
      (process.env.NEXT_PUBLIC_PADDLE_ENV as Environments) || "sandbox";

    console.log(
      `[Paddle Init Check] hasClientToken: ${Boolean(clientToken)}, environment: ${paddleEnv}`
    );

    if (!clientToken || clientToken.trim() === "") {
      return;
    }

    if (paddleRef.current?.Initialized) {
      return;
    }

    initializePaddle({
      token: clientToken.trim(),
      environment: paddleEnv,
      eventCallback: (event) => {
        if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
          setSuccessMessage(
            "Payment completed successfully! Activating your subscription..."
          );
          setTimeout(() => {
            router.push("/account?subscribed=true");
          }, 1800);
        } else if (
          event.name === CheckoutEventNames.CHECKOUT_ERROR ||
          event.name === CheckoutEventNames.CHECKOUT_FAILED ||
          event.name === CheckoutEventNames.CHECKOUT_PAYMENT_FAILED ||
          event.name === CheckoutEventNames.CHECKOUT_PAYMENT_ERROR
        ) {
          setErrorMessage(
            "An issue occurred during checkout. Please try again or refresh the page."
          );
        }
      },
    })
      .then((p) => {
        if (p) {
          paddleRef.current = p;
        }
      })
      .catch((err) => {
        console.warn("[Paddle Init Warning]:", err?.message || err);
      });
  }, [router]);

  const handleSubscribe = async (tier: SubscriptionTierDetails) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (tier.id === "free") {
      if (status !== "authenticated") {
        signIn("google", { callbackUrl: "/prompts" });
      } else {
        router.push("/prompts");
      }
      return;
    }

    if (status !== "authenticated") {
      signIn("google", {
        callbackUrl: `/pricing?tier=${tier.id}&cycle=${billingCycle}`,
      });
      return;
    }

    if (currentTier === tier.id) {
      router.push("/account");
      return;
    }

    setLoadingTier(tier.id);

    try {
      // 1. Fetch configured Paddle Price ID & runtime client token from server
      const res = await fetch("/api/checkout/paddle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: tier.id,
          billingCycle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Failed to initialize subscription checkout."
        );
      }

      const { priceId, clientToken: serverToken, environment: serverEnv } = data;

      if (!priceId) {
        throw new Error(
          "Paddle Price ID not configured for this plan. Please verify environment settings."
        );
      }

      // 2. Resolve client token (from bundle or server runtime fallback)
      const activeToken =
        (process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
         process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.trim() !== "")
          ? process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN.trim()
          : (serverToken && serverToken.trim() !== "")
          ? serverToken.trim()
          : null;

      if (!activeToken) {
        throw new Error(
          "Paddle client token is missing. Please set NEXT_PUBLIC_PADDLE_CLIENT_TOKEN in Vercel project environment variables and trigger a redeployment."
        );
      }

      const activeEnv: Environments =
        (process.env.NEXT_PUBLIC_PADDLE_ENV as Environments) ||
        (serverEnv as Environments) ||
        "sandbox";

      // 3. Obtain or initialize active Paddle instance
      let activePaddle = paddleRef.current;
      if (!activePaddle || !activePaddle.Initialized) {
        activePaddle =
          (await initializePaddle({
            token: activeToken,
            environment: activeEnv,
            eventCallback: (event) => {
              if (event.name === "checkout.completed") {
                setSuccessMessage(
                  "Payment completed successfully! Activating your subscription..."
                );
                setTimeout(() => {
                  router.push("/account?subscribed=true");
                }, 1800);
              }
            },
          })) || null;

        if (activePaddle) {
          paddleRef.current = activePaddle;
        }
      }

      if (!activePaddle) {
        throw new Error(
          "Unable to load Paddle checkout library. Please verify your client token and network connection."
        );
      }

      // 4. Open Paddle.js Overlay Checkout with user metadata in customData
      activePaddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: session?.user?.email
          ? {
              email: session.user.email,
            }
          : undefined,
        customData: {
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          tier: tier.id,
          billingCycle,
        },
        settings: {
          variant: "one-page",
          displayMode: "overlay",
          theme: "dark",
          successUrl: `${window.location.origin}/account?subscribed=true`,
        },
      });
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during checkout. Please try again.";
      console.error("[Paddle Checkout Error]:", errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* Billing Cycle & Currency Switcher Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-border-subtle">
        {/* Monthly / Yearly Toggle */}
        <div className="inline-flex items-center p-1 rounded-full bg-surface-elevated border border-border">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
              billingCycle === "monthly"
                ? "bg-accent text-white shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all ${
              billingCycle === "yearly"
                ? "bg-accent text-white shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            <span>Annual Billing</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-bold">
              Save 25%
            </span>
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-tertiary font-mono">Currency:</span>
          <CurrencySwitcher />
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
          <p className="font-semibold">Checkout Notice:</p>
          <p className="mt-0.5">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400">
          <p className="font-semibold">Success:</p>
          <p className="mt-0.5">{successMessage}</p>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {SUBSCRIPTION_TIERS.map((tier) => {
          const isCurrent = currentTier === tier.id && status === "authenticated";
          const isPro = tier.id === "pro";

          const usdPrice = billingCycle === "yearly" ? tier.yearlyUSD : tier.monthlyUSD;
          const customOverrides =
            billingCycle === "yearly" ? tier.yearlyCustomPrices : tier.monthlyCustomPrices;

          const formattedPrice =
            usdPrice === 0 ? "Free" : formatPrice(usdPrice, customOverrides);

          const periodSuffix =
            usdPrice === 0 ? "" : billingCycle === "yearly" ? "/year" : "/month";

          return (
            <div
              key={tier.id}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                isPro
                  ? "border-2 border-accent bg-surface-elevated shadow-xl shadow-accent/5 ring-1 ring-accent/20"
                  : "border border-border-subtle bg-surface/80 hover:border-border-bright"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3.5 right-6 rounded-full bg-accent px-3.5 py-1 text-[11px] font-semibold font-mono tracking-wide text-white uppercase shadow-sm">
                  {tier.badge}
                </div>
              )}

              <div>
                {/* Header */}
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight text-primary flex items-center gap-2">
                    {tier.name}
                    {isCurrent && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                        Current Plan
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-secondary leading-relaxed min-h-[36px]">
                    {tier.tagline}
                  </p>
                </div>

                {/* Price Display */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tight text-primary font-mono">
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-tertiary font-mono">{periodSuffix}</span>
                </div>

                {billingCycle === "yearly" && usdPrice > 0 && (
                  <p className="mt-1 text-[11px] font-mono text-emerald-400">
                    Billed annually (equivalent to{" "}
                    {formatPrice(Math.round(usdPrice / 12), customOverrides)}/mo)
                  </p>
                )}

                {/* Unlock Limit Badge */}
                <div className="mt-6 rounded-xl border border-border-subtle bg-surface/50 p-3 text-xs">
                  <p className="font-semibold text-primary">
                    {tier.id === "free" && "Standard Catalog Access"}
                    {tier.id === "basic" && "25 Prompt Unlocks / Month"}
                    {tier.id === "pro" && "Unlimited Prompt Access"}
                  </p>
                  <p className="text-[11px] text-tertiary mt-0.5">
                    {tier.id === "free" && "Preview premium prompts with blurred recipe tokens."}
                    {tier.id === "basic" && "Claim individual prompts; resets each billing period."}
                    {tier.id === "pro" && "Instant full access to all recipes, formulas & drops."}
                  </p>
                </div>

                {/* Features List */}
                <div className="mt-8 space-y-3">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-secondary font-semibold">
                    What&apos;s Included:
                  </p>
                  <ul className="space-y-2.5 text-xs text-secondary">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-accent mt-0.5">✓</span>
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-10 pt-6 border-t border-border-subtle">
                <button
                  type="button"
                  disabled={loadingTier === tier.id}
                  onClick={() => handleSubscribe(tier)}
                  className={`w-full py-3.5 px-6 rounded-2xl text-xs font-semibold tracking-wide transition-all shadow-sm ${
                    isCurrent
                      ? "bg-surface-elevated text-primary border border-border hover:border-border-bright"
                      : isPro
                      ? "bg-accent text-white hover:bg-accent/90 hover:scale-[1.01]"
                      : "bg-primary text-background hover:bg-primary/90"
                  } disabled:opacity-50`}
                >
                  {loadingTier === tier.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Setting up Paddle checkout...
                    </span>
                  ) : isCurrent ? (
                    "Manage Subscription →"
                  ) : tier.id === "free" ? (
                    status === "authenticated" ? "Explore Catalog" : "Start Free with Google"
                  ) : (
                    `Upgrade to ${tier.name}`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
