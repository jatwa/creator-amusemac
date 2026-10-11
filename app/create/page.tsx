"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CreatorIntelligenceInput } from "@/components/creator-intelligence-input";
import { CreatorIntelligenceExecutionPicker } from "@/components/creator-intelligence-execution-picker";
import {
  StagedSourcePayload,
  saveStagedIntake,
  loadStagedIntake,
} from "@/lib/creator-intelligence-actions";
import {
  ExecutionMode,
  CANONICAL_INTELLIGENCE_MODULES,
  EXECUTION_MODES,
} from "@/lib/creator-intelligence-plans";

export default function CreatePage() {
  const router = useRouter();
  const [stagedSource, setStagedSource] = useState<StagedSourcePayload | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([
    "story_analysis",
    "visual_bible",
    "shot_breakdown",
  ]);
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("semi_automatic");

  // Load existing staged payload if present in session
  useEffect(() => {
    const existing = loadStagedIntake();
    if (existing) {
      setStagedSource(existing);
      if (existing.selectedModules && existing.selectedModules.length > 0) {
        setSelectedModules(existing.selectedModules);
      }
      if (existing.executionMode) {
        setExecutionMode(existing.executionMode);
      }
    }
  }, []);

  const handleSourceStaged = (payload: StagedSourcePayload) => {
    const updated = {
      ...payload,
      selectedModules,
      executionMode,
    };
    setStagedSource(updated);
    saveStagedIntake(updated);
  };

  const handleModulesChange = (modules: string[]) => {
    setSelectedModules(modules);
    if (stagedSource) {
      const updated = { ...stagedSource, selectedModules: modules };
      setStagedSource(updated);
      saveStagedIntake(updated);
    }
  };

  const handleExecutionModeChange = (mode: ExecutionMode) => {
    setExecutionMode(mode);
    if (stagedSource) {
      const updated = { ...stagedSource, executionMode: mode };
      setStagedSource(updated);
      saveStagedIntake(updated);
    }
  };

  const handleProceedToWorkspace = () => {
    if (!stagedSource) return;
    const finalPayload: StagedSourcePayload = {
      ...stagedSource,
      selectedModules,
      executionMode,
    };
    saveStagedIntake(finalPayload);
    router.push("/create/analyze");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      <Navigation />

      <main className="flex-1 shell py-28 sm:py-36 space-y-12">
        {/* Editorial Cinematic Header */}
        <div className="border-b border-zinc-800 pb-8 text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            DIRECTOR&apos;S STUDIO INTAKE · 24 FPS
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            CREATE STUDIO
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Translate real screenplay treatments, scenes, and visual concepts into calibrated directorial intelligence and multi-engine video prompts.
          </p>
        </div>

        {/* STEP 1: ADD YOUR STORY */}
        <section aria-labelledby="step-1-heading" className="space-y-4">
          <CreatorIntelligenceInput
            userTier="free"
            onSourceStaged={handleSourceStaged}
            stagedPayload={stagedSource}
          />
        </section>

        {/* STEP 2: CHOOSE YOUR GOAL */}
        <section aria-labelledby="step-2-heading" className="space-y-4 border-t border-zinc-800 pt-10">
          <CreatorIntelligenceExecutionPicker
            selectedModules={selectedModules}
            executionMode={executionMode}
            characterCount={stagedSource?.characterCount || null}
            onModulesChange={handleModulesChange}
            onExecutionModeChange={handleExecutionModeChange}
          />
        </section>

        {/* STEP 3: REVIEW AND CONTINUE */}
        <section
          aria-labelledby="step-3-heading"
          className="space-y-4 border-t border-zinc-800 pt-10"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                STEP 3 · REVIEW &amp; CONTINUE
              </span>
              <span className="text-xs font-mono text-zinc-500">Staging Verification</span>
            </div>
            <h2 id="step-3-heading" className="text-xl sm:text-2xl font-bold text-white font-sans">
              Review Choices &amp; Directorial Handoff
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans">
              Confirm your intake details and selected goals before entering the Filmmaker Intelligence Workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-7 shadow-2xl backdrop-blur-md space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
              {/* Source Item */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Source Material</span>
                <p className="font-bold text-white truncate text-sm">
                  {stagedSource ? stagedSource.sourceName : "None staged yet"}
                </p>
                <p className="text-[11px] text-zinc-400 font-sans">
                  {stagedSource ? (
                    <>
                      {stagedSource.fileExtension.toUpperCase()} · {(stagedSource.sizeBytes / 1024).toFixed(1)} KB
                    </>
                  ) : (
                    "Upload or paste in Step 1"
                  )}
                </p>
              </div>

              {/* Status Item */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Extraction Status</span>
                <div>
                  {stagedSource ? (
                    <span
                      className={`inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase border ${
                        stagedSource.textAvailable
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {stagedSource.textAvailable ? "Text ready" : "File staged — extraction pending"}
                    </span>
                  ) : (
                    <span className="inline-block rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-500 font-medium">
                      Awaiting source
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  {stagedSource?.textAvailable
                    ? "Parsed locally in browser"
                    : stagedSource
                    ? "Safe metadata staging"
                    : "Step 1 required"}
                </p>
              </div>

              {/* Goals Item */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Selected Goals</span>
                <p className="font-bold text-amber-400 text-sm">
                  {selectedModules.length} Directorial Modules
                </p>
                <p className="text-[11px] text-zinc-400 font-sans truncate">
                  {selectedModules
                    .map((id) => CANONICAL_INTELLIGENCE_MODULES.find((m) => m.id === id)?.name || id)
                    .join(", ")}
                </p>
              </div>

              {/* Protocol Item */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Execution Mode</span>
                <p className="font-bold text-white text-sm">
                  {EXECUTION_MODES[executionMode].title}
                </p>
                <p className="text-[11px] text-zinc-400 font-sans">
                  {EXECUTION_MODES[executionMode].subtitle}
                </p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-zinc-400 font-sans">
                {stagedSource ? (
                  <span>
                    ✓ Ready to continue. Staged details will transfer seamlessly into your session workspace.
                  </span>
                ) : (
                  <span className="text-amber-400">
                    Stage your source screenplay or select a curated scenario above to continue.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={!stagedSource}
                  onClick={handleProceedToWorkspace}
                  className={`w-full sm:w-auto rounded-xl px-7 py-3 text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
                    stagedSource
                      ? "bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] cursor-pointer"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
                  }`}
                >
                  <span>CONTINUE TO WORKSPACE</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
