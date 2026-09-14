"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Clapperboard, Sparkles, ArrowRight, Search, ArrowUpRight, Camera, Sliders } from '@/components/cinematic/icons';

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
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 text-center transition-colors">
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="shell relative z-10">
        <div className="mx-auto max-w-4xl">
          {/* Directorial Slate Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
            className="inline-flex max-w-full items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-white/[0.08] mb-6 sm:mb-8 shadow-sm backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
            <span className="font-mono text-[10px] sm:text-xs text-neutral-300 tracking-wider uppercase font-medium">
              <span className="sm:hidden">Filmmaker Intelligence OS</span>
              <span className="hidden sm:inline">The Intelligence Layer for Modern Filmmakers</span>
            </span>
            <span className="text-neutral-600 font-mono text-xs">|</span>
            <span className="font-mono text-[10px] sm:text-[11px] text-amber-400/90">24.000 FPS</span>
          </motion.div>

          {/* Huge Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="text-3xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight font-sans"
          >
            DIRECT BETTER. <br />
            <span className="font-serif italic font-normal text-amber-200 text-[26px] xs:text-3xl sm:text-6xl lg:text-7xl">
              CREATE CINEMATICALLY.
            </span>{" "}
            <br className="sm:hidden" />
            <span className="text-neutral-400 font-sans font-semibold text-[26px] xs:text-3xl sm:text-6xl lg:text-7xl">WITH AI.</span>
          </motion.h1>

          {/* Directorial Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease }}
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-300 font-normal"
          >
            Professional cinematography intelligence, director recipes, camera optics, AI video workflows, and production intelligence — built for directors, cinematographers, and visual storytellers.
          </motion.p>

          {/* Action Hub */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4, ease }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/prompts/factory"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 px-7 py-3.5 text-xs sm:text-sm font-bold text-neutral-950 transition-all duration-200 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.4)] group"
              >
                <Clapperboard className="w-4 h-4 text-neutral-950" />
                <span>ENTER DIRECTOR&apos;S STUDIO</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/toolkit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 hover:border-amber-400/40 bg-white/[0.03] hover:bg-white/[0.06] px-6 py-3.5 text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white transition-all duration-200"
              >
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>PRODUCTION TOOLKIT</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Minimalist Cinematography Search */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.5, ease }}
            onSubmit={handleSearch}
            className="mx-auto mt-12 flex w-full max-w-xl items-center rounded-2xl border border-white/[0.09] bg-neutral-950/80 px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition focus-within:border-amber-400/50 focus-within:shadow-[0_0_25px_rgba(245,158,11,0.12)] backdrop-blur-md"
          >
            <Search className="h-4 w-4 shrink-0 text-neutral-400 mr-3" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search Creator Platform"
              className="w-full min-w-0 bg-transparent text-xs sm:text-sm text-white outline-none placeholder:text-neutral-500 font-sans"
              placeholder="Search recipes, lenses, rigs, lighting ratios, films, models..."
            />
            <button
              type="submit"
              className="shrink-0 text-xs font-mono font-semibold text-neutral-400 hover:text-amber-400 transition-colors px-2 py-1 uppercase"
            >
              SEARCH [↵]
            </button>
          </motion.form>

          {/* Live Telemetry Sensor Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-neutral-500"
          >
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-neutral-400">
              RATIO: 2.39:1 SCOPE
            </span>
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-neutral-400">
              OPTICS: 35MM T1.4
            </span>
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-neutral-400">
              SHUTTER: 180°
            </span>
            <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-neutral-400">
              COLOR: KODAK 5219
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300">
              MODELS: 8 ENGINES
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
