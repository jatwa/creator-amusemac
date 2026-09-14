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
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-white">Admin</Link>
          <span>/</span>
          <span className="text-zinc-200">Vault</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Director Recipe Vault &amp; Prompt Inventory
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Inspect all 42 calibrated Director Recipes, camera/lens parameters, unlock counts, and model compatibility.
        </p>
      </div>

      {/* Prompts Table */}
      <section className="surface p-6 rounded-2xl border border-line space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-mono">
            {prompts.length} Director Recipes Registered
          </h2>
          <span className="rounded bg-accent/10 border border-accent/30 px-2.5 py-0.5 text-xs font-mono text-accent font-bold">
            PRO VAULT ACTIVE
          </span>
        </div>

        <div className="rounded-xl border border-line overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[750px]">
            <thead className="border-b border-line bg-black/60 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Recipe Title &amp; Category</th>
                <th className="p-3">Camera / Optics</th>
                <th className="p-3">Engine Compatibility</th>
                <th className="p-3 text-center">Unlocks</th>
                <th className="p-3 text-right">Studio Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-zinc-300">
              {prompts.map((p) => {
                const unlocks = unlockMap[p.slug] || 0;
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="p-3">
                      <p className="font-semibold text-white">{p.title}</p>
                      <p className="text-[11px] text-zinc-500">{p.subcategory || p.category}</p>
                    </td>
                    <td className="p-3 text-zinc-400">
                      <p>{p.lens ? p.lens.split(" ")[0] + " " + (p.lens.split(" ")[1] || "") : "Custom Optics"}</p>
                      <p className="text-[10px] text-zinc-500">{p.aspectRatio || "2.39:1"}</p>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {(p.recommendedModels || []).slice(0, 2).map((m, i) => (
                          <span key={i} className="rounded bg-panel border border-line px-1.5 py-0.5 text-[10px] text-lime">
                            {m.split(" ")[0]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-white">{unlocks}</td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/prompts/factory?preset=${p.slug}`}
                        target="_blank"
                        className="rounded border border-line bg-panel px-2.5 py-1 text-[11px] font-semibold text-accent hover:border-accent transition inline-block"
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
