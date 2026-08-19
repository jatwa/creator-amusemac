"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { PromptExampleItem } from "@/data/types";

interface PromptAnatomyCardProps {
  example: PromptExampleItem;
}

export function PromptAnatomyCard({ example }: PromptAnatomyCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToken = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    } catch {}
  };

  const copyFullPrompt = async () => {
    try {
      await navigator.clipboard.writeText(example.promptText);
      setCopiedKey("full");
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {}
  };

  const tokenList: { key: keyof typeof example.anatomy; label: string; icon: string }[] = [
    { key: "subject", label: "Subject", icon: "👤" },
    { key: "action", label: "Action", icon: "⚡" },
    { key: "camera", label: "Camera", icon: "🎥" },
    { key: "lens", label: "Lens / Optics", icon: "🔍" },
    { key: "light", label: "Lighting", icon: "💡" },
    { key: "environment", label: "Environment", icon: "🌍" },
    { key: "motion", label: "Motion", icon: "💨" },
    { key: "physics", label: "Physics", icon: "🌊" },
    { key: "style", label: "Color / Grade", icon: "🎨" },
  ];

  return (
    <div className="surface p-6 sm:p-7 rounded-2xl border border-border bg-surface shadow-subtle space-y-5 transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div>
          <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-accent">
            {example.category}
          </span>
          <h4 className="mt-1.5 text-base font-semibold text-primary">{example.title}</h4>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={copyFullPrompt}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition shadow-sm ${
            copiedKey === "full"
              ? "bg-accent text-accent-foreground"
              : "bg-foreground text-background hover:opacity-90"
          }`}
        >
          {copiedKey === "full" ? "✓ Copied Full Prompt!" : "Copy Full Recipe"}
        </motion.button>
      </div>

      {/* Full Prompt Window */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 font-mono text-xs sm:text-sm text-primary leading-relaxed select-all">
        &quot;{example.promptText}&quot;
      </div>

      {/* Editorial Explanation */}
      <p className="text-xs text-secondary leading-relaxed">{example.explanation}</p>

      {/* Tokenized Anatomy Grid */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-tertiary block">
          Deconstructed Prompt Anatomy (Click to copy token)
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {tokenList.map(({ key, label, icon }) => {
            const val = example.anatomy[key];
            if (!val) return null;
            const isCopied = copiedKey === key;

            return (
              <button
                key={key}
                onClick={() => copyToken(key, val)}
                className="group text-left rounded-xl border border-border-subtle bg-surface-elevated p-3 hover:border-accent/40 transition-colors"
                title="Click to copy this token"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-tertiary mb-1">
                  <span className="flex items-center gap-1">
                    <span>{icon}</span>
                    <span>{label}</span>
                  </span>
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    {isCopied ? "Copied!" : "Copy"}
                  </span>
                </div>
                <p className="text-primary font-medium line-clamp-2 leading-tight text-xs">
                  {val}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
