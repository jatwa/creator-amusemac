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
    <div className="relative overflow-hidden border-b border-border-subtle bg-surface/30 py-16 sm:py-24 transition-colors">
      <div className="shell relative z-10">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-tertiary mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-secondary">Video Generation Intelligence</span>
        </div>

        {/* Badge & Meta */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
            Flagship Intelligence Hub
          </span>
          <span className="text-xs text-tertiary font-mono">
            {engineCount} Verified Engines • Audited {verifiedDate}
          </span>
        </div>

        {/* Headline & Director Pitch */}
        <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-primary max-w-4xl leading-[1.12]">
          Cinematic AI Video Generation for Directors &amp; Storytellers
        </h1>

        <p className="mt-4 text-base sm:text-lg text-secondary max-w-3xl leading-relaxed font-normal">
          Compare diffusion models, transformer engines, camera coordinate syntax, character persistence, and physics adherence. Choose the exact AI model stack engineered for your shot requirements.
        </p>

        {/* Quick Value Metrics */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-8 border-t border-border-subtle">
          <div className="surface p-4 bg-surface-elevated">
            <div className="text-[11px] text-tertiary font-mono uppercase">Camera Control</div>
            <div className="mt-1 text-sm sm:text-base font-semibold text-primary">Directional 6-DOF &amp; Presets</div>
          </div>
          <div className="surface p-4 bg-surface-elevated">
            <div className="text-[11px] text-tertiary font-mono uppercase">Max Resolution</div>
            <div className="mt-1 text-sm sm:text-base font-semibold text-accent">1080p (4K Upscaled)</div>
          </div>
          <div className="surface p-4 bg-surface-elevated">
            <div className="text-[11px] text-tertiary font-mono uppercase">Continuity</div>
            <div className="mt-1 text-sm sm:text-base font-semibold text-primary">I2V Keyframing &amp; Motion</div>
          </div>
          <div className="surface p-4 bg-surface-elevated">
            <div className="text-[11px] text-tertiary font-mono uppercase">Licensing</div>
            <div className="mt-1 text-sm sm:text-base font-semibold text-primary">Commercial Rights (Paid)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
