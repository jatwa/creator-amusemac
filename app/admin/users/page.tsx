import React from "react";
import Link from "next/link";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = (q || "").trim().toLowerCase();

  let users: any[] = [];
  try {
    let sql = `
      SELECT u.id, u.name, u.email, u.image, u.created_at,
             s.tier, s.status as sub_status, s.provider as sub_provider,
             s.paddle_subscription_id, s.razorpay_subscription_id,
             COUNT(DISTINCT pu.id) as unlock_count,
             COUNT(DISTINCT fp.id) as project_count
      FROM users u
      LEFT JOIN subscriptions s ON u.id = s.user_id
      LEFT JOIN prompt_unlocks pu ON u.id = pu.user_id
      LEFT JOIN film_projects fp ON u.id = fp.user_id
    `;
    const params: any[] = [];

    if (searchQuery) {
      sql += ` WHERE LOWER(u.name) LIKE $1 OR LOWER(u.email) LIKE $1 OR u.id LIKE $1`;
      params.push(`%${searchQuery}%`);
    }

    sql += ` GROUP BY u.id, u.name, u.email, u.image, u.created_at, s.tier, s.status, s.provider, s.paddle_subscription_id, s.razorpay_subscription_id ORDER BY u.created_at DESC LIMIT 50`;

    const res = await queryNeon<any>(sql, params);
    if (res && res.rows) {
      users = res.rows;
    }
  } catch (err: any) {
    console.warn("[Admin Users Query Warning]:", err.message);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1.5">
            <Link href="/admin" className="hover:text-amber-400 transition">Admin</Link>
            <span>/</span>
            <span className="text-zinc-200">Users</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            User Intelligence &amp; Subscriber Directory
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Search registered accounts, inspect active plans, unlock volume, and film projects.
          </p>
        </div>

        {/* Search Bar */}
        <form method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search name, email, or ID..."
            className="rounded border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 w-64 font-mono transition"
          />
          <button
            type="submit"
            className="rounded border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-zinc-700 hover:border-zinc-600 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono">
            {users.length} {users.length === 1 ? "User" : "Users"} Displayed
          </h2>
          {searchQuery && (
            <Link href="/admin/users" className="text-xs text-amber-400 hover:underline font-mono">
              Clear search filter ✕
            </Link>
          )}
        </div>

        {users.length === 0 ? (
          <div className="rounded border border-zinc-800 bg-zinc-950/60 p-10 text-center text-xs text-zinc-400 font-mono">
            {searchQuery ? `No users matched "${searchQuery}".` : "No registered users in database yet."}
          </div>
        ) : (
          <div className="rounded border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono min-w-[700px]">
              <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Plan Tier</th>
                  <th className="p-3">Billing Status</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3 text-center">Unlocks</th>
                  <th className="p-3 text-center">Projects</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {users.map((u) => {
                  const tier = u.tier || "free";
                  const isPro = tier === "pro";
                  const isBasic = tier === "basic";

                  return (
                    <tr key={u.id} className="hover:bg-zinc-800/40 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-7 w-7 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs">
                            {u.name ? u.name[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{u.name || "Anonymous User"}</p>
                            <p className="text-[11px] text-zinc-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isPro
                              ? "bg-amber-400/10 border border-amber-400/30 text-amber-400"
                              : isBasic
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                              : "bg-zinc-800 border border-zinc-700 text-zinc-400"
                          }`}
                        >
                          {tier}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5 text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {u.sub_status || "active"}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-400 uppercase">
                        {u.sub_provider || "free"}
                      </td>
                      <td className="p-3 text-center text-white font-bold">{u.unlock_count || 0}</td>
                      <td className="p-3 text-center text-white font-bold">{u.project_count || 0}</td>
                      <td className="p-3 text-right space-x-2">
                        <Link
                          href={`/admin/users/${encodeURIComponent(u.id)}`}
                          className="rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-[11px] font-semibold text-zinc-200 hover:text-white hover:border-zinc-500 transition inline-block"
                        >
                          X-Ray ↗
                        </Link>
                        <Link
                          href={`/admin/access-debugger?email=${encodeURIComponent(u.email || u.id)}`}
                          className="rounded border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-400/20 transition inline-block"
                        >
                          Debug ↗
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
