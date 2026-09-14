"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Clapperboard,
  Camera,
  Sliders,
  Sparkles,
  ArrowRight,
  Check,
  Play,
  BookOpen,
  ArrowUpRight,
  Film,
  Zap,
} from "@/components/cinematic/icons";

interface DecisionStepOption {
  id: string;
  label: string;
  subtitle: string;
}

interface DecisionMatch {
  id: string;
  slug: string;
  name: string;
  category: string;
  creationType: string;
  bestFor: string;
  whyThisTool: string;
  primaryLimitation: string;
  score: number;
  studioEngineId: string;
  primaryComparisonSlug?: string;
}

const STEP_1_CREATION: DecisionStepOption[] = [
  { id: "video", label: "Cinematic Video", subtitle: "24fps motion, camera moves, and scene takes" },
  { id: "image", label: "Stills / Concept Art", subtitle: "Keyframes, lookbooks, and lighting bibles" },
  { id: "audio", label: "Voice / Foley", subtitle: "Dialogue, voice cloning, and sound effects" },
  { id: "vfx", label: "VFX / Upscaling", subtitle: "Texture enhancement, frame rate, and inpainting" },
  { id: "previs", label: "Previs & Storyboards", subtitle: "Animatics, camera angles, and sequence planning" },
];

const STEP_2_CONTROL: DecisionStepOption[] = [
  { id: "full_dop", label: "Full Director / DoP Control", subtitle: "Physical lenses, rig kinematics, and shutter angles" },
  { id: "guided", label: "Guided Precision", subtitle: "Motion brush, trajectory vectors, and seed lock" },
  { id: "automated", label: "Mostly Automated", subtitle: "Fast text-to-output with rapid creative iterations" },
];

const STEP_3_BUDGET: DecisionStepOption[] = [
  { id: "open_source", label: "Free / Open Source", subtitle: "Local execution, open weights, and zero vendor lock" },
  { id: "credit", label: "Pay-Per-Credit", subtitle: "Usage-based flexible rendering without high commitment" },
  { id: "subscription", label: "Monthly Studio Plan", subtitle: "High-priority queues, 4K exports, and commercial rights" },
];

const STEP_4_STAGE: DecisionStepOption[] = [
  { id: "previs_stage", label: "Pre-Production & Pitch", subtitle: "Pitch treatments, character lookdev, and animatics" },
  { id: "production_stage", label: "Principal Generation", subtitle: "Final pixel generation and master scene takes" },
  { id: "post_stage", label: "Post Finishing", subtitle: "Color matching, 4K upscaling, and DCI deliverables" },
];

