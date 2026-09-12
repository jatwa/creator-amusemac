"use client";

import React, { useState } from "react";
import { useCurrency } from "@/context/currency-context";
import { VAULT_PRICING_PLANS } from "@/lib/geo/currency";
import { CurrencySwitcher } from "@/components/currency-switcher";
import { STRINGS } from "@/lib/i18n/strings";

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay?: any;
  }
}

export function VaultCheckout() {
  const { currency, currencyConfig, formatPrice, getPrice, isLoading } = useCurrency();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("vault-lifetime");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setIsProcessing(true);
    setCheckoutMessage(null);

    try {
      // 1. Call checkout API to create Razorpay Order with detected currency
      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not initialize checkout");
      }

      const { order } = data;

      // 2. If Razorpay SDK is loaded on window, trigger checkout
      if (typeof window !== "undefined" && window.Razorpay) {
        const options = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Creator Intel",
          description: `${order.planName} Access`,
          order_id: order.orderId,
          prefill: {
            name: "",
            email: "",
          },
          theme: {
            color: "#6366f1",
          },
          handler: function (response: any) {
            setCheckoutMessage(
              `Payment successful! Reference ID: ${response.razorpay_payment_id || order.orderId}. Your Vault pass has been generated.`
            );
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Preview mode / Mock notice
        setCheckoutMessage(
          `Razorpay Order created in ${order.currency} for ${currencyConfig.symbol}${order.displayAmount}. (Order Ref: ${order.orderId})`
        );
      }
    } catch (err: any) {
      setCheckoutMessage(`Checkout notice: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Visual Currency Indicator & Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl border border-border-subtle bg-surface/50">
        <CurrencySwitcher variant="banner" />
        <div className="text-xs text-tertiary font-mono">
          🔒 International cards, UPI &amp; localized billing supported
        </div>
      </div>

      {checkoutMessage && (
        <div className="rounded-2xl border border-accent/30 bg-accent/10 p-4 text-xs font-mono text-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>✨</span>
            <span>{checkoutMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutMessage(null)}
            className="text-tertiary hover:text-primary ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid gap-8 lg:grid-cols-3 items-stretch">
        {VAULT_PRICING_PLANS.map((plan) => {
          const formattedAmount = formatPrice(plan.priceUSD, plan.customPrices);
          const isSelected = selectedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
                plan.isPopular
                  ? "border-2 border-accent bg-surface shadow-xl shadow-accent/5"
                  : "border border-border bg-surface/80 hover:border-border-bright"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-accent px-4 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-white shadow-md">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">{plan.name}</h3>
                  <span className="text-[11px] font-mono text-secondary uppercase tracking-widest">
                    {plan.period === "lifetime" ? "Lifetime" : plan.period === "year" ? "Annual" : "Monthly"}
                  </span>
                </div>

                <p className="mt-2 text-xs text-secondary leading-relaxed font-normal min-h-[36px]">
                  {plan.tagline}
                </p>

                {/* Price Display with detected currency */}
                <div className="mt-6 border-y border-border-subtle py-5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-primary font-mono">
                      {isLoading ? "..." : formattedAmount}
                    </span>
                    <span className="text-xs text-tertiary font-mono">
                      {plan.period === "lifetime"
                        ? "one-time"
                        : plan.period === "year"
                        ? "/year"
                        : "/month"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-tertiary font-mono">
                    Billed in {currencyConfig.code} ({currencyConfig.name})
                  </p>
                </div>

                {/* Feature checklist */}
                <ul className="mt-6 space-y-3 text-xs text-secondary">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                      <span className="text-accent font-bold mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isProcessing}
                  className={`w-full py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm cursor-pointer ${
                    plan.isPopular
                      ? "bg-accent text-white hover:opacity-90 shadow-md shadow-accent/20"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {isProcessing && selectedPlanId === plan.id
                    ? STRINGS.checkout.processing
                    : plan.isPopular
                    ? "Unlock Lifetime Vault Pass →"
                    : `Get ${plan.name} →`}
                </button>

                <p className="mt-3 text-center text-[10px] text-tertiary font-mono">
                  {STRINGS.checkout.securedBy}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
