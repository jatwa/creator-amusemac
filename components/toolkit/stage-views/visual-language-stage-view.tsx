"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Film, FilmProject, ProjectVisualLanguage, ColorSwatchItem, Technique } from "@/data/film-intelligence-types";
import {
  allFilms,
  allTechniques,
  getFilmById,
  getTechniqueById,
} from "@/data/content";

interface StageViewProps {
  project: FilmProject;
  onUpdateProject: (updates: Partial<FilmProject>) => void;
  onNextStage?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

const DEFAULT_SWATCHES: ColorSwatchItem[] = [
  { hex: "#1A2530", label: "Midnight Sea", role: "Shadows / Deep ocean" },
  { hex: "#4A6B82", label: "Storm Indigo", role: "Midtones / Cloud layer" },
  { hex: "#D4B07B", label: "Lighthouse Amber", role: "Key light / Incandescent beacon" },
  { hex: "#E8ECEF", label: "Sea Foam Mist", role: "Highlights / Coastal spray" },
];

const DEFAULT_VISUAL: ProjectVisualLanguage = {
  aspectRatio: "2.39:1 Anamorphic",
  colorPalette: DEFAULT_SWATCHES,
  lightingRatio: "High contrast (4:1 key-to-fill) with motivated practical sources.",
  opticsDescription: "Vintage Cooke anamorphic glass for warm flares, gentle roll-off and organic distortion.",
  cameraMovementPhilosophy: "Deliberate slow dolly tracking shots punctuated by motionless contemplative tableaux.",
  grainTexture: "Subtle 35mm organic film grain emulation with rich shadow detail.",
};

const ASPECT_RATIOS = [
  "2.39:1 Anamorphic Scope",
  "1.85:1 Flat Theatrical",
  "2.00:1 Univisium / Modern Streaming",
  "1.33:1 Academy 4:3",
  "1.66:1 European Widescreen",
  "1.43:1 IMAX Theatrical",
];

export function VisualLanguageStageView({
  project,
  onUpdateProject,
  onNextStage,
  onMarkComplete,
  isCompleted,
}: StageViewProps) {
  const visual = project.visualLanguage || DEFAULT_VISUAL;
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const [techModalOpen, setTechModalOpen] = useState(false);

  const swatches: ColorSwatchItem[] = (visual.colorPalette || DEFAULT_SWATCHES).map((s) => {
    if (typeof s === "string") {
      return { hex: s, label: s, role: "Palette Tone" };
    }
    return s;
  });

  const attachedFilms = (project.filmReferenceIds || [])
    .map((id) => getFilmById(id))
    .filter(Boolean);

  const attachedTechniques = (project.techniqueIds || [])
    .map((id) => getTechniqueById(id))
    .filter(Boolean);

  const handleUpdateVisual = (updates: Partial<ProjectVisualLanguage>) => {
    onUpdateProject({
      visualLanguage: {
        ...visual,
        ...updates,
      },
    });
  };

  const handleAddSwatch = () => {
    const newSwatches: ColorSwatchItem[] = [
      ...swatches,
      { hex: "#888888", label: "New Tone", role: "Accent / Texture" },
    ];
    handleUpdateVisual({ colorPalette: newSwatches });
  };

  const handleUpdateSwatch = (
    index: number,
    updates: Partial<ColorSwatchItem>
  ) => {
    const newSwatches = [...swatches];
    newSwatches[index] = { ...newSwatches[index], ...updates };
    handleUpdateVisual({ colorPalette: newSwatches });
  };

  const handleDeleteSwatch = (index: number) => {
    const newSwatches = swatches.filter((_, i) => i !== index);
    handleUpdateVisual({ colorPalette: newSwatches });
  };

  const toggleAttachFilm = (id: string) => {
    const current = project.filmReferenceIds || [];
    if (current.includes(id)) {
      onUpdateProject({ filmReferenceIds: current.filter((item) => item !== id) });
    } else {
      onUpdateProject({ filmReferenceIds: [...current, id] });
    }
  };

  const toggleAttachTechnique = (id: string) => {
    const current = project.techniqueIds || [];
    if (current.includes(id)) {
      onUpdateProject({ techniqueIds: current.filter((item) => item !== id) });
    } else {
      onUpdateProject({ techniqueIds: [...current, id] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="surface rounded-2xl border border-border p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-bold">STAGE 04</span>
            <span className="text-tertiary text-xs">•</span>
            <span className="text-xs font-mono text-secondary uppercase tracking-wider">Aesthetics</span>
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
              {isCompleted ? "✓ Stage 04 Marked Complete" : "Mark Stage Complete"}
            </button>
          )}
        </div>
        <h1 className="text-2xl font-serif text-primary font-bold">Visual Language & Aesthetic Bible</h1>
        <p className="text-sm text-secondary">
          Define the optical grammar, color chemistry, aspect ratio, and lighting philosophy governing the cinematic universe.
        </p>
      </div>

      {/* Grid of Optics & Core Aesthetic Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aspect Ratio & Optics */}
        <div className="surface rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
            Frame Geometry & Optics
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-secondary">Aspect Ratio Standard</label>
            <select
              value={visual.aspectRatio || "2.39:1 Anamorphic Scope"}
              onChange={(e) => handleUpdateVisual({ aspectRatio: e.target.value })}
              className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2.5 text-xs font-mono text-primary focus:border-accent focus:outline-none"
            >
              {ASPECT_RATIOS.map((ar) => (
                <option key={ar} value={ar}>{ar}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-secondary">Optics & Glass Character</label>
            <textarea
              rows={3}
              value={visual.opticsDescription || ""}
              onChange={(e) => handleUpdateVisual({ opticsDescription: e.target.value })}
              placeholder="Vintage anamorphic lenses, gentle flare character, low-contrast multi-coating..."
              className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-secondary">Texture & Grain Profile</label>
            <input
              type="text"
              value={visual.grainTexture || ""}
              onChange={(e) => handleUpdateVisual({ grainTexture: e.target.value })}
              placeholder="e.g. Kodak Vision3 500T 35mm grain profile with soft highlight halation"
              className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Lighting & Camera Movement */}
        <div className="surface rounded-2xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
            Lighting & Kinetic Philosophy
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-secondary">Lighting Philosophy & Contrast Ratio</label>
            <textarea
              rows={3}
              value={visual.lightingRatio || ""}
              onChange={(e) => handleUpdateVisual({ lightingRatio: e.target.value })}
              placeholder="High contrast chiaroscuro with motivated tungsten key lights and deep maritime shadow falloff..."
              className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none leading-relaxed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-secondary">Camera Movement Grammar</label>
            <textarea
              rows={3}
              value={visual.cameraMovementPhilosophy || ""}
              onChange={(e) => handleUpdateVisual({ cameraMovementPhilosophy: e.target.value })}
              placeholder="Static observational tripod shots for domestic scenes; fluid slow tracking dollies during storms..."
              className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Color Palette Swatches Board */}
      <div className="surface rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Chromatic Palette & Color Swatches
            </h2>
            <p className="text-xs text-tertiary">
              Master color grades, mood anchors, and lighting chromaticity.
            </p>
          </div>
          <button
            onClick={handleAddSwatch}
            className="rounded-lg bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-mono font-semibold text-accent hover:bg-accent/20 cursor-pointer"
          >
            + Add Swatch
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {swatches.map((swatch, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border bg-surface-elevated p-3 space-y-2.5 overflow-hidden"
            >
              <div
                className="w-full h-16 rounded-lg border border-white/10 shadow-inner flex items-end justify-between p-2"
                style={{ backgroundColor: swatch.hex }}
              >
                <input
                  type="color"
                  value={swatch.hex}
                  onChange={(e) => handleUpdateSwatch(idx, { hex: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="font-mono text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                  {swatch.hex.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  value={swatch.label}
                  onChange={(e) => handleUpdateSwatch(idx, { label: e.target.value })}
                  placeholder="Swatch Name"
                  className="w-full rounded border border-border bg-surface px-2 py-1 text-xs font-semibold text-primary focus:border-accent focus:outline-none"
                />
                <input
                  type="text"
                  value={swatch.role}
                  onChange={(e) => handleUpdateSwatch(idx, { role: e.target.value })}
                  placeholder="Role in frame"
                  className="w-full rounded border border-border bg-surface px-2 py-1 text-[11px] text-secondary placeholder-tertiary focus:border-accent focus:outline-none"
                />
              </div>

              <button
                onClick={() => handleDeleteSwatch(idx)}
                className="text-[10px] font-mono text-tertiary hover:text-red-400 cursor-pointer w-full text-right"
              >
                Delete Swatch ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Connected References: Film & Techniques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reference Films */}
        <div className="surface rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Reference Cinema ({attachedFilms.length})
            </h2>
            <button
              onClick={() => setFilmModalOpen(true)}
              className="text-xs font-mono text-accent hover:underline cursor-pointer"
            >
              + Link Films
            </button>
          </div>

          {attachedFilms.length === 0 ? (
            <p className="text-xs text-tertiary italic">No reference films linked yet.</p>
          ) : (
            <div className="space-y-2">
              {attachedFilms.map((film) => (
                <div
                  key={film?.id}
                  className="rounded-xl border border-border bg-surface-elevated p-3 flex items-center justify-between"
                >
                  <div>
                    <Link
                      href={`/films/${film?.slug}`}
                      target="_blank"
                      className="font-semibold text-xs text-primary hover:text-accent"
                    >
                      {film?.title} ({film?.releaseYear})
                    </Link>
                    <p className="text-[10px] font-mono text-tertiary">
                      Ratio: {film?.technicalSpecs.aspectRatio} • Format: {film?.format}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAttachFilm(film!.id)}
                    className="text-xs font-mono text-tertiary hover:text-red-400 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Attached Techniques */}
        <div className="surface rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Cinematic Techniques ({attachedTechniques.length})
            </h2>
            <button
              onClick={() => setTechModalOpen(true)}
              className="text-xs font-mono text-accent hover:underline cursor-pointer"
            >
              + Link Techniques
            </button>
          </div>

          {attachedTechniques.length === 0 ? (
            <p className="text-xs text-tertiary italic">No techniques linked yet.</p>
          ) : (
            <div className="space-y-2">
              {attachedTechniques.map((tech) => (
                <div
                  key={tech?.id}
                  className="rounded-xl border border-border bg-surface-elevated p-3 flex items-center justify-between"
                >
                  <div>
                    <Link
                      href={`/techniques/${tech?.slug}`}
                      target="_blank"
                      className="font-semibold text-xs text-primary hover:text-accent"
                    >
                      {tech?.name}
                    </Link>
                    <p className="text-[10px] font-mono text-tertiary">
                      {tech?.category} • {tech?.difficulty}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAttachTechnique(tech!.id)}
                    className="text-xs font-mono text-tertiary hover:text-red-400 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-tertiary">
          Aesthetic parameters guide prompt generation and color grading pipeline specifications.
        </span>
        {onNextStage && (
          <button
            onClick={onNextStage}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-mono font-semibold text-accent-contrast shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to Stage 05: Pre-Production</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Link Film Modal */}
      {filmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="surface w-full max-w-xl max-h-[70vh] rounded-2xl border border-border flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Link Canonical Reference Films
              </h3>
              <button
                onClick={() => setFilmModalOpen(false)}
                className="text-tertiary hover:text-primary font-mono text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {allFilms.map((f: Film) => {
                const isLinked = (project.filmReferenceIds || []).includes(f.id);
                return (
                  <div
                    key={f.id}
                    className="rounded-xl border border-border bg-surface p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-xs text-primary">{f.title} ({f.releaseYear})</p>
                      <p className="text-[10px] font-mono text-tertiary">{f.technicalSpecs.aspectRatio}</p>
                    </div>
                    <button
                      onClick={() => toggleAttachFilm(f.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer ${
                        isLinked
                          ? "bg-red-500/10 border border-red-500/30 text-red-400"
                          : "bg-accent text-accent-contrast"
                      }`}
                    >
                      {isLinked ? "Unlink" : "Link"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t border-border flex justify-end">
              <button
                onClick={() => setFilmModalOpen(false)}
                className="rounded-lg bg-surface-elevated border border-border px-3.5 py-1.5 text-xs font-mono text-primary cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Technique Modal */}
      {techModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="surface w-full max-w-xl max-h-[70vh] rounded-2xl border border-border flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Link Cinematic Techniques
              </h3>
              <button
                onClick={() => setTechModalOpen(false)}
                className="text-tertiary hover:text-primary font-mono text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {allTechniques.map((t: Technique) => {
                const isLinked = (project.techniqueIds || []).includes(t.id);
                return (
                  <div
                    key={t.id}
                    className="rounded-xl border border-border bg-surface p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-xs text-primary">{t.name}</p>
                      <p className="text-[10px] font-mono text-tertiary">{t.category}</p>
                    </div>
                    <button
                      onClick={() => toggleAttachTechnique(t.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer ${
                        isLinked
                          ? "bg-red-500/10 border border-red-500/30 text-red-400"
                          : "bg-accent text-accent-contrast"
                      }`}
                    >
                      {isLinked ? "Unlink" : "Link"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t border-border flex justify-end">
              <button
                onClick={() => setTechModalOpen(false)}
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
