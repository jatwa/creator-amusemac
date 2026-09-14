'use client'

import React from 'react'
import Link from 'next/link'
import { Clapperboard, Sparkles, ArrowRight, ShieldCheck, Film, Terminal, ArrowUpRight } from '@/components/cinematic/icons'

export function FinalFrame() {
  return (
    <section className="relative w-full py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08] overflow-hidden">
      {/* Background Scope Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

      {/* 2.39:1 Frame Box Container */}
      <div className="relative bg-neutral-950/90 border border-white/[0.12] rounded-3xl p-8 sm:p-14 text-center backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Top Reticle Header */}
        <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500 pb-6 mb-8 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-semibold tracking-wider">STANDBY • READY FOR TAKE</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-neutral-400">
            <span>24.000 FPS</span>
            <span>•</span>
            <span>2.39:1 SCOPE</span>
            <span>•</span>
            <span>DCI 4K RAW</span>
          </div>
          <span className="text-amber-400/90 font-mono">CREATOR INTEL OS</span>
        </div>

        {/* Core Directorial Callout */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Intelligence Layer for Modern Filmmakers</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-sans">
            YOU HAVE THE IDEA. <br />
            <span className="font-serif italic font-normal text-amber-200">NOW DIRECT IT.</span>
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Stop gambling with generic AI prompts. Calibrate your optics, craft director recipes, and command modern video engines with true cinematographic authority.
          </p>

          {/* Action Hub */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/prompts/factory"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm tracking-wide transition-all duration-200 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] group"
            >
              <Clapperboard className="w-4 h-4 text-neutral-950" />
              <span>ENTER DIRECTOR&apos;S STUDIO</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/toolkit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/15 hover:border-amber-400/50 bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white font-semibold text-sm transition-all duration-200"
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>EXPLORE PRODUCTION TOOLKIT</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
            </Link>
          </div>

          {/* Quick Sub-navigation */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-neutral-500">
            <Link href="/prompts" className="hover:text-amber-400 transition-colors">
              Prompt Recipes
            </Link>
            <span>•</span>
            <Link href="/tools" className="hover:text-amber-400 transition-colors">
              Cinematic Tools
            </Link>
            <span>•</span>
            <Link href="/pricing" className="hover:text-amber-400 transition-colors">
              Studio Pro Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
