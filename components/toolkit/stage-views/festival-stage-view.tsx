"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FilmFestival, FilmProject } from "@/data/film-intelligence-types";
import { allStandingFestivals, getStandingFestivalById } from "@/data/content";

interface StageViewProps {
  project: FilmProject;
  onUpdateProject: (updates: Partial<FilmProject>) => void;
  onNextStage?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

const MASTER_DELIVERY_CHECKLIST = [
  { id: "dcp", category: "Exhibition", label: "SMPTE DCI-Compliant DCP (24fps, Unencrypted)", official: true },
  { id: "prores", category: "Exhibition", label: "ProRes 422 HQ / 4444 Theatrical Backup File", official: true },
  { id: "dialogue_list", category: "Deliverables", label: "Timecode-Accurate English Dialogue & Spotting List", official: true },
  { id: "music_cue", category: "Legal / Rights", label: "Complete Music Cue Sheet (PRO, Composers, Durations)", official: true },
  { id: "chain_of_title", category: "Legal / Rights", label: "Chain of Title & Copyright Clearances", official: true },
  { id: "subtitles_srt", category: "Deliverables", label: "English Subtitles (.SRT & .VTT formatted)", official: true },
  { id: "audio_51", category: "Audio", label: "5.1 Surround Print Master (-24 LKFS ±1 LUFS)", official: true },
  { id: "audio_stereo", category: "Audio", label: "Stereo 2.0 Lt/Rt Mix Master", official: true },
  { id: "epk_pdf", category: "Marketing", label: "Electronic Press Kit (EPK) in PDF Format", official: false },
  { id: "film_stills", category: "Marketing", label: "5+ High-Resolution Film Stills (300 DPI, Uncompressed)", official: true },
  { id: "director_bio", category: "Marketing", label: "Director Bio (50-word & 150-word) + Headshot", official: true },
  { id: "poster_hi_res", category: "Marketing", label: "Official Poster Artwork (Vertical 27x40 & Digital 16:9)", official: true },
  { id: "trailer_prores", category: "Marketing", label: "Official Teaser / Trailer (ProRes & Web MP4)", official: false },
  { id: "premiere_audit", category: "Strategy", label: "Premiere Exclusivity & Territory Verification", official: false },
];

export function FestivalStageView({
  project,
  onUpdateProject,
  onNextStage,
  onMarkComplete,
  isCompleted,
}: StageViewProps) {
  const [festivalModalOpen, setFestivalModalOpen] = useState(false);
  const [checklist, setChecklist] = useState<string[]>(
    (project as any).deliveryChecklist || [
      "dcp",
      "dialogue_list",
      "music_cue",
      "subtitles_srt",
      "film_stills",
      "director_bio",
      "poster_hi_res",
    ]
  );

  const targetFestivals = (project.festivalIds || [])
    .map((id) => getStandingFestivalById(id))
    .filter(Boolean);

  const toggleAttachFestival = (id: string) => {
    const current = project.festivalIds || [];
    if (current.includes(id)) {
      onUpdateProject({ festivalIds: current.filter((item) => item !== id) });
    } else {
      onUpdateProject({ festivalIds: [...current, id] });
    }
  };

  const handleToggleChecklistItem = (id: string) => {
    const updated = checklist.includes(id)
      ? checklist.filter((item) => item !== id)
      : [...checklist, id];
    setChecklist(updated);
    onUpdateProject({ ...project, deliveryChecklist: updated } as any);
  };

  const checklistProgress = Math.round((checklist.length / MASTER_DELIVERY_CHECKLIST.length) * 100);

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="surface rounded-2xl border border-border p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-bold">STAGE 08</span>
            <span className="text-tertiary text-xs">•</span>
            <span className="text-xs font-mono text-secondary uppercase tracking-wider">Strategy</span>
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
              {isCompleted ? "✓ Stage 08 Marked Complete" : "Mark Stage Complete"}
            </button>
          )}
        </div>
        <h1 className="text-2xl font-serif text-primary font-bold">Festival Strategy & Master Delivery Desk</h1>
        <p className="text-sm text-secondary">
          Target prestigious festival editions, audit premiere exclusivity requirements, and verify DCI delivery packages.
        </p>
      </div>

      {/* Target Festivals */}
      <div className="surface rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Target Festival Campaign ({targetFestivals.length})
            </h2>
            <p className="text-xs text-tertiary">
              Standing festivals and editions targeted for world, international, or regional premiere.
            </p>
          </div>
          <button
            onClick={() => setFestivalModalOpen(true)}
            className="rounded-lg bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-mono font-semibold text-accent hover:bg-accent/20 cursor-pointer"
          >
            + Target Festival
          </button>
        </div>

        {targetFestivals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-subtle p-8 text-center space-y-2">
            <p className="text-xs text-secondary">No target festivals selected yet.</p>
            <p className="text-xs text-tertiary">
              Select festival editions to automatically track submission deadlines, premiere rules, and delivery guidelines.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {targetFestivals.map((fest) => (
              <div
                key={fest?.id}
                className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-accent border border-accent/30 px-1.5 py-0.5 rounded">
                      {fest?.prestigeTier}
                    </span>
                    <button
                      onClick={() => toggleAttachFestival(fest!.id)}
                      className="text-tertiary hover:text-red-400 text-xs font-mono cursor-pointer"
                    >
                      Remove ✕
                    </button>
                  </div>
                  <h3 className="font-bold text-sm text-primary">{fest?.name}</h3>
                  <p className="text-xs text-secondary">
                    📍 {fest?.hostCity}, {fest?.hostCountry} • Founded: {fest?.foundedYear}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <div className="rounded-lg bg-surface p-2.5 space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-accent">
                      <span>✓ OFFICIAL STATUS</span>
                    </div>
                    <p className="text-secondary leading-tight line-clamp-2">{fest?.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-tertiary">
                      {fest?.fiapfAccredited ? "FIAPF Accredited" : "Independent Circuit"}
                    </span>
                    <Link
                      href={`/festivals/${fest?.slug}`}
                      target="_blank"
                      className="text-accent hover:underline text-xs font-mono flex items-center gap-1"
                    >
                      <span>Festival Intelligence</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Master Delivery Checklist */}
      <div className="surface rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Master Exhibition & Delivery Checklist
            </h2>
            <p className="text-xs text-tertiary">
              {checklist.length} of {MASTER_DELIVERY_CHECKLIST.length} required assets ready ({checklistProgress}%)
            </p>
          </div>
          <div className="w-28 bg-surface-elevated rounded-full h-2 overflow-hidden border border-border">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${checklistProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MASTER_DELIVERY_CHECKLIST.map((item) => {
            const isChecked = checklist.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleToggleChecklistItem(item.id)}
                className={`rounded-xl border p-3 flex items-start gap-3 cursor-pointer transition ${
                  isChecked
                    ? "border-emerald-500/30 bg-emerald-500/5 text-primary"
                    : "border-border-subtle bg-surface-elevated hover:border-border text-secondary"
                }`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                    isChecked
                      ? "bg-emerald-500 border-emerald-500 text-black"
                      : "border-border bg-surface text-transparent"
                  }`}
                >
                  ✓
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-surface border border-border text-tertiary">
                      {item.category}
                    </span>
                    {item.official ? (
                      <span className="font-mono text-[9px] text-amber-400">OFFICIAL REQ</span>
                    ) : (
                      <span className="font-mono text-[9px] text-accent">RECOMMENDED</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-tight">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-tertiary">
          All festival requirements conform to FIAPF and Academy standards.
        </span>
        {onNextStage && (
          <button
            onClick={onNextStage}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-mono font-semibold text-accent-contrast shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to Stage 09: Archive & Export</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Festival Modal */}
      {festivalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="surface w-full max-w-xl max-h-[70vh] rounded-2xl border border-border flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Target Standing Festivals
              </h3>
              <button
                onClick={() => setFestivalModalOpen(false)}
                className="text-tertiary hover:text-primary font-mono text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {allStandingFestivals.map((fest: FilmFestival) => {
                const isTarget = (project.festivalIds || []).includes(fest.id);
                return (
                  <div
                    key={fest.id}
                    className="rounded-xl border border-border bg-surface p-3 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 max-w-[75%]">
                      <p className="font-semibold text-xs text-primary">{fest.name}</p>
                      <p className="text-[10px] font-mono text-tertiary">
                        {fest.hostCity}, {fest.hostCountry} • {fest.prestigeTier}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleAttachFestival(fest.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer ${
                        isTarget
                          ? "bg-red-500/10 border border-red-500/30 text-red-400"
                          : "bg-accent text-accent-contrast"
                      }`}
                    >
                      {isTarget ? "Remove" : "Target"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t border-border flex justify-end">
              <button
                onClick={() => setFestivalModalOpen(false)}
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