// Curated verified tool knowledge base for matching
const KNOWLEDGE_MATCHES: Record<string, DecisionMatch> = {
  kling: {
    id: "tool-kling",
    slug: "kling",
    name: "Kling AI 2.0 Master",
    category: "Video Generation",
    creationType: "Cinematic Video & Physics",
    bestFor: "Complex physical inertia, fluid dynamics, and wet floor optical reflections",
    whyThisTool: "Industry-standard physical simulation that avoids rubbery AI morphing during fast actor or vehicle motion.",
    primaryLimitation: "Queue times can vary during peak hours on standard tiers.",
    score: 4.8,
    studioEngineId: "kling",
    primaryComparisonSlug: "runway-vs-kling",
  },
  runway: {
    id: "tool-runway",
    slug: "runway",
    name: "Runway Gen-3 Alpha",
    category: "Video Generation",
    creationType: "Directable Cine Video & VFX",
    bestFor: "Director camera control tags, motion brush masking, and Act-One performances",
    whyThisTool: "Fine-grained camera trajectory directives (Pan, Tilt, Zoom, Roll) with timeline brush control.",
    primaryLimitation: "Higher credit consumption rate for high-definition 4K master renders.",
    score: 4.8,
    studioEngineId: "runway",
    primaryComparisonSlug: "runway-vs-kling",
  },
  veo: {
    id: "tool-veo",
    slug: "veo",
    name: "Google Veo 2",
    category: "Video Generation",
    creationType: "High-Fidelity 4K Video",
    bestFor: "Photochemical color curves, Deakins-style lighting, and semantic prompt adherence",
    whyThisTool: "Exceptional prompt fidelity that accurately renders complex multi-layered architectural spaces.",
    primaryLimitation: "Waitlist and limited API access rollouts.",
    score: 4.9,
    studioEngineId: "veo",
    primaryComparisonSlug: "runway-vs-kling",
  },
  midjourney: {
    id: "tool-midjourney",
    slug: "midjourney",
    name: "Midjourney v6.1",
    category: "Image Direction",
    creationType: "Photorealistic Stills & Keyframes",
    bestFor: "Authorial aesthetics, Kodak 5219 film emulsion, and complex character lookbooks",
    whyThisTool: "The golden standard for film still texture, natural skin rendering, and cinematic lighting ratios.",
    primaryLimitation: "Discord-first interface and no native video generation engine.",
    score: 4.9,
    studioEngineId: "midjourney",
    primaryComparisonSlug: "midjourney-vs-ideogram",
  },
  flux: {
    id: "tool-flux",
    slug: "flux",
    name: "Flux.1 Schnell / Dev",
    category: "Image Direction",
    creationType: "Sub-Millimeter Keyframes",
    bestFor: "Precise Art Deco architectural geometry, typography, and zero prompt bleeding",
    whyThisTool: "State-of-the-art flow matching with flawless hands and architectural anatomy.",
    primaryLimitation: "Requires high VRAM (16GB+) for local ComfyUI execution.",
    score: 4.8,
    studioEngineId: "flux",
    primaryComparisonSlug: "midjourney-vs-ideogram",
  },
  wan: {
    id: "tool-wan",
    slug: "wan",
    name: "Wan 2.1 Video",
    category: "Video Generation",
    creationType: "Open Weights Cine Video",
    bestFor: "Open-source fine-tuning, heavy cinematic weight, and spatio-temporal depth",
    whyThisTool: "Zero vendor lock-in with dense volumetric fog and realistic camera inertia.",
    primaryLimitation: "Requires local GPU infrastructure or third-party cloud hosting.",
    score: 4.7,
    studioEngineId: "wan",
    primaryComparisonSlug: "runway-vs-kling",
  },
  elevenlabs: {
    id: "tool-elevenlabs",
    slug: "elevenlabs",
    name: "ElevenLabs Cinema Voice",
    category: "Voice & Sound Design",
    creationType: "Voice Cloning & Cinematic Foley",
    bestFor: "Emotional vocal nuance, multilingual ADR, and procedural sound effects",
    whyThisTool: "Sub-second voice synthesis with dynamic whisper, grit, and emotional subtext control.",
    primaryLimitation: "Voice consistency requires careful stability parameter calibration.",
    score: 4.9,
    studioEngineId: "kling",
    primaryComparisonSlug: "descript-vs-capcut",
  },
  topaz: {
    id: "tool-topaz",
    slug: "topaz",
    name: "Topaz Video AI Pro",
    category: "Upscaling & VFX",
    creationType: "4K/8K Film Gate Enhancement",
    bestFor: "Motion de-blurring, 24fps to 60fps interpolation, and optical artifact removal",
    whyThisTool: "Local standalone studio software engineered for broadcast and DCI-P3 theatrical finishing.",
    primaryLimitation: "Heavy hardware render times on complex noise reduction passes.",
    score: 4.8,
    studioEngineId: "kling",
    primaryComparisonSlug: "descript-vs-capcut",
  },
};

