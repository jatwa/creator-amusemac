"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";

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

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 text-center transition-colors">
      <div className="shell relative z-10">
        <div className="mx-auto max-w-3xl">
          {/* Subtle Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
            className="eyebrow mb-6 text-tertiary"
          >
            Creator by Amusemac
          </motion.p>

          {/* Huge Apple-inspired Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tighter text-primary leading-[1.08]"
          >
            AI tools for people <br />
            <span className="text-tertiary">who make things.</span>
          </motion.h1>

          {/* Calm, Confident Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease }}
            className="mx-auto mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-secondary font-normal"
          >
            Production intelligence, verified camera models, prompt architecture, and director workflows for filmmakers and visual storytellers.
          </motion.p>

          {/* Restrained CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4, ease }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Link
                href="/tools"
                className="rounded-full bg-foreground px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-background transition-opacity hover:opacity-90 shadow-sm inline-block"
              >
                Explore Creator
              </Link>
            </motion.div>
            <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.985 }}>
              <Link
                href="/categories/video"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-accent hover:opacity-80 transition-opacity"
              >
                <span>Explore Video AI Hub</span>
                <span>→</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Minimalist Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5, ease }}
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
          </motion.form>

          {/* Quick Focus Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-secondary"
          >
            <span className="text-tertiary">Quick links:</span>
            <Link href="/categories/video" className="hover:text-primary underline-offset-4 hover:underline">Video Hub</Link>
            <span className="text-border">•</span>
            <Link href="/prompts" className="hover:text-primary underline-offset-4 hover:underline">Prompts</Link>
            <span className="text-border">•</span>
            <Link href="/compare/runway-vs-kling" className="hover:text-primary underline-offset-4 hover:underline">Runway vs Kling</Link>
            <span className="text-border">•</span>
            <Link href="/workflows" className="hover:text-primary underline-offset-4 hover:underline">Workflows</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
