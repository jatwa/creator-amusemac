"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  StagedSourcePayload,
  loadStagedIntake,
  clearStagedIntake,
} from "@/lib/creator-intelligence-actions";
import {
  CANONICAL_INTELLIGENCE_MODULES,
  EXECUTION_MODES,
  estimateTotalWorkflowTokens,
  estimateModuleTokens,
} from "@/lib/creator-intelligence-plans";
import { getPlanLimits } from "@/lib/creator-intelligence-limits";

export default function CreateAnalyzePage() {
  const router = useRouter();
  const [staged, setStaged] = useState<StagedSourcePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [stagedStatus, setStagedStatus] = useState<"ready" | "staged_confirmed">("ready");

  useEffect(() => {
    const data = loadStagedIntake();
    if (data) {
      setStaged(data);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Loading Staged Workspace...</span>
        </div>
      </div>
    );
  }

  if (!staged) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
        <Navigation />
        <main className="flex-1 shell py-32 sm:py-40 flex items-center justify-center">
          <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center space-y-4 font-mono shadow-2xl">
            <div className="text-3xl">📁</div>
            <h2 className="text-base font-bold text-white uppercase">No Source Material Staged</h2>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              No screenplay or treatment was found in this browser session. Please stage a source file or text first.
            </p>
            <div className="pt-2">
              <Link
                href="/create"
                className="inline-block rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition"
              >
                ← Return to Source Intake
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const limits = getPlanLimits(staged.userTier);
  const modeConfig = EXECUTION_MODES[staged.executionMode] || EXECUTION_MODES.semi_automatic;
  const activeModules = CANONICAL_INTELLIGENCE_MODULES.filter((m) =>
    staged.selectedModules.includes(m.id)
  );
  const totalTokens = estimateTotalWorkflowTokens(staged.selectedModules, staged.characterCount);

  const handleConfirmHandoff = () => {
    setStagedStatus("staged_confirmed");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      <Navigation />

      <main className="flex-1 shell py-28 sm:py-36 space-y-10">
        {/* WORKSPACE HEADER */}
        <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <Link href="/create" className="hover:text-amber-400 transition">
                Intake
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-amber-400 font-semibold">Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
              FILMMAKER INTELLIGENCE WORKSPACE
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-sans">
              Source verified and staged. Review your intelligence plan before handoff to Director&apos;s Studio.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-bold text-amber-400">
              {limits.label}
            </span>
            <span className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1 text-zinc-300">
              Mode: {modeConfig.title}
            </span>
          </div>
        </div>

        {/* 2-COLUMN WORKSPACE GRID */}
        <div className="grid gap-8 lg:grid-cols-12 font-mono">
          {/* LEFT COLUMN: SOURCE AUDIT & PREVIEW (7 COLS) */}
          <div className="space-y-6 lg:col-span-7">
            {/* SOURCE IDENTITY CARD */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
                  <span>📄 Source Audit &amp; Metadata</span>
                </h3>
                <span
                  className={`rounded px-2.5 py-0.5 text-[10px] font-bold uppercase border ${
                    staged.extractionStatus === "ready"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {staged.extractionStatus === "ready" ? "Text Extracted & Verified" : "Document Staged"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">Format</span>
                  <p className="font-bold text-white uppercase">{staged.fileExtension}</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">Size</span>
                  <p className="font-bold text-white">{(staged.sizeBytes / 1024).toFixed(1)} KB</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">Characters</span>
                  <p className="font-bold text-white">
                    {staged.characterCount !== null ? staged.characterCount.toLocaleString() : "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-1">
                  <span className="text-[10px] text-zinc-500 uppercase">Words (Approx)</span>
                  <p className="font-bold text-white">
                    {staged.wordCount !== null ? staged.wordCount.toLocaleString() : "—"}
                  </p>
                </div>
              </div>

              <div className="text-xs text-zinc-400 space-y-1 pt-1 font-sans">
                <p>
                  Source Label: <strong className="font-mono text-zinc-200">{staged.sourceName}</strong>
                </p>
                {staged.fileName && (
                  <p>
                    Filename: <span className="font-mono text-zinc-400">{staged.fileName}</span>
                  </p>
                )}
              </div>
            </section>

            {/* SOURCE TEXT PREVIEW WELL */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-white tracking-wider">
                  Source Content Inspection
                </h3>
                <span className="text-[11px] text-zinc-500">
                  {staged.textAvailable ? "Local Memory Buffer" : "Binary Stream Staged"}
                </span>
              </div>

              {staged.textAvailable && staged.rawText ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 max-h-[360px] overflow-y-auto text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap select-text">
                  {staged.rawText}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950/60 p-8 text-center space-y-2">
                  <div className="text-2xl">⏳</div>
                  <h4 className="text-xs font-bold text-zinc-200 uppercase font-mono">
                    Document Text Extraction Pending
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans max-w-sm mx-auto leading-relaxed">
                    Raw {staged.fileExtension.toUpperCase()} file is staged securely. Server-side deep text extraction will parse sluglines and dialogue upon project initialization.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: INTELLIGENCE PLAN & WORKFLOW PIPELINE (5 COLS) */}
          <div className="space-y-6 lg:col-span-5">
            {/* INTELLIGENCE PLAN CARD */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-2">
                  <span>⚡ Active Intelligence Plan</span>
                </h3>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {totalTokens.formatted}
                </span>
              </div>

              <div className="space-y-3">
                {activeModules.map((mod) => {
                  const est = estimateModuleTokens(mod.id, staged.characterCount);
                  return (
                    <div
                      key={mod.id}
                      className="rounded-xl border border-zinc-800/90 bg-zinc-950 p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-200">{mod.name}</span>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold">
                          {est.formatted}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans leading-snug">
                        {mod.purpose}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {mod.outputArtifacts.map((art) => (
                          <span
                            key={art}
                            className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-400"
                          >
                            + {art}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* DIRECTORIAL PIPELINE PROGRESSION */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold uppercase text-white tracking-wider">
                Directorial Synthesis Sequence
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { step: "01", title: "Story Structure", desc: "Logline, dramatic stakes & 3-act pacing" },
                  { step: "02", title: "Character Dynamics", desc: "Conflict vectors & archetype bibles" },
                  { step: "03", title: "Scene Breakdowns", desc: "INT/EXT, lighting conditions & locations" },
                  { step: "04", title: "Visual Language", desc: "Optics, ratios, color space & rigs" },
                  { step: "05", title: "Shot Coverage", desc: "Camera movement, focal lengths & coverage" },
                  { step: "06", title: "Model Translations", desc: "Calibrated Runway, Kling & Flux prompts" },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-3 rounded-lg border border-zinc-800/60 bg-zinc-950/70 p-2.5"
                  >
                    <span className="font-mono text-amber-400 font-bold text-[11px] mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <h5 className="font-bold text-zinc-200 text-xs">{item.title}</h5>
                      <p className="text-[11px] text-zinc-400 font-sans">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PRIMARY HANDOFF CTA CARD */}
            <section className="rounded-2xl border border-amber-400/40 bg-gradient-to-b from-amber-400/10 to-transparent p-6 space-y-4 shadow-xl">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white font-mono">
                  {stagedStatus === "ready"
                    ? "Workspace Ready for Directorial Handoff"
                    : "✓ Source Staged into Director Workspace"}
                </h4>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  {stagedStatus === "ready"
                    ? "Confirm staging to initialize your project parameters and unlock prompt recipes in Director's Studio."
                    : "Your creative source is staged in this session. Jump into Director's Studio to compile camera-locked shot recipes."}
                </p>
              </div>

              {stagedStatus === "ready" ? (
                <button
                  type="button"
                  onClick={handleConfirmHandoff}
                  className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 py-3.5 text-xs font-bold text-zinc-950 transition-all font-mono shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2"
                >
                  <span>STAGE TO DIRECTOR&apos;S WORKSPACE</span>
                  <span>→</span>
                </button>
              ) : (
                <div className="space-y-2.5">
                  <Link
                    href="/prompts/factory"
                    className="w-full rounded-xl bg-amber-400 hover:bg-amber-300 py-3.5 text-xs font-bold text-zinc-950 transition-all font-mono shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2"
                  >
                    <span>ENTER DIRECTOR&apos;S STUDIO →</span>
                  </Link>
                  <Link
                    href="/toolkit"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-semibold text-zinc-200 transition-all font-mono flex items-center justify-center gap-2"
                  >
                    <span>OPEN PRODUCTION TOOLKIT</span>
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
