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
import { Technique, Film, ResearchRecord } from "@/data/film-intelligence-types";
import { CreatorVerdictCard } from "./creator-verdict-card";
import { RoleModeSelector, ROLE_CONFIGS } from "./role-mode-selector";
import { PromptAnatomyCard } from "./prompt-anatomy-card";
import { StickyToc } from "./sticky-toc";
import { AdSlot } from "./ad-slot";

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
  supportedTechniques?: Technique[];
  relatedFilms?: Film[];
  relatedResearch?: ResearchRecord[];
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
  supportedTechniques = [],
  relatedFilms = [],
  relatedResearch = [],
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
    { id: "cinema-intelligence", label: "Cinema Intelligence" },
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
            className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4 sm:p-5 text-sm sm:text-base text-primary leading-relaxed font-sans"
          >
            <span className="font-sans uppercase font-bold text-accent text-xs block mb-1.5 tracking-wider">
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
          <section id="quick-facts" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Quick Facts &amp; Verification</h2>
              <span className="text-xs font-mono text-tertiary">
                Verified {dossier.quickFacts.lastVerified}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                <span className="text-tertiary font-sans text-xs uppercase tracking-wider block">Developer</span>
                <p className="font-bold text-primary mt-1 text-sm sm:text-base">{dossier.quickFacts.developer}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                <span className="text-tertiary font-sans text-xs uppercase tracking-wider block">Verified Model</span>
                <p className="font-bold text-accent mt-1 text-sm sm:text-base">{dossier.quickFacts.verifiedModel}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                <span className="text-tertiary font-sans text-xs uppercase tracking-wider block">Pricing Tier</span>
                <p className="font-bold text-primary mt-1 text-sm sm:text-base">{dossier.quickFacts.pricingSummary}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                <span className="text-tertiary font-sans text-xs uppercase tracking-wider block">Commercial Terms</span>
                <p className="font-bold text-primary mt-1 text-sm sm:text-base">{dossier.quickFacts.commercialTerms}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                <span className="text-tertiary font-sans text-xs uppercase tracking-wider block">API Support</span>
                <p className="font-bold text-primary mt-1 text-sm sm:text-base">{dossier.quickFacts.apiSupport}</p>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                <span className="text-tertiary font-sans text-xs uppercase tracking-wider block">Free Tier Status</span>
                <p className="font-bold text-primary mt-1 text-sm sm:text-base">{dossier.quickFacts.freeTierStatus}</p>
              </div>
            </div>
          </section>

          {/* LEVEL 3: PROS & CONS */}
          <section id="pros-cons" className="grid gap-6 sm:grid-cols-2">
            <div className="surface p-6 sm:p-7 rounded-2xl border border-border bg-surface-elevated space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-accent">
                  Verified Strengths (Pros)
                </h3>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-secondary font-sans">
                {dossier.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-accent font-bold text-sm mt-0.5">✓</span>
                    <span className="leading-relaxed">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface p-6 sm:p-7 rounded-2xl border border-border bg-surface-elevated space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-tertiary" />
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-tertiary">
                  Production Trade-offs (Cons)
                </h3>
              </div>
              <ul className="space-y-3 text-sm sm:text-base text-secondary font-sans">
                {dossier.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-tertiary font-bold text-sm mt-0.5">✗</span>
                    <span className="leading-relaxed">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* LEVEL 4: WHY CREATORS USE IT & FILMMAKER'S TAKE */}
          <section id="why-creators-use-it" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary">Why Creators Use It</h2>
            <p className="text-base sm:text-lg leading-relaxed text-secondary font-normal font-sans">
              {dossier.whyCreatorsUseIt}
            </p>
          </section>

          <section id="filmmaker-take" className="surface p-6 sm:p-8 rounded-2xl border border-accent/20 bg-accent/5 space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <span className="text-xl">🎬</span>
              <h2 className="text-lg sm:text-xl font-serif font-bold">The Filmmaker&apos;s Take: What This Means on Set</h2>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-primary font-normal font-sans">
              {dossier.filmmakerTake}
            </p>
          </section>

          {/* LEVEL 5: WHAT IT ACTUALLY DOES (CATEGORIZED) */}
          <section id="capabilities" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">
                Functional Taxonomy
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-1">
                What {tool.name} Actually Does
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-3">
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-bold">
                  1. Generation
                </span>
                <ul className="space-y-2 text-sm text-secondary font-sans">
                  {dossier.functionalBreakdown.generation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-3">
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-bold">
                  2. Transformation &amp; Editing
                </span>
                <ul className="space-y-2 text-sm text-secondary font-sans">
                  {dossier.functionalBreakdown.transformation.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-3">
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-bold">
                  3. Character Performance
                </span>
                <ul className="space-y-2 text-sm text-secondary font-sans">
                  {dossier.functionalBreakdown.performance.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-3">
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-bold">
                  4. Camera &amp; Optics
                </span>
                <ul className="space-y-2 text-sm text-secondary font-sans">
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
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">
                Director&apos;s Field Guide
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-1">
                Shot-by-Shot Production Breakdown
              </h2>
              <p className="text-sm sm:text-base text-secondary mt-1 font-sans">
                Exact prompt strategies, expected results, and common failure modes by shot type.
              </p>
            </div>

            <div className="space-y-4">
              {dossier.shotByShotBreakdown.map((shot, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <h3 className="text-base sm:text-lg font-bold text-primary font-sans">{shot.shotType}</h3>
                    <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-mono font-medium text-accent">
                      {shot.recommendedModel}
                    </span>
                  </div>

                  <div className="text-sm text-secondary space-y-3 font-sans">
                    <p>
                      <strong className="text-primary font-semibold">Why This Model: </strong>
                      {shot.why}
                    </p>
                    <div className="rounded-lg border border-border bg-surface p-3.5 font-mono text-xs sm:text-sm text-primary select-all leading-relaxed">
                      {shot.promptStrategy}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs sm:text-sm">
                      <div className="rounded-lg border border-border-subtle bg-surface p-3 text-secondary">
                        <span className="text-accent font-bold text-xs uppercase tracking-wider block mb-1">
                          Expected Result:
                        </span>
                        {shot.expectedResult}
                      </div>
                      <div className="rounded-lg border border-border-subtle bg-surface p-3 text-secondary">
                        <span className="text-tertiary font-bold text-xs uppercase tracking-wider block mb-1">
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
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">
                Pipeline Blueprint
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-1">
                Real-World Production Workflow
              </h2>
            </div>

            <div className="space-y-3">
              {dossier.productionPipeline.map((stage) => (
                <div
                  key={stage.stageNumber}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-mono text-sm font-bold text-accent">
                      0{stage.stageNumber}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-primary font-sans">{stage.stageName}</h4>
                      <p className="text-sm text-secondary mt-0.5 font-sans">{stage.action}</p>
                      <span className="text-xs text-tertiary font-sans mt-1 block">
                        Artifact: {stage.outputArtifact}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="rounded-md bg-surface px-2.5 py-1 text-xs font-sans text-secondary border border-border font-medium">
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
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">
                  Instructional Roadmap
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-1">
                  How to Use {tool.name}
                </h2>
              </div>

              {/* Tier Toggle */}
              <div className="flex rounded-full border border-border bg-surface-elevated p-1 text-xs">
                {(["beginner", "intermediate", "advanced"] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setUsageLevel(tier)}
                    className={`rounded-full px-3.5 py-1.5 capitalize transition text-xs font-medium font-sans ${
                      usageLevel === tier
                        ? "bg-foreground text-background font-semibold shadow-sm"
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
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-4 sm:p-5 text-sm sm:text-base text-secondary leading-relaxed flex items-start gap-3.5 font-sans"
                >
                  <span className="text-accent font-bold text-sm">→</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 9: PROMPT ANATOMY & RECIPES */}
          <section id="prompt-anatomy" className="space-y-6">
            <div>
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">
                Recipe Library
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-1">
                Deconstructed Production Prompt Anatomy
              </h2>
              <p className="text-sm sm:text-base text-secondary mt-1 font-sans">
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
              <span className="text-xs font-sans uppercase tracking-wider text-tertiary font-semibold">
                Production Pitfalls
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-1">
                Common Mistakes &amp; How to Fix Them
              </h2>
            </div>

            <div className="space-y-4">
              {dossier.commonMistakes.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 sm:p-6 space-y-2.5 text-sm font-sans"
                >
                  <p className="font-bold text-primary text-base flex items-center gap-2">
                    <span className="text-tertiary font-bold">✗ Mistake:</span>
                    <span>{item.mistake}</span>
                  </p>
                  <p className="text-secondary leading-relaxed">
                    <strong className="text-tertiary font-semibold">Impact: </strong>
                    {item.impact}
                  </p>
                  <div className="rounded-lg border border-accent/20 bg-accent/5 p-3.5 text-primary mt-2 leading-relaxed">
                    <strong className="text-accent font-semibold">✓ Solution: </strong>
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
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">
                  Editorial Assessment
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-1">
                  Creator Production Scorecard
                </h2>
              </div>
              <span className="text-xs font-sans text-tertiary">
                1.0 - 5.0 Scale
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm font-sans">
              {Object.entries(dossier.creatorScorecard).map(([key, val]) => (
                <div
                  key={key}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
                >
                  <span className="text-tertiary font-sans text-xs uppercase tracking-wider block capitalize font-medium">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xl font-bold text-primary font-mono">{val.toFixed(1)}</span>
                    <span className="text-xs text-accent font-medium font-sans">
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
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">
                  Commercial Pricing
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mt-1">
                  Transparent Pricing &amp; Licensing
                </h2>
              </div>
              <span className="text-xs font-mono text-tertiary">
                Audited {dossier.quickFacts.lastVerified}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dossier.pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 sm:p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-base font-bold text-primary font-sans">{tier.name}</h3>
                    <p className="mt-2 text-2xl font-bold text-primary font-sans">{tier.price}</p>
                    <p className="mt-2 text-xs sm:text-sm text-secondary font-sans">{tier.creditsOrLimits}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border-subtle text-xs text-tertiary space-y-1 font-sans">
                    <div>Commercial Rights: <strong className="text-primary">{tier.commercialRights ? "Yes" : "No"}</strong></div>
                    <div>Watermark: <strong className="text-primary">{tier.watermark ? "Yes" : "None"}</strong></div>
                    <p className="text-xs pt-1">{tier.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* LEVEL 13: ALTERNATIVES & COMPARISONS */}
          <section id="alternatives" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary">
              Alternatives &amp; Comparison Scenarios
            </h2>

            <div className="divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface-elevated overflow-hidden text-sm font-sans">
              {dossier.alternativesMatrix.map((alt, i) => (
                <div
                  key={i}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <span className="text-xs font-sans uppercase tracking-wider text-tertiary font-semibold">
                      If You Need:
                    </span>
                    <p className="font-bold text-primary mt-0.5 text-base">{alt.need}</p>
                    <p className="text-secondary mt-0.5 text-sm">{alt.why}</p>
                  </div>
                  <Link
                    href={`/tools/${alt.slug}`}
                    className="rounded-full border border-border bg-surface px-4 py-2 font-semibold text-accent hover:opacity-80 transition shrink-0 text-xs sm:text-sm"
                  >
                    Switch to {alt.useTool} →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* AdSense Placement */}
          <AdSlot slotId="dossier-bottom" label="Production Intelligence Sponsor" />

          {/* LEVEL 13.5: CANONICAL CINEMA INTELLIGENCE & TECHNIQUES */}
          {(supportedTechniques.length > 0 || relatedFilms.length > 0 || relatedResearch.length > 0) && (
            <section id="cinema-intelligence" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">
                  Canonical Cinema Intelligence & Techniques
                </span>
                <span className="text-xs font-sans text-tertiary">
                  Knowledge Graph
                </span>
              </div>

              {/* Supported Techniques */}
              {supportedTechniques.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-sans uppercase tracking-wider text-tertiary font-semibold">Supported Cinema Techniques</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {supportedTechniques.map((tech) => (
                      <Link
                        key={tech.id}
                        href={`/techniques/${tech.slug}`}
                        className="rounded-xl border border-border-subtle bg-surface-elevated p-4 hover:border-accent/40 transition group space-y-1.5 block"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-sans uppercase text-accent font-semibold">
                            {tech.category.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs font-sans text-tertiary">
                            {tech.difficulty}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-primary group-hover:text-accent transition font-sans">
                          {tech.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-secondary line-clamp-2 font-sans">
                          {tech.creativePurpose}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Demonstration Films */}
              {relatedFilms.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border-subtle">
                  <div className="text-xs font-sans uppercase tracking-wider text-tertiary font-semibold">Demonstrated in Canonical Works</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {relatedFilms.map((film) => (
                      <Link
                        key={film.id}
                        href={`/films/${film.slug}`}
                        className="rounded-xl border border-border-subtle bg-surface-elevated p-4 hover:border-accent/40 transition group block"
                      >
                        <div className="text-sm font-bold text-primary group-hover:text-accent transition font-sans">
                          {film.title} ({film.releaseYear})
                        </div>
                        <div className="text-xs text-secondary mt-0.5 line-clamp-1 font-sans">
                          {film.format.replace(/_/g, " ")} • {film.technicalSpecs.aspectRatio}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Research Ledgers */}
              {relatedResearch.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border-subtle">
                  <div className="text-xs font-sans uppercase tracking-wider text-tertiary font-semibold">Connected Research Ledgers</div>
                  <div className="space-y-2.5">
                    {relatedResearch.map((res) => (
                      <Link
                        key={res.id}
                        href={`/research/${res.slug}`}
                        className="block rounded-lg border border-border-subtle bg-surface-elevated p-3.5 hover:border-accent/40 transition group"
                      >
                        <div className="text-xs font-sans text-accent font-medium">{res.topic}</div>
                        <div className="text-sm font-semibold text-primary group-hover:text-accent transition mt-0.5 font-sans">
                          {res.researchQuestion}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* LEVEL 14: TRACEABLE SOURCE LEDGER */}
          <section id="source-ledger" className="surface p-6 sm:p-8 rounded-2xl border border-border bg-surface shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="text-xs font-sans uppercase tracking-wider text-tertiary font-semibold">
                Traceable Source Ledger
              </span>
              <span className="text-xs font-sans text-accent font-medium">
                Verification Confidence: High
              </span>
            </div>

            <div className="space-y-2 text-xs sm:text-sm font-sans">
              {dossier.sourceLedger.map((src, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border-subtle bg-surface-elevated p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
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
                    <span className="text-tertiary text-xs block font-sans mt-0.5">
                      Last Verified: {src.lastVerified}
                    </span>
                  </div>
                  <span className="rounded bg-accent/10 px-2 py-0.5 font-sans text-xs text-accent font-medium">
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
