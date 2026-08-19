"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function VideoHubHero({
  engineCount,
  verifiedDate,
}: {
  engineCount: number;
  verifiedDate: string;
}) {
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="relative overflow-hidden border-b border-border-subtle bg-surface/30 py-16 sm:py-24 transition-colors">
      <div className="shell relative z-10">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
          className="flex flex-wrap items-center gap-2 text-xs font-mono text-tertiary mb-6"
        >
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-secondary">Video Generation Intelligence</span>
        </motion.div>

        {/* Badge & Meta */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease }}
          className="flex flex-wrap items-center gap-3"
        >
          <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
            Flagship Intelligence Hub
          </span>
          <span className="text-xs text-tertiary font-mono">
            {engineCount} Verified Engines • Audited {verifiedDate}
          </span>
        </motion.div>

        {/* Headline & Director Pitch */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease }}
          className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-primary max-w-4xl leading-[1.12]"
        >
          Cinematic AI Video Generation for Directors &amp; Storytellers
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15, ease }}
          className="mt-4 text-base sm:text-lg text-secondary max-w-3xl leading-relaxed font-normal"
        >
          Compare diffusion models, transformer engines, camera coordinate syntax, character persistence, and physics adherence. Choose the exact AI model stack engineered for your shot requirements.
        </motion.p>

        {/* Quick Value Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-8 border-t border-border-subtle"
        >
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
        </motion.div>
      </div>
    </div>
  );
}
