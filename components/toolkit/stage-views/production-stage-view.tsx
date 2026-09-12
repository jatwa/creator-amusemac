"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FilmProject, ProjectShotItem } from "@/data/film-intelligence-types";
import { Tool } from "@/data/types";
import { allTools, getToolById } from "@/data/content";

interface StageViewProps {
  project: FilmProject;
  onUpdateProject: (updates: Partial<FilmProject>) => void;
  onNextStage?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

export function ProductionStageView({
  project,
  onUpdateProject,
  onNextStage,
  onMarkComplete,
  isCompleted,
}: StageViewProps) {
  const [toolModalOpen, setToolModalOpen] = useState(false);

  const scenes = project.scenes || [];
  const attachedTools = (project.toolIds || [])
    .map((id) => getToolById(id))
    .filter(Boolean);

  const totalShots = scenes.reduce((acc, s) => acc + (s.shots?.length || 0), 0);
  const completedShots = scenes.reduce(
    (acc, s) => acc + (s.shots?.filter((shot) => shot.status === "SHOT" || shot.status === "IN_POST").length || 0),
    0
  );

  const handleShotStatusChange = (
    sceneId: string,
    shotId: string,
    newStatus: "PLANNED" | "SHOT" | "DROPPED" | "IN_POST"
  ) => {
    const updatedScenes = scenes.map((s) => {
      if (s.id !== sceneId) return s;
      const updatedShots = (s.shots || []).map((shot) =>
        shot.id === shotId ? { ...shot, status: newStatus } : shot
      );
      return { ...s, shots: updatedShots };
    });
    onUpdateProject({ scenes: updatedScenes });
  };

  const toggleAttachTool = (id: string) => {
    const current = project.toolIds || [];
    if (current.includes(id)) {
      onUpdateProject({ toolIds: current.filter((item) => item !== id) });
    } else {
      onUpdateProject({ toolIds: [...current, id] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="surface rounded-2xl border border-border p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-bold">STAGE 06</span>
            <span className="text-tertiary text-xs">•</span>
            <span className="text-xs font-mono text-secondary uppercase tracking-wider">Execution</span>
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
              {isCompleted ? "✓ Stage 06 Marked Complete" : "Mark Stage Complete"}
            </button>
          )}
        </div>
        <h1 className="text-2xl font-serif text-primary font-bold">Production & Set Coverage Matrix</h1>
        <p className="text-sm text-secondary">
          Track set execution, mark captured camera coverage, and manage production camera gear packages.
        </p>
      </div>

      {/* Coverage Meter */}
      <div className="surface rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Set Coverage Tracker
            </h2>
            <p className="text-xs text-tertiary">
              {completedShots} of {totalShots} planned setups captured
            </p>
          </div>
          <span className="text-sm font-mono font-bold text-accent">
            {totalShots > 0 ? Math.round((completedShots / totalShots) * 100) : 0}% Complete
          </span>
        </div>

        {/* Master Shot Matrix */}
        {scenes.length === 0 ? (
          <p className="text-xs text-tertiary italic p-4 text-center">
            No scenes configured. Build scenes and setups in Stage 03 (Story & Scenes).
          </p>
        ) : (
          <div className="space-y-4">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent">
                      SCENE {scene.sceneNumber}
                    </span>
                    <span className="font-mono text-xs text-primary font-semibold truncate">
                      {scene.slugline}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-tertiary">
                    {scene.shots?.length || 0} setups
                  </span>
                </div>

                {(!scene.shots || scene.shots.length === 0) ? (
                  <p className="text-[11px] text-tertiary italic">No shots defined in this scene.</p>
                ) : (
                  <div className="space-y-2">
                    {scene.shots.map((shot) => {
                      const isShot = shot.status === "SHOT";
                      const isInPost = shot.status === "IN_POST";
                      const isDropped = shot.status === "DROPPED";

                      return (
                        <div
                          key={shot.id}
                          className="rounded-lg border border-border-subtle bg-surface p-3 flex items-center justify-between gap-4"
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-accent">
                                {shot.shotNumber}
                              </span>
                              <span className="font-mono text-[10px] text-tertiary uppercase">
                                {shot.framing} • {shot.focalLength}
                              </span>
                            </div>
                            <p className="text-xs text-secondary truncate">{shot.description}</p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {(["PLANNED", "SHOT", "IN_POST", "DROPPED"] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => handleShotStatusChange(scene.id, shot.id, st)}
                                className={`rounded px-2 py-0.5 font-mono text-[10px] font-semibold cursor-pointer transition ${
                                  shot.status === st
                                    ? st === "SHOT"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                      : st === "IN_POST"
                                      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/40"
                                      : st === "DROPPED"
                                      ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                      : "bg-surface-elevated text-primary border border-border-bright"
                                    : "bg-transparent text-tertiary hover:text-secondary"
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Production Gear & Tool Stack */}
      <div className="surface rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Production Gear & Tool Package ({attachedTools.length})
            </h2>
            <p className="text-xs text-tertiary">
              Camera bodies, lenses, stabilizers, and software tools.
            </p>
          </div>
          <button
            onClick={() => setToolModalOpen(true)}
            className="rounded-lg bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-mono font-semibold text-accent hover:bg-accent/20 cursor-pointer"
          >
            + Add Gear / Tool
          </button>
        </div>

        {attachedTools.length === 0 ? (
          <p className="text-xs text-tertiary italic">No production tools specified.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {attachedTools.map((tool) => (
              <div
                key={tool?.id}
                className="rounded-xl border border-border bg-surface-elevated p-3 space-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-accent uppercase">{tool?.category}</span>
                    <button
                      onClick={() => toggleAttachTool(tool!.id)}
                      className="text-tertiary hover:text-red-400 text-xs font-mono cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="font-semibold text-xs text-primary">{tool?.name}</h4>
                  <p className="text-[11px] text-secondary line-clamp-1">{tool?.tagline}</p>
                </div>

                <Link
                  href={`/tools/${tool?.slug}`}
                  target="_blank"
                  className="text-accent hover:underline text-[10px] font-mono text-right block"
                >
                  Specs ↗
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-tertiary">
          Coverage data feeds editorial assembly and rough-cut tracking.
        </span>
        {onNextStage && (
          <button
            onClick={onNextStage}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-mono font-semibold text-accent-contrast shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to Stage 07: Post & Finish</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Tool Modal */}
      {toolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="surface w-full max-w-xl max-h-[70vh] rounded-2xl border border-border flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Add Production Tool / Gear
              </h3>
              <button
                onClick={() => setToolModalOpen(false)}
                className="text-tertiary hover:text-primary font-mono text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {allTools.map((t: Tool) => {
                const isAttached = (project.toolIds || []).includes(t.id);
                return (
                  <div
                    key={t.id}
                    className="rounded-xl border border-border bg-surface p-3 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 max-w-[75%]">
                      <p className="font-semibold text-xs text-primary">{t.name}</p>
                      <p className="text-[10px] font-mono text-tertiary">{t.category} • {t.tagline}</p>
                    </div>
                    <button
                      onClick={() => toggleAttachTool(t.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer ${
                        isAttached
                          ? "bg-red-500/10 border border-red-500/30 text-red-400"
                          : "bg-accent text-accent-contrast"
                      }`}
                    >
                      {isAttached ? "Remove" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t border-border flex justify-end">
              <button
                onClick={() => setToolModalOpen(false)}
                className="rounded-lg bg-surface-elevated border border-border px-3.5 py-1.5 text-xs font-mono text-primary cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
