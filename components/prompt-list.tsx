"use client";

import { useState } from "react";
import Link from "next/link";
import { promptsData } from "@/data/platform-data";

export function PromptList() {
  const [copied, setCopied] = useState<string | null>(null);
  const featuredPrompts = promptsData.slice(0, 3);

  const copyPrompt = async (id: string, promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      // Fallback
    }
  };

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-3">
        {featuredPrompts.map((item) => (
          <article
            key={item.id}
            className="surface flex flex-col justify-between p-6 transition duration-200 hover:border-zinc-500"
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-lime">
                  {item.useCase}
                </p>
                <span className="rounded-md border border-line bg-black/40 px-2 py-0.5 text-[11px] text-zinc-400">
                  {item.category.toUpperCase()}
                </span>
              </div>

              <h3 className="mt-3 text-xl font-bold text-white">
                <Link href={`/prompts/${item.slug}`} className="hover:text-lime transition">
                  {item.title}
                </Link>
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-400">
                {item.description}
              </p>

              <div className="mt-4 rounded-xl border border-zinc-800 bg-black/40 p-4 text-xs font-mono leading-6 text-zinc-300 select-all">
                {item.promptText}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
              <button
                onClick={() => copyPrompt(item.id, item.promptText)}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-panel px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-lime hover:text-lime"
              >
                <span>{copied === item.id ? "✓ Copied to clipboard" : "⌁ Copy prompt"}</span>
              </button>

              <Link
                href={`/prompts/${item.slug}`}
                className="text-xs font-medium text-zinc-400 hover:text-white transition"
              >
                Customize variables →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/prompts"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-3 text-sm font-semibold text-white transition hover:border-lime hover:bg-white/5"
        >
          <span>Explore all {promptsData.length} production prompts</span>
          <span className="text-lime">→</span>
        </Link>
      </div>
    </div>
  );
}
