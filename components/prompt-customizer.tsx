"use client";

import { useState } from "react";
import { Prompt } from "@/data/types";

export function PromptCustomizer({ prompt }: { prompt: Prompt }) {
  // Initialize state with default values for each variable
  const initialVars = prompt.variables.reduce<Record<string, string>>((acc, v) => {
    acc[v.key] = v.defaultValue || "";
    return acc;
  }, {});

  const [variables, setVariables] = useState<Record<string, string>>(initialVars);
  const [copied, setCopied] = useState(false);

  // Compute the interpolated prompt text
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
      <div className="surface overflow-hidden border-lime/30 bg-panel/90 shadow-glow">
        <div className="flex items-center justify-between border-b border-line bg-black/40 px-6 py-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-lime">
            Live Assembled Prompt
          </span>
          <button
            onClick={resetDefaults}
            className="text-xs text-zinc-400 hover:text-white transition underline"
          >
            Reset defaults
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-zinc-800 bg-black/60 p-5 font-mono text-sm leading-7 text-zinc-100 select-all">
            {finalPrompt}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleCopy}
              className="rounded-xl bg-lime px-6 py-3 text-sm font-bold text-black transition hover:bg-white flex items-center gap-2"
            >
              <span>{copied ? "✓ Copied to clipboard!" : "⌁ Copy assembled prompt"}</span>
            </button>

            <span className="text-xs text-zinc-500 font-mono">
              {finalPrompt.length} characters • {finalPrompt.split(/\s+/).length} words
            </span>
          </div>
        </div>
      </div>

      {/* Variables Editor */}
      {prompt.variables.length > 0 && (
        <div className="surface p-8">
          <h2 className="text-xl font-bold text-white">Customize Variables</h2>
          <p className="mt-1 text-xs text-zinc-400">
            Modify values below to tailor this recipe to your project, brand, or film scene.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {prompt.variables.map((v) => (
              <div key={v.key} className="space-y-2">
                <label className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                  <span>{v.label}</span>
                  <span className="text-zinc-500 font-mono">[{v.key}]</span>
                </label>

                <input
                  type="text"
                  value={variables[v.key] || ""}
                  onChange={(e) =>
                    setVariables({ ...variables, [v.key]: e.target.value })
                  }
                  placeholder={v.placeholder}
                  className="w-full rounded-lg border border-line bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-lime"
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
        <div className="surface p-6 border-red-500/20">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
            Recommended Negative Prompt
          </p>
          <p className="mt-2 rounded-lg border border-zinc-800 bg-black/40 p-3 font-mono text-xs text-zinc-300">
            {prompt.negativePrompt}
          </p>
        </div>
      )}
    </div>
  );
}
