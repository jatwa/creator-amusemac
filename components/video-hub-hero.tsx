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
    <div className="relative overflow-hidden border-b border-line bg-gradient-to-b from-panel/90 via-ink to-ink py-12 sm:py-20">
      {/* Background Subtle Atmosphere */}
      <div className="absolute top-0 right-1/3 h-80 w-80 rounded-full bg-lime/5 blur-3xl pointer-events-none" />

      <div className="shell relative z-10">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 mb-6">
          <Link href="/" className="hover:text-lime transition">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-lime transition">Categories</Link>
          <span>/</span>
          <span className="text-zinc-300">Video Generation Intelligence</span>
        </div>

        {/* Badge & Meta */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 font-mono text-xs font-semibold text-lime flex items-center gap-1.5 shadow-glow-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
            DIRECTOR&apos;S INTELLIGENCE HUB
          </span>
          <span className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-xs text-zinc-300">
            {engineCount} Verified Video Engines
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            Audited: {verifiedDate}
          </span>
        </div>

        {/* Headline & Director Pitch */}
        <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl leading-[1.12]">
          Cinematic AI Video Generation for Directors &amp; Storytellers
        </h1>

        <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-3xl leading-relaxed font-medium">
          Compare diffusion models, transformer engines, camera coordinate syntax, character persistence, and physics adherence. Choose the exact AI model stack engineered for your shot requirements.
        </p>

        {/* Quick Value Metrics */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-line/60">
          <div className="surface p-4 bg-ink/70">
            <div className="text-[11px] text-zinc-500 font-mono uppercase">Camera Control</div>
            <div className="mt-1 text-sm sm:text-base font-bold text-white">Directional 6-DOF &amp; Presets</div>
          </div>
          <div className="surface p-4 bg-ink/70">
            <div className="text-[11px] text-zinc-500 font-mono uppercase">Max Resolution</div>
            <div className="mt-1 text-sm sm:text-base font-bold text-lime">1080p (4K Upscaled)</div>
          </div>
          <div className="surface p-4 bg-ink/70">
            <div className="text-[11px] text-zinc-500 font-mono uppercase">Continuity</div>
            <div className="mt-1 text-sm sm:text-base font-bold text-white">I2V Keyframing &amp; Motion</div>
          </div>
          <div className="surface p-4 bg-ink/70">
            <div className="text-[11px] text-zinc-500 font-mono uppercase">Licensing</div>
            <div className="mt-1 text-sm sm:text-base font-bold text-white">Commercial Rights (Paid)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
