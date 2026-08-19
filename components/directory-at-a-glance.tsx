"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tool } from "@/data/types";

interface DirectoryAtAGlanceProps {
  tools: Tool[];
}

export function DirectoryAtAGlance({ tools }: DirectoryAtAGlanceProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filtered = tools.filter(
    (t) => filterCategory === "all" || t.category === filterCategory
  );

  return (
    <div className="surface rounded-2xl border border-border bg-surface shadow-subtle p-6 space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
              Editorial Benchmark Matrix
            </span>
          </div>
          <h3 className="text-xl font-semibold text-primary mt-1 tracking-tight">
            AI Creative Tools At A Glance
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Quickly scan verified pricing, free tier terms, primary capabilities, and editorial verdicts.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-tertiary font-mono text-[11px]">Discipline:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-primary outline-none focus:border-accent/40 font-medium"
          >
            <option value="all">All ({tools.length})</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
            <option value="editing">Editing</option>
            <option value="vfx">VFX</option>
          </select>
        </div>
      </div>

      {/* Scannable Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-elevated font-mono text-tertiary uppercase text-[10px]">
              <th className="py-3 px-4">Tool / Model</th>
              <th className="py-3 px-4">Best For</th>
              <th className="py-3 px-4">Pricing</th>
              <th className="py-3 px-4">Free Option</th>
              <th className="py-3 px-4">Key Capability</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filtered.map((tool) => (
              <tr
                key={tool.id}
                className="hover:bg-surface-hover transition-colors group"
              >
                {/* Tool Name & Category */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">
                    <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
                  </div>
                  <span className="text-[10px] text-tertiary font-mono uppercase">
                    {tool.category}
                  </span>
                </td>

                {/* Best For */}
                <td className="py-3.5 px-4 max-w-xs">
                  <p className="text-secondary line-clamp-2 leading-relaxed">
                    {tool.bestFor}
                  </p>
                </td>

                {/* Starting Price */}
                <td className="py-3.5 px-4 font-medium text-primary">
                  {tool.pricing.startingPrice || "Free"}
                </td>

                {/* Free Option */}
                <td className="py-3.5 px-4 text-secondary">
                  {tool.pricing.freeTierDetails ? (
                    <span className="text-[11px] text-secondary">
                      {tool.pricing.freeTierDetails.split(".")[0]}
                    </span>
                  ) : (
                    <span className="text-tertiary font-mono">None</span>
                  )}
                </td>

                {/* Key Capability */}
                <td className="py-3.5 px-4 max-w-[200px]">
                  <span className="text-secondary line-clamp-1">
                    {tool.keyFeatures?.[0] || tool.overview}
                  </span>
                </td>

                {/* Score */}
                <td className="py-3.5 px-4">
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-accent">
                    ★ {tool.rating?.toFixed(1) || "4.5"}
                  </span>
                </td>

                {/* Action */}
                <td className="py-3.5 px-4 text-right">
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="inline-flex items-center gap-1 font-medium text-accent hover:opacity-80 transition-opacity"
                  >
                    Inspect →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
