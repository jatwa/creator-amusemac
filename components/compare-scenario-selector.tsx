"use client";

import { useState } from "react";
import Link from "next/link";
import { ComparisonScenario } from "@/data/types";
import { Tool } from "@/data/types";

interface CompareScenarioSelectorProps {
  scenarios: ComparisonScenario[];
  toolA: Tool | undefined;
  toolB: Tool | undefined;
  comparisonSlug: string;
}

export function CompareScenarioSelector({
  scenarios,
  toolA,
  toolB,
  comparisonSlug,
}: CompareScenarioSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  const activeScenario = scenarios[selectedIndex] || scenarios[0];
  const nameA = toolA?.name || "Tool A";
  const nameB = toolB?.name || "Tool B";

  const winnerTool =
    activeScenario.winnerId === toolA?.id
      ? toolA
      : activeScenario.winnerId === toolB?.id
      ? toolB
      : null;

  const winnerName = winnerTool?.name || (activeScenario.winnerId === toolA?.id ? nameA : nameB);
  const runnerUpName = winnerName === nameA ? nameB : nameA;

  return (
    <div className="surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
            <span>⚡</span>
            <span>INTERACTIVE DECISION ENGINE</span>
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-primary font-serif">
            Which tool should you use for your specific scene?
          </h2>
        </div>
        <span className="text-xs font-mono text-tertiary">
          Scenario {selectedIndex + 1} of {scenarios.length}
        </span>
      </div>

      {/* Scenario Selection Tabs */}
      <div className="flex flex-wrap gap-2">
        {scenarios.map((sc, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all text-left ${
                isSelected
                  ? "bg-foreground text-background font-semibold shadow-sm ring-2 ring-accent/30"
                  : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
              }`}
            >
              <span>{sc.scenario}</span>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Decision Breakdown */}
      <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-tertiary block">
              Active Production Scenario
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-primary mt-0.5">
              {activeScenario.scenario}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-tertiary">Recommended:</span>
            <span className="rounded-full bg-accent/15 border border-accent/30 px-3.5 py-1 text-xs sm:text-sm font-bold text-accent">
              ★ {winnerName}
            </span>
          </div>
        </div>

        {/* Why this tool wins */}
        <div className="space-y-2">
          <p className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
            Why {winnerName} Wins in This Scenario:
          </p>
          <p className="text-sm sm:text-base leading-relaxed text-primary font-normal">
            {activeScenario.rationale}
          </p>
        </div>

        {/* Trade-off summary */}
        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <span className="text-xs font-mono text-emerald-400 font-semibold block uppercase">
              ✓ Advantage of {winnerName}
            </span>
            <p className="mt-1 text-xs sm:text-sm text-secondary leading-relaxed">
              Optimized kinematics, reliable outputs, and purpose-built toolsets tailored specifically for {activeScenario.scenario.toLowerCase()}.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <span className="text-xs font-mono text-amber-400 font-semibold block uppercase">
              ⚠ Caution with {runnerUpName}
            </span>
            <p className="mt-1 text-xs sm:text-sm text-secondary leading-relaxed">
              May require additional prompt iteration passes, manual rotoscoping, or external post-enhancement for this exact delivery requirement.
            </p>
          </div>
        </div>

        {/* Direct Studio CTA Bridge */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-tertiary">Ready to direct this scene?</span>
          </div>
          <div className="flex items-center gap-3">
            {winnerTool && (
              <Link
                href={`/tools/${winnerTool.slug}`}
                className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
              >
                Inspect {winnerName} Dossier →
              </Link>
            )}
            <Link
              href="/prompts/factory"
              className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Direct in Studio</span>
              <span>⚡</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
