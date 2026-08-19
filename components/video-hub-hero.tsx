"use client";

import Link from "next/link";

export function VideoHubHero({
  engineCount,
  verifiedDate,
}: {
  engineCount: number;
  verifiedDate: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-line bg-panel/70 py-12 sm:py-20">
      {/* Background Subtle Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none" />
      
      <div className="shell relative z-10">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-6">
          <Link href="/" className="hover:text-lime transition">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-lime transition">Categories</Link>
          <span>/</span>
          <span className="text-white">Video Generation Intelligence</span>
        </div>

        {/* Badge & Meta */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 font-mono text-xs font-semibold text-lime flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
            DIRECTOR&apos;S INTELLIGENCE HUB
          </span>
          <span className="rounded-full border border-line bg-black/50 px-3 py-1 font-mono text-xs text-zinc-300">
            {engineCount} Verified Video Engines
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            Updated: {verifiedDate}
          </span>
        </div>

        {/* Headline & Director Pitch */}
        <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.15]">
          Cinematic AI Video Generation for Directors &amp; Storytellers
        </h1>

        <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed">
          Compare diffusion models, transformer engines, camera coordinate syntax, character persistence, and physics adherence. Choose the exact AI model stack engineered for your shot requirements.
        </p>

        {/* Quick Value Metrics */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-line/60">
          <div>
            <div className="text-xs text-zinc-500 font-mono uppercase">Camera Control</div>
            <div className="mt-1 text-sm sm:text-base font-bold text-white">Directional 6-DOF &amp; Presets</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 font-mono uppercase">Max Resolution</div>
            <div className="mt-1 text-sm sm:text-base font-bold text-lime">1080p (4K Upscaled)</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 font-mono uppercase">Continuity</div>
            <div className="mt-1 text-sm sm:text-base font-bold text-white">I2V Keyframing &amp; Motion</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500 font-mono uppercase">Licensing</div>
            <div className="mt-1 text-sm sm:text-base font-bold text-white">Commercial Rights (Paid)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
