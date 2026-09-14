"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UnifiedToolIntelligence } from "@/lib/adapters/tool-intelligence-adapter";
import { ToolMediaHub } from "@/components/tools/tool-media-hub";
import {
  Clapperboard,
  Camera,
  Film,
  Sparkles,
  Zap,
  Sliders,
  Check,
  ArrowRight,
  ArrowUpRight,
  Copy,
  BookOpen,
  Layers,
  Search,
} from "@/components/cinematic/icons";

interface UnifiedToolDossierProps {
  tool: UnifiedToolIntelligence;
}

export function UnifiedToolDossier({ tool }: UnifiedToolDossierProps) {
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const handleCopyPrompt = (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPromptId(id);
      setTimeout(() => setCopiedPromptId(null), 2500);
    }
  };

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Dossier Header / Director's Verdict */}
      <section className="relative rounded-3xl border border-white/[0.1] bg-neutral-950/90 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

        {/* Top Breadcrumb & Status */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/[0.08]">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Link href="/tools" className="hover:text-amber-400 transition-colors">
              Tools Directory
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-semibold">{tool.name}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
              ● Directorial Audit Verified
            </span>
            {tool.verifiedAt && (
              <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
                Updated {tool.verifiedAt}
              </span>
            )}
          </div>
        </div>

        {/* Hero Headline & Direct Studio Action */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs font-mono text-neutral-300">
                {tool.category}
              </span>
              {tool.developer && (
                <span className="px-2.5 py-0.5 rounded-md bg-neutral-900 text-xs font-mono text-neutral-400">
                  Dev: {tool.developer}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
              {tool.name}
            </h1>

            <p className="text-lg sm:text-xl font-serif italic text-amber-200/90 leading-relaxed">
              &ldquo;{tool.tagline}&rdquo;
            </p>

            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed pt-2">
              {tool.overview}
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tool.capabilities.slice(0, 5).map((cap, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900/90 border border-white/[0.06] text-xs font-mono text-neutral-300"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Action & Rating Card */}
          <div className="lg:col-span-4 rounded-2xl border border-amber-400/30 bg-neutral-900/90 p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  CREATOR INTEL RATING
                </span>
                <span className="text-3xl font-bold text-white font-mono">
                  {tool.rating.toFixed(1)}{" "}
                  <span className="text-sm text-neutral-500 font-normal">/ 5.0</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                  PRICING MODEL
                </span>
                <span className="text-sm font-bold text-neutral-200 font-mono">
                  {tool.pricingModel}
                </span>
              </div>
            </div>

            {/* Direct In Studio CTA */}
            <div className="space-y-3">
              <Link
                href={`/prompts/factory?engine=${tool.studioEngineId}&preset=${tool.studioPreset}`}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm font-sans flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(245,158,11,0.25)] group"
              >
                <Clapperboard className="w-4 h-4 text-neutral-950 group-hover:scale-110 transition-transform" />
                <span>Direct in Studio with {tool.name}</span>
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-center text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-1"
                >
                  <span>Official Site</span>
                  <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </a>

                {tool.docsUrl ? (
                  <a
                    href={tool.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-center text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <span>API / Docs</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                  </a>
                ) : (
                  <Link
                    href="#how-to-use"
                    className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-center text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Usage Guide</span>
                    <BookOpen className="w-3 h-3 text-neutral-500" />
                  </Link>
                )}
              </div>
            </div>

            {/* Scorecard Quick List */}
            {tool.scorecard && (
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  Directorial Scorecard
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(tool.scorecard).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-1.5 rounded bg-neutral-950/60 border border-white/[0.04]">
                      <span className="text-neutral-400 capitalize">{key}</span>
                      <span className="text-amber-400 font-bold">{val}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Editorial Verdict Box (Pros, Cons, Use Cases, Limitations) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths & Best Use Cases */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/[0.08] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              DIRECTORIAL STRENGTHS &amp; BEST USE CASES
            </h3>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-sans">
              Where {tool.name} Excels on Set
            </h4>
            <ul className="space-y-2.5">
              {tool.bestUseCases.map((useCase, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-200 font-sans">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {typeof useCase === "string"
                      ? useCase
                      : `${useCase.title}${useCase.explanation ? `: ${useCase.explanation}` : ""}`}
                  </span>
                </li>
              ))}
              {tool.pros.map((pro, idx) => (
                <li key={`pro-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 font-sans">
                  <Check className="w-4 h-4 text-emerald-400/70 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Limitations & When to Avoid */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/[0.08] p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-rose-400 font-bold">
              LIMITATIONS &amp; WHEN TO AVOID
            </h3>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-sans">
              Known Artifacts &amp; Edge Cases
            </h4>
            <ul className="space-y-2.5">
              {tool.limitations.map((limit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 font-sans">
                  <span className="text-rose-400 font-mono font-bold shrink-0">✕</span>
                  <span>{limit}</span>
                </li>
              ))}
              {tool.notBestFor.map((avoid, idx) => (
                <li key={`avoid-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-400 font-sans">
                  <span className="text-rose-400/80 font-mono font-bold shrink-0">✕</span>
                  <span>
                    Do not use for:{" "}
                    {typeof avoid === "string"
                      ? avoid
                      : `${avoid.title}${avoid.explanation ? `: ${avoid.explanation}` : ""}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Media Hub ("SEE IT IN ACTION") */}
      <ToolMediaHub toolName={tool.name} items={tool.mediaHub} />

      {/* 4. Production Prompts & Creation Examples */}
      {tool.promptExamples.length > 0 && (
        <section className="space-y-6" id="prompts">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
                AUDITED RECIPES &amp; KEYFRAMES
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Directorial Prompts Benchmarked for {tool.name}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-1">
              Engineered with physical camera parameters, lighting ratios, and motion vector tags.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tool.promptExamples.map((item, idx) => {
              const promptId = `prompt-${idx}`;
              const isCopied = copiedPromptId === promptId;
              return (
                <div
                  key={promptId}
                  className="rounded-2xl border border-white/[0.08] bg-neutral-900/60 p-6 flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                        {item.title}
                      </span>
                      {item.anatomy?.camera && (
                        <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded bg-white/[0.04]">
                          {item.anatomy.camera}
                        </span>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-neutral-950 border border-white/[0.06] font-mono text-xs text-neutral-300 leading-relaxed select-all">
                      {item.promptText}
                    </div>

                    {item.anatomy?.light && (
                      <p className="text-xs text-neutral-400 font-sans">
                        <span className="text-neutral-500 font-mono">Lighting:</span> {item.anatomy.light}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyPrompt(promptId, item.promptText)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>

                    <Link
                      href={`/prompts/factory?engine=${tool.studioEngineId}&preset=${tool.studioPreset}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-mono font-bold transition-all"
                    >
                      <Clapperboard className="w-3.5 h-3.5" />
                      <span>Open in Studio</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Production Pipeline & Shot Breakdowns */}
      {(tool.productionPipeline.length > 0 || tool.shotBreakdowns.length > 0) && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Production Pipeline */}
          {tool.productionPipeline.length > 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/40 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                  PRODUCTION PIPELINE POSITION
                </h3>
              </div>

              <div className="space-y-4">
                {tool.productionPipeline.map((stage, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-950 border border-white/[0.04] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {stage.stageName}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">Step 0{stage.stageNumber || idx + 1}</span>
                    </div>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {stage.action}
                    </p>
                    {stage.outputArtifact && (
                      <p className="text-[11px] font-mono text-amber-300/80 pt-1">
                        Deliverable: {stage.outputArtifact}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shot Breakdown Tactics */}
          {tool.shotBreakdowns.length > 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/40 p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  DIRECTOR SHOT BREAKDOWNS
                </h3>
              </div>

              <div className="space-y-4">
                {tool.shotBreakdowns.map((shot, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-950 border border-white/[0.04] space-y-1.5">
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                      {shot.shotType}
                    </span>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {shot.why}
                    </p>
                    {shot.promptStrategy && (
                      <p className="text-[11px] font-mono text-neutral-400 pt-1">
                        Strategy: {shot.promptStrategy}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 6. Step-by-Step Usage Guide & Common Mistakes */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="how-to-use">
        {/* Usage Guide */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-neutral-900/40 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
              HOW TO USE {tool.name.toUpperCase()} (WORKFLOW PROTOCOL)
            </h3>
          </div>

          <div className="space-y-4">
            {tool.usageGuide && (
              <>
                {tool.usageGuide.beginner && tool.usageGuide.beginner.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">Level 1: Core Fundamentals</span>
                    {tool.usageGuide.beginner.map((step, idx) => (
                      <div key={`b-${idx}`} className="flex items-start gap-3 text-xs text-neutral-300">
                        <span className="font-mono text-amber-400 font-bold">0{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tool.usageGuide.intermediate && tool.usageGuide.intermediate.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                    <span className="text-[10px] font-mono uppercase text-amber-300 tracking-wider">Level 2: Camera &amp; Lighting Control</span>
                    {tool.usageGuide.intermediate.map((step, idx) => (
                      <div key={`i-${idx}`} className="flex items-start gap-3 text-xs text-neutral-300">
                        <span className="font-mono text-amber-300 font-bold">0{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}

                {tool.usageGuide.advanced && tool.usageGuide.advanced.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Level 3: Master Production Pipeline</span>
                    {tool.usageGuide.advanced.map((step, idx) => (
                      <div key={`a-${idx}`} className="flex items-start gap-3 text-xs text-neutral-300">
                        <span className="font-mono text-emerald-400 font-bold">0{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Common Mistakes */}
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-neutral-900/40 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
              COMMON AMATEUR MISTAKES
            </h3>
          </div>

          <div className="space-y-4">
            {tool.commonMistakes.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-neutral-950 border border-white/[0.04] space-y-2">
                <div className="text-xs font-bold text-rose-300 font-sans flex items-start gap-2">
                  <span className="text-rose-400 font-mono">✕</span>
                  <span>{item.mistake}</span>
                </div>
                {item.impact && (
                  <p className="text-[11px] text-neutral-400 pl-4 font-sans">
                    Impact: {item.impact}
                  </p>
                )}
                <div className="text-xs text-emerald-300 font-sans flex items-start gap-2 pl-4">
                  <span className="text-emerald-400 font-mono">✓</span>
                  <span>Correction: {item.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Head-to-Head Comparisons & Alternatives Matrix */}
      {tool.comparisons.length > 0 && (
        <section className="space-y-6" id="compare">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
                HEAD-TO-HEAD COMPARISONS
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
              Compare {tool.name} with Alternative Engines
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-1">
              Direct technical tradeoffs, physics fidelity, and cost per minute benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tool.comparisons.map((cmp) => (
              <Link
                key={cmp.id}
                href={`/compare/${cmp.slug}`}
                className="p-6 rounded-2xl border border-white/[0.08] bg-neutral-900/60 hover:bg-neutral-900 hover:border-amber-400/50 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                    <span>DIRECT TRADEOFF</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="text-lg font-bold text-white font-sans group-hover:text-amber-200 transition-colors uppercase font-mono text-sm">
                    {cmp.slug.replace(/-/g, " ")}
                  </h4>
                  <p className="text-xs text-neutral-300 font-sans line-clamp-3">
                    {cmp.summaryVerdict}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Read In-Depth Comparison</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. Bottom Sticky Conversion / Studio Dispatch Bar */}
      <section className="rounded-3xl border border-amber-400/40 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-semibold">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>DIRECTOR STUDIO DISPATCH</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-bold text-white font-sans">
            Ready to Direct with {tool.name}?
          </h3>

          <p className="text-sm sm:text-base text-neutral-300 font-sans">
            Load the verified {tool.name} optical recipe directly into the Director's Studio. Adjust focal lengths, rigs, and lighting ratios with real-time prompt compilation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href={`/prompts/factory?engine=${tool.studioEngineId}&preset=${tool.studioPreset}`}
            className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm font-sans transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2"
          >
            <Clapperboard className="w-4 h-4 text-neutral-950" />
            <span>Launch in Director's Studio</span>
          </Link>

          <Link
            href="/tools"
            className="px-6 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white text-sm font-mono transition-colors"
          >
            Browse All 200+ AI Tools
          </Link>
        </div>
      </section>
    </div>
  );
}