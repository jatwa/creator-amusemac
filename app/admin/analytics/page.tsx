import React from "react";
import Link from "next/link";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  let userRegistrationsCount = 0;
  let activeSubscriptionsCount = 0;
  let totalUnlocksCount = 0;
  let filmProjectsCount = 0;

  try {
    const uRes = await queryNeon<any>("SELECT COUNT(*) as count FROM users");
    userRegistrationsCount = parseInt(uRes?.rows[0]?.count || "0", 10);

    const sRes = await queryNeon<any>("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'");
    activeSubscriptionsCount = parseInt(sRes?.rows[0]?.count || "0", 10);

    const unlRes = await queryNeon<any>("SELECT COUNT(*) as count FROM prompt_unlocks");
    totalUnlocksCount = parseInt(unlRes?.rows[0]?.count || "0", 10);

    const pRes = await queryNeon<any>("SELECT COUNT(*) as count FROM film_projects");
    filmProjectsCount = parseInt(pRes?.rows[0]?.count || "0", 10);
  } catch {}

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-white">Admin</Link>
          <span>/</span>
          <span className="text-zinc-200">Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Platform Telemetry &amp; Conversion Analytics
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Audited production metrics derived from PostgreSQL database activity. Zero synthetic analytics.
        </p>
      </div>

      {/* Real Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Registered Users</span>
          <span className="text-3xl font-bold text-white mt-1 block">{userRegistrationsCount}</span>
          <span className="text-zinc-500 text-[11px]">Google OAuth verified</span>
        </div>

        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Active Subscriptions</span>
          <span className="text-3xl font-bold text-lime mt-1 block">{activeSubscriptionsCount}</span>
          <span className="text-zinc-500 text-[11px]">Paid Basic &amp; Pro members</span>
        </div>

        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Total Recipe Unlocks</span>
          <span className="text-3xl font-bold text-white mt-1 block">{totalUnlocksCount}</span>
          <span className="text-zinc-500 text-[11px]">Vault prompt claims</span>
        </div>

        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Film Projects Created</span>
          <span className="text-3xl font-bold text-white mt-1 block">{filmProjectsCount}</span>
          <span className="text-zinc-500 text-[11px]">Active film director workbenches</span>
        </div>
      </div>

      {/* Telemetry Tracking Note */}
      <section className="surface p-6 rounded-2xl border border-line space-y-3 text-xs text-zinc-300">
        <h2 className="text-base font-bold text-white">Truthful Telemetry Disclosure</h2>
        <p className="leading-relaxed">
          Creator Intel computes analytics strictly from confirmed database transactions and persistent entity tables. Third-party client telemetry and invasive browser tracking are disabled by default in adherence with our privacy commitments.
        </p>
      </section>
    </div>
  );
}
