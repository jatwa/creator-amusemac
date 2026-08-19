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
      // Clipboard fallback
    }
  };

  const resetDefaults = () => {
    setVariables(initialVars);
  };

  return (
    <div className="space-y-8">
      {/* Live Formatted Prompt Preview Output */}
      <div className="surface overflow-hidden border-border bg-surface shadow-subtle transition-colors">
        <div className="flex items-center justify-between border-b border-border-subtle bg-surface-elevated px-6 py-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
            Live Assembled Syntax
          </span>
          <button
            onClick={resetDefaults}
            className="text-xs text-tertiary hover:text-primary transition-colors font-mono"
          >
            Reset Defaults
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 font-mono text-sm sm:text-base leading-relaxed text-primary select-all">
            {finalPrompt}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleCopy}
              className={`rounded-full px-6 py-2.5 text-xs sm:text-sm font-medium transition flex items-center gap-2 shadow-sm ${
                copied
                  ? "bg-accent text-accent-foreground"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              <span>{copied ? "✓ Copied to Clipboard!" : "Copy Assembled Prompt"}</span>
            </button>

            <span className="text-xs text-tertiary font-mono">
              {finalPrompt.length} chars • {finalPrompt.split(/\s+/).length} words
            </span>
          </div>
        </div>
      </div>

      {/* Variables Editor */}
      {prompt.variables.length > 0 && (
        <div className="surface p-6 sm:p-8 border-border bg-surface shadow-subtle transition-colors">
          <h2 className="text-lg sm:text-xl font-semibold text-primary mb-1">Customize Variables</h2>
          <p className="text-xs sm:text-sm text-secondary font-normal">
            Adjust the creative parameters below. The assembled prompt above will update in real-time.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {prompt.variables.map((v) => (
              <div key={v.key} className="space-y-2">
                <label className="flex items-center justify-between text-xs font-medium text-primary">
                  <span>{v.label}</span>
                  <span className="font-mono text-tertiary text-[11px]">[{v.key}]</span>
                </label>

                <input
                  type="text"
                  value={variables[v.key] || ""}
                  onChange={(e) =>
                    setVariables({ ...variables, [v.key]: e.target.value })
                  }
                  placeholder={v.placeholder}
                  className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 font-mono text-xs sm:text-sm text-primary placeholder:text-tertiary outline-none focus:border-accent/40 transition"
                />

                {v.description && (
                  <p className="text-[11px] text-tertiary">{v.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negative Prompt (if available) */}
      {prompt.negativePrompt && (
        <div className="surface p-6 border-border-subtle bg-surface-elevated transition-colors">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-tertiary">
            Recommended Negative Prompt
          </p>
          <p className="mt-2 rounded-lg border border-border bg-surface p-3 font-mono text-xs text-secondary leading-relaxed">
            {prompt.negativePrompt}
          </p>
        </div>
      )}
    </div>
  );
}
