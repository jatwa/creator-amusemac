import React from "react";
import Link from "next/link";
import { queryNeon } from "@/lib/db/neon";
import { CANONICAL_FEATURE_MATRIX, resolveUserEntitlements } from "@/lib/entitlements/resolver";
import { SubscriptionTier, SubscriptionStatus } from "@/lib/db/subscription-repo";

export const dynamic = "force-dynamic";

export default async function AdminAccessDebuggerPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  const lookupKey = (email || "").trim().toLowerCase();

  let userData: any = null;
  let subData: any = null;
  let unlocksData: any[] = [];
  let diagnosticDiagnosis: string[] = [];

  if (lookupKey) {
    try {
      // 1. Query User
      const userRes = await queryNeon<any>(
        `SELECT * FROM users WHERE LOWER(email) = $1 OR id = $1 LIMIT 1`,
        [lookupKey]
      );
      if (userRes && userRes.rows.length > 0) {
        userData = userRes.rows[0];

        // 2. Query Subscriptions
        const subRes = await queryNeon<any>(
          `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
          [userData.id]
        );
        if (subRes && subRes.rows.length > 0) {
          subData = subRes.rows[0];
        }

        // 3. Query Unlocks
        const unlRes = await queryNeon<any>(
          `SELECT * FROM prompt_unlocks WHERE user_id = $1 ORDER BY unlocked_date DESC`,
          [userData.id]
        );
        if (unlRes && unlRes.rows) {
          unlocksData = unlRes.rows;
        }
      }
    } catch (err: any) {
      console.warn("[Access Debugger Warning]:", err.message);
    }
  }

  const rawTier: SubscriptionTier = subData?.tier || "free";
  const rawStatus: SubscriptionStatus = subData?.status || "active";
  const unlockCount = unlocksData.length;

  const resolution = resolveUserEntitlements(rawTier, rawStatus, unlockCount);

  // Diagnostic checks
  if (userData) {
    if (!subData) {
      diagnosticDiagnosis.push("User has no subscription row in database. Defaulting to Free Starter tier.");
    } else {
      if (subData.status === "past_due") {
        diagnosticDiagnosis.push("Subscription status is PAST_DUE. Payment retry is in progress with Paddle.");
      }
      if (subData.current_period_end && new Date(subData.current_period_end) < new Date()) {
        diagnosticDiagnosis.push("Subscription current_period_end has passed. Entitlement has expired.");
      }
      if (subData.tier === "basic" && unlockCount >= 25) {
        diagnosticDiagnosis.push("Basic monthly limit reached (25/25 unlocks used). User requires Pro upgrade for additional unlocks.");
      }
    }
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-white">Admin</Link>
            <span>/</span>
            <span className="text-zinc-200">Access Debugger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            User Entitlement &amp; Access Debugger
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Compare Expected vs Actual entitlements, diagnose billing linkage, and verify prompt unlock quotas.
          </p>
        </div>

        {/* Lookup Form */}
        <form method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="email"
            defaultValue={lookupKey}
            placeholder="Enter user email or ID..."
            className="rounded-xl border border-line bg-black/60 px-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-lime focus:outline-none w-64 font-mono"
          />
          <button
            type="submit"
            className="rounded-xl bg-panel border border-line px-4 py-2 text-xs font-semibold text-white hover:border-lime transition"
          >
            Diagnose
          </button>
        </form>
      </div>

      {!lookupKey ? (
        <div className="surface p-12 rounded-2xl border border-line text-center text-xs text-zinc-500 font-mono">
          Enter a user email address or user ID above to run live entitlement calculations.
        </div>
      ) : !userData ? (
        <div className="surface p-12 rounded-2xl border border-line text-center text-xs text-amber-400 font-mono">
          No user found matching "{lookupKey}".
        </div>
      ) : (
        <div className="space-y-8">
          {/* User Record Card */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="surface p-6 rounded-2xl border border-line space-y-3 font-mono text-xs">
              <span className="text-zinc-500 block uppercase">User Identity</span>
              <p className="text-base font-bold text-white">{userData.name || "Anonymous User"}</p>
              <p className="text-zinc-400">{userData.email}</p>
              <p className="text-[11px] text-zinc-500">ID: {userData.id}</p>
              <p className="text-[11px] text-zinc-500">Created: {new Date(userData.created_at).toLocaleDateString()}</p>
            </div>

            <div className="surface p-6 rounded-2xl border border-line space-y-3 font-mono text-xs">
              <span className="text-zinc-500 block uppercase">Subscription State</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-lime uppercase">{rawTier}</span>
                <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[10px]">
                  {rawStatus}
                </span>
              </div>
              <p className="text-zinc-400">Provider: {subData?.provider || "free"}</p>
              <p className="text-[11px] text-zinc-500">
                Period End: {subData?.current_period_end ? new Date(subData.current_period_end).toLocaleDateString() : "None"}
              </p>
            </div>

            <div className="surface p-6 rounded-2xl border border-line space-y-3 font-mono text-xs">
              <span className="text-zinc-500 block uppercase">Vault Unlock Quota</span>
              <p className="text-2xl font-bold text-white">
                {unlockCount} / {rawTier === "pro" ? "∞" : rawTier === "basic" ? "25" : "0"}
              </p>
              <p className="text-zinc-400">
                {rawTier === "pro"
                  ? "Unlimited Studio Pro Access"
                  : rawTier === "basic"
                  ? `${Math.max(0, 25 - unlockCount)} unlocks remaining`
                  : "Free Preview Mode Only"}
              </p>
            </div>
          </div>

          {/* Diagnostic Warnings */}
          {diagnosticDiagnosis.length > 0 && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-2 text-xs font-mono text-amber-300">
              <span className="font-bold flex items-center gap-2">
                <span>⚠ Diagnostic Flags Detected:</span>
              </span>
              <ul className="list-disc pl-5 space-y-1">
                {diagnosticDiagnosis.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Expected vs Actual Entitlements */}
          <section className="surface p-6 rounded-2xl border border-line space-y-4">
            <h2 className="text-base font-bold text-white">Calculated Feature Entitlements</h2>
            <div className="rounded-xl border border-line overflow-x-auto">
              <table className="w-full text-left text-xs font-mono min-w-[650px]">
                <thead className="border-b border-line bg-black/60 text-zinc-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Feature Key</th>
                    <th className="p-3">Expected (Plan Baseline)</th>
                    <th className="p-3">Actual (Runtime State)</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-zinc-300">
                  {CANONICAL_FEATURE_MATRIX.map((f) => {
                    const expectedVal = f[rawTier];
                    const actualVal = resolution.entitlements[f.featureId];
                    const matches = expectedVal === actualVal;

                    return (
                      <tr key={f.featureId} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-semibold text-white">{f.name}</td>
                        <td className="p-3 text-zinc-400">{String(expectedVal)}</td>
                        <td className="p-3 text-lime">{String(actualVal)}</td>
                        <td className="p-3 text-right">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] ${
                              matches
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {matches ? "MATCHED" : "DIVERGENT"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
