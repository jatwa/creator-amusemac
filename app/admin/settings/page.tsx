import React from "react";
import Link from "next/link";
import { FEATURE_FLAGS } from "@/lib/config/feature-flags";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const flags = Object.entries(FEATURE_FLAGS);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          System Settings &amp; Feature Flags
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
          Inspect active feature switches, runtime configurations, and administrative boundaries.
        </p>
      </div>

      {/* Feature Flags */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">Active Feature Flags</h2>
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Feature Flag Key</th>
                <th className="p-3 text-right">Runtime Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {flags.map(([key, val]) => (
                <tr key={key} className="hover:bg-zinc-800/40 transition">
                  <td className="p-3 font-semibold text-white">{key}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        val
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {val ? "ENABLED" : "DISABLED"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
