"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Draft = { query?: string; fileName?: string };

export default function CreateWorkspacePage() {
  const [draft, setDraft] = useState<Draft>({});
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ci_intelligence_draft");
      if (raw) setDraft(JSON.parse(raw) as Draft);
    } catch {}
  }, []);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="shell py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400">CREATOR INTELLIGENCE WORKSPACE</span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">Bring your story in.</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-neutral-400">Turn a script, scene, document or raw idea into research, directorial decisions, shot design, model selection and production-ready prompts.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-white/[0.09] bg-neutral-900/70 p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">INPUT</span>
                <span className="text-[10px] font-mono text-emerald-400">WORKSPACE READY</span>
              </div>
              {draft.fileName && (
                <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-4">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-amber-400">DOCUMENT</p>
                  <p className="mt-2 text-sm font-semibold text-white">{draft.fileName}</p>
                  <p className="mt-1 text-xs text-neutral-500">Document intake is staged; PDF/DOCX extraction will run in the server analysis step.</p>
                </div>
              )}
              <div className="mt-5">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-500">Your instruction</label>
                <div className="mt-2 min-h-40 rounded-2xl border border-white/[0.08] bg-black/40 p-4 text-sm leading-relaxed text-neutral-200">{draft.query || "Write what you want Creator Intel to do with your story or scene."}</div>
              </div>
              <button type="button" className="mt-5 w-full rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold text-neutral-950">Continue to Story Analysis →</button>
            </section>

            <section className="rounded-3xl border border-white/[0.09] bg-neutral-900/50 p-6 sm:p-8">
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400">WHAT YOU CAN CREATE</p>
              <div className="mt-5 space-y-3">
                {[
                  ["01", "Scene Breakdown", "Turn screenplay pages into production decisions."],
                  ["02", "Shot Cards", "Design lens, camera, light, movement and intent."],
                  ["03", "Model Selection", "Match the shot to the engine that fits it."],
                  ["04", "Production Prompts", "Generate model-specific instructions and constraints."],
                  ["05", "Visual Bible", "Build a consistent visual language for the project."],
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

          <div className="mt-8 text-center"><Link href="/" className="text-xs font-mono text-neutral-500 hover:text-amber-400">← Back to Creator Intel</Link></div>
        </div>
      </div>
    </main>
  );
}
