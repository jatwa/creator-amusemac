import React from "react";
import Link from "next/link";
import { db } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export default function AdminSourcesPage() {
  const sources = db.getAllSources();

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">Sources</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          Verified Evidence &amp; Source Ledger
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
          Immutable registry of external domains, pricing pages, API documentations, and manual audit sources.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-[10px] font-semibold uppercase text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Source URL</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Publisher</th>
                <th className="py-3.5 px-4">Reliability</th>
                <th className="py-3.5 px-4">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {sources.map((src) => {
                const tool = db.getToolById(src.entityId);
                return (
                  <tr key={src.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {tool?.name || src.entityId}
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-400 underline hover:text-white"
                      >
                        {src.url} ↗
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-zinc-950 border border-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300 uppercase">
                        {src.sourceType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">{src.publisher}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {(src.reliabilityScore * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono">
                      {src.lastVerifiedAt || "Pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
