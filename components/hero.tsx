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

  return (
    <section id="top" className="relative overflow-hidden border-b border-line">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(217,255,74,.13),transparent_26rem)]" />
      <div className="shell relative grid min-h-[620px] place-items-center py-24 text-center sm:min-h-[680px]">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/80 px-3.5 py-1 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime">The AI creator intelligence platform</p>
          </div>

          <h1 className="mt-6 text-5xl font-semibold tracking-[-0.055em] text-white sm:text-7xl lg:text-8xl">
            Make the work<br />
            <span className="text-zinc-500">only you can make.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            A clear, production-tested platform connecting AI tools, prompt recipes, and end-to-end workflows for filmmakers, editors, designers, and directors.
          </p>

          {/* Functional Search Form */}
          <form onSubmit={handleSearch} className="mx-auto mt-10 flex max-w-xl rounded-2xl border border-zinc-700 bg-panel p-2 shadow-glow">
            <label className="flex flex-1 items-center gap-3 px-3 text-left">
              <span className="text-lime text-lg font-mono">⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search Creator Platform"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                placeholder="Search tools, prompts, workflows (e.g. 'cinematic commercial', 'Runway', 'Midjourney')..."
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-lime"
            >
              Search
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-zinc-500 py-1">Popular:</span>
            <Link href="/search?q=video" className="rounded-md border border-line bg-ink px-2.5 py-1 text-zinc-400 hover:border-lime hover:text-white">
              AI Video
            </Link>
            <Link href="/search?q=commercial" className="rounded-md border border-line bg-ink px-2.5 py-1 text-zinc-400 hover:border-lime hover:text-white">
              Commercial Workflow
            </Link>
            <Link href="/search?q=Runway" className="rounded-md border border-line bg-ink px-2.5 py-1 text-zinc-400 hover:border-lime hover:text-white">
              Runway vs Kling
            </Link>
            <Link href="/search?q=35mm" className="rounded-md border border-line bg-ink px-2.5 py-1 text-zinc-400 hover:border-lime hover:text-white">
              35mm Film Still
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="text-lime">✓</span> Made for visual storytellers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-lime">✓</span> Production-verified benchmarks
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-lime">✓</span> Built to save production time
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
