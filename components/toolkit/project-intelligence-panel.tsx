"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FilmProject } from "@/data/film-intelligence-types";
import {
  getResearchById,
  getFilmById,
  getTechniqueById,
  getToolById,
  getPromptById,
  getCanonicalWorkflowById,
  getStandingFestivalById,
} from "@/data/content";

interface ProjectIntelligencePanelProps {
  project: FilmProject;
  onNavigateStage?: (stage: any) => void;
}

export function ProjectIntelligencePanel({
  project,
  onNavigateStage,
}: ProjectIntelligencePanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const attachedResearch = (project.researchIds || [])
    .map((id) => getResearchById(id))
    .filter(Boolean);

  const attachedFilms = (project.filmReferenceIds || [])
    .map((id) => getFilmById(id))
    .filter(Boolean);

  const attachedTechniques = (project.techniqueIds || [])
    .map((id) => getTechniqueById(id))
    .filter(Boolean);

  const attachedTools = (project.toolIds || [])
    .map((id) => getToolById(id))
    .filter(Boolean);

  const attachedPrompts = (project.promptIds || [])
    .map((id) => getPromptById(id))
    .filter(Boolean);

  const attachedWorkflows = (project.workflowIds || [])
    .map((id) => getCanonicalWorkflowById(id))
    .filter(Boolean);

  const targetFestivals = (project.festivalIds || [])
    .map((id) => getStandingFestivalById(id))
    .filter(Boolean);

  // Deterministic Next Recommendations based on project completeness
  const recommendations: { stage: string; action: string; reason: string }[] = [];

  if (!project.logline || project.logline.length < 20) {
    recommendations.push({
      stage: "01_CONCEPT",
      action: "Refine Project Logline",
      reason: "A 1-sentence narrative thesis is required before defining scene breakdowns.",
    });
  }

  if (attachedResearch.length === 0) {
    recommendations.push({
      stage: "02_RESEARCH",
      action: "Attach Verification Research",
      reason: "Link at least 1 verified cinema research dossier (e.g. optics or festival rules).",
    });
  }

  if (!project.scenes || project.scenes.length === 0) {
    recommendations.push({
      stage: "03_STORY",
      action: "Draft First Scene Breakdown",
      reason: "Create opening scene structure and initial shot coverage setups.",
    });
  }

  if (attachedTechniques.length === 0) {
    recommendations.push({
      stage: "04_VISUAL_LANGUAGE",
      action: "Select Core Cinema Techniques",
      reason: "Attach lens optics or lighting techniques to anchor your visual language board.",
    });
  }

  if (attachedWorkflows.length === 0) {
    recommendations.push({
      stage: "05_PRE_PRODUCTION",
      action: "Attach Production Playbook",
      reason: "Select a verified pipeline workflow (e.g. Lookbook or AI Previs) to guide production.",
    });
  }

  if (targetFestivals.length === 0) {
    recommendations.push({
      stage: "08_FESTIVAL",
      action: "Select Target Film Festivals",
      reason: "Identify target premiere window to audit delivery specs and premiere exclusivity.",
    });
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="surface fixed right-4 bottom-4 z-40 rounded-full border border-border bg-surface-elevated p-3 shadow-2xl text-xs font-mono text-accent hover:border-accent transition flex items-center gap-2 cursor-pointer"
        aria-label="Open Project Intelligence Panel"
      >
        <span>⚡</span>
        <span className="font-semibold">Project Intelligence ({attachedTechniques.length + attachedTools.length + attachedWorkflows.length})</span>
      </button>
    );
  }

  return (
    <aside className="surface rounded-2xl border border-border p-5 space-y-6 text-xs sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div className="flex items-center gap-2">
          <span className="text-accent text-sm">⚡</span>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-primary font-mono">
            Project Intelligence
          </h2>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-tertiary hover:text-primary font-mono text-[11px] cursor-pointer"
        >
          Minimize ✕
        </button>
      </div>

      {/* Next Actions (Deterministic) */}
      {recommendations.length > 0 && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 space-y-2.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold block">
            Next Recommended Decisions
          </span>
          <div className="space-y-2">
            {recommendations.slice(0, 3).map((rec, idx) => (
              <div
                key={idx}
                onClick={() => onNavigateStage && onNavigateStage(rec.stage)}
                className="rounded-lg bg-surface border border-border p-2.5 space-y-1 hover:border-accent/40 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-primary text-[11px]">{rec.action}</span>
                  <span className="text-[9px] font-mono text-accent">Stage {rec.stage.slice(0, 2)} →</span>
                </div>
                <p className="text-[11px] text-secondary leading-snug">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connected Graph Links */}
      <div className="space-y-4">
        {/* Attached Techniques */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-tertiary">
            <span>Attached Techniques ({attachedTechniques.length})</span>
            <Link href="/techniques" className="text-accent hover:underline text-[10px]">
              Browse →
            </Link>
          </div>
          {attachedTechniques.length === 0 ? (
            <p className="text-tertiary italic text-[11px]">No techniques attached yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {attachedTechniques.map((tech) => (
                <Link
                  key={tech?.id}
                  href={`/techniques/${tech?.slug}`}
                  className="rounded-md border border-accent/20 bg-accent/5 px-2 py-0.5 text-accent font-mono text-[10px] hover:border-accent"
                >
                  {tech?.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Attached Tools */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-tertiary">
            <span>Tool Stack ({attachedTools.length})</span>
            <Link href="/tools" className="text-accent hover:underline text-[10px]">
              Browse →
            </Link>
          </div>
          {attachedTools.length === 0 ? (
            <p className="text-tertiary italic text-[11px]">No tools selected yet.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {attachedTools.map((tool) => (
                <Link
                  key={tool?.id}
                  href={`/tools/${tool?.slug}`}
                  className="rounded-md border border-border bg-surface-elevated px-2 py-0.5 text-secondary font-mono text-[10px] hover:text-primary"
                >
                  {tool?.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Attached Prompts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-tertiary">
            <span>Linked Prompts ({attachedPrompts.length})</span>
            <Link href="/prompts" className="text-accent hover:underline text-[10px]">
              Browse →
            </Link>
          </div>
          {attachedPrompts.length === 0 ? (
            <p className="text-tertiary italic text-[11px]">No prompt recipes attached.</p>
          ) : (
            <div className="space-y-1.5">
              {attachedPrompts.map((prompt) => (
                <Link
                  key={prompt?.id}
                  href={`/prompts/${prompt?.slug}`}
                  className="block rounded-lg border border-border-subtle bg-surface-elevated p-2 text-primary hover:border-accent/40 transition"
                >
                  <p className="font-semibold text-[11px] truncate">{prompt?.title}</p>
                  <p className="text-[10px] font-mono text-accent truncate">{prompt?.useCase}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Attached Workflows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-tertiary">
            <span>Production Playbooks ({attachedWorkflows.length})</span>
            <Link href="/workflows" className="text-accent hover:underline text-[10px]">
              Browse →
            </Link>
          </div>
          {attachedWorkflows.length === 0 ? (
            <p className="text-tertiary italic text-[11px]">No workflows linked yet.</p>
          ) : (
            <div className="space-y-1.5">
              {attachedWorkflows.map((wf) => (
                <Link
                  key={wf?.id}
                  href={`/workflows/${wf?.slug}`}
                  className="block rounded-lg border border-border-subtle bg-surface-elevated p-2 hover:border-accent/40 transition"
                >
                  <p className="font-semibold text-[11px] text-primary truncate">{wf?.title}</p>
                  <span className="text-[10px] font-mono text-tertiary">
                    {wf?.steps.length} Phases • {wf?.difficulty}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Target Festivals */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-tertiary">
            <span>Target Festivals ({targetFestivals.length})</span>
            <Link href="/festivals" className="text-accent hover:underline text-[10px]">
              Browse →
            </Link>
          </div>
          {targetFestivals.length === 0 ? (
            <p className="text-tertiary italic text-[11px]">No target festivals attached.</p>
          ) : (
            <div className="space-y-1.5">
              {targetFestivals.map((fest) => (
                <Link
                  key={fest?.id}
                  href={`/festivals/${fest?.slug}`}
                  className="block rounded-lg border border-border-subtle bg-surface-elevated p-2 hover:border-accent/40 transition"
                >
                  <p className="font-semibold text-[11px] text-primary truncate">{fest?.name}</p>
                  <span className="text-[10px] font-mono text-tertiary">
                    {fest?.hostCity}, {fest?.hostCountry} • {fest?.prestigeTier}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Reference Films */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-tertiary">
            <span>Reference Films ({attachedFilms.length})</span>
            <Link href="/films" className="text-accent hover:underline text-[10px]">
              Browse →
            </Link>
          </div>
          {attachedFilms.length === 0 ? (
            <p className="text-tertiary italic text-[11px]">No reference films saved.</p>
          ) : (
            <div className="space-y-1.5">
              {attachedFilms.map((film) => (
                <Link
                  key={film?.id}
                  href={`/films/${film?.slug}`}
                  className="block rounded-lg border border-border-subtle bg-surface-elevated p-2 hover:border-accent/40 transition"
                >
                  <p className="font-semibold text-[11px] text-primary truncate">{film?.title}</p>
                  <span className="text-[10px] font-mono text-tertiary">
                    {film?.releaseYear} • {film?.technicalSpecs.aspectRatio}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
