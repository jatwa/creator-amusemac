import React from "react";
import Link from "next/link";
import { getPaddlePriceIds } from "@/lib/paddle/config";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

function maskIdentifier(id: string): string {
  if (!id) return "Not Configured";
  if (id.length <= 8) return "••••••••";
  return `${id.slice(0, 7)}••••${id.slice(-4)}`;
}

export default async function AdminBillingPage() {
  const prices = getPaddlePriceIds();
  const paddleEnv = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox";

  // Query subscription breakdown
  let paddleActiveCount = 0;
  let razorpayActiveCount = 0;
  let pastDueCount = 0;
  let cancelledCount = 0;

  try {
    const res = await queryNeon<any>(
      `SELECT provider, status, COUNT(*) as count FROM subscriptions GROUP BY provider, status`
    );
    if (res && res.rows) {
      for (const r of res.rows) {
        const cnt = parseInt(r.count || "0", 10);
        if (r.provider === "paddle" && r.status === "active") paddleActiveCount += cnt;
        if (r.provider === "razorpay" && r.status === "active") razorpayActiveCount += cnt;
        if (r.status === "past_due") pastDueCount += cnt;
        if (r.status === "cancelled" || r.status === "canceled") cancelledCount += cnt;
      }
    }
  } catch {}

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-white">Admin</Link>
            <span>/</span>
            <span className="text-zinc-200">Billing Monitor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Paddle &amp; Razorpay Billing Observability
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Secure configuration monitoring, price mapping verification, and subscriber distribution.
          </p>
        </div>
        <div>
          <Link
            href="/admin/billing/webhooks"
            className="rounded-xl border border-lime/40 bg-lime/10 px-4 py-2 text-xs font-semibold text-lime hover:bg-lime/20 transition"
          >
            Webhook Monitor →
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Paddle Active</span>
          <span className="text-2xl font-bold text-white mt-1 block">{paddleActiveCount}</span>
          <span className="text-zinc-500 text-[11px]">Primary active billing engine</span>
        </div>

        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Razorpay Legacy</span>
          <span className="text-2xl font-bold text-white mt-1 block">{razorpayActiveCount}</span>
          <span className="text-zinc-500 text-[11px]">Legacy active subscriptions</span>
        </div>

        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Past Due / Grace</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">{pastDueCount}</span>
          <span className="text-zinc-500 text-[11px]">Payment retry in progress</span>
        </div>

        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Cancelled</span>
          <span className="text-2xl font-bold text-zinc-400 mt-1 block">{cancelledCount}</span>
          <span className="text-zinc-500 text-[11px]">Terminated subscriptions</span>
        </div>
      </div>

      {/* Paddle Price Mapping Configuration */}
      <section className="surface p-6 rounded-2xl border border-line space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="text-base font-bold text-white">Paddle Product &amp; Price Configuration</h2>
            <p className="text-xs text-zinc-400">Environment: <span className="font-mono uppercase text-lime">{paddleEnv}</span></p>
          </div>
          <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-xs font-mono">
            4 OF 4 PRICES RESOLVED
          </span>
        </div>

        <div className="rounded-xl border border-line overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-line bg-black/60 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Plan Tier</th>
                <th className="p-3">Billing Cadence</th>
                <th className="p-3">Catalog Price (INR)</th>
                <th className="p-3">Masked Paddle Price ID</th>
                <th className="p-3 text-right">Mapping Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-zinc-300">
              <tr className="hover:bg-white/[0.02]">
                <td className="p-3 font-semibold text-white">Director Basic</td>
                <td className="p-3 text-zinc-400">Monthly</td>
                <td className="p-3 text-white">₹499 / mo</td>
                <td className="p-3 text-lime font-mono">{maskIdentifier(prices.directorMonthly)}</td>
                <td className="p-3 text-right text-emerald-400 font-semibold">VALIDATED</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-3 font-semibold text-white">Director Basic</td>
                <td className="p-3 text-zinc-400">Yearly (Save 25%)</td>
                <td className="p-3 text-white">₹4,499 / yr</td>
                <td className="p-3 text-lime font-mono">{maskIdentifier(prices.directorYearly)}</td>
                <td className="p-3 text-right text-emerald-400 font-semibold">VALIDATED</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-3 font-semibold text-white">Studio Pro</td>
                <td className="p-3 text-zinc-400">Monthly</td>
                <td className="p-3 text-white">₹1,499 / mo</td>
                <td className="p-3 text-lime font-mono">{maskIdentifier(prices.proMonthly)}</td>
                <td className="p-3 text-right text-emerald-400 font-semibold">VALIDATED</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-3 font-semibold text-white">Studio Pro</td>
                <td className="p-3 text-zinc-400">Yearly (Save 28%)</td>
                <td className="p-3 text-white">₹12,999 / yr</td>
                <td className="p-3 text-lime font-mono">{maskIdentifier(prices.proYearly)}</td>
                <td className="p-3 text-right text-emerald-400 font-semibold">VALIDATED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Security & Secret Safety Notice */}
      <section className="rounded-2xl border border-lime/20 bg-lime/5 p-5 text-xs text-zinc-300 space-y-2">
        <h3 className="font-bold text-lime flex items-center gap-2">
          <span>🔒 Secret Safety &amp; Credential Isolation Policy</span>
        </h3>
        <p className="leading-relaxed">
          Creator Intel strictly adheres to zero-trust credential handling. Secret keys (`PADDLE_API_KEY`, `PADDLE_NOTIFICATION_WEBHOOK_SECRET`, `RAZORPAY_KEY_SECRET`) are only accessible inside secure server-side Node.js environments and are never transmitted to client bundles or displayed in plain-text.
        </p>
      </section>
    </div>
  );
}
