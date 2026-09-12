"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CanonicalWorkflow, CanonicalWorkflowCategory } from "@/data/film-intelligence-types";
import { getTechniqueById, getToolById } from "@/data/content";

interface WorkflowDiscoveryDeskProps {
  initialWorkflows: CanonicalWorkflow[];
  legacyWorkflows?: {
    id: string;
    slug: string;
    title: string;
    category: string;
    summary: string;
    estimatedTime: string;
    difficulty: string;
    steps: { stepNumber: number; phaseName: string; goal: string; recommendedToolIds: string[] }[];
  }[];
}

const CATEGORY_TABS: { id: string; label: string }[] = [
  { id: "ALL", label: "All Playbooks" },
  { id: "CONCEPT_DEVELOPMENT", label: "Concept & Lookbook" },
  { id: "PRE_PRODUCTION", label: "Pre-Production" },
  { id: "PRODUCTION", label: "Production" },
  { id: "POST", label: "Post & Finishing" },
  { id: "FESTIVAL_DISTRIBUTION", label: "Festival Delivery" },
  { id: "AI_CINEMA", label: "AI & Virtual Cinema" },
];

const DIFFICULTY_TABS: { id: string; label: string }[] = [
  { id: "ALL", label: "All Levels" },
  { id: "BEGINNER", label: "Beginner" },
  { id: "INTERMEDIATE", label: "Intermediate" },
  { id: "ADVANCED", label: "Advanced" },
  { id: "MASTER", label: "Master" },
];

export function WorkflowDiscoveryDesk({
  initialWorkflows,
  legacyWorkflows = [],
}: WorkflowDiscoveryDeskProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");

  const filteredWorkflows = useMemo(() => {
    return initialWorkflows.filter((wf) => {
      // Category filter
      if (selectedCategory !== "ALL" && wf.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "ALL" && wf.difficulty !== selectedDifficulty) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = wf.title.toLowerCase().includes(q);
        const matchesSummary = wf.summary.toLowerCase().includes(q);
        const matchesPurpose = wf.purpose.toLowerCase().includes(q);
        const matchesStep = wf.steps.some(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.objective.toLowerCase().includes(q) ||
            s.action.toLowerCase().includes(q)
        );
        return matchesTitle || matchesSummary || matchesPurpose || matchesStep;
      }

      return true;
    });
  }, [initialWorkflows, selectedCategory, selectedDifficulty, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Controls & Search */}
      <div className="surface p-6 sm:p-8 space-y-6 rounded-2xl border border-border">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workflows by technique, tool, stage, or production objective..."
            className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 pl-11 text-sm text-primary placeholder:text-tertiary focus:border-accent/40 focus:outline-none transition"
          />
          <svg
            className="absolute left-3.5 top-3.5 h-4 w-4 text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3.5 text-xs font-mono text-tertiary hover:text-primary transition"
            >
              CLEAR ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-t border-border-subtle">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-tertiary mr-1">Stage:</span>
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selectedCategory === tab.id
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border bg-surface-elevated text-secondary hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown / Tabs */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-tertiary">Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter by Difficulty"
              className="rounded-lg border border-border bg-surface-elevated px-3 py-1 text-xs font-mono text-secondary focus:border-accent/40 focus:outline-none"
            >
              {DIFFICULTY_TABS.map((tab) => (
                <option key={tab.id} value={tab.id}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-tertiary px-1">
          <span>Showing {filteredWorkflows.length} Production Playbooks</span>
          {(selectedCategory !== "ALL" || selectedDifficulty !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSelectedDifficulty("ALL");
                setSearchQuery("");
              }}
              className="text-accent hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredWorkflows.length === 0 ? (
          <div className="surface rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-primary">No production workflows match your criteria</p>
            <p className="text-xs text-secondary max-w-sm mx-auto">
              Try adjusting your search query or selecting a broader production stage.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredWorkflows.map((wf) => {
              const allToolIds = Array.from(
                new Set(wf.steps.flatMap((s) => s.recommendedToolIds))
              );
              const toolsUsed = allToolIds.map((id) => getToolById(id)).filter(Boolean);

              const allTechIds = Array.from(
                new Set(wf.steps.flatMap((s) => s.recommendedTechniqueIds))
              );
              const techniquesUsed = allTechIds.map((id) => getTechniqueById(id)).filter(Boolean);

              return (
                <article
                  key={wf.id}
                  className="surface surface-hover p-6 sm:p-8 space-y-6 rounded-2xl border border-border"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-[11px] font-semibold text-accent uppercase">
                          {wf.category.replace(/_/g, " ")}
                        </span>
                        <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 font-mono text-[10px] text-tertiary uppercase">
                          {wf.difficulty}
                        </span>
                        <span className="font-mono text-xs text-secondary">
                          ⏱ {wf.estimatedEffort}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 font-mono text-[10px]">
                          VERIFIED PROTOCOL
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
                        <Link
                          href={`/workflows/${wf.slug}`}
                          className="hover:text-accent transition-colors"
                        >
                          {wf.title}
                        </Link>
                      </h2>

                      <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-3xl font-normal">
                        {wf.summary}
                      </p>
                    </div>

                    <Link
                      href={`/workflows/${wf.slug}`}
                      className="rounded-full bg-foreground px-6 py-2.5 text-xs sm:text-sm font-medium text-background hover:opacity-90 transition shrink-0 self-start md:self-center flex items-center gap-2 shadow-sm"
                    >
                      <span>Inspect Playbook</span>
                      <span>→</span>
                    </Link>
                  </div>

                  {/* Production Phases Preview Strip */}
                  <div className="border-t border-border-subtle pt-5 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Production Pipeline ({wf.steps.length} Phases):
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      {wf.steps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5 space-y-1"
                        >
                          <span className="font-mono text-[11px] text-accent font-semibold">
                            Phase 0{step.stepNumber}
                          </span>
                          <p className="text-xs font-semibold text-primary line-clamp-1">
                            {step.name}
                          </p>
                          <p className="text-[11px] text-secondary line-clamp-2 leading-snug">
                            {step.objective}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools & Techniques Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-4 text-xs">
                    {toolsUsed.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-tertiary font-mono text-[11px]">Tool Stack:</span>
                        {toolsUsed.map((tool) => (
                          <Link
                            key={tool?.id}
                            href={`/tools/${tool?.slug}`}
                            className="rounded-md border border-border bg-surface-elevated px-2 py-0.5 text-secondary hover:text-primary font-mono text-[11px]"
                          >
                            {tool?.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {techniquesUsed.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-tertiary font-mono text-[11px]">Techniques:</span>
                        {techniquesUsed.map((tech) => (
                          <Link
                            key={tech?.id}
                            href={`/techniques/${tech?.slug}`}
                            className="rounded-md border border-accent/20 bg-accent/5 px-2 py-0.5 text-accent hover:underline font-mono text-[11px]"
                          >
                            {tech?.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
