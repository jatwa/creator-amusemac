"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CreatorVerdict } from "@/data/types";

interface CreatorVerdictCardProps {
  verdict: CreatorVerdict;
  toolName: string;
}

export function CreatorVerdictCard({ verdict, toolName }: CreatorVerdictCardProps) {
  return (
    <div className="surface p-6 sm:p-8 rounded-2xl border border-accent/20 bg-surface-elevated shadow-subtle relative overflow-hidden transition-colors">
      {/* Editorial Watermark */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-accent">
            Creator&apos;s Signature Verdict
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-mono font-semibold text-accent">
          <span>★</span>
          <span>{verdict.rating.toFixed(1)}</span>
          <span className="text-[10px] text-tertiary font-normal">/ 5.0</span>
        </div>
      </div>

      {/* Best For Tagline */}
      <div className="mt-5">
        <span className="text-[10px] uppercase font-mono tracking-widest text-tertiary block">
          Best For
        </span>
        <h3 className="mt-1 text-base sm:text-lg font-semibold text-primary leading-snug">
          {verdict.bestFor}
        </h3>
      </div>

      {/* Editorial Quote */}
      <p className="mt-3.5 text-xs sm:text-sm text-secondary leading-relaxed italic border-l-2 border-accent/40 pl-3.5">
        &quot;{verdict.editorialQuote}&quot;
      </p>

      {/* Decision Matrix Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Use When */}
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="flex items-center gap-1.5 font-medium text-primary mb-1.5">
            <span className="text-accent font-bold">✓</span>
            <span className="uppercase text-[10px] font-mono tracking-wider text-accent">
              Use It When
            </span>
          </div>
          <p className="text-secondary leading-relaxed">{verdict.useWhen}</p>
        </div>

        {/* Avoid When */}
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="flex items-center gap-1.5 font-medium text-primary mb-1.5">
            <span className="text-tertiary font-bold">✗</span>
            <span className="uppercase text-[10px] font-mono tracking-wider text-tertiary">
              Avoid It When
            </span>
          </div>
          <p className="text-secondary leading-relaxed">{verdict.avoidWhen}</p>
        </div>
      </div>

      {/* Primary Alternative Link */}
      <div className="mt-6 pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-tertiary font-mono text-[11px]">Primary Alternative:</span>
          <Link
            href={`/tools/${verdict.primaryAlternative.slug}`}
            className="font-medium text-primary hover:text-accent underline underline-offset-4 transition-colors"
          >
            {verdict.primaryAlternative.name}
          </Link>
        </div>
        <span className="text-tertiary text-[11px] font-mono">
          {verdict.primaryAlternative.reason}
        </span>
      </div>
    </div>
  );
}
