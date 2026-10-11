"use client";

import React, { useState } from "react";
import {
  CANONICAL_INTELLIGENCE_MODULES,
  EXECUTION_MODES,
  ExecutionMode,
  estimateModuleTokens,
  estimateTotalWorkflowTokens,
} from "@/lib/creator-intelligence-plans";

interface CreatorIntelligenceExecutionPickerProps {
  selectedModules: string[];
  executionMode: ExecutionMode;
  characterCount: number | null;
  onModulesChange: (moduleIds: string[]) => void;
  onExecutionModeChange: (mode: ExecutionMode) => void;
}

// Filmmaker-friendly labels mapped to canonical module IDs
const FILMMAKER_GOALS: Record<
  string,
  {
    filmmakerTitle: string;
    filmmakerSubhead: string;
    icon: string;
    filmmakerExplanation: string;
  }
> = {
  story_analysis: {
    filmmakerTitle: "Understand My Story",
    filmmakerSubhead: "Story structure & dramatic stakes",
    icon: "📖",
    filmmakerExplanation:
      "Evaluates three-act pacing, dramatic conflict vectors, logline premise, and thematic core.",
  },
  screenplay_breakdown: {
    filmmakerTitle: "Break Down My Scenes",
    filmmakerSubhead: "Locations, scenes & logistics",
    icon: "🎬",
    filmmakerExplanation:
      "Identifies INT/EXT conditions, day/night lighting setups, scene density, and production requirements.",
  },
  visual_bible: {
    filmmakerTitle: "Develop My Visual Style",
    filmmakerSubhead: "Optics, mood, lighting & color",
    icon: "🎨",
    filmmakerExplanation:
      "Defines optical choices (anamorphic vs spherical), key-to-fill contrast ratios, and color grading palette.",
  },
  shot_breakdown: {
    filmmakerTitle: "Plan My Shots & Build Prompts",
    filmmakerSubhead: "Camera movement & multi-engine recipes",
    icon: "🎥",
    filmmakerExplanation:
      "Generates production shot lists, focal lengths, and native prompt recipes for Kling, Runway, Veo, and Midjourney.",
  },
  film_research: {
    filmmakerTitle: "Research Cinema References",
    filmmakerSubhead: "Film precedents & visual citations",
    icon: "🏛",
    filmmakerExplanation:
      "Grounds your piece in cinema history, reference directors, genre tropes, and festival target standards.",
  },
  character_analysis: {
    filmmakerTitle: "Analyze Character Dynamics",
    filmmakerSubhead: "Protagonist tension & dialogue voice",
    icon: "🎭",
    filmmakerExplanation:
      "Builds character tension matrices, motivation arcs, casting archetypes, and dialogue cadence guides.",
  },
};

