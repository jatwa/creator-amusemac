"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FilmProject, ProjectWorkflowStateItem, CanonicalWorkflow } from "@/data/film-intelligence-types";
import { Prompt } from "@/data/types";
import {
  allCanonicalWorkflows,
  allPrompts,
  getCanonicalWorkflowById,
  getPromptById,
} from "@/data/content";

interface StageViewProps {
  project: FilmProject;
  onUpdateProject: (updates: Partial<FilmProject>) => void;
  onNextStage?: () => void;
  onMarkComplete?: () => void;
  isCompleted?: boolean;
}

export function PreProductionStageView({
  project,
  onUpdateProject,
  onNextStage,
  onMarkComplete,
  isCompleted,
}: StageViewProps) {
  const [workflowModalOpen, setWorkflowModalOpen] = useState(false);
  const [promptModalOpen, setPromptModalOpen] = useState(false);

  const attachedWorkflows = (project.workflowIds || [])
    .map((id) => getCanonicalWorkflowById(id))
    .filter(Boolean);

  const attachedPrompts = (project.promptIds || [])
    .map((id) => getPromptById(id))
    .filter(Boolean);

  const workflowStates: ProjectWorkflowStateItem[] = project.workflowStates || [];

  const handleToggleStep = (workflowId: string, stepNumber: number) => {
    let existingState = workflowStates.find((ws) => ws.workflowId === workflowId);
    let updatedStates: ProjectWorkflowStateItem[];

    if (!existingState) {
      existingState = {
        workflowId,
        completedStepNumbers: [stepNumber],
      };
      updatedStates = [...workflowStates, existingState];
    } else {
      const alreadyCompleted = (existingState.completedStepNumbers || []).includes(stepNumber);
      const newStepNumbers = alreadyCompleted
        ? (existingState.completedStepNumbers || []).filter((n) => n !== stepNumber)
        : [...(existingState.completedStepNumbers || []), stepNumber];

      updatedStates = workflowStates.map((ws) =>
        ws.workflowId === workflowId
          ? { ...ws, completedStepNumbers: newStepNumbers }
          : ws
      );
    }
    onUpdateProject({ workflowStates: updatedStates });
  };

  const toggleAttachWorkflow = (id: string) => {
    const current = project.workflowIds || [];
    if (current.includes(id)) {
      onUpdateProject({ workflowIds: current.filter((item) => item !== id) });
    } else {
      onUpdateProject({ workflowIds: [...current, id] });
    }
  };

  const toggleAttachPrompt = (id: string) => {
    const current = project.promptIds || [];
    if (current.includes(id)) {
      onUpdateProject({ promptIds: current.filter((item) => item !== id) });
    } else {
      onUpdateProject({ promptIds: [...current, id] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="surface rounded-2xl border border-border p-6 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent font-bold">STAGE 05</span>
            <span className="text-tertiary text-xs">•</span>
            <span className="text-xs font-mono text-secondary uppercase tracking-wider">Preparation</span>
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
              {isCompleted ? "✓ Stage 05 Marked Complete" : "Mark Stage Complete"}
            </button>
          )}
        </div>
        <h1 className="text-2xl font-serif text-primary font-bold">Pre-Production & Pipeline Playbooks</h1>
        <p className="text-sm text-secondary">
          Execute structured production playbooks, prompt recipes, lookbook generation, and technical camera tests.
        </p>
      </div>

      {/* Production Playbooks Section */}
      <div className="surface rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Active Production Playbooks ({attachedWorkflows.length})
            </h2>
            <p className="text-xs text-tertiary">
              Step-by-step production pipelines attached to this film.
            </p>
          </div>
          <button
            onClick={() => setWorkflowModalOpen(true)}
            className="rounded-lg bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-mono font-semibold text-accent hover:bg-accent/20 cursor-pointer"
          >
            + Attach Playbook
          </button>
        </div>

        {attachedWorkflows.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-subtle p-8 text-center space-y-2">
            <p className="text-xs text-secondary">No playbooks attached yet.</p>
            <p className="text-xs text-tertiary">
              Attach playbooks like "Cinematic Lookbook Creation" or "Multi-Camera Coverage" to track prep milestones.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {attachedWorkflows.map((wf) => {
              const state = workflowStates.find((ws) => ws.workflowId === wf?.id);
              const completedSteps = state?.completedStepNumbers || [];
              const progress = Math.round((completedSteps.length / (wf?.steps.length || 1)) * 100);

              return (
                <div
                  key={wf?.id}
                  className="rounded-xl border border-border bg-surface-elevated p-5 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/workflows/${wf?.slug}`}
                          target="_blank"
                          className="font-bold text-sm text-primary hover:text-accent flex items-center gap-1"
                        >
                          <span>{wf?.title}</span>
                          <span className="text-tertiary text-xs">↗</span>
                        </Link>
                        <span className="font-mono text-[10px] text-accent border border-accent/30 px-1.5 py-0.5 rounded">
                          {wf?.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-secondary">{wf?.summary}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-emerald-400 font-semibold">
                        {progress}% Complete
                      </span>
                      <button
                        onClick={() => toggleAttachWorkflow(wf!.id)}
                        className="text-tertiary hover:text-red-400 text-xs font-mono cursor-pointer"
                      >
                        Detach ✕
                      </button>
                    </div>
                  </div>

                  {/* Interactive Steps Checklist */}
                  <div className="space-y-2.5">
                    {wf?.steps.map((step) => {
                      const isDone = completedSteps.includes(step.stepNumber);
                      return (
                        <div
                          key={step.stepNumber}
                          onClick={() => handleToggleStep(wf.id, step.stepNumber)}
                          className={`rounded-xl border p-3 flex items-start gap-3 cursor-pointer transition ${
                            isDone
                              ? "border-emerald-500/30 bg-emerald-500/5 text-primary"
                              : "border-border-subtle bg-surface hover:border-border text-secondary"
                          }`}
                        >
                          <div
                            className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center font-mono text-[10px] font-bold ${
                              isDone
                                ? "bg-emerald-500 border-emerald-500 text-black"
                                : "border-border bg-surface-elevated text-transparent"
                            }`}
                          >
                            ✓
                          </div>
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-semibold text-primary">
                                Phase {step.stepNumber}: {step.name}
                              </span>
                              <span className="font-mono text-[10px] text-tertiary">
                                {step.recommendedToolIds.join(", ")}
                              </span>
                            </div>
                            <p className="text-xs text-secondary leading-relaxed">{step.action}</p>
                            <p className="text-[11px] font-mono text-tertiary">
                              Outcome: {step.output}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Prompt Recipes & Generation Desk */}
      <div className="surface rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-primary">
              Linked Prompt Recipes ({attachedPrompts.length})
            </h2>
            <p className="text-xs text-tertiary">
              Cinematic prompt formulas tailored for visual previs and generation tools.
            </p>
          </div>
          <button
            onClick={() => setPromptModalOpen(true)}
            className="rounded-lg bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-mono font-semibold text-accent hover:bg-accent/20 cursor-pointer"
          >
            + Link Prompts
          </button>
        </div>

        {attachedPrompts.length === 0 ? (
          <p className="text-xs text-tertiary italic">No prompt recipes attached to this project.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attachedPrompts.map((prompt) => (
              <div
                key={prompt?.id}
                className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-accent uppercase">
                      {prompt?.category}
                    </span>
                    <button
                      onClick={() => toggleAttachPrompt(prompt!.id)}
                      className="text-tertiary hover:text-red-400 text-xs font-mono cursor-pointer"
                    >
                      Unlink ✕
                    </button>
                  </div>
                  <h3 className="font-semibold text-xs text-primary">{prompt?.title}</h3>
                  <p className="text-[11px] text-secondary font-mono bg-surface p-2.5 rounded-lg border border-border-subtle line-clamp-3">
                    {prompt?.promptText}
                  </p>
                </div>

                <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono text-tertiary">
                  <span>Use Case: {prompt?.useCase}</span>
                  <Link
                    href={`/prompts/${prompt?.slug}`}
                    target="_blank"
                    className="text-accent hover:underline flex items-center gap-1"
                  >
                    <span>View Recipe</span>
                    <span>↗</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs font-mono text-tertiary">
          Verified playbooks ensure zero production friction before shoot day.
        </span>
        {onNextStage && (
          <button
            onClick={onNextStage}
            className="rounded-xl bg-accent px-5 py-2.5 text-xs font-mono font-semibold text-accent-contrast shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to Stage 06: Production</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Workflow Modal */}
      {workflowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="surface w-full max-w-xl max-h-[70vh] rounded-2xl border border-border flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Attach Canonical Production Playbook
              </h3>
              <button
                onClick={() => setWorkflowModalOpen(false)}
                className="text-tertiary hover:text-primary font-mono text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {allCanonicalWorkflows.map((w: CanonicalWorkflow) => {
                const isAttached = (project.workflowIds || []).includes(w.id);
                return (
                  <div
                    key={w.id}
                    className="rounded-xl border border-border bg-surface p-3 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 max-w-[75%]">
                      <p className="font-semibold text-xs text-primary">{w.title}</p>
                      <p className="text-[11px] text-secondary line-clamp-1">{w.summary}</p>
                    </div>
                    <button
                      onClick={() => toggleAttachWorkflow(w.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer ${
                        isAttached
                          ? "bg-red-500/10 border border-red-500/30 text-red-400"
                          : "bg-accent text-accent-contrast"
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
                onClick={() => setWorkflowModalOpen(false)}
                className="rounded-lg bg-surface-elevated border border-border px-3.5 py-1.5 text-xs font-mono text-primary cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt Modal */}
      {promptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="surface w-full max-w-xl max-h-[70vh] rounded-2xl border border-border flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Link Cinematic Prompts
              </h3>
              <button
                onClick={() => setPromptModalOpen(false)}
                className="text-tertiary hover:text-primary font-mono text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2 flex-1">
              {allPrompts.map((p: Prompt) => {
                const isAttached = (project.promptIds || []).includes(p.id);
                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-border bg-surface p-3 flex items-center justify-between"
                  >
                    <div className="space-y-0.5 max-w-[75%]">
                      <p className="font-semibold text-xs text-primary">{p.title}</p>
                      <p className="text-[10px] font-mono text-accent">{p.useCase}</p>
                    </div>
                    <button
                      onClick={() => toggleAttachPrompt(p.id)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold cursor-pointer ${
                        isAttached
                          ? "bg-red-500/10 border border-red-500/30 text-red-400"
                          : "bg-accent text-accent-contrast"
                      }`}
                    >
                      {isAttached ? "Unlink" : "Link"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="p-3 border-t border-border flex justify-end">
              <button
                onClick={() => setPromptModalOpen(false)}
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
