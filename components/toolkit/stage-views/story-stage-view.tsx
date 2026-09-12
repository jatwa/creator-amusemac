"use client";

import React, { useState } from "react";
import { FilmProject, ProjectSceneItem, ProjectShotItem } from "@/data/film-intelligence-types";

interface StageViewProps {
  project: FilmProject;
  onUpdateProject: (updates: Partial<FilmProject>) => void;
  onNextStage?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

const FRAMINGS = [
  "EXTREME_WIDE",
  "WIDE",
  "MEDIUM_WIDE",
  "MEDIUM",
  "MEDIUM_CLOSE_UP",
  "CLOSE_UP",
  "EXTREME_CLOSE_UP",
  "INSERT",
  "OVER_THE_SHOULDER",
  "POV",
  "DUTCH_ANGLE",
];

const MOVEMENTS = [
  "STATIC",
  "PAN",
  "TILT",
  "TRACKING",
  "DOLLY_IN",
  "DOLLY_OUT",
  "STEADICAM",
  "HANDHELD",
  "CRANE_JIB",
  "DRONE",
];

export function StoryStageView({
  project,
  onUpdateProject,
  onNextStage,
  onMarkComplete,
  isCompleted,
}: StageViewProps) {
  const scenes = project.scenes || [];
  const [activeSceneId, setActiveSceneId] = useState<string>(
    scenes.length > 0 ? scenes[0].id : ""
  );

  const activeScene = scenes.find((s) => s.id === activeSceneId) || scenes[0];

  const handleAddScene = () => {
    const newSceneNumber = scenes.length + 1;
    const newScene: ProjectSceneItem = {
      id: `scene_${Date.now()}`,
      sceneNumber: newSceneNumber,
      slugline: `EXT. NEW LOCATION - DAY`,
      location: "New Location",
      timeOfDay: "DAY",
      dramaticBeat: "Opening exposition or dramatic shift",
      estDurationSeconds: 120,
      shots: [],
    };
    const updatedScenes = [...scenes, newScene];
    onUpdateProject({ scenes: updatedScenes });
    setActiveSceneId(newScene.id);
  };

  const handleUpdateScene = (sceneId: string, updates: Partial<ProjectSceneItem>) => {
    const updatedScenes = scenes.map((s) => (s.id === sceneId ? { ...s, ...updates } : s));
    onUpdateProject({ scenes: updatedScenes });
  };

  const handleDeleteScene = (sceneId: string) => {
    const updatedScenes = scenes.filter((s) => s.id !== sceneId);
    onUpdateProject({ scenes: updatedScenes });
    if (activeSceneId === sceneId && updatedScenes.length > 0) {
      setActiveSceneId(updatedScenes[0].id);
    }
  };

  const handleAddShot = (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    const shotCount = (scene.shots || []).length;
    const newShot: ProjectShotItem = {
      id: `shot_${Date.now()}`,
      shotNumber: `${scene.sceneNumber}${String.fromCharCode(65 + (shotCount % 26))}`,
      framing: "WIDE",
      cameraMovement: "STATIC",
      focalLength: "35mm",
      lightingNote: "Natural daylight",
      description: "Character enters frame from left.",
      status: "PLANNED",
    };
    const updatedShots = [...(scene.shots || []), newShot];
    handleUpdateScene(sceneId, { shots: updatedShots });
  };

  const handleUpdateShot = (
    sceneId: string,
    shotId: string,
    updates: Partial<ProjectShotItem>
  ) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    const updatedShots = (scene.shots || []).map((shot) =>
      shot.id === shotId ? { ...shot, ...updates } : shot
    );
    handleUpdateScene(sceneId, { shots: updatedShots });
  };

  const handleDeleteShot = (sceneId: string, shotId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return;
    const updatedShots = (scene.shots || []).filter((shot) => shot.id !== shotId);
    handleUpdateScene(sceneId, { shots: updatedShots });
  };

