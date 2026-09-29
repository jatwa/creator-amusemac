import React from "react";
import Link from "next/link";
import { CANONICAL_FEATURE_MATRIX } from "@/lib/entitlements/resolver";

export default function AdminEntitlementsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-amber-400">Admin</Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200">Entitlements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Feature Entitlements Lab &amp; Access Matrix
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
            Code-derived single source of truth for feature permissions across Free, Director Basic, and Studio Pro tiers.
          </p>
        </div>
        <Link
          href="/admin/simulator"
          className="rounded border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition font-mono"
        >
          Test in Simulator →
        </Link>
      </div>

      {/* Feature Matrix Table */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">Canonical Feature Gating Matrix</h2>
          <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-mono font-bold">
            {CANONICAL_FEATURE_MATRIX.length} FEATURES AUDITED
          </span>
        </div>

        <div className="rounded-lg border border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[700px]">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3.5">Feature Name &amp; Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">Free (Starter)</th>
                <th className="p-3.5 text-center">Director Basic</th>
                <th className="p-3.5 text-center">Studio Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {CANONICAL_FEATURE_MATRIX.map((f) => (
                <tr key={f.featureId} className="hover:bg-zinc-800/40 transition">
                  <td className="p-3.5 max-w-sm">
                    <p className="font-semibold text-white">{f.name}</p>
                    <p className="text-[11px] text-zinc-400 font-sans mt-0.5">{f.description}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="rounded bg-zinc-950 border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 uppercase">
                      {f.category}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {typeof f.free === "boolean" ? (
                      f.free ? (
                        <span className="text-emerald-400 font-bold">✓ Included</span>
                      ) : (
                        <span className="text-zinc-600">✕ No</span>
                      )
                    ) : (
                      <span className="text-zinc-400">{f.free}</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {typeof f.basic === "boolean" ? (
                      f.basic ? (
                        <span className="text-emerald-400 font-bold">✓ Included</span>
                      ) : (
                        <span className="text-zinc-600">✕ No</span>
                      )
                    ) : (
                      <span className="text-emerald-400 font-semibold">{f.basic}</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    {typeof f.pro === "boolean" ? (
                      f.pro ? (
                        <span className="text-emerald-400 font-bold">✓ Included</span>
                      ) : (
                        <span className="text-zinc-600">✕ No</span>
                      )
                    ) : (
                      <span className="text-amber-300 font-semibold">{f.pro}</span>
                    )}
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
