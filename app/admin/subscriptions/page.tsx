import React from "react";
import Link from "next/link";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

interface SubscriptionsPageProps {
  searchParams: Promise<{ status?: string; tier?: string; q?: string }>;
}

export default async function AdminSubscriptionsPage({ searchParams }: SubscriptionsPageProps) {
  const { status: statusFilter, tier: tierFilter, q } = await searchParams;
  const status = (statusFilter || "all").toLowerCase();
  const tier = (tierFilter || "all").toLowerCase();
  const searchQuery = (q || "").trim().toLowerCase();

  let subscriptions: any[] = [];
  let stats = {
    total: 0,
    activePro: 0,
    activeBasic: 0,
    pastDue: 0,
    canceled: 0,
  };

  try {
    // 1. Fetch aggregates
    const statsRes = await queryNeon<any>(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'active' AND tier = 'pro') as active_pro,
        COUNT(*) FILTER (WHERE status = 'active' AND tier = 'basic') as active_basic,
        COUNT(*) FILTER (WHERE status IN ('past_due', 'unpaid')) as past_due,
        COUNT(*) FILTER (WHERE status IN ('canceled', 'paused')) as canceled
      FROM subscriptions
    `);

    if (statsRes && statsRes.rows && statsRes.rows.length > 0) {
      const row = statsRes.rows[0];
      stats = {
        total: parseInt(row.total || "0", 10),
        activePro: parseInt(row.active_pro || "0", 10),
        activeBasic: parseInt(row.active_basic || "0", 10),
        pastDue: parseInt(row.past_due || "0", 10),
        canceled: parseInt(row.canceled || "0", 10),
      };
    }

    // 2. Fetch filtered records
    let sql = `
      SELECT s.id, s.user_id, s.provider, s.tier, s.status, 
             s.paddle_customer_id, s.paddle_subscription_id, s.razorpay_subscription_id,
             s.current_period_start, s.current_period_end, s.cancel_at_period_end,
             s.paddle_custom_data, s.created_at, s.updated_at,
             u.email, u.name
      FROM subscriptions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIdx = 1;

    if (status !== "all") {
      sql += ` AND s.status = $${paramIdx++}`;
      params.push(status);
    }

    if (tier !== "all") {
      sql += ` AND s.tier = $${paramIdx++}`;
      params.push(tier);
    }

    if (searchQuery) {
      sql += ` AND (LOWER(u.email) LIKE $${paramIdx} OR LOWER(u.name) LIKE $${paramIdx} OR s.paddle_subscription_id LIKE $${paramIdx} OR s.id LIKE $${paramIdx})`;
      params.push(`%${searchQuery}%`);
      paramIdx++;
    }

    sql += ` ORDER BY s.updated_at DESC LIMIT 100`;

    const res = await queryNeon<any>(sql, params);
    subscriptions = res?.rows || [];
  } catch (err: any) {
    console.error("[Admin Subscriptions Query Error]:", err.message);
  }

  return (
    <div className="space-y-8 font-mono">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-amber-400 transition">Admin</Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200">Subscriptions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Subscription &amp; Revenue Lifecycle Monitor
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Real-time subscriber states, billing period renewals, churn status, and AI quota consumption.
          </p>
        </div>

        {/* Search */}
        <form method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search email, sub ID..."
            className="rounded border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none w-56 font-mono"
          />
          <button
            type="submit"
            className="rounded bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 hover:text-white hover:border-zinc-500 transition"
          >
            Filter
          </button>
        </form>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
          <p className="text-[11px] uppercase text-zinc-400 font-bold">Active Pro</p>
          <p className="text-3xl font-bold text-amber-400">{stats.activePro}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Studio Pro ($99/mo)</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
          <p className="text-[11px] uppercase text-zinc-400 font-bold">Active Basic</p>
          <p className="text-3xl font-bold text-emerald-400">{stats.activeBasic}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Director Basic ($39/mo)</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
          <p className="text-[11px] uppercase text-zinc-400 font-bold">Past Due / Unpaid</p>
          <p className="text-3xl font-bold text-amber-500">{stats.pastDue}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Requires billing retry</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
          <p className="text-[11px] uppercase text-zinc-400 font-bold">Canceled / Paused</p>
          <p className="text-3xl font-bold text-zinc-400">{stats.canceled}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Historical churn</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="text-zinc-500 font-bold uppercase text-[10px]">Filter Status:</span>
        {["all", "active", "past_due", "canceled", "paused"].map((st) => (
          <Link
            key={st}
            href={`/admin/subscriptions?status=${st}${tier !== "all" ? `&tier=${tier}` : ""}`}
            className={`px-3 py-1.5 rounded border transition text-xs font-semibold ${
              status === st
                ? "bg-amber-400 text-zinc-950 font-bold border-amber-400"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            {st.toUpperCase()}
          </Link>
        ))}

        <span className="text-zinc-500 font-bold uppercase text-[10px] ml-4">Filter Tier:</span>
        {["all", "basic", "pro"].map((t) => (
          <Link
            key={t}
            href={`/admin/subscriptions?tier=${t}${status !== "all" ? `&status=${status}` : ""}`}
            className={`px-3 py-1.5 rounded border transition text-xs font-semibold ${
              tier === t
                ? "bg-amber-400 text-zinc-950 font-bold border-amber-400"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700"
            }`}
          >
            {t.toUpperCase()}
          </Link>
        ))}
      </div>

      {/* Table Section */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase text-white tracking-wider">
            {subscriptions.length} Subscriptions Listed
          </h2>
          {(status !== "all" || tier !== "all" || searchQuery) && (
            <Link href="/admin/subscriptions" className="text-xs text-amber-400 hover:underline">
              Clear filters ✕
            </Link>
          )}
        </div>

        {subscriptions.length === 0 ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-12 text-center text-xs text-zinc-400">
            No subscriptions found matching the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-left text-xs min-w-[800px]">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-800">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Period Range</th>
                  <th className="p-3">AI Quota Used</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {subscriptions.map((s) => {
                  const customData = s.paddle_custom_data || {};
                  const aiUsed = typeof customData.ai_generations_used === "number" ? customData.ai_generations_used : 0;
                  const isPro = s.tier === "pro";
                  const isBasic = s.tier === "basic";

                  return (
                    <tr key={s.id} className="hover:bg-zinc-800/40 transition">
                      <td className="p-3">
                        <p className="text-white font-semibold">{s.email || "No email"}</p>
                        <p className="text-[11px] text-zinc-500 font-mono">UID: {s.user_id}</p>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          isPro ? "bg-amber-400/10 border-amber-400/40 text-amber-300" : isBasic ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-zinc-800 border-zinc-700 text-zinc-400"
                        }`}>
                          {s.tier}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          s.status === "active" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : s.status === "past_due" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" : "text-zinc-400 bg-zinc-800 border-zinc-700"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 uppercase text-zinc-300 text-[11px] font-semibold">{s.provider || "paddle"}</td>
                      <td className="p-3 text-zinc-400 text-[11px]">
                        <div>{s.current_period_start ? new Date(s.current_period_start).toLocaleDateString() : "—"} to</div>
                        <div>{s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}</div>
                      </td>
                      <td className="p-3 text-[11px]">
                        {isPro ? (
                          <span className="text-emerald-400 font-bold">Unlimited</span>
                        ) : isBasic ? (
                          <span className="text-amber-400 font-bold">{aiUsed} / 25</span>
                        ) : (
                          <span className="text-zinc-500">—</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/admin/users/${encodeURIComponent(s.user_id)}`}
                          className="rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-200 hover:text-white hover:border-zinc-500 transition inline-block"
                        >
                          User X-Ray ↗
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
