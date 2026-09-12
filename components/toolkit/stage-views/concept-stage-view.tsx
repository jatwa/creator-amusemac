"use client";

import React from "react";
import { FilmProject, ProjectProjectType } from "@/data/film-intelligence-types";

interface StageViewProps {
  project: FilmProject;
  onUpdateProject: (updates: Partial<FilmProject>) => void;
  onNextStage?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

const PROJECT_TYPES: { id: ProjectProjectType; label: string }[] = [
  { id: "feature", label: "Feature Film" },
  { id: "short", label: "Short Film" },
  { id: "documentary", label: "Documentary Feature / Short" },
  { id: "proof_of_concept", label: "Proof of Concept / Teaser" },
  { id: "series_pilot", label: "Series Pilot" },
];

export function ConceptStageView({
  project,
  onUpdateProject,
  onNextStage,
  onMarkComplete,
  isCompleted,
}: StageViewProps) {
  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="surface rounded-2xl border border-border p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-bold">STAGE 01</span>
            <span className="text-tertiary text-xs">•</span>
            <span className="text-xs font-mono text-secondary uppercase tracking-wider">Foundation</span>
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
              {isCompleted ? "✓ Stage 01 Marked Complete" : "Mark Stage Complete"}
            </button>
          )}
        </div>
        <h1 className="text-2xl font-serif text-primary font-bold">Concept, Premise & Narrative Intent</h1>
        <p className="text-sm text-secondary">
          Define the foundational creative thesis of your film project before committing to scene design or visual language.
        </p>
      </div>

      {/* Primary Project Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="surface rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
            Project Identification
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-secondary">Project Title (Official / Working) *</label>
            <input
              type="text"
              value={project.title || ""}
              onChange={(e) => onUpdateProject({ title: e.target.value })}
              placeholder="e.g. Chronicles of the Monsoon"
              className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-secondary">Project Type</label>
              <select
                value={project.projectType || "short"}
                onChange={(e) => onUpdateProject({ projectType: e.target.value as ProjectProjectType })}
                className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none"
              >
                {PROJECT_TYPES.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-secondary">Est. Runtime (Mins)</label>
              <input
                type="number"
                value={project.estimatedRuntimeMinutes || ""}
                onChange={(e) => onUpdateProject({ estimatedRuntimeMinutes: Number(e.target.value) || undefined })}
                placeholder="e.g. 18"
                className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-secondary">Target Year</label>
              <input
                type="number"
                value={project.targetReleaseYear || ""}
                onChange={(e) => onUpdateProject({ targetReleaseYear: Number(e.target.value) || undefined })}
                placeholder="2026"
                className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-secondary">Country of Origin</label>
              <input
                type="text"
                value={project.countryOfOrigin || ""}
                onChange={(e) => onUpdateProject({ countryOfOrigin: e.target.value })}
                placeholder="e.g. India / France"
                className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-secondary">Genres (comma separated)</label>
            <input
              type="text"
              value={(project.genre || []).join(", ")}
              onChange={(e) =>
                onUpdateProject({
                  genre: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Drama, Magical Realism, Environmental"
              className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Narrative Core: Logline & Themes */}
        <div className="surface rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Narrative Thesis
            </h2>
            <span className="text-[11px] font-mono text-tertiary">
              {(project.logline || "").length} characters
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-secondary">
              Logline (1-2 sentence core conflict)
            </label>
            <textarea
              rows={3}
              value={project.logline || ""}
              onChange={(e) => onUpdateProject({ logline: e.target.value })}
              placeholder="When an elderly lighthouse keeper along the Konkan coast discovers a silent meteorological phenomenon, she must choose between warning the harbor authorities or preserving the arrival of an unearthly monsoon."
              className="w-full rounded-xl border border-border bg-surface-elevated p-3.5 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none leading-relaxed"
            />
            <p className="text-[11px] text-tertiary">
              Tip: A strong logline includes protagonist, inciting conflict, obstacle, and narrative stakes.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-secondary">Creative Intent & Thematic Focus</label>
            <textarea
              rows={4}
              value={project.creativeIntent || ""}
              onChange={(e) => onUpdateProject({ creativeIntent: e.target.value })}
              placeholder="Explore the tactile texture of rain, time dilation, and the sensory isolation of coastal monsoon landscapes using high-contrast natural lighting."
              className="w-full rounded-xl border border-border bg-surface-elevated p-3.5 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Detailed Synopsis */}
      <div className="surface rounded-2xl border border-border p-6 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
          Full Narrative Synopsis / Pitch Summary
        </h2>
        <textarea
          rows={5}
          value={project.synopsis || ""}
          onChange={(e) => onUpdateProject({ synopsis: e.target.value })}
          placeholder="Detailed act breakdown or treatment summary..."
          className="w-full rounded-xl border border-border bg-surface-elevated p-3.5 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none leading-relaxed"
        />
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-tertiary">
          All changes are saved automatically to your private workspace.
        </span>
        {onNextStage && (
          <button
            onClick={onNextStage}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-mono font-semibold text-accent-contrast shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to Stage 02: Research</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