export function ToolDecisionFinder() {
  const [selectedCreation, setSelectedCreation] = useState<string>("video");
  const [selectedControl, setSelectedControl] = useState<string>("full_dop");
  const [selectedBudget, setSelectedBudget] = useState<string>("subscription");
  const [selectedStage, setSelectedStage] = useState<string>("production_stage");

  // Dynamic Rule-Based Matching Logic
  const matches = useMemo(() => {
    const list: DecisionMatch[] = [];

    if (selectedCreation === "video") {
      if (selectedBudget === "open_source") {
        list.push(KNOWLEDGE_MATCHES.wan);
        list.push(KNOWLEDGE_MATCHES.kling);
      } else if (selectedControl === "full_dop") {
        list.push(KNOWLEDGE_MATCHES.runway);
        list.push(KNOWLEDGE_MATCHES.kling);
        list.push(KNOWLEDGE_MATCHES.veo);
      } else {
        list.push(KNOWLEDGE_MATCHES.kling);
        list.push(KNOWLEDGE_MATCHES.runway);
      }
    } else if (selectedCreation === "image") {
      if (selectedBudget === "open_source") {
        list.push(KNOWLEDGE_MATCHES.flux);
        list.push(KNOWLEDGE_MATCHES.midjourney);
      } else {
        list.push(KNOWLEDGE_MATCHES.midjourney);
        list.push(KNOWLEDGE_MATCHES.flux);
      }
    } else if (selectedCreation === "audio") {
      list.push(KNOWLEDGE_MATCHES.elevenlabs);
      list.push(KNOWLEDGE_MATCHES.runway);
    } else if (selectedCreation === "vfx") {
      list.push(KNOWLEDGE_MATCHES.topaz);
      list.push(KNOWLEDGE_MATCHES.runway);
    } else if (selectedCreation === "previs") {
      list.push(KNOWLEDGE_MATCHES.midjourney);
      list.push(KNOWLEDGE_MATCHES.runway);
      list.push(KNOWLEDGE_MATCHES.kling);
    }

    return list.slice(0, 3);
  }, [selectedCreation, selectedControl, selectedBudget, selectedStage]);

  return (
    <section className="relative w-full rounded-3xl border border-white/[0.09] bg-neutral-950/90 p-6 sm:p-10 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl mb-10 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
            FILMMAKER DECISION ENGINE
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans">
          TOO MANY AI TOOLS. <br />
          <span className="font-serif italic font-normal text-amber-200">
            NOT ENOUGH CLARITY.
          </span>
        </h2>

        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-sans">
          Answer 4 core directorial questions. Creator Intel eliminates marketing noise and identifies the exact engine, optical parameters, and workflow for your production.
        </p>
      </div>

      {/* 4 Decision Question Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-white/[0.08]">
        {/* Q1: What are you creating? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400">01</span>
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
              What are you creating?
            </span>
          </div>

          <div className="space-y-1.5">
            {STEP_1_CREATION.map((opt) => {
              const isSelected = selectedCreation === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedCreation(opt.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-amber-400/10 border-amber-400/70 text-white shadow-sm ring-1 ring-amber-400/30"
                      : "bg-neutral-900/60 border-white/[0.06] text-neutral-400 hover:text-neutral-200 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-sans">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">{opt.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Q2: Camera / Creative Control */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400">02</span>
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
              Camera &amp; Motion Control?
            </span>
          </div>

          <div className="space-y-1.5">
            {STEP_2_CONTROL.map((opt) => {
              const isSelected = selectedControl === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedControl(opt.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-amber-400/10 border-amber-400/70 text-white shadow-sm ring-1 ring-amber-400/30"
                      : "bg-neutral-900/60 border-white/[0.06] text-neutral-400 hover:text-neutral-200 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-sans">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">{opt.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Q3: Budget Model */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400">03</span>
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
              Budget &amp; License Model?
            </span>
          </div>

          <div className="space-y-1.5">
            {STEP_3_BUDGET.map((opt) => {
              const isSelected = selectedBudget === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedBudget(opt.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-amber-400/10 border-amber-400/70 text-white shadow-sm ring-1 ring-amber-400/30"
                      : "bg-neutral-900/60 border-white/[0.06] text-neutral-400 hover:text-neutral-200 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-sans">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">{opt.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Q4: Production Stage */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400">04</span>
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-300 font-semibold">
              Production Stage?
            </span>
          </div>

          <div className="space-y-1.5">
            {STEP_4_STAGE.map((opt) => {
              const isSelected = selectedStage === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedStage(opt.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-amber-400/10 border-amber-400/70 text-white shadow-sm ring-1 ring-amber-400/30"
                      : "bg-neutral-900/60 border-white/[0.06] text-neutral-400 hover:text-neutral-200 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-sans">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">{opt.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Recommendation Output Stage: "YOUR BEST MATCH" */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
              YOUR BEST MATCH ({matches.length} AUDITED ENGINES)
            </span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            GROUNDED IN REAL BENCHMARKS • ZERO SPONSORED BIAS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {matches.map((tool, idx) => {
            const isTopMatch = idx === 0;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className={`p-6 rounded-2xl border flex flex-col justify-between relative ${
                  isTopMatch
                    ? "bg-neutral-900 border-amber-400/60 shadow-[0_0_25px_rgba(245,158,11,0.12)] ring-1 ring-amber-400/30"
                    : "bg-neutral-950/80 border-white/[0.08]"
                }`}
              >
                {isTopMatch && (
                  <span className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-mono font-bold uppercase tracking-wider">
                    ★ Top Match
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-neutral-400">
                        {tool.creationType}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-300">
                        ★ {tool.score.toFixed(1)} / 5.0
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-sans mt-2">
                      <Link href={`/tools/${tool.slug}`} className="hover:text-amber-400 transition-colors">
                        {tool.name}
                      </Link>
                    </h3>
                  </div>

                  {/* Best For */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                      Best For
                    </span>
                    <p className="text-xs text-neutral-200 font-sans leading-snug">
                      {tool.bestFor}
                    </p>
                  </div>

                  {/* Why this tool */}
                  <div className="space-y-1 p-3 rounded-xl bg-neutral-950/70 border border-white/[0.04]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Directorial Rationale
                    </span>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {tool.whyThisTool}
                    </p>
                  </div>

                  {/* Primary Limitation */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400">
                      Primary Limitation
                    </span>
                    <p className="text-xs text-neutral-400 leading-snug font-sans">
                      {tool.primaryLimitation}
                    </p>
                  </div>
                </div>

                {/* Direct Action Hub */}
                <div className="pt-6 mt-6 border-t border-white/[0.06] space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/tools/${tool.slug}#media`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-mono text-neutral-200 hover:text-white transition-colors"
                    >
                      <Play className="w-3 h-3 text-amber-400 fill-current" />
                      <span>Watch</span>
                    </Link>

                    <Link
                      href={`/tools/${tool.slug}#how-to-use`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-mono text-neutral-200 hover:text-white transition-colors"
                    >
                      <BookOpen className="w-3 h-3 text-neutral-400" />
                      <span>Learn</span>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {tool.primaryComparisonSlug ? (
                      <Link
                        href={`/compare/${tool.primaryComparisonSlug}`}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-mono text-neutral-200 hover:text-white transition-colors"
                      >
                        <Sliders className="w-3 h-3 text-neutral-400" />
                        <span>Compare</span>
                      </Link>
                    ) : (
                      <Link
                        href="/compare"
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-mono text-neutral-200 hover:text-white transition-colors"
                      >
                        <Sliders className="w-3 h-3 text-neutral-400" />
                        <span>Compare</span>
                      </Link>
                    )}

                    <Link
                      href={`/prompts/factory?engine=${tool.studioEngineId}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-[11px] font-sans transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    >
                      <Clapperboard className="w-3 h-3 text-neutral-950" />
                      <span>Direct in Studio</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
