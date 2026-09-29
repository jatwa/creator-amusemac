"use client";

import { useMemo, useState } from "react";
import {
  CREATOR_INTELLIGENCE_ACTIONS,
  DEFAULT_BREAKDOWN_MODULES,
  EXECUTION_MODES,
} from "@/lib/creator-intelligence-actions";

export function CreatorIntelligenceExecutionPicker() {
  const [mode, setMode] = useState<keyof typeof EXECUTION_MODES>("semi_automatic");
  const [selected, setSelected] = useState<string[]>(DEFAULT_BREAKDOWN_MODULES.map((item) => item.id));

  const estimate = useMemo(
    () => selected.reduce((sum, id) => sum + (DEFAULT_BREAKDOWN_MODULES.find((item) => item.id === id)?.tokens || 0), 0),
    [selected]
  );

  return (
    <section className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.04] p-6 sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400">EXECUTION MODE</p>
          <h2 className="mt-2 text-xl font-bold text-white">How do you want Creator Intel to work?</h2>
        </div>
        <p className="text-xs font-mono text-neutral-400">Estimated usage: ~{estimate.toLocaleString()} tokens</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {Object.values(EXECUTION_MODES).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setMode(item.id)}
            className={`rounded-2xl border p-4 text-left transition ${mode === item.id ? "border-amber-400/50 bg-amber-400/[0.08]" : "border-white/[0.08] bg-black/20 hover:border-white/[0.16]"}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">{item.label}</span>
              {mode === item.id && <span className="text-[10px] font-mono text-amber-400">SELECTED</span>}
            </div>
            <p className="mt-2 text-xs font-semibold text-neutral-300">{item.tagline}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">{item.description}</p>
          </button>
        ))}
      </div>

      {mode !== "automatic" && (
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_BREAKDOWN_MODULES.map((module) => {
            const active = selected.includes(module.id);
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => setSelected((current) => active ? current.filter((id) => id !== module.id) : [...current, module.id])}
                className={`flex items-center justify-between rounded-xl border px-3 py-3 text-left ${active ? "border-emerald-400/30 bg-emerald-400/[0.05]" : "border-white/[0.07] bg-black/20"}`}
              >
                <span className="text-xs font-semibold text-neutral-200">{module.label}</span>
                <span className="text-[10px] font-mono text-neutral-500">~{module.tokens.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-white/[0.07] bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-white">Skipped steps are not charged.</p>
          <p className="mt-1 text-[10px] text-neutral-500">The estimate is shown before running. Actual successful usage is recorded after completion.</p>
        </div>
        <span className="text-sm font-bold text-amber-300">~{estimate.toLocaleString()} tokens</span>
      </div>

      <div className="mt-4 hidden">
        {Object.keys(CREATOR_INTELLIGENCE_ACTIONS).length}
      </div>
    </section>
  );
}
