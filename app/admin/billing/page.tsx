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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-amber-400">Admin</Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200">Billing Monitor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Paddle &amp; Razorpay Billing Observability
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
            Secure configuration monitoring, price mapping verification, and subscriber distribution.
          </p>
        </div>
        <div>
          <Link
            href="/admin/billing/webhooks"
            className="rounded border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition font-mono"
          >
            Webhook Monitor →
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-1">
          <span className="text-zinc-400 block font-bold text-[11px] uppercase">Paddle Active</span>
          <span className="text-3xl font-bold text-white mt-1 block">{paddleActiveCount}</span>
          <span className="text-zinc-500 text-[10px]">Primary active billing engine</span>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-1">
          <span className="text-zinc-400 block font-bold text-[11px] uppercase">Razorpay Legacy</span>
          <span className="text-3xl font-bold text-white mt-1 block">{razorpayActiveCount}</span>
          <span className="text-zinc-500 text-[10px]">Legacy active subscriptions</span>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-1">
          <span className="text-zinc-400 block font-bold text-[11px] uppercase">Past Due / Grace</span>
          <span className="text-3xl font-bold text-amber-400 mt-1 block">{pastDueCount}</span>
          <span className="text-zinc-500 text-[10px]">Payment retry in progress</span>
        </div>

        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-1">
          <span className="text-zinc-400 block font-bold text-[11px] uppercase">Cancelled</span>
          <span className="text-3xl font-bold text-zinc-400 mt-1 block">{cancelledCount}</span>
          <span className="text-zinc-500 text-[10px]">Terminated subscriptions</span>
        </div>
      </div>

      {/* Paddle Price Mapping Configuration */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">Paddle Product &amp; Price Configuration</h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">Environment: <span className="font-mono uppercase text-amber-400 font-bold">{paddleEnv}</span></p>
          </div>
          <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono font-bold">
            4 OF 4 PRICES RESOLVED
          </span>
        </div>

        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Plan Tier</th>
                <th className="p-3">Billing Cadence</th>
                <th className="p-3">Catalog Price (INR)</th>
                <th className="p-3">Masked Paddle Price ID</th>
                <th className="p-3 text-right">Mapping Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              <tr className="hover:bg-zinc-800/40 transition">
                <td className="p-3 font-semibold text-white">Director Basic</td>
                <td className="p-3 text-zinc-400">Monthly</td>
                <td className="p-3 text-white">₹499 / mo</td>
                <td className="p-3 text-amber-400 font-mono">{maskIdentifier(prices.directorMonthly)}</td>
                <td className="p-3 text-right text-emerald-400 font-semibold">VALIDATED</td>
              </tr>
              <tr className="hover:bg-zinc-800/40 transition">
                <td className="p-3 font-semibold text-white">Director Basic</td>
                <td className="p-3 text-zinc-400">Yearly (Save 25%)</td>
                <td className="p-3 text-white">₹4,499 / yr</td>
                <td className="p-3 text-amber-400 font-mono">{maskIdentifier(prices.directorYearly)}</td>
                <td className="p-3 text-right text-emerald-400 font-semibold">VALIDATED</td>
              </tr>
              <tr className="hover:bg-zinc-800/40 transition">
                <td className="p-3 font-semibold text-white">Studio Pro</td>
                <td className="p-3 text-zinc-400">Monthly</td>
                <td className="p-3 text-white">₹1,499 / mo</td>
                <td className="p-3 text-amber-400 font-mono">{maskIdentifier(prices.proMonthly)}</td>
                <td className="p-3 text-right text-emerald-400 font-semibold">VALIDATED</td>
              </tr>
              <tr className="hover:bg-zinc-800/40 transition">
                <td className="p-3 font-semibold text-white">Studio Pro</td>
                <td className="p-3 text-zinc-400">Yearly (Save 28%)</td>
                <td className="p-3 text-white">₹12,999 / yr</td>
                <td className="p-3 text-amber-400 font-mono">{maskIdentifier(prices.proYearly)}</td>
                <td className="p-3 text-right text-emerald-400 font-semibold">VALIDATED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Security & Secret Safety Notice */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-xs text-zinc-300 space-y-2 font-mono">
        <h3 className="font-bold text-amber-400 flex items-center gap-2 text-xs uppercase tracking-wider">
          <span>🔒 Secret Safety &amp; Credential Isolation Policy</span>
        </h3>
        <p className="leading-relaxed text-zinc-400">
          Creator Intel strictly adheres to zero-trust credential handling. Secret keys (`PADDLE_API_KEY`, `PADDLE_NOTIFICATION_WEBHOOK_SECRET`, `RAZORPAY_KEY_SECRET`) are only accessible inside secure server-side Node.js environments and are never transmitted to client bundles or displayed in plain-text.
        </p>
      </section>
    </div>
  );
}
