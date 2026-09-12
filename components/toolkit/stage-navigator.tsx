"use client";

import React from "react";
import { ToolkitStage } from "@/data/film-intelligence-types";

interface StageNavigatorProps {
  currentStage: ToolkitStage;
  completedStages: ToolkitStage[];
  onSelectStage: (stage: ToolkitStage) => void;
}

export const STAGES: { id: ToolkitStage; number: string; title: string; subtitle: string }[] = [
  { id: "01_CONCEPT", number: "01", title: "Concept", subtitle: "Core premise, themes & intent" },
  { id: "02_RESEARCH", number: "02", title: "Research", subtitle: "Verified sources & rules" },
  { id: "03_STORY", number: "03", title: "Story & Scenes", subtitle: "Scene breakdowns & shot design" },
  { id: "04_VISUAL_LANGUAGE", number: "04", title: "Visual Language", subtitle: "Optics, lighting & palette" },
  { id: "05_PRE_PRODUCTION", number: "05", title: "Pre-Production", subtitle: "Workflow playbooks & tests" },
  { id: "06_PRODUCTION", number: "06", title: "Production", subtitle: "Gear, locations & coverage" },
  { id: "07_POST", number: "07", title: "Post & Finish", subtitle: "Editorial, color, sound & DCP" },
  { id: "08_FESTIVAL", number: "08", title: "Festival Strategy", subtitle: "Deadlines, premiere & delivery" },
  { id: "09_ARCHIVE", number: "09", title: "Archive & Export", subtitle: "Dossier & project package" },
];

export function StageNavigator({
  currentStage,
  completedStages = [],
  onSelectStage,
}: StageNavigatorProps) {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
  const progressPercent = Math.round(((completedStages.length) / STAGES.length) * 100);

  return (
    <div className="surface rounded-2xl border border-border p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between px-1 text-xs">
        <span className="font-mono text-tertiary uppercase tracking-wider text-[11px]">
          Filmmaking Stage Navigator
        </span>
        <span className="font-mono text-accent text-[11px] font-semibold">
          {completedStages.length} of {STAGES.length} Stages Completed ({progressPercent}%)
        </span>
      </div>

      {/* Horizontal Stage Stepper */}
      <div className="flex items-stretch gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {STAGES.map((stage, idx) => {
          const isActive = stage.id === currentStage;
          const isCompleted = completedStages.includes(stage.id);

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className={`flex-1 min-w-[130px] rounded-xl p-2.5 text-left transition relative border cursor-pointer ${
                isActive
                  ? "bg-accent/10 border-accent/40 text-primary shadow-xs"
                  : isCompleted
                  ? "bg-surface-elevated border-emerald-500/20 text-secondary hover:text-primary hover:border-border-bright"
                  : "bg-surface border-border-subtle text-tertiary hover:text-secondary hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] font-semibold ${isActive ? "text-accent" : isCompleted ? "text-emerald-400" : "text-tertiary"}`}>
                  {stage.number}
                </span>
                {isCompleted && (
                  <span className="text-emerald-400 font-bold text-[10px]">✓</span>
                )}
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                )}
              </div>
              <p className={`mt-1 text-xs font-semibold leading-tight line-clamp-1 ${isActive ? "text-primary font-bold" : "text-secondary"}`}>
                {stage.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
