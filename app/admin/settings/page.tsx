import React from "react";
import Link from "next/link";
import { FEATURE_FLAGS } from "@/lib/config/feature-flags";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const flags = Object.entries(FEATURE_FLAGS);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-white">Admin</Link>
          <span>/</span>
          <span className="text-zinc-200">Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          System Settings &amp; Feature Flags
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Inspect active feature switches, runtime configurations, and administrative boundaries.
        </p>
      </div>

      {/* Feature Flags */}
      <section className="surface p-6 rounded-2xl border border-line space-y-4">
        <h2 className="text-base font-bold text-white">Active Feature Flags</h2>
        <div className="rounded-xl border border-line overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-line bg-black/60 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Feature Flag Key</th>
                <th className="p-3 text-right">Runtime Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-zinc-300">
              {flags.map(([key, val]) => (
                <tr key={key} className="hover:bg-white/[0.02]">
                  <td className="p-3 font-semibold text-white">{key}</td>
                  <td className="p-3 text-right">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        val
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
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
