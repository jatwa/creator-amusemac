import React from "react";
import Link from "next/link";
import { CINEMATIC_42_PROMPTS } from "@/data/cinematic-prompts";
import { queryNeon } from "@/lib/db/neon";

export const dynamic = "force-dynamic";

export default async function AdminVaultPage() {
  const prompts = CINEMATIC_42_PROMPTS;

  // Query unlock counts per prompt from Neon DB
  const unlockMap: Record<string, number> = {};
  try {
    const res = await queryNeon<any>(
      `SELECT prompt_slug, COUNT(*) as count FROM prompt_unlocks GROUP BY prompt_slug`
    );
    if (res && res.rows) {
      for (const r of res.rows) {
        unlockMap[r.prompt_slug] = parseInt(r.count || "0", 10);
      }
    }
  } catch {}

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">Vault</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          Director Recipe Vault &amp; Prompt Inventory
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
          Inspect all 42 calibrated Director Recipes, camera/lens parameters, unlock counts, and model compatibility.
        </p>
      </div>

      {/* Prompts Table */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">
            {prompts.length} Director Recipes Registered
          </h2>
          <span className="rounded bg-amber-400/10 border border-amber-400/40 px-2.5 py-0.5 text-xs font-mono text-amber-300 font-bold">
            PRO VAULT ACTIVE
          </span>
        </div>

        <div className="rounded-lg border border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[750px]">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Recipe Title &amp; Category</th>
                <th className="p-3">Camera / Optics</th>
                <th className="p-3">Engine Compatibility</th>
                <th className="p-3 text-center">Unlocks</th>
                <th className="p-3 text-right">Studio Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {prompts.map((p) => {
                const unlocks = unlockMap[p.slug] || 0;
                return (
                  <tr key={p.id} className="hover:bg-zinc-800/40 transition">
                    <td className="p-3">
                      <p className="font-semibold text-white">{p.title}</p>
                      <p className="text-[11px] text-zinc-400 font-sans mt-0.5">{p.subcategory || p.category}</p>
                    </td>
                    <td className="p-3 text-zinc-400">
                      <p className="text-zinc-300">{p.lens ? p.lens.split(" ")[0] + " " + (p.lens.split(" ")[1] || "") : "Custom Optics"}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">{p.aspectRatio || "2.39:1"}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {(p.recommendedModels || []).slice(0, 2).map((m, i) => (
                          <span key={i} className="rounded bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 text-[10px] text-amber-400 font-semibold">
                            {m.split(" ")[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-white font-mono">{unlocks}</td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/prompts/factory?preset=${p.slug}`}
                        target="_blank"
                        className="rounded border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-400/20 transition inline-block"
                      >
                        Studio ↗
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
