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
import { ExecutionMode } from "@/lib/creator-intelligence-plans";

export default function CreatePage() {
  const router = useRouter();
  const [stagedSource, setStagedSource] = useState<StagedSourcePayload | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([
    "story_analysis",
    "character_analysis",
    "screenplay_breakdown",
    "visual_bible",
    "shot_breakdown",
  ]);
  const [executionMode, setExecutionMode] = useState<ExecutionMode>("semi_automatic");

  // Load existing staged payload if present in session
  useEffect(() => {
    const existing = loadStagedIntake();
    if (existing) {
      setStagedSource(existing);
      if (existing.selectedModules) setSelectedModules(existing.selectedModules);
      if (existing.executionMode) setExecutionMode(existing.executionMode);
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

      <main className="flex-1 shell py-28 sm:py-36 space-y-10">
        {/* Editorial Directorial Header */}
        <div className="border-b border-zinc-800 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Directorial Intake OS
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            CREATIVE INTELLIGENCE INTAKE
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
            Stage your screenplay, treatment notes, or concept brief. Creator Intel will parse narrative parameters, extract scene coverage, and compile optical prompt recipes.
          </p>
        </div>

        {/* STEP 1: SOURCE INTAKE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-zinc-950 text-xs font-bold">1</span>
              <span>Source Material Intake</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">Supported: .TXT, .MD, .PDF, .DOCX</span>
          </div>

          <CreatorIntelligenceInput
            userTier="free"
            onSourceStaged={handleSourceStaged}
            stagedPayload={stagedSource}
          />
        </section>

        {/* STEP 2: MODULES & EXECUTION MODE */}
        <section className="space-y-4 border-t border-zinc-800/80 pt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-zinc-950 text-xs font-bold">2</span>
              <span>Intelligence Plan &amp; Execution Protocol</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">{selectedModules.length} Modules Active</span>
          </div>

          <CreatorIntelligenceExecutionPicker
            selectedModules={selectedModules}
            executionMode={executionMode}
            characterCount={stagedSource?.characterCount || null}
            onModulesChange={handleModulesChange}
            onExecutionModeChange={handleExecutionModeChange}
          />
        </section>

        {/* PROCEED ACTION BAR */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
          <div>
            <h3 className="text-sm font-bold text-white font-mono">
              {stagedSource ? `Ready to Analyze: ${stagedSource.sourceName}` : "Awaiting Source Material"}
            </h3>
            <p className="mt-1 text-xs text-zinc-400 font-sans">
              {stagedSource
                ? "Your source is validated and staged. Continue into the filmmaker intelligence workspace."
                : "Upload a file, paste script text, or pick a sample scenario above to proceed."}
            </p>
          </div>

          <button
            type="button"
            disabled={!stagedSource}
            onClick={handleProceedToWorkspace}
            className={`rounded-xl px-7 py-3.5 text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
              stagedSource
                ? "bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)] cursor-pointer"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50"
            }`}
          >
            <span>CONTINUE TO INTELLIGENCE WORKSPACE</span>
            <span>→</span>
          </button>
        </section>
      </main>

      <Footer />
    </div>
  );
}
