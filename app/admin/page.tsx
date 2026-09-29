import Link from "next/link";
import { queryNeon } from "@/lib/db/neon";
import { db } from "@/lib/db/repository";
import { toolsData } from "@/data/platform-data";
import { CINEMATIC_42_PROMPTS } from "@/data/cinematic-prompts";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  // 1. Fetch real DB stats if Neon is available
  let totalUsers = 0;
  let freeUsers = 0;
  let basicUsers = 0;
  let proUsers = 0;
  let activeSubscriptions = 0;
  let totalUnlocks = 0;
  let totalProjects = 0;
  let dbStatus = "ONLINE";

  try {
    const userRes = await queryNeon<any>("SELECT COUNT(*) as count FROM users");
    totalUsers = parseInt(userRes?.rows[0]?.count || "0", 10);

    const subRes = await queryNeon<any>(
      "SELECT tier, status, COUNT(*) as count FROM subscriptions GROUP BY tier, status"
    );
    if (subRes && subRes.rows) {
      for (const row of subRes.rows) {
        const count = parseInt(row.count || "0", 10);
        if (row.tier === "pro" && row.status === "active") proUsers += count;
        if (row.tier === "basic" && row.status === "active") basicUsers += count;
        if (row.status === "active") activeSubscriptions += count;
      }
    }
    freeUsers = Math.max(0, totalUsers - (proUsers + basicUsers));

    const unlockRes = await queryNeon<any>("SELECT COUNT(*) as count FROM prompt_unlocks");
    totalUnlocks = parseInt(unlockRes?.rows[0]?.count || "0", 10);

    const projRes = await queryNeon<any>("SELECT COUNT(*) as count FROM film_projects");
    totalProjects = parseInt(projRes?.rows[0]?.count || "0", 10);
  } catch {
    dbStatus = "DEGRADED (FALLBACK ACTIVE)";
  }

  const allTools = toolsData;
  const allPrompts = CINEMATIC_42_PROMPTS;
  const pendingUpdates = db.getUpdatesByStatus("pending");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2 font-mono">
            <span>Production Intelligence Control Center</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            Real-time subscriber telemetry, database health, and backend systems monitoring.
          </p>
        </div>
        <div className="flex items-center gap-2.5 font-mono">
          <Link
            href="/admin/simulator"
            className="rounded border border-amber-500/40 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20 px-3 py-1.5 text-xs font-semibold transition"
          >
            ⚡ Preview Simulator
          </Link>
          <Link
            href="/admin/system"
            className="rounded border border-zinc-300 bg-white text-zinc-700 hover:text-zinc-900 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-white dark:hover:border-zinc-600 px-3 py-1.5 text-xs font-semibold transition shadow-sm"
          >
            System Diagnostics ↗
          </Link>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-1 shadow-sm">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
            Total Users
          </p>
          <p className="text-3xl font-bold font-mono text-zinc-900 dark:text-white tracking-tight">{totalUsers}</p>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Registered Google accounts</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
              Active Subscribers
            </p>
            <span className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">{activeSubscriptions}</p>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
            {basicUsers} Basic • {proUsers} Studio Pro
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-1 shadow-sm">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
            Recipe Unlocks
          </p>
          <p className="text-3xl font-bold font-mono text-zinc-900 dark:text-white tracking-tight">{totalUnlocks}</p>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Vault prompt claims tracked</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-1 shadow-sm">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold">
            Film Projects
          </p>
          <p className="text-3xl font-bold font-mono text-zinc-900 dark:text-white tracking-tight">{totalProjects}</p>
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">Active Director Toolkits</p>
        </div>
      </div>

      {/* System Status Row */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400 font-bold">
          Core Infrastructure Status
        </h2>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 text-xs font-mono">
          <div className="rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950/60 p-3 flex items-center justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Database (Neon)</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              {dbStatus}
            </span>
          </div>
          <div className="rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950/60 p-3 flex items-center justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Auth (NextAuth)</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              ACTIVE
            </span>
          </div>
          <div className="rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950/60 p-3 flex items-center justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Paddle Billing</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              CONFIGURED
            </span>
          </div>
          <div className="rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950/60 p-3 flex items-center justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">Razorpay Legacy</span>
            <span className="inline-flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              STANDBY
            </span>
          </div>
        </div>
      </section>

      {/* Quick Access Modules */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">User Intelligence</h3>
              <Link href="/admin/users" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-mono">Open →</Link>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Search registered users, inspect real subscription statuses, and verify active prompt unlock counts.
            </p>
          </div>
          <Link
            href="/admin/users"
            className="block rounded border border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:text-white dark:hover:border-zinc-600 p-2.5 text-xs font-semibold transition text-center font-mono"
          >
            Search User Directory
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">Subscription Monitor</h3>
              <Link href="/admin/subscriptions" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-mono">Open →</Link>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Track active revenue, past-due states, billing period renewals, and Basic AI generation quotas.
            </p>
          </div>
          <Link
            href="/admin/subscriptions"
            className="block rounded border border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:text-white dark:hover:border-zinc-600 p-2.5 text-xs font-semibold transition text-center font-mono"
          >
            View Subscriptions &amp; Quotas
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">AI Customizer X-Ray</h3>
              <Link href="/admin/ai" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-mono">Open →</Link>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Inspect deterministic 5-weight matcher, Free/Basic/Pro quota invariants, and engine syntax matrix.
            </p>
          </div>
          <Link
            href="/admin/ai"
            className="block rounded border border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:text-white dark:hover:border-zinc-600 p-2.5 text-xs font-semibold transition text-center font-mono"
          >
            Inspect AI Engine Pipeline
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">Entitlements Lab</h3>
              <Link href="/admin/entitlements" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-mono">Open →</Link>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Verify code-derived feature gates for Free, Director Basic (25/mo), and Studio Pro without manual data drift.
            </p>
          </div>
          <Link
            href="/admin/entitlements"
            className="block rounded border border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:text-white dark:hover:border-zinc-600 p-2.5 text-xs font-semibold transition text-center font-mono"
          >
            Open Feature Matrix
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">Access Debugger</h3>
              <Link href="/admin/access-debugger" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-mono">Open →</Link>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Diagnose individual user accounts by comparing Expected vs Actual feature entitlements and unlock state.
            </p>
          </div>
          <Link
            href="/admin/access-debugger"
            className="block rounded border border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:text-white dark:hover:border-zinc-600 p-2.5 text-xs font-semibold transition text-center font-mono"
          >
            Diagnose User Account
          </Link>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">Billing &amp; Webhooks</h3>
              <Link href="/admin/billing" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-mono">Open →</Link>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Audit Paddle Price IDs, webhook transaction synchronization, and legacy Razorpay status.
            </p>
          </div>
          <Link
            href="/admin/billing"
            className="block rounded border border-zinc-300 bg-zinc-50 text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-200 dark:hover:text-white dark:hover:border-zinc-600 p-2.5 text-xs font-semibold transition text-center font-mono"
          >
            Inspect Billing Configuration
          </Link>
        </div>
      </div>

      {/* Content & Prompt Library Summary */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white font-mono uppercase tracking-wider">Content &amp; Recipe Registries</h2>
          <Link href="/admin/content" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-mono">Inspect All →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 text-xs font-mono">
          <div className="rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950/60 p-4 space-y-1">
            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-semibold">AI Tools Registered</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{allTools.length}</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-[11px] font-sans">25 Audited Tool Dossiers</p>
          </div>
          <div className="rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950/60 p-4 space-y-1">
            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-semibold">Director Recipes</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{allPrompts.length}</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-[11px] font-sans">42 Calibrated Director Recipes</p>
          </div>
          <div className="rounded border border-zinc-200 bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-950/60 p-4 space-y-1">
            <p className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-semibold">Pending Change Queue</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingUpdates.length}</p>
            <p className="text-zinc-600 dark:text-zinc-400 text-[11px] font-sans">Automated price/spec changes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
