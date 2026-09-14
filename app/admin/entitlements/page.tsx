import React from "react";
import Link from "next/link";
import { CANONICAL_FEATURE_MATRIX } from "@/lib/entitlements/resolver";

export default function AdminEntitlementsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-white">Admin</Link>
            <span>/</span>
            <span className="text-zinc-200">Entitlements</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Feature Entitlements Lab &amp; Access Matrix
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Code-derived single source of truth for feature permissions across Free, Director Basic, and Studio Pro tiers.
          </p>
        </div>
        <Link
          href="/admin/simulator"
          className="rounded-xl border border-lime/40 bg-lime/10 px-4 py-2 text-xs font-semibold text-lime hover:bg-lime/20 transition"
        >
          Test in Simulator →
        </Link>
      </div>

      {/* Feature Matrix Table */}
      <section className="surface p-6 rounded-2xl border border-line space-y-4">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <h2 className="text-base font-bold text-white">Canonical Feature Gating Matrix</h2>
          <span className="rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-mono">
            {CANONICAL_FEATURE_MATRIX.length} FEATURES AUDITED
          </span>
        </div>

        <div className="rounded-xl border border-line overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[700px]">
            <thead className="border-b border-line bg-black/60 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Feature Name &amp; Description</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">Free (Starter)</th>
                <th className="p-3.5 text-center">Director Basic</th>
                <th className="p-3.5 text-center">Studio Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-zinc-300">
              {CANONICAL_FEATURE_MATRIX.map((f) => (
                <tr key={f.featureId} className="hover:bg-white/[0.02]">
                  <td className="p-3.5 max-w-sm">
                    <p className="font-semibold text-white">{f.name}</p>
                    <p className="text-[11px] text-zinc-500 font-sans mt-0.5">{f.description}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="rounded bg-panel border border-line px-2 py-0.5 text-[10px] text-zinc-400">
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
                      <span className="text-lime font-semibold">{f.basic}</span>
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
                      <span className="text-accent font-semibold">{f.pro}</span>
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
