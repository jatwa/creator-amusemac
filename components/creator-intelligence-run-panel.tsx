"use client";

import { useState } from "react";

export function CreatorIntelligenceRunPanel() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function run() {
    setRunning(true);
    setError("");
    setResult("");

    let draft: { query?: string } = {};
    try {
      const raw = sessionStorage.getItem("ci_intelligence_draft");
      if (raw) draft = JSON.parse(raw);
    } catch {}

    const prompt = draft.query?.trim() || "Analyse the submitted story document for narrative structure, characters, conflict, themes, and directorial opportunities.";
    try {
      const response = await fetch("/api/creator-intelligence/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionId: "story_analysis",
          prompt,
          instruction: "Analyse this material as a professional film development consultant. Return clear sections for premise, structure, characters, conflict, themes, visual opportunities, risks, and directorial questions. Do not invent facts that are not present in the material.",
          mode: "semi_automatic",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Analysis failed.");
      setResult(data.result || "Analysis completed.");
    } catch (err: any) {
      setError(err?.message || "Analysis failed. No AI tokens were charged.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/[0.04] p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="intel-eyebrow">STORY ANALYSIS</span>
          <h2 className="mt-2 text-xl font-bold text-primary">Run the first intelligence pass</h2>
          <p className="mt-1 text-xs text-secondary">Estimated usage: ~5,000 AI tokens. Failed processing is not charged.</p>
        </div>
        <button type="button" onClick={run} disabled={running} className="rounded-xl bg-accent px-5 py-3 text-xs font-bold text-white disabled:opacity-50">
          {running ? "Analysing…" : "Analyse Story · ~5K Tokens"}
        </button>
      </div>

      {error && <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/[0.05] p-4 text-xs text-rose-300">{error}</div>}
      {result && <div className="prose-cinema mt-6 max-h-[560px] overflow-auto rounded-2xl border border-border-subtle bg-surface-elevated p-5 whitespace-pre-wrap">{result}</div>}
    </section>
  );
}