  const totalShots = scenes.reduce((acc, s) => acc + (s.shots?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="surface rounded-2xl border border-border p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-bold">STAGE 03</span>
            <span className="text-tertiary text-xs">•</span>
            <span className="text-xs font-mono text-secondary uppercase tracking-wider">Structure</span>
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
              {isCompleted ? "✓ Stage 03 Marked Complete" : "Mark Stage Complete"}
            </button>
          )}
        </div>
        <h1 className="text-2xl font-serif text-primary font-bold">Story Breakdown & Shot Design</h1>
        <p className="text-sm text-secondary">
          Structure narrative beats into scenes, specify camera coverage, lens choices, and blocking for every setup.
        </p>
      </div>

      {/* Main Breakdown Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenes Sidebar */}
        <div className="lg:col-span-4 surface rounded-2xl border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Scenes ({scenes.length})
              </h2>
              <span className="text-[10px] font-mono text-tertiary">{totalShots} Total Planned Setups</span>
            </div>
            <button
              onClick={handleAddScene}
              className="rounded-lg bg-accent/10 border border-accent/30 px-2.5 py-1 text-xs font-mono font-semibold text-accent hover:bg-accent/20 cursor-pointer"
            >
              + Add Scene
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {scenes.length === 0 ? (
              <p className="text-xs text-tertiary italic p-3 text-center">No scenes created yet.</p>
            ) : (
              scenes.map((scene) => {
                const isActive = scene.id === (activeScene?.id || activeSceneId);
                return (
                  <div
                    key={scene.id}
                    onClick={() => setActiveSceneId(scene.id)}
                    className={`rounded-xl p-3 text-left transition cursor-pointer border ${
                      isActive
                        ? "bg-accent/10 border-accent/40 text-primary shadow-xs"
                        : "bg-surface-elevated border-border-subtle text-secondary hover:text-primary hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-accent">
                        SCENE {scene.sceneNumber}
                      </span>
                      <span className="text-[10px] font-mono text-tertiary">
                        {scene.shots?.length || 0} setups
                      </span>
                    </div>
                    <p className="font-mono text-xs font-semibold mt-1 truncate">{scene.slugline}</p>
                    <p className="text-[11px] text-tertiary line-clamp-1 mt-0.5">{scene.dramaticBeat}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Active Scene Editor & Shot List */}
        <div className="lg:col-span-8 space-y-6">
          {activeScene ? (
            <div className="surface rounded-2xl border border-border p-6 space-y-6">
              {/* Scene Details */}
              <div className="space-y-4 border-b border-border-subtle pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-accent font-bold">
                      EDITING SCENE {activeScene.sceneNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteScene(activeScene.id)}
                    className="text-xs font-mono text-tertiary hover:text-red-400 cursor-pointer"
                  >
                    Delete Scene ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-secondary">Slugline / Header</label>
                    <input
                      type="text"
                      value={activeScene.slugline || ""}
                      onChange={(e) => handleUpdateScene(activeScene.id, { slugline: e.target.value })}
                      placeholder="EXT. LIGHTHOUSE CLIFF - DUSK"
                      className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs font-mono text-primary placeholder-tertiary focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-secondary">Location</label>
                      <input
                        type="text"
                        value={activeScene.location || ""}
                        onChange={(e) => handleUpdateScene(activeScene.id, { location: e.target.value })}
                        placeholder="Cliff / Konkan Coast"
                        className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-secondary">Est. Duration (s)</label>
                      <input
                        type="number"
                        value={activeScene.estDurationSeconds || ""}
                        onChange={(e) => handleUpdateScene(activeScene.id, { estDurationSeconds: Number(e.target.value) || 0 })}
                        placeholder="120"
                        className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs font-mono text-primary placeholder-tertiary focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-secondary">Dramatic Beat / Core Action</label>
                  <textarea
                    rows={2}
                    value={activeScene.dramaticBeat || ""}
                    onChange={(e) => handleUpdateScene(activeScene.id, { dramaticBeat: e.target.value })}
                    placeholder="Elena stands against the gale observing the unearthly luminous storm rolling over the sea."
                    className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Nested Shot Designer */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                      Shot Coverage Matrix ({activeScene.shots?.length || 0} Setups)
                    </h3>
                    <p className="text-[11px] text-tertiary">
                      Design shot setups with specific lens, framing and movement parameters.
                    </p>
                  </div>
                  <button
                    onClick={() => handleAddShot(activeScene.id)}
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-mono font-semibold text-accent-contrast hover:opacity-90 cursor-pointer"
                  >
                    + Add Shot Setup
                  </button>
                </div>

                {(!activeScene.shots || activeScene.shots.length === 0) ? (
                  <div className="rounded-xl border border-dashed border-border-subtle p-6 text-center space-y-2">
                    <p className="text-xs text-secondary">No shot coverage created for this scene yet.</p>
                    <button
                      onClick={() => handleAddShot(activeScene.id)}
                      className="text-xs font-mono text-accent hover:underline cursor-pointer"
                    >
                      Create First Setup (Wide Establishing)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeScene.shots.map((shot, idx) => (
                      <div
                        key={shot.id || idx}
                        className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-accent bg-surface px-2 py-0.5 rounded border border-border">
                              SHOT {shot.shotNumber}
                            </span>
                            <span className="text-xs font-mono text-secondary">
                              {shot.framing} • {shot.focalLength} • {shot.cameraMovement}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteShot(activeScene.id, shot.id)}
                            className="text-tertiary hover:text-red-400 text-xs font-mono cursor-pointer"
                          >
                            Remove ✕
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-tertiary">Framing</label>
                            <select
                              value={shot.framing}
                              onChange={(e) => handleUpdateShot(activeScene.id, shot.id, { framing: e.target.value })}
                              className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-primary focus:border-accent focus:outline-none font-mono"
                            >
                              {FRAMINGS.map((f) => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-tertiary">Movement</label>
                            <select
                              value={shot.cameraMovement}
                              onChange={(e) => handleUpdateShot(activeScene.id, shot.id, { cameraMovement: e.target.value })}
                              className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-primary focus:border-accent focus:outline-none font-mono"
                            >
                              {MOVEMENTS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-tertiary">Focal Length / Lens</label>
                            <input
                              type="text"
                              value={shot.focalLength || ""}
                              onChange={(e) => handleUpdateShot(activeScene.id, shot.id, { focalLength: e.target.value })}
                              placeholder="35mm Anamorphic"
                              className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-primary font-mono placeholder-tertiary focus:border-accent focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-tertiary">Action / Composition</label>
                            <input
                              type="text"
                              value={shot.description || ""}
                              onChange={(e) => handleUpdateShot(activeScene.id, shot.id, { description: e.target.value })}
                              placeholder="Elena turns head toward horizon as sudden lightning illuminates spray."
                              className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-tertiary">Lighting & Contrast Note</label>
                            <input
                              type="text"
                              value={shot.lightingNote || ""}
                              onChange={(e) => handleUpdateShot(activeScene.id, shot.id, { lightingNote: e.target.value })}
                              placeholder="High chiaroscuro, oceanic bioluminescent rim"
                              className="w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="surface rounded-2xl border border-border p-12 text-center space-y-3">
              <p className="text-secondary text-sm">No scene selected.</p>
              <button
                onClick={handleAddScene}
                className="rounded-lg bg-accent px-4 py-2 text-xs font-mono font-semibold text-accent-contrast hover:opacity-90 cursor-pointer"
              >
                Create Scene 1
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-tertiary">
          Scene breakdowns automatically propagate to the Production & Coverage stage.
        </span>
        {onNextStage && (
          <button
            onClick={onNextStage}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-mono font-semibold text-accent-contrast shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to Stage 04: Visual Language</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
