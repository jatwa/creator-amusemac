import React from "react";
import Link from "next/link";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

export default async function AdminWebhooksPage() {
  const webhookEndpoint = "https://creatorintels.com/api/webhooks/paddle";
  const hasSecret = !!process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET;

  // Query recent subscriptions updated via webhooks
  let recentEvents: any[] = [];
  try {
    const res = await queryNeon<any>(
      `SELECT id, user_id, tier, status, provider, paddle_subscription_id, paddle_customer_id, updated_at
       FROM subscriptions
       WHERE provider = 'paddle'
       ORDER BY updated_at DESC LIMIT 15`
    );
    if (res && res.rows) {
      recentEvents = res.rows;
    }
  } catch {}

  const supportedPaddleEvents = [
    { event: "subscription.created", lifecycle: "Account Creation", handled: "Yes — Idempotent sync" },
    { event: "subscription.activated", lifecycle: "Payment Confirmation", handled: "Yes — Immediate Pro/Basic unlock" },
    { event: "subscription.updated", lifecycle: "Plan Upgrade / Change", handled: "Yes — Dynamic tier re-calculation" },
    { event: "subscription.canceled", lifecycle: "User Cancellation", handled: "Yes — Grace period till period_end" },
    { event: "subscription.past_due", lifecycle: "Payment Failure", handled: "Yes — Grace status mapped" },
    { event: "transaction.completed", lifecycle: "Direct Checkout", handled: "Yes — Customer mirror sync" },
    { event: "customer.created", lifecycle: "CRM Customer Mirror", handled: "Yes — Paddle customer linked" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          <span className="text-zinc-600">/</span>
          <Link href="/admin/billing" className="hover:text-amber-400">Billing</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">Webhooks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          Paddle Webhook Verification &amp; Event Monitor
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
          HMAC-SHA256 signature verification status, endpoint health, and synced subscription events.
        </p>
      </div>

      {/* Endpoint Configuration Status */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">Webhook Notification Endpoint</h2>
        <div className="grid gap-4 sm:grid-cols-3 text-xs font-mono">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 sm:col-span-2">
            <span className="text-zinc-400 block font-bold text-[11px] uppercase">Production Ingestion URL</span>
            <span className="text-amber-400 font-bold text-sm mt-1 block font-mono">{webhookEndpoint}</span>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
            <span className="text-zinc-400 block font-bold text-[11px] uppercase">Signature Verification</span>
            <span className={`font-bold text-sm mt-1 block font-mono ${hasSecret ? "text-emerald-400" : "text-amber-400"}`}>
              {hasSecret ? "HMAC-SHA256 ACTIVE" : "SECRET STANDBY"}
            </span>
          </div>
        </div>
      </section>

      {/* Supported Lifecycle Event Handlers */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">Supported Paddle Event Handlers</h2>
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Paddle Event Name</th>
                <th className="p-3">Lifecycle Phase</th>
                <th className="p-3 text-right">Synchronization Handler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {supportedPaddleEvents.map((ev) => (
                <tr key={ev.event} className="hover:bg-zinc-800/40 transition">
                  <td className="p-3 font-semibold text-white">{ev.event}</td>
                  <td className="p-3 text-zinc-400">{ev.lifecycle}</td>
                  <td className="p-3 text-right text-emerald-400 font-semibold">{ev.handled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Synced Subscription Records */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">Recent Database Synchronizations</h2>
        {recentEvents.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-8 text-center text-xs text-zinc-400 font-mono">
            No Paddle webhook events recorded in local database yet.
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-800 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Paddle Subscription ID</th>
                  <th className="p-3 text-right">Last Synced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {recentEvents.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-800/40 transition">
                    <td className="p-3 text-white font-semibold">{r.user_id}</td>
                    <td className="p-3 uppercase text-amber-400 font-semibold">{r.tier}</td>
                    <td className="p-3">
                      <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-400 font-mono">{r.paddle_subscription_id || "—"}</td>
                    <td className="p-3 text-right text-zinc-400">{new Date(r.updated_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
