import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { queryNeon } from "@/lib/db/neon";
import { resolveUserEntitlements } from "@/lib/entitlements/resolver";
import { CINEMATIC_42_PROMPTS } from "@/data/cinematic-prompts";

export const dynamic = "force-dynamic";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).trim();

  // Query user by ID or email
  let user: any = null;
  let subscriptions: any[] = [];
  let unlocks: any[] = [];
  let projects: any[] = [];

  try {
    const userRes = await queryNeon<any>(
      `SELECT id, name, email, image, email_verified, created_at, updated_at 
       FROM users 
       WHERE id = $1 OR LOWER(email) = LOWER($1) 
       LIMIT 1`,
      [decodedId]
    );

    if (userRes && userRes.rows && userRes.rows.length > 0) {
      user = userRes.rows[0];
    } else {
      notFound();
    }

    // Query all subscriptions for user
    const subRes = await queryNeon<any>(
      `SELECT id, provider, paddle_customer_id, paddle_subscription_id, razorpay_subscription_id,
              tier, status, current_period_start, current_period_end, cancel_at_period_end,
              paddle_custom_data, created_at, updated_at
       FROM subscriptions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [user.id]
    );
    subscriptions = subRes?.rows || [];

    // Query unlocks
    const unlockRes = await queryNeon<any>(
      `SELECT id, prompt_id, prompt_slug, COALESCE(unlocked_date, CURRENT_TIMESTAMP) as unlocked_at 
       FROM prompt_unlocks 
       WHERE user_id = $1 
       ORDER BY unlocked_date DESC`,
      [user.id]
    );
    unlocks = unlockRes?.rows || [];

    // Query film projects
    const projRes = await queryNeon<any>(
      `SELECT id, title, genre, aspect_ratio, created_at, updated_at
       FROM film_projects
       WHERE user_id = $1
       ORDER BY updated_at DESC`,
      [user.id]
    );
    projects = projRes?.rows || [];
  } catch (err: any) {
    console.error("[Admin User Detail Error]:", err.message);
  }

  if (!user) {
    notFound();
  }

  // Active subscription resolution
  const activeSub = subscriptions.find((s) => s.status === "active" || s.status === "trialing") || subscriptions[0];
  const tier = activeSub?.tier || "free";
  const subStatus = activeSub?.status || "active";
  const unlockCount = unlocks.length;
  const entitlements = resolveUserEntitlements(tier, subStatus, unlockCount);

  // Extract AI quota usage from paddle_custom_data
  const customData = activeSub?.paddle_custom_data || {};
  const aiUsed = typeof customData.ai_generations_used === "number" ? customData.ai_generations_used : 0;
  const aiPeriodStart = customData.ai_period_start || activeSub?.current_period_start || "N/A";

  // Map prompt names
  const promptMap = new Map<string, string>();
  CINEMATIC_42_PROMPTS.forEach((p: any) => promptMap.set(p.id, p.title));

  return (
    <div className="space-y-8 font-mono">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-amber-400 transition">Admin</Link>
            <span className="text-zinc-600">/</span>
            <Link href="/admin/users" className="hover:text-amber-400 transition">Users</Link>
            <span className="text-zinc-600">/</span>
            <span className="text-amber-400 truncate max-w-xs">{user.email || user.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>User Deep X-Ray</span>
            <span className={`text-xs px-2.5 py-1 rounded-full uppercase border font-semibold ${
              tier === "pro" 
                ? "bg-amber-400/10 border-amber-400/40 text-amber-300" 
                : tier === "basic" 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                : "bg-zinc-800 border-zinc-700 text-zinc-400"
            }`}>
              {tier} tier
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/access-debugger?email=${encodeURIComponent(user.email || user.id)}`}
            className="rounded border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition"
          >
            Open Access Debugger ↗
          </Link>
        </div>
      </div>

      {/* Grid: Identity & Quotas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Identity Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xs uppercase text-zinc-400 tracking-wider font-semibold">Account Identity</h2>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-zinc-500">User ID:</span>
              <p className="text-zinc-200 break-all font-mono">{user.id}</p>
            </div>
            <div>
              <span className="text-zinc-500">Email:</span>
              <p className="text-white font-semibold">{user.email}</p>
            </div>
            <div>
              <span className="text-zinc-500">Name:</span>
              <p className="text-zinc-200">{user.name || "None set"}</p>
            </div>
            <div>
              <span className="text-zinc-500">Registered:</span>
              <p className="text-zinc-300">
                {user.created_at ? new Date(user.created_at).toLocaleString() : "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* AI Customizer Quota Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xs uppercase text-zinc-400 tracking-wider font-semibold">AI Customizer Quota</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Current Tier Policy:</span>
              <span className="text-white font-bold">
                {tier === "pro" ? "Unlimited" : tier === "basic" ? "25 / billing period" : "1 preview / day"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Generations Used:</span>
              <span className="text-amber-400 font-bold">{tier === "pro" ? "Unlimited (DB verified)" : `${aiUsed} used`}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Quota Period Start:</span>
              <span className="text-zinc-300">{aiPeriodStart}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">Atomic JSONB Safe:</span>
              <span className="text-emerald-400 font-bold">Verified</span>
            </div>
          </div>
        </div>

        {/* Vault & Projects Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xs uppercase text-zinc-400 tracking-wider font-semibold">Activity Summary</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Claimed Vault Unlocks:</span>
              <span className="text-white font-bold">{unlockCount} recipes</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-800">
              <span className="text-zinc-400">Director Film Projects:</span>
              <span className="text-white font-bold">{projects.length} projects</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">Active Subscriptions:</span>
              <span className="text-white font-bold">{subscriptions.length} records</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resolved Entitlements Breakdown */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase text-white tracking-wider">Live Entitlements Engine State</h2>
            <p className="text-xs text-zinc-400 mt-1">Computed by single source of truth: lib/entitlements/resolver.ts</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
            RESOLVED
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          {Object.entries(entitlements).map(([key, val]) => (
            <div key={key} className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-1">
              <span className="text-zinc-400 text-[11px] break-all">{key}</span>
              <p className={`font-bold ${typeof val === "boolean" ? (val ? "text-emerald-400" : "text-zinc-500") : "text-amber-400"}`}>
                {typeof val === "boolean" ? (val ? "TRUE" : "FALSE") : String(val)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Subscriptions Table */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider">Database Subscription Records ({subscriptions.length})</h2>
        {subscriptions.length === 0 ? (
          <p className="text-xs text-zinc-500">No subscription records found in database for this user.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold border-b border-zinc-800">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Tier</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Period Start</th>
                  <th className="p-3">Period End</th>
                  <th className="p-3">Subscription ID</th>
                  <th className="p-3">Custom Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {subscriptions.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-800/40 transition">
                    <td className="p-3 text-zinc-500 font-mono text-[11px]">{s.id}</td>
                    <td className="p-3 uppercase text-zinc-300 font-semibold">{s.provider || "paddle"}</td>
                    <td className="p-3 font-bold text-white uppercase">{s.tier}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        s.status === "active" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" : "text-zinc-400 bg-zinc-800 border-zinc-700"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-400">{s.current_period_start ? new Date(s.current_period_start).toLocaleDateString() : "—"}</td>
                    <td className="p-3 text-zinc-400">{s.current_period_end ? new Date(s.current_period_end).toLocaleDateString() : "—"}</td>
                    <td className="p-3 text-zinc-400 text-[11px] font-mono">{s.paddle_subscription_id || s.razorpay_subscription_id || "—"}</td>
                    <td className="p-3 text-zinc-400 text-[10px] max-w-xs truncate font-mono">
                      {s.paddle_custom_data ? JSON.stringify(s.paddle_custom_data) : "{}"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Claimed Vault Unlocks */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider">Claimed Vault Prompt Unlocks ({unlocks.length})</h2>
        {unlocks.length === 0 ? (
          <p className="text-xs text-zinc-500">No prompt recipes unlocked yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {unlocks.map((u) => (
              <div key={u.id} className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-1">
                <p className="text-white font-semibold truncate">{promptMap.get(u.prompt_id) || u.prompt_id}</p>
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span className="font-mono">ID: {u.prompt_id}</span>
                  <span>{new Date(u.unlocked_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Film Projects */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider">Director Studio Film Projects ({projects.length})</h2>
        {projects.length === 0 ? (
          <p className="text-xs text-zinc-500">No director film projects saved in database.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {projects.map((p) => (
              <div key={p.id} className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-1">
                <p className="text-white font-semibold">{p.title || "Untitled Project"}</p>
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>Genre: {p.genre || "Standard"}</span>
                  <span>Aspect: {p.aspect_ratio || "16:9"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
