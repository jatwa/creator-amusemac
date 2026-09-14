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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Command Center Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Real-time telemetry, subscriber breakdown, and production system status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/simulator"
            className="rounded-xl border border-lime/40 bg-lime/10 px-4 py-2 text-xs font-semibold text-lime hover:bg-lime/20 transition"
          >
            ⚡ Launch Preview Simulator
          </Link>
          <Link
            href="/admin/system"
            className="rounded-xl border border-line bg-panel px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition"
          >
            System Health ↗
          </Link>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface p-5 rounded-2xl border border-line">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
            Total Users
          </p>
          <p className="mt-2 text-3xl font-bold text-white font-mono">{totalUsers}</p>
          <p className="mt-2 text-[11px] text-zinc-500">Registered Google accounts</p>
        </div>

        <div className="surface p-5 rounded-2xl border border-lime/30 bg-lime/[0.02]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-lime font-mono">
              Active Subscribers
            </p>
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
          </div>
          <p className="mt-2 text-3xl font-bold text-lime font-mono">{activeSubscriptions}</p>
          <p className="mt-2 text-[11px] text-zinc-400 font-mono">
            {basicUsers} Basic • {proUsers} Studio Pro
          </p>
        </div>

        <div className="surface p-5 rounded-2xl border border-line">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
            Recipe Unlocks
          </p>
          <p className="mt-2 text-3xl font-bold text-white font-mono">{totalUnlocks}</p>
          <p className="mt-2 text-[11px] text-zinc-500">Vault prompt claims tracked</p>
        </div>

        <div className="surface p-5 rounded-2xl border border-line">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 font-mono">
            Film Projects
          </p>
          <p className="mt-2 text-3xl font-bold text-white font-mono">{totalProjects}</p>
          <p className="mt-2 text-[11px] text-zinc-500">Active Director Toolkits</p>
        </div>
      </div>

      {/* System Status Table */}
      <section className="surface p-6 rounded-2xl border border-line">
        <h2 className="text-base font-bold text-white mb-4">Core Infrastructure Status</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs font-mono">
          <div className="rounded-xl border border-line bg-black/40 p-3.5 flex items-center justify-between">
            <span className="text-zinc-400">Database (Neon)</span>
            <span className="text-emerald-400 font-semibold">{dbStatus}</span>
          </div>
          <div className="rounded-xl border border-line bg-black/40 p-3.5 flex items-center justify-between">
            <span className="text-zinc-400">Auth (NextAuth)</span>
            <span className="text-emerald-400 font-semibold">ACTIVE</span>
          </div>
          <div className="rounded-xl border border-line bg-black/40 p-3.5 flex items-center justify-between">
            <span className="text-zinc-400">Paddle Billing</span>
            <span className="text-emerald-400 font-semibold">CONFIGURED</span>
          </div>
          <div className="rounded-xl border border-line bg-black/40 p-3.5 flex items-center justify-between">
            <span className="text-zinc-400">Razorpay Legacy</span>
            <span className="text-emerald-400 font-semibold">STANDBY</span>
          </div>
        </div>
      </section>

      {/* Quick Access Modules */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface p-6 rounded-2xl border border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">User Management</h3>
            <Link href="/admin/users" className="text-xs text-lime hover:underline font-mono">Manage →</Link>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Search registered users, inspect real subscription statuses, and verify active prompt unlock counts.
          </p>
          <Link
            href="/admin/users"
            className="block rounded-xl border border-line bg-panel p-3 text-xs font-semibold text-zinc-200 hover:border-lime transition text-center"
          >
            Search User Directory
          </Link>
        </div>

        <div className="surface p-6 rounded-2xl border border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Entitlements Lab</h3>
            <Link href="/admin/entitlements" className="text-xs text-lime hover:underline font-mono">View →</Link>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Verify code-derived feature gates for Free, Director Basic (25/mo), and Studio Pro without manual data drift.
          </p>
          <Link
            href="/admin/entitlements"
            className="block rounded-xl border border-line bg-panel p-3 text-xs font-semibold text-zinc-200 hover:border-lime transition text-center"
          >
            Open Feature Matrix
          </Link>
        </div>

        <div className="surface p-6 rounded-2xl border border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Access Debugger</h3>
            <Link href="/admin/access-debugger" className="text-xs text-lime hover:underline font-mono">Debug →</Link>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Diagnose individual user accounts by comparing Expected vs Actual feature entitlements and unlock state.
          </p>
          <Link
            href="/admin/access-debugger"
            className="block rounded-xl border border-line bg-panel p-3 text-xs font-semibold text-zinc-200 hover:border-lime transition text-center"
          >
            Diagnose User Account
          </Link>
        </div>
      </div>

      {/* Content & Prompt Library Summary */}
      <section className="surface p-6 rounded-2xl border border-line space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Content &amp; Recipe Registries</h2>
          <Link href="/admin/content" className="text-xs text-lime hover:underline font-mono">Inspect All →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-line bg-black/40 p-4">
            <p className="text-zinc-400 font-mono">AI Tools Registered</p>
            <p className="mt-1 text-2xl font-bold text-white font-mono">{allTools.length}</p>
            <p className="mt-1 text-zinc-500">25 Audited Tool Dossiers</p>
          </div>
          <div className="rounded-xl border border-line bg-black/40 p-4">
            <p className="text-zinc-400 font-mono">Director Recipes</p>
            <p className="mt-1 text-2xl font-bold text-white font-mono">{allPrompts.length}</p>
            <p className="mt-1 text-zinc-500">42 Calibrated Director Recipes</p>
          </div>
          <div className="rounded-xl border border-line bg-black/40 p-4">
            <p className="text-zinc-400 font-mono">Pending Change Queue</p>
            <p className="mt-1 text-2xl font-bold text-lime font-mono">{pendingUpdates.length}</p>
            <p className="mt-1 text-zinc-500">Automated price/spec changes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
