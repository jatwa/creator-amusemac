"use client";

import { useState } from "react";
import { prompts } from "@/data/content";

export function PromptList() {
  const [copied, setCopied] = useState<string | null>(null);
  const copyPrompt = async (title: string, prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    setCopied(title);
    window.setTimeout(() => setCopied(null), 1800);
  };
  return <div className="grid gap-4 lg:grid-cols-3">{prompts.map((item) => <article key={item.title} className="surface p-6"><p className="text-xs font-medium uppercase tracking-wider text-lime">{item.category}</p><h3 className="mt-3 text-lg font-medium text-white">{item.title}</h3><p className="mt-5 rounded-xl border border-zinc-800 bg-black/20 p-4 text-sm leading-6 text-zinc-400">{item.prompt}</p><button onClick={() => copyPrompt(item.title, item.prompt)} className="mt-5 text-sm font-medium text-white transition hover:text-lime">{copied === item.title ? "Copied ✓" : "Copy prompt →"}</button></article>)}</div>;
}
