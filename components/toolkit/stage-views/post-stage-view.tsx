"use client";

import React from "react";
import { FilmProject, ProjectPostPipelineItem } from "@/data/film-intelligence-types";

interface StageViewProps {
  project: FilmProject;
  onUpdateProject: (updates: Partial<FilmProject>) => void;
  onNextStage?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

const DEFAULT_PIPELINE: ProjectPostPipelineItem[] = [
  { step: "DAILIES_INGEST", title: "Dailies Ingest & Checksum Verification", status: "COMPLETE", notes: "Dual NVMe backup with xxHash64 checksums. ProRes Proxy generation." },
  { step: "EDITORIAL_OFFLINE", title: "Offline Assembly & Scene Stitch", status: "COMPLETE", notes: "First rough assembly matching script supervisor notes." },
  { step: "ROUGH_CUT", title: "Director's Rough Cut Review", status: "IN_PROGRESS", notes: "Trimming pacing across lighthouse scenes." },
  { step: "PICTURE_LOCK", title: "Fine Cut & Picture Lock Milestone", status: "NOT_STARTED", notes: "Timecode lock before EDL / AAF turnover to color & sound." },
  { step: "VFX_CLEANUP", title: "VFX, Rig Removal & Storm Enhancement", status: "NOT_STARTED", notes: "Plate cleanup and water spray composite integration." },
  { step: "COLOR_GRADING", title: "Color Grading (ACES / P3-DCI)", status: "NOT_STARTED", notes: "Show LUT application and maritime contrast balancing." },
  { step: "SOUND_MIX", title: "Sound Design, Foley & 5.1/7.1 Mix", status: "NOT_STARTED", notes: "Atmospheric ocean gale spatial panning and score mix." },
  { step: "DCP_MASTERING", title: "Theatrical DCP & Archival Master", status: "NOT_STARTED", notes: "SMPTE DCP 24fps 2K/4K with 5.1 audio + ProRes 4444 XQ master." },
];

export function PostStageView({
  project,
  onUpdateProject,
  onNextStage,
  onMarkComplete,
  isCompleted,
}: StageViewProps) {
  const pipeline = project.postPipeline && project.postPipeline.length > 0
    ? project.postPipeline
    : DEFAULT_PIPELINE;

  const handleUpdateStepStatus = (
    index: number,
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE"
  ) => {
    const updated = [...pipeline];
    updated[index] = { ...updated[index], status };
    onUpdateProject({ postPipeline: updated });
  };

  const handleUpdateStepNotes = (index: number, notes: string) => {
    const updated = [...pipeline];
    updated[index] = { ...updated[index], notes };
    onUpdateProject({ postPipeline: updated });
  };

  const completedCount = pipeline.filter((p) => p.status === "COMPLETE").length;
  const progressPercent = Math.round((completedCount / pipeline.length) * 100);

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="surface rounded-2xl border border-border p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-bold">STAGE 07</span>
            <span className="text-tertiary text-xs">•</span>
            <span className="text-xs font-mono text-secondary uppercase tracking-wider">Finishing</span>
          </div>
          {onMarkComplete && (
            <button
              onClick={onMarkComplete}
              className={`rounded-lg px-3 py-1 text-xs font-mono font-semibold transition border cursor-pointer ${
                isCompleted
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-surface-elevated border-border text-tertiary hover:text-primary hover:border-border-bright"
              }`}
            >
              {isCompleted ? "✓ Stage 07 Marked Complete" : "Mark Stage Complete"}
            </button>
          )}
        </div>
        <h1 className="text-2xl font-serif text-primary font-bold">Post-Production Pipeline & Theatrical Finish</h1>
        <p className="text-sm text-secondary">
          Track milestones from dailies ingest to Picture Lock, ACES color grading, sound design, and SMPTE DCP mastering.
        </p>
      </div>

      {/* Pipeline Milestones */}
      <div className="surface rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Post-Production Roadmap
            </h2>
            <p className="text-xs text-tertiary">
              {completedCount} of {pipeline.length} milestones complete ({progressPercent}%)
            </p>
          </div>
          <div className="w-32 bg-surface-elevated rounded-full h-2 overflow-hidden border border-border">
            <div
              className="bg-accent h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {pipeline.map((item, idx) => {
            const isComplete = item.status === "COMPLETE";
            const isInProgress = item.status === "IN_PROGRESS";

            return (
              <div
                key={item.step || idx}
                className={`rounded-xl border p-4 space-y-3 transition ${
                  isComplete
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : isInProgress
                    ? "border-accent/40 bg-accent/5"
                    : "border-border-subtle bg-surface-elevated"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isComplete
                          ? "bg-emerald-500/20 text-emerald-400"
                          : isInProgress
                          ? "bg-accent/20 text-accent"
                          : "bg-surface text-tertiary border border-border"
                      }`}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-semibold text-sm text-primary">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {(["NOT_STARTED", "IN_PROGRESS", "COMPLETE"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStepStatus(idx, st)}
                        className={`rounded px-2.5 py-1 font-mono text-[10px] font-semibold cursor-pointer transition ${
                          item.status === st
                            ? st === "COMPLETE"
                              ? "bg-emerald-500 text-black shadow-xs"
                              : st === "IN_PROGRESS"
                              ? "bg-accent text-accent-contrast shadow-xs"
                              : "bg-surface-elevated text-primary border border-border-bright"
                            : "bg-surface text-tertiary hover:text-secondary border border-transparent"
                        }`}
                      >
                        {st.replace(/_/g, " ")}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-tertiary">Specifications & Notes</label>
                  <input
                    type="text"
                    value={item.notes || ""}
                    onChange={(e) => handleUpdateStepNotes(idx, e.target.value)}
                    placeholder="Turnover specs, color space, audio channel configuration..."
                    className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-tertiary">
          Picture lock unlocks official festival entry submission windows.
        </span>
        {onNextStage && (
          <button
            onClick={onNextStage}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-mono font-semibold text-accent-contrast shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to Stage 08: Festival Strategy</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
