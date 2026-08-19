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
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 text-center transition-colors">
      <div className="shell relative z-10">
        <div className="mx-auto max-w-3xl">
          {/* Subtle Eyebrow */}
          <p className="eyebrow mb-6 text-tertiary">
            Creator by Amusemac
          </p>

          {/* Huge Apple-inspired Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-primary leading-[1.08]">
            AI tools for people <br />
            <span className="text-tertiary">who make things.</span>
          </h1>

          {/* Calm, Confident Subheadline */}
          <p className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-secondary font-normal">
            Production intelligence, verified camera models, prompt architecture, and director workflows for filmmakers and visual storytellers.
          </p>

          {/* Restrained CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tools"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 shadow-sm"
            >
              Explore Creator
            </Link>
            <Link
              href="/categories/video"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
            >
              <span>Explore Video AI Hub</span>
              <span>→</span>
            </Link>
          </div>

          {/* Minimalist Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-12 flex w-full max-w-xl items-center rounded-full border border-border bg-surface px-4 py-2.5 shadow-subtle transition focus-within:border-accent/40 focus-within:shadow-card"
          >
            <svg
              className="h-4 w-4 shrink-0 text-secondary mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search Creator Platform"
              className="w-full min-w-0 bg-transparent text-sm text-primary outline-none placeholder:text-tertiary"
              placeholder="Search tools, prompt recipes, workflows..."
            />
            <button
              type="submit"
              className="shrink-0 text-xs font-medium text-secondary hover:text-primary transition-colors px-2 py-1"
            >
              Search
            </button>
          </form>

          {/* Quick Focus Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-secondary">
            <span className="text-tertiary">Quick links:</span>
            <Link href="/categories/video" className="hover:text-primary underline-offset-4 hover:underline">Video Hub</Link>
            <span className="text-border">•</span>
            <Link href="/prompts" className="hover:text-primary underline-offset-4 hover:underline">Prompts</Link>
            <span className="text-border">•</span>
            <Link href="/compare/runway-vs-kling" className="hover:text-primary underline-offset-4 hover:underline">Runway vs Kling</Link>
            <span className="text-border">•</span>
            <Link href="/workflows" className="hover:text-primary underline-offset-4 hover:underline">Workflows</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
