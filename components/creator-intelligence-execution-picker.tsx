"use client";

import React from "react";
import {
  CANONICAL_INTELLIGENCE_MODULES,
  EXECUTION_MODES,
  ExecutionMode,
  estimateModuleTokens,
  estimateTotalWorkflowTokens,
} from "@/lib/creator-intelligence-plans";

interface CreatorIntelligenceExecutionPickerProps {
  selectedModules: string[];
  executionMode: ExecutionMode;
  characterCount: number | null;
  onModulesChange: (moduleIds: string[]) => void;
  onExecutionModeChange: (mode: ExecutionMode) => void;
}

export function CreatorIntelligenceExecutionPicker({
  selectedModules,
  executionMode,
  characterCount,
  onModulesChange,
  onExecutionModeChange,
}: CreatorIntelligenceExecutionPickerProps) {
  const toggleModule = (id: string) => {
    if (selectedModules.includes(id)) {
      if (selectedModules.length === 1) return; // keep at least 1
      onModulesChange(selectedModules.filter((m) => m !== id));
    } else {
      onModulesChange([...selectedModules, id]);
    }
  };

  const totalEstimate = estimateTotalWorkflowTokens(selectedModules, characterCount);

  return (
    <div className="space-y-8 font-mono">
      {/* 1. EXECUTION MODE SELECTOR */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <h3 className="text-xs font-bold uppercase text-zinc-900 dark:text-white flex items-center gap-2">
            <span>1. Execution Protocol</span>
          </h3>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans">
            Controls human-in-the-loop validation
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(EXECUTION_MODES) as ExecutionMode[]).map((modeKey) => {
            const config = EXECUTION_MODES[modeKey];
            const isSelected = executionMode === modeKey;
            return (
              <div
                key={modeKey}
                onClick={() => onExecutionModeChange(modeKey)}
                className={`cursor-pointer rounded-xl border p-4.5 transition shadow-sm ${
                  isSelected
                    ? "border-amber-500 bg-amber-500/10 dark:border-amber-400 dark:bg-amber-400/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                    : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{config.icon}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                      isSelected
                        ? "bg-amber-500 text-zinc-950 dark:bg-amber-400"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {isSelected ? "Active" : "Select"}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white leading-tight">
                  {config.title}
                </h4>
                <p className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  {config.subtitle}
                </p>
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                  {config.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. INTELLIGENCE MODULES MATRIX */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <div>
            <h3 className="text-xs font-bold uppercase text-zinc-900 dark:text-white flex items-center gap-2">
              <span>2. Intelligence Analysis Modules</span>
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-sans mt-0.5">
              Select the intelligence layers to extract from the source treatment
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">Total Estimated Budget:</span>
            <strong className="text-amber-500 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {totalEstimate.formatted}
            </strong>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CANONICAL_INTELLIGENCE_MODULES.map((mod) => {
            const isSelected = selectedModules.includes(mod.id);
            const tokenInfo = estimateModuleTokens(mod.id, characterCount);

            return (
              <div
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className={`cursor-pointer rounded-xl border p-4.5 flex flex-col justify-between transition shadow-sm ${
                  isSelected
                    ? "border-amber-500/60 bg-amber-500/5 dark:border-amber-400/50 dark:bg-amber-400/5"
                    : "border-zinc-200 bg-white opacity-70 hover:opacity-100 dark:border-zinc-800 dark:bg-zinc-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] uppercase font-bold text-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400">
                      {mod.category}
                    </span>
                    <span
                      className={`h-4 w-4 rounded flex items-center justify-center text-[10px] font-bold border transition ${
                        isSelected
                          ? "bg-amber-500 border-amber-500 text-zinc-950 dark:bg-amber-400 dark:border-amber-400"
                          : "border-zinc-300 dark:border-zinc-700 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                    {mod.name}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {mod.purpose}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500 dark:text-zinc-400 font-sans">Estimated Cost:</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                    {tokenInfo.formatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INTELLIGENCE PIPELINE FLOW VISUALIZER */}
      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/80 space-y-3">
        <h4 className="text-xs font-bold uppercase text-zinc-900 dark:text-white">
          Directorial Output Sequence
        </h4>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {[
            "STORY",
            "CHARACTERS",
            "SCENES",
            "VISUAL LANGUAGE",
            "SHOTS",
            "MODEL / PROMPT DECISIONS",
          ].map((stage, idx) => (
            <React.Fragment key={stage}>
              <span className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 font-semibold shadow-xs">
                {stage}
              </span>
              {idx < 5 && <span className="text-amber-500 dark:text-amber-400 font-bold">→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
          The selected modules synthesize raw creative input into actionable optical blueprints, camera rigs, and calibrated prompts for video diffusion engines.
        </p>
      </section>
    </div>
  );
}