export function CreatorIntelligenceExecutionPicker({
  selectedModules,
  executionMode,
  characterCount,
  onModulesChange,
  onExecutionModeChange,
}: CreatorIntelligenceExecutionPickerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const toggleModule = (id: string) => {
    if (selectedModules.includes(id)) {
      if (selectedModules.length === 1) return; // Keep at least one goal active
      onModulesChange(selectedModules.filter((m) => m !== id));
    } else {
      onModulesChange([...selectedModules, id]);
    }
  };

  const totalEstimate = estimateTotalWorkflowTokens(selectedModules, characterCount);

  return (
    <div className="space-y-8 text-left">
      {/* STEP 2 HEADER */}
      <div className="space-y-2 pb-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            STEP 2 · CHOOSE YOUR GOAL
          </span>
          <span className="text-xs font-mono text-zinc-500">Filmmaker Analysis Objectives</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          What do you need help with next?
        </h2>
        <p className="text-sm text-zinc-400 font-sans leading-relaxed max-w-2xl">
          Select the cinematic intelligence outputs you want to generate. Creator Intel maps these goals to calibrated directorial analysis pipelines.
        </p>
      </div>

      {/* GOALS SELECTION GRID */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
          <span className="text-xs font-mono text-zinc-400">
            Selected Goals: <strong className="text-white">{selectedModules.length} of {CANONICAL_INTELLIGENCE_MODULES.length} active</strong>
          </span>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span>Estimated Compute:</span>
            <strong className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-semibold">
              {totalEstimate.formatted} (Est.)
            </strong>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {CANONICAL_INTELLIGENCE_MODULES.map((mod) => {
            const isSelected = selectedModules.includes(mod.id);
            const tokenInfo = estimateModuleTokens(mod.id, characterCount);
            const goalInfo = FILMMAKER_GOALS[mod.id] || {
              filmmakerTitle: mod.name,
              filmmakerSubhead: mod.category,
              icon: "🎬",
              filmmakerExplanation: mod.purpose,
            };

            return (
              <div
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleModule(mod.id);
                  }
                }}
                tabIndex={0}
                role="checkbox"
                aria-checked={isSelected}
                className={`cursor-pointer rounded-2xl border p-5 flex flex-col justify-between transition shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
                  isSelected
                    ? "border-amber-400/80 bg-zinc-900/90 shadow-[0_0_20px_rgba(245,158,11,0.12)]"
                    : "border-zinc-800 bg-zinc-950/60 opacity-70 hover:opacity-100 hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-2xl">{goalInfo.icon}</span>
                    <span
                      className={`h-5 w-5 rounded-md flex items-center justify-center text-xs font-bold border transition ${
                        isSelected
                          ? "bg-amber-400 border-amber-400 text-zinc-950"
                          : "border-zinc-700 text-transparent bg-zinc-900"
                      }`}
                    >
                      ✓
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white font-sans leading-snug">
                    {goalInfo.filmmakerTitle}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-amber-400 font-mono">
                    {goalInfo.filmmakerSubhead}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400 font-sans leading-relaxed">
                    {goalInfo.filmmakerExplanation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span>Context allocation:</span>
                  <span className="font-semibold text-zinc-300">
                    {tokenInfo.formatted}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-zinc-500 font-mono pt-1">
          * Note: Token estimates reflect language model context window allocations, not monetary subscription charges.
        </p>
      </div>

      {/* ADVANCED PROGRESSIVE DISCLOSURE: EXECUTION PROTOCOL */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 text-xs font-mono text-zinc-300 hover:text-white hover:bg-zinc-800/40 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">{showAdvanced ? "▼" : "▶"}</span>
            <span className="font-semibold text-sm font-sans">Execution Protocol &amp; Review Mode</span>
            <span className="text-zinc-500 text-xs">
              (Current: {EXECUTION_MODES[executionMode].title})
            </span>
          </div>
          <span className="text-xs text-amber-400 font-medium">
            {showAdvanced ? "Hide settings" : "Configure protocol →"}
          </span>
        </button>

        {showAdvanced && (
          <div className="p-5 pt-1 border-t border-zinc-800 space-y-4">
            <p className="text-xs text-zinc-400 font-sans">
              Choose how Creator Intel executes your chosen goals. Semi-automatic is recommended for directors who want to review visual styles before generating final shot recipes.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {(Object.keys(EXECUTION_MODES) as ExecutionMode[]).map((modeKey) => {
                const config = EXECUTION_MODES[modeKey];
                const isSelected = executionMode === modeKey;
                return (
                  <div
                    key={modeKey}
                    onClick={() => onExecutionModeChange(modeKey)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onExecutionModeChange(modeKey);
                      }
                    }}
                    tabIndex={0}
                    role="radio"
                    aria-checked={isSelected}
                    className={`cursor-pointer rounded-xl border p-4 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                        : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg">{config.icon}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase font-mono ${
                          isSelected
                            ? "bg-amber-400 text-zinc-950"
                            : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        {isSelected ? "Active" : "Select"}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-sans leading-tight">
                      {config.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-amber-400 font-mono">
                      {config.subtitle}
                    </p>
                    <p className="mt-2 text-xs text-zinc-400 font-sans leading-relaxed">
                      {config.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* PIPELINE SYNTHESIS VISUALIZER */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-4 space-y-2.5">
        <h4 className="text-xs font-mono font-bold uppercase text-zinc-300">
          Directorial Synthesis Pipeline
        </h4>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {[
            "STORY",
            "SCENES",
            "VISUAL STYLE",
            "SHOT COVERAGE",
            "PROMPT RECIPES",
          ].map((stage, idx) => (
            <React.Fragment key={stage}>
              <span className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-zinc-300 font-medium">
                {stage}
              </span>
              {idx < 4 && <span className="text-amber-400 font-bold">→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
          The selected modules synthesize raw creative input into actionable optical blueprints, camera rigs, and calibrated prompts for video diffusion engines.
        </p>
      </div>
    </div>
  );
}
