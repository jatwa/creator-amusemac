"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CreatorIntelligenceExecutionPicker } from "@/components/creator-intelligence-execution-picker";

type Draft = { query?: string; fileName?: string };

export default function StoryAnalysisPage() {
  const [draft, setDraft] = useState<Draft>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ci_intelligence_draft");
      if (raw) setDraft(JSON.parse(raw) as Draft);
    } catch {}
  }, []);

  const hasDocument = Boolean(draft.fileName);
  const hasText = Boolean(draft.query?.trim());

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="shell py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400">STORY ANALYSIS</span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">Your story is in the workspace.</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-400">
            Creator Intel has captured your instruction and document intake. This step prepares the material for scene, shot and model decisions.
          </p>

          <div className="mt-8">
            <CreatorIntelligenceExecutionPicker />
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-white/[0.09] bg-neutral-900/70 p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">SOURCE</span>
                <span className="text-[10px] font-mono text-emerald-400">CAPTURED</span>
              </div>
              {hasDocument && (
                <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400">DOCUMENT</p>
                  <p className="mt-2 text-sm font-semibold text-white">{draft.fileName}</p>
                  <p className="mt-1 text-xs text-neutral-500">File type and size were validated at intake.</p>
                </div>
              )}
              {hasText && (
                <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/30 p-4">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">INSTRUCTION</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-200">{draft.query}</p>
                </div>
              )}

              {hasDocument && !hasText && (
                <div className="mt-5 rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-4 text-xs leading-relaxed text-neutral-400">
                  PDF/DOCX text extraction is the next server-side intake layer. The interface will not pretend a document was analysed until extraction is actually available.
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={hasText ? "/prompts/factory" : "/create"} className="rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold text-neutral-950">
                  {hasText ? "Open Director's Studio →" : "Back to Intake →"}
                </Link>
                <Link href="/" className="rounded-xl border border-white/[0.1] px-5 py-3 text-xs font-semibold text-neutral-300 hover:text-white">
                  Back to Creator Intel
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-white/[0.09] bg-neutral-900/50 p-6 sm:p-8">
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400">NEXT DECISIONS</p>
              <div className="mt-5 space-y-3">
                {[
                  ["01", "Scene Breakdown", "Identify scenes, subjects, actions and production intent."],
                  ["02", "Shot Cards", "Translate story intent into camera, lens, light and movement."],
                  ["03", "Model Selection", "Match each shot to the right AI engine."],
                  ["04", "Production Prompts", "Compile model-specific instructions and constraints."],
                ].map(([n, title, copy]) => (
                  <div key={n} className="rounded-2xl border border-white/[0.07] bg-black/30 p-4">
                    <span className="text-[10px] font-mono text-amber-400">{n}</span>
                    <h2 className="mt-2 text-sm font-bold text-white">{title}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500">{copy}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
