"use client";

import { useState } from "react";
import { Prompt } from "@/data/types";

export function PromptCustomizer({ prompt }: { prompt: Prompt }) {
  const initialVars = prompt.variables.reduce<Record<string, string>>((acc, v) => {
    acc[v.key] = v.defaultValue || "";
    return acc;
  }, {});

  const [variables, setVariables] = useState<Record<string, string>>(initialVars);
  const [copied, setCopied] = useState(false);

  const computePrompt = () => {
    let text = prompt.promptText;
    prompt.variables.forEach((v) => {
      const val = variables[v.key] || `[${v.key}]`;
      text = text.replace(new RegExp(`\\[${v.key}\\]`, "g"), val);
    });
    return text;
  };

  const finalPrompt = computePrompt();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const resetDefaults = () => {
    setVariables(initialVars);
  };

  return (
    <div className="space-y-8">
      {/* Live Formatted Prompt Preview Output */}
      <div className="surface overflow-hidden border-lime/30 bg-panel/90 shadow-card">
        <div className="flex items-center justify-between border-b border-line bg-black/40 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span className="eyebrow text-xs">Live Assembled Syntax</span>
          </div>
          <button
            onClick={resetDefaults}
            className="text-xs text-zinc-400 hover:text-white transition font-mono"
          >
            Reset Defaults
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-zinc-800 bg-ink/90 p-5 font-mono text-sm sm:text-base leading-relaxed text-zinc-100 select-all shadow-inner">
            {finalPrompt}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleCopy}
              className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-glow-subtle ${
                copied
                  ? "bg-lime text-black"
                  : "bg-white text-black hover:bg-lime"
              }`}
            >
              <span>{copied ? "✓ Copied to Clipboard!" : "⌁ Copy Assembled Prompt"}</span>
            </button>

            <span className="text-xs text-zinc-500 font-mono">
              {finalPrompt.length} chars • {finalPrompt.split(/\s+/).length} words
            </span>
          </div>
        </div>
      </div>

      {/* Variables Editor */}
      {prompt.variables.length > 0 && (
        <div className="surface p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Customize Variables</h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Adjust the creative parameters below. The assembled prompt above will update in real-time.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {prompt.variables.map((v) => (
              <div key={v.key} className="space-y-2">
                <label className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>{v.label}</span>
                  <span className="font-mono text-zinc-500 text-[11px]">[{v.key}]</span>
                </label>

                <input
                  type="text"
                  value={variables[v.key] || ""}
                  onChange={(e) =>
                    setVariables({ ...variables, [v.key]: e.target.value })
                  }
                  placeholder={v.placeholder}
                  className="w-full rounded-lg border border-line bg-ink px-3.5 py-2.5 font-mono text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none focus:border-lime transition"
                />

                {v.description && (
                  <p className="text-[11px] text-zinc-500">{v.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negative Prompt (if available) */}
      {prompt.negativePrompt && (
        <div className="surface p-6 border-red-500/20 bg-red-950/10">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-red-400">
            Recommended Negative Prompt
          </p>
          <p className="mt-2 rounded-lg border border-zinc-800 bg-ink/70 p-3 font-mono text-xs text-zinc-300 leading-relaxed">
            {prompt.negativePrompt}
          </p>
        </div>
      )}
    </div>
  );
}
