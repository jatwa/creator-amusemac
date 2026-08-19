"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const productionIntents = [
    { label: "Commercials", href: "/search?q=commercial" },
    { label: "Video Generation", href: "/categories/video" },
    { label: "Character Consistency", href: "/search?q=character" },
    { label: "Cinematic Film Stills", href: "/prompts/realistic-film-still" },
    { label: "VFX & Motion", href: "/categories/vfx" },
    { label: "Runway vs Kling", href: "/compare/runway-vs-kling" },
  ];

  return (
    <section id="top" className="relative overflow-hidden border-b border-line bg-ink">
      {/* Cinematic Ambient Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-ink to-ink pointer-events-none" />
      <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-lime/5 blur-3xl pointer-events-none" />

      <div className="shell relative z-10 py-20 sm:py-28 text-center">
        <div className="mx-auto max-w-4xl">
          {/* Eyebrow Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-lime">
              AI Production Intelligence
            </span>
          </div>

          {/* Cinematic Headline */}
          <h1 className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em] text-white leading-[1.08]">
            For people who <br className="hidden sm:inline" />
            <span className="text-zinc-500">make things.</span>
          </h1>

          {/* Value Pitch */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-300">
            Discover tools, build prompts, compare models, and design complete AI production workflows for directors, cinematographers, and visual storytellers.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/tools"
              className="rounded-full bg-lime px-6 py-3 text-sm font-semibold text-black transition hover:bg-white shadow-glow-subtle"
            >
              Explore AI Tools
            </Link>
            <Link
              href="/prompts"
              className="rounded-full border border-line bg-panel px-6 py-3 text-sm font-semibold text-white transition hover:border-zinc-500 hover:bg-panel-hover"
            >
              Build a Prompt
            </Link>
            <Link
              href="/categories/video"
              className="rounded-full border border-lime/30 bg-lime/5 px-6 py-3 text-sm font-semibold text-lime transition hover:bg-lime/20"
            >
              Video AI Hub →
            </Link>
          </div>

          {/* Production Search Input */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-2xl items-center rounded-2xl border border-line bg-panel p-2 shadow-card transition focus-within:border-lime/60 focus-within:shadow-glow-subtle"
          >
            <label className="flex flex-1 items-center gap-3 px-3">
              <span className="font-mono text-base text-lime">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search Creator Platform"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Search tools, prompt recipes, workflows (e.g. 'cinematic commercial', 'Runway', 'Midjourney')..."
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-black transition hover:bg-lime"
            >
              Search
            </button>
          </form>

          {/* "What Are You Making?" Intent Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-mono text-[11px] text-zinc-500 py-1 uppercase tracking-wider">
              Quick Focus:
            </span>
            {productionIntents.map((intent) => (
              <Link
                key={intent.label}
                href={intent.href}
                className="rounded-full border border-line bg-panel/80 px-3 py-1 font-mono text-[11px] text-zinc-300 transition hover:border-lime hover:text-lime"
              >
                {intent.label}
              </Link>
            ))}
          </div>

          {/* Production Credibility Bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-line/60 pt-8 text-left">
            <div>
              <div className="font-mono text-[10px] uppercase text-zinc-500">Domain</div>
              <div className="mt-1 font-bold text-sm text-white">Curated AI Tools</div>
              <div className="text-[11px] text-zinc-400">Zero sponsored clutter</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-zinc-500">Video Engine Hub</div>
              <div className="mt-1 font-bold text-sm text-lime">6 Verified Models</div>
              <div className="text-[11px] text-zinc-400">Physics &amp; camera specs</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-zinc-500">Formula Library</div>
              <div className="mt-1 font-bold text-sm text-white">Cinematic Prompts</div>
              <div className="text-[11px] text-zinc-400">Variable-ready syntax</div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase text-zinc-500">Pipelines</div>
              <div className="mt-1 font-bold text-sm text-white">Director Blueprints</div>
              <div className="text-[11px] text-zinc-400">End-to-end workflows</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
