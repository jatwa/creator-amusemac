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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-white">Admin</Link>
            <span>/</span>
            <span className="text-zinc-200">Users</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            User Management &amp; Subscribers
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Search registered accounts, inspect active plans, unlock volume, and film projects.
          </p>
        </div>

        {/* Search Bar */}
        <form method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search by name, email, or ID..."
            className="rounded-xl border border-line bg-black/60 px-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-lime focus:outline-none w-64"
          />
          <button
            type="submit"
            className="rounded-xl bg-panel border border-line px-4 py-2 text-xs font-semibold text-white hover:border-lime transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <section className="surface p-6 rounded-2xl border border-line space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-mono">
            {users.length} {users.length === 1 ? "User" : "Users"} Displayed
          </h2>
          {searchQuery && (
            <Link href="/admin/users" className="text-xs text-lime hover:underline font-mono">
              Clear search filter ✕
            </Link>
          )}
        </div>

        {users.length === 0 ? (
          <div className="rounded-xl border border-line bg-black/40 p-12 text-center text-xs text-zinc-500 font-mono">
            {searchQuery ? `No users matched "${searchQuery}".` : "No registered users in database yet."}
          </div>
        ) : (
          <div className="rounded-xl border border-line overflow-x-auto">
            <table className="w-full text-left text-xs font-mono min-w-[700px]">
              <thead className="border-b border-line bg-black/60 text-zinc-400 uppercase text-[10px]">
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
              <tbody className="divide-y divide-line text-zinc-300">
                {users.map((u) => {
                  const tier = u.tier || "free";
                  const isPro = tier === "pro";
                  const isBasic = tier === "basic";

                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02]">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-panel border border-line flex items-center justify-center font-bold text-white text-xs">
                            {u.name ? u.name[0].toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{u.name || "Anonymous User"}</p>
                            <p className="text-[11px] text-zinc-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            isPro
                              ? "bg-accent/10 border border-accent/30 text-accent"
                              : isBasic
                              ? "bg-lime/10 border border-lime/30 text-lime"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {tier}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-emerald-400">{u.sub_status || "active"}</span>
                      </td>
                      <td className="p-3 text-zinc-400 uppercase">
                        {u.sub_provider || "free"}
                      </td>
                      <td className="p-3 text-center text-white">{u.unlock_count || 0}</td>
                      <td className="p-3 text-center text-white">{u.project_count || 0}</td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/admin/access-debugger?email=${encodeURIComponent(u.email || u.id)}`}
                          className="rounded border border-line bg-panel px-2.5 py-1 text-[11px] font-semibold text-lime hover:border-lime transition inline-block"
                        >
                          Diagnose ↗
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
