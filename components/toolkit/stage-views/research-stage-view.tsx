"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FilmProject, ResearchRecord } from "@/data/film-intelligence-types";
import { allResearchEntries, getResearchById } from "@/data/content";

interface StageViewProps {
  project: FilmProject;
  onUpdateProject: (updates: Partial<FilmProject>) => void;
  onNextStage?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

export function ResearchStageView({
  project,
  onUpdateProject,
  onNextStage,
  onMarkComplete,
  isCompleted,
}: StageViewProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const attachedResearchIds = project.researchIds || [];
  const attachedResearch = attachedResearchIds
    .map((id) => getResearchById(id))
    .filter(Boolean);

  const toggleAttachResearch = (id: string) => {
    if (attachedResearchIds.includes(id)) {
      onUpdateProject({
        researchIds: attachedResearchIds.filter((item) => item !== id),
      });
    } else {
      onUpdateProject({
        researchIds: [...attachedResearchIds, id],
      });
    }
  };

  const filteredCatalog = allResearchEntries.filter((r: ResearchRecord) =>
    r.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.findingsSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.researchQuestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="surface rounded-2xl border border-border p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-bold">STAGE 02</span>
            <span className="text-tertiary text-xs">•</span>
            <span className="text-xs font-mono text-secondary uppercase tracking-wider">Verification</span>
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
              {isCompleted ? "✓ Stage 02 Marked Complete" : "Mark Stage Complete"}
            </button>
          )}
        </div>
        <h1 className="text-2xl font-serif text-primary font-bold">Cinema Research & Technical Verification</h1>
        <p className="text-sm text-secondary">
          Ground your project in peer-reviewed optics research, historical documentation, and verified festival regulations.
        </p>
      </div>

      {/* Attached Research Desk */}
      <div className="surface rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Attached Research Dossiers ({attachedResearch.length})
            </h2>
            <p className="text-xs text-tertiary">
              Verified cinema intelligence linked to this film project.
            </p>
          </div>
          <button
            onClick={() => setPickerOpen(true)}
            className="rounded-xl border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-xs font-mono font-semibold text-accent hover:bg-accent/20 cursor-pointer flex items-center gap-1.5"
          >
            <span>+ Attach from Research Desk</span>
          </button>
        </div>

        {attachedResearch.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-subtle p-8 text-center space-y-3">
            <p className="text-sm text-secondary">No research dossiers attached to this project yet.</p>
            <p className="text-xs text-tertiary max-w-md mx-auto">
              Attach verified research on lens characteristics, color theory, historical context, or festival rules to establish technical parameters.
            </p>
            <button
              onClick={() => setPickerOpen(true)}
              className="rounded-lg bg-surface-elevated border border-border px-4 py-2 text-xs font-mono text-accent hover:border-accent cursor-pointer"
            >
              Browse Research Desk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attachedResearch.map((item) => (
              <div
                key={item?.id}
                className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-accent uppercase tracking-wider">
                      {item?.verificationStatus?.replace(/_/g, " ")} • {item?.confidenceLevel} CONFIDENCE
                    </span>
                    <button
                      onClick={() => toggleAttachResearch(item!.id)}
                      className="text-tertiary hover:text-red-400 text-xs font-mono cursor-pointer"
                      title="Detach research dossier"
                    >
                      Detach ✕
                    </button>
                  </div>
                  <h3 className="font-semibold text-sm text-primary leading-tight">
                    {item?.topic}
                  </h3>
                  <p className="text-xs text-secondary line-clamp-3 leading-relaxed">
                    {item?.findingsSummary}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                  <span className="rounded bg-surface px-1.5 py-0.5 text-[9px] font-mono text-tertiary">
                    {item?.entityType}
                  </span>
                  <Link
                    href={`/research/${item?.slug}`}
                    target="_blank"
                    className="text-accent hover:underline text-xs font-mono flex items-center gap-1"
                  >
                    <span>Inspect Dossier</span>
                    <span>↗</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Notes & References */}
      <div className="surface rounded-2xl border border-border p-6 space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
          Director's Field Research & Archival Notes
        </h2>
        <textarea
          rows={4}
          value={project.notes || ""}
          onChange={(e) => onUpdateProject({ notes: e.target.value })}
          placeholder="Document archival references, interviews, historical records, and location research findings..."
          className="w-full rounded-xl border border-border bg-surface-elevated p-3.5 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none leading-relaxed"
        />
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-tertiary">
          Linked research informs automatic visual language and gear package recommendations.
        </span>
        {onNextStage && (
          <button
            onClick={onNextStage}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-mono font-semibold text-accent-contrast shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to Stage 03: Story & Scenes</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Attach Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="surface w-full max-w-2xl max-h-[80vh] rounded-2xl border border-border flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-primary">
                Attach Cinema Research Dossier
              </h3>
              <button
                onClick={() => setPickerOpen(false)}
                className="text-tertiary hover:text-primary font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 border-b border-border-subtle">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search verified research topics, optics, festival rules..."
                className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none"
              />
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
              {filteredCatalog.map((item: ResearchRecord) => {
                const isAttached = attachedResearchIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl border p-3 flex items-center justify-between transition ${
                      isAttached
                        ? "border-accent/40 bg-accent/5"
                        : "border-border-subtle bg-surface hover:border-border"
                    }`}
                  >
                    <div className="space-y-1 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-accent uppercase">
                          {item.verificationStatus} • {item.confidenceLevel}
                        </span>
                        <span className="text-[10px] text-tertiary">• {item.verifiedDate?.slice(0, 4)}</span>
                      </div>
                      <h4 className="font-semibold text-xs text-primary">{item.topic}</h4>
                      <p className="text-[11px] text-secondary line-clamp-1">{item.findingsSummary}</p>
                    </div>

                    <button
                      onClick={() => toggleAttachResearch(item.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition border cursor-pointer ${
                        isAttached
                          ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                          : "bg-accent text-accent-contrast hover:opacity-90"
                      }`}
                    >
                      {isAttached ? "Detach" : "Attach"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-3 border-t border-border flex justify-end">
              <button
                onClick={() => setPickerOpen(false)}
                className="rounded-lg bg-surface-elevated border border-border px-4 py-1.5 text-xs font-mono text-primary hover:border-border-bright cursor-pointer"
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
