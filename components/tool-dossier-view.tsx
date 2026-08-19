"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  DetailedToolDossier,
  Tool,
  Prompt,
  ToolComparison,
  Workflow,
  Tutorial,
  BlogPost,
  VideoItem,
  RoleMode,
} from "@/data/types";
import { CreatorVerdictCard } from "./creator-verdict-card";
import { RoleModeSelector, ROLE_CONFIGS } from "./role-mode-selector";
import { PromptAnatomyCard } from "./prompt-anatomy-card";
import { StickyToc } from "./sticky-toc";

interface ToolDossierViewProps {
  tool: Tool;
  dossier: DetailedToolDossier;
  competitors: (Tool | undefined)[];
  comparisons: ToolComparison[];
  recommendedPrompts: Prompt[];
  linkedTutorials: Tutorial[];
  linkedWorkflows: Workflow[];
  relatedBlogs: BlogPost[];
  relatedVideos: VideoItem[];
}

export function ToolDossierView({
  tool,
  dossier,
  competitors,
  comparisons,
  recommendedPrompts,
  linkedTutorials,
  linkedWorkflows,
  relatedBlogs,
  relatedVideos,
}: ToolDossierViewProps) {
  const [activeRole, setActiveRole] = useState<RoleMode>("director");
  const [usageLevel, setUsageLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  const tocItems = [
    { id: "verdict", label: "Creator's Verdict" },
    { id: "quick-facts", label: "Quick Facts" },
    { id: "pros-cons", label: "Pros & Cons" },
    { id: "why-creators-use-it", label: "Why Creators Use It" },
    { id: "filmmaker-take", label: "Filmmaker's Take" },
    { id: "capabilities", label: "Capabilities Breakdown" },
    { id: "shot-breakdown", label: "Shot-by-Shot Recipes" },
    { id: "production-pipeline", label: "Production Pipeline" },
    { id: "how-to-use", label: "How to Use It" },
    { id: "prompt-anatomy", label: "Prompt Anatomy" },
    { id: "common-mistakes", label: "Common Mistakes" },
    { id: "scorecard", label: "Creator Scorecard" },
    { id: "pricing", label: "Pricing & Rights" },
    { id: "alternatives", label: "Alternatives & Matrix" },
    { id: "source-ledger", label: "Source Ledger" },
  ];

  return (
    <div className="shell py-12">
      {/* Role Mode Selector Banner */}
      <div className="surface p-6 mb-10 border-border bg-surface shadow-subtle rounded-2xl">
        <RoleModeSelector
          currentRole={activeRole}
          onRoleChange={setActiveRole}
        />
        {dossier.rolePerspectives && dossier.rolePerspectives[activeRole] && (
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 text-xs text-primary leading-relaxed"
          >
            <span className="font-mono uppercase font-semibold text-accent text-[10px] block mb-1">
              {ROLE_CONFIGS[activeRole].label} Perspective on {tool.name}:
            </span>
            {dossier.rolePerspectives[activeRole]}
          </motion.div>
        )}
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Main Content Column */}
        <div className="lg:col-span-9 space-y-12">
          {/* LEVEL 1: SIGNATURE CREATOR VERDICT */}
          <section id="verdict">
            <CreatorVerdictCard
              verdict={dossier.creatorVerdict}
              toolName={dossier.name}
            />
          </section>

          {/* LEVEL 2: QUICK FACTS */}
          <section id="quick-facts" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="text-lg font-semibold text-primary">Quick Facts &amp; Verification</h2>
              <span className="text-[11px] font-mono text-tertiary">
                Verified {dossier.quickFacts.lastVerified}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5">
                <span className="text-tertiary font-mono text-[10px] uppercase block">Developer</span>
                <p className="font-semibold text-primary mt-1">{dossier.quickFacts.developer}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5">
                <span className="text-tertiary font-mono text-[10px] uppercase block">Verified Model</span>
                <p className="font-semibold text-accent mt-1">{dossier.quickFacts.verifiedModel}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5">
                <span className="text-tertiary font-mono text-[10px] uppercase block">Pricing Tier</span>
                <p className="font-semibold text-primary mt-1">{dossier.quickFacts.pricingSummary}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5">
                <span className="text-tertiary font-mono text-[10px] uppercase block">Commercial Terms</span>
                <p className="font-semibold text-primary mt-1">{dossier.quickFacts.commercialTerms}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5">
                <span className="text-tertiary font-mono text-[10px] uppercase block">API Support</span>
                <p className="font-semibold text-primary mt-1">{dossier.quickFacts.apiSupport}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5">
                <span className="text-tertiary font-mono text-[10px] uppercase block">Free Tier Status</span>
                <p className="font-semibold text-primary mt-1">{dossier.quickFacts.freeTierStatus}</p>
              </div>
            </div>
          </section>

          {/* LEVEL 3: PROS & CONS */}
          <section id="pros-cons" className="grid gap-6 sm:grid-cols-2">
            <div className="surface p-6 rounded-2xl border border-border bg-surface-elevated space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                  Verified Strengths (Pros)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-secondary">
                {dossier.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-accent font-bold text-xs mt-0.5">✓</span>
                    <span className="leading-relaxed">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface p-6 rounded-2xl border border-border bg-surface-elevated space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tertiary" />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-tertiary">
                  Production Trade-offs (Cons)
                </h3>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-secondary">
                {dossier.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="text-tertiary font-bold text-xs mt-0.5">✗</span>
                    <span className="leading-relaxed">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* LEVEL 4: WHY CREATORS USE IT & FILMMAKER'S TAKE */}
          <section id="why-creators-use-it" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-primary">Why Creators Use It</h2>
            <p className="text-sm sm:text-base leading-relaxed text-secondary font-normal">
              {dossier.whyCreatorsUseIt}
            </p>
          </section>

          <section id="filmmaker-take" className="surface p-6 sm:p-8 rounded-2xl border border-accent/20 bg-accent/5 space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <span className="text-lg">🎬</span>
              <h2 className="text-base sm:text-lg font-semibold">The Filmmaker&apos;s Take: What This Means on Set</h2>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-primary font-normal">
              {dossier.filmmakerTake}
            </p>
          </section>

          {/* LEVEL 5: WHAT IT ACTUALLY DOES (CATEGORIZED) */}
          <section id="capabilities" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                Functional Taxonomy
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mt-1">
                What {tool.name} Actually Does
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                  1. Generation
                </span>
                <ul className="space-y-1.5 text-xs text-secondary">
                  {dossier.functionalBreakdown.generation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                  2. Transformation &amp; Editing
                </span>
                <ul className="space-y-1.5 text-xs text-secondary">
                  {dossier.functionalBreakdown.transformation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                  3. Character Performance
                </span>
                <ul className="space-y-1.5 text-xs text-secondary">
                  {dossier.functionalBreakdown.performance.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">
                  4. Camera &amp; Optics
                </span>
                <ul className="space-y-1.5 text-xs text-secondary">
                  {dossier.functionalBreakdown.camera.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* LEVEL 6: SHOT-BY-SHOT BREAKDOWN */}
          <section id="shot-breakdown" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                Director&apos;s Field Guide
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mt-1">
                Shot-by-Shot Production Breakdown
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Exact prompt strategies, expected results, and common failure modes by shot type.
              </p>
            </div>

            <div className="space-y-4">
              {dossier.shotByShotBreakdown.map((shot, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
                    <h3 className="text-sm font-semibold text-primary">{shot.shotType}</h3>
                    <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-accent">
                      {shot.recommendedModel}
                    </span>
                  </div>

                  <div className="text-xs text-secondary space-y-2">
                    <p>
                      <strong className="text-primary font-medium">Why This Model: </strong>
                      {shot.why}
                    </p>
                    <div className="rounded-lg border border-border bg-surface p-3 font-mono text-xs text-primary select-all">
                      {shot.promptStrategy}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="rounded border border-border-subtle bg-surface p-2.5 text-secondary">
                        <span className="text-accent font-semibold text-[10px] uppercase font-mono block">
                          Expected Result:
                        </span>
                        {shot.expectedResult}
                      </div>
                      <div className="rounded border border-border-subtle bg-surface p-2.5 text-secondary">
                        <span className="text-tertiary font-semibold text-[10px] uppercase font-mono block">
                          Common Failure Warning:
                        </span>
                        {shot.commonFailure}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 7: REAL PRODUCTION WORKFLOW */}
          <section id="production-pipeline" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                Pipeline Blueprint
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mt-1">
                Real-World Production Workflow
              </h2>
            </div>

            <div className="space-y-3">
              {dossier.productionPipeline.map((stage) => (
                <div
                  key={stage.stageNumber}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-xs font-bold text-accent">
                      0{stage.stageNumber}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-primary">{stage.stageName}</h4>
                      <p className="text-xs text-secondary mt-0.5">{stage.action}</p>
                      <span className="text-[11px] text-tertiary font-mono mt-1 block">
                        Artifact: {stage.outputArtifact}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="rounded bg-surface px-2 py-1 font-mono text-[10px] text-secondary border border-border">
                      {stage.featureUsed}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 8: HOW TO USE IT (3-TIER GUIDES) */}
          <section id="how-to-use" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                  Instructional Roadmap
                </span>
                <h2 className="text-lg sm:text-xl font-semibold text-primary mt-1">
                  How to Use {tool.name}
                </h2>
              </div>

              {/* Tier Toggle */}
              <div className="flex rounded-full border border-border bg-surface-elevated p-1 text-xs">
                {(["beginner", "intermediate", "advanced"] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setUsageLevel(tier)}
                    className={`rounded-full px-3 py-1 capitalize transition ${
                      usageLevel === tier
                        ? "bg-foreground text-background font-medium shadow-sm"
                        : "text-secondary hover:text-primary"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {dossier.usageGuide[usageLevel].map((step, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs sm:text-sm text-secondary leading-relaxed flex items-start gap-3"
                >
                  <span className="text-accent font-mono font-bold text-xs">→</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 9: PROMPT ANATOMY & RECIPES */}
          <section id="prompt-anatomy" className="space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                Recipe Library
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mt-1">
                Deconstructed Production Prompt Anatomy
              </h2>
              <p className="text-xs text-secondary mt-0.5">
                Tokenized prompt recipes engineered specifically for {tool.name}&apos;s latent diffusion space.
              </p>
            </div>

            <div className="space-y-5">
              {dossier.promptExamples.map((example, i) => (
                <PromptAnatomyCard key={i} example={example} />
              ))}
            </div>
          </section>

          {/* LEVEL 10: COMMON MISTAKES */}
          <section id="common-mistakes" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-tertiary font-semibold">
                Production Pitfalls
              </span>
              <h2 className="text-lg sm:text-xl font-semibold text-primary mt-1">
                Common Mistakes &amp; How to Fix Them
              </h2>
            </div>

            <div className="space-y-4">
              {dossier.commonMistakes.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-2 text-xs"
                >
                  <p className="font-semibold text-primary text-sm flex items-center gap-2">
                    <span className="text-tertiary font-bold">✗ Mistake:</span>
                    <span>{item.mistake}</span>
                  </p>
                  <p className="text-secondary">
                    <strong className="text-tertiary font-medium">Impact: </strong>
                    {item.impact}
                  </p>
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-3 text-primary mt-2">
                    <strong className="text-accent font-medium">✓ Solution: </strong>
                    {item.fix}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 11: CREATOR SCORECARD */}
          <section id="scorecard" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                  Editorial Assessment
                </span>
                <h2 className="text-lg sm:text-xl font-semibold text-primary mt-1">
                  Creator Production Scorecard
                </h2>
              </div>
              <span className="text-[11px] font-mono text-tertiary">
                1.0 - 5.0 Scale
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              {Object.entries(dossier.creatorScorecard).map(([key, val]) => (
                <div
                  key={key}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
                >
                  <span className="text-tertiary font-mono text-[10px] uppercase block capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-lg font-bold text-primary font-mono">{val.toFixed(1)}</span>
                    <span className="text-[10px] text-accent font-mono">
                      {val >= 4.7 ? "Excellent" : val >= 4.4 ? "Strong" : "Average"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 12: TRANSPARENT PRICING TIERS */}
          <section id="pricing" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                  Commercial Pricing
                </span>
                <h2 className="text-lg sm:text-xl font-semibold text-primary mt-1">
                  Transparent Pricing &amp; Licensing
                </h2>
              </div>
              <span className="text-[11px] font-mono text-tertiary">
                Audited {dossier.quickFacts.lastVerified}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dossier.pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-primary">{tier.name}</h3>
                    <p className="mt-2 text-2xl font-bold text-primary font-mono">{tier.price}</p>
                    <p className="mt-2 text-xs text-secondary">{tier.creditsOrLimits}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle text-[11px] text-tertiary space-y-1">
                    <div>Commercial Rights: <strong className="text-primary">{tier.commercialRights ? "Yes" : "No"}</strong></div>
                    <div>Watermark: <strong className="text-primary">{tier.watermark ? "Yes" : "None"}</strong></div>
                    <p className="text-[10px] pt-1">{tier.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 13: ALTERNATIVES & COMPARISONS */}
          <section id="alternatives" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <h2 className="text-lg sm:text-xl font-semibold text-primary">
              Alternatives &amp; Comparison Scenarios
            </h2>

            <div className="divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface-elevated overflow-hidden text-xs">
              {dossier.alternativesMatrix.map((alt, i) => (
                <div
                  key={i}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase text-tertiary">
                      If You Need:
                    </span>
                    <p className="font-semibold text-primary mt-0.5">{alt.need}</p>
                    <p className="text-secondary mt-0.5">{alt.why}</p>
                  </div>
                  <Link
                    href={`/tools/${alt.slug}`}
                    className="rounded-full border border-border bg-surface px-4 py-1.5 font-medium text-accent hover:opacity-80 transition shrink-0"
                  >
                    Switch to {alt.useTool} →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 14: TRACEABLE SOURCE LEDGER */}
          <section id="source-ledger" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-tertiary">
                Traceable Source Ledger
              </span>
              <span className="text-[11px] font-mono text-accent">
                Verification Confidence: High
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {dossier.sourceLedger.map((src, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border-subtle bg-surface-elevated p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
                >
                  <div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:text-accent underline transition"
                    >
                      {src.title} ↗
                    </a>
                    <span className="text-tertiary text-[11px] block font-mono">
                      Last Verified: {src.lastVerified}
                    </span>
                  </div>
                  <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent">
                    {src.verificationConfidence}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Sticky TOC & Quick Actions */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="surface p-6 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
              <a
                href={tool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-full bg-foreground px-5 py-2.5 text-xs font-medium text-background hover:opacity-90 transition text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Launch {tool.name}</span>
                <span>↗</span>
              </a>
              <Link
                href="/compare"
                className="w-full rounded-full border border-border bg-surface-elevated px-5 py-2.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition text-center block"
              >
                Compare Alternatives
              </Link>
            </div>

            <div className="surface p-6 rounded-2xl border border-border bg-surface shadow-subtle">
              <StickyToc items={tocItems} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
