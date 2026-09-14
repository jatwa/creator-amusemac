"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FilmProject, ProjectProjectType } from "@/data/film-intelligence-types";

interface ToolkitDashboardProps {
  initialProjects: FilmProject[];
}

export function ToolkitDashboard({ initialProjects }: ToolkitDashboardProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<FilmProject[]>(initialProjects);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New project form state
  const [title, setTitle] = useState("");
  const [projectType, setProjectType] = useState<ProjectProjectType>("short");
  const [logline, setLogline] = useState("");
  const [runtime, setRuntime] = useState<number | undefined>(undefined);
  const [country, setCountry] = useState("");

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/toolkit/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          projectType,
          logline: logline.trim(),
          estimatedRuntimeMinutes: runtime,
          countryOfOrigin: country.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newProject: FilmProject | undefined = data.project || (data.id ? data : undefined);
        const targetId = (newProject?.id && newProject.id !== "undefined")
          ? newProject.id
          : (newProject?.slug && newProject.slug !== "undefined")
          ? newProject.slug
          : null;

        if (newProject && targetId) {
          setProjects((prev) => [newProject, ...prev.filter((p) => p.id !== newProject.id)]);
          setModalOpen(false);
          router.push(`/toolkit/${targetId}`);
        } else {
          setError("Failed to initialize project: invalid server response (missing project identifier).");
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Failed to create project. Please verify inputs.");
      }
    } catch (err: any) {
      console.error("Failed to create project:", err);
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this film project? This cannot be undone.")) return;

    try {
      const res = await fetch(`/api/toolkit/projects/${projectId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== projectId));
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Desk */}
        <div className="surface rounded-2xl border border-border p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-accent font-bold uppercase tracking-wider">DIRECTOR'S DESK</span>
                <span className="text-tertiary text-xs">•</span>
                <span className="text-xs font-sans text-secondary uppercase tracking-wider font-medium">
                  Private Workspace
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary">Director's Toolkit</h1>
              <p className="text-base text-secondary max-w-2xl leading-relaxed font-sans">
                A structured filmmaking workspace connected directly to Creator Intel's cinema knowledge graph: verified research, optics techniques, tool packages, prompt formulas, and festival delivery intelligence.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="self-start sm:self-center rounded-xl bg-accent px-5 py-3 text-xs sm:text-sm font-sans font-semibold text-accent-contrast shadow-sm hover:opacity-90 cursor-pointer flex items-center gap-2"
            >
              <span>+ Start a Film Project</span>
            </button>
          </div>

          <div className="pt-3 border-t border-border-subtle flex flex-wrap gap-4 text-xs sm:text-sm font-sans text-tertiary font-medium">
            <span>⚡ 9-Stage Pipeline (Concept → Archive)</span>
            <span>⚡ Zero AI Screenplay Autogen</span>
            <span>⚡ Strictly Private Workspace</span>
          </div>
        </div>

        {/* Project Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-sans uppercase tracking-wider font-bold text-primary">
              Your Film Projects ({projects.length})
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="surface rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-primary">No Projects in Workspace</h3>
                <p className="text-sm text-secondary max-w-md mx-auto font-sans leading-relaxed">
                  Create your first project to architect scene coverage, optical bibles, and festival delivery roadmaps.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-xl bg-accent px-5 py-2.5 text-xs sm:text-sm font-sans font-semibold text-accent-contrast cursor-pointer"
              >
                Create First Film Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const completedCount = (project.completedStages || []).length;
                const progress = Math.round((completedCount / 9) * 100);
                const currentStageName = (project.currentStage || "01_CONCEPT").replace(/_/g, " ");

                const connectedCount =
                  (project.researchIds?.length || 0) +
                  (project.techniqueIds?.length || 0) +
                  (project.toolIds?.length || 0) +
                  (project.promptIds?.length || 0) +
                  (project.workflowIds?.length || 0) +
                  (project.festivalIds?.length || 0);

                const targetId = (project.id && project.id !== "undefined")
                  ? project.id
                  : (project.slug && project.slug !== "undefined")
                  ? project.slug
                  : null;

                if (!targetId) return null;

                return (
                  <Link
                    key={targetId}
                    href={`/toolkit/${targetId}`}
                    className="surface group rounded-2xl border border-border p-6 sm:p-7 flex flex-col justify-between space-y-5 hover:border-accent/40 transition shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="rounded-md bg-surface-elevated border border-border px-2.5 py-0.5 text-xs font-sans text-secondary uppercase font-semibold">
                          {project.projectType || "film"}
                        </span>
                        <button
                          onClick={(e) => handleDeleteProject(project.id || targetId, e)}
                          className="text-tertiary hover:text-red-400 font-sans text-xs opacity-0 group-hover:opacity-100 transition cursor-pointer p-1"
                          title="Delete Project"
                        >
                          ✕
                        </button>
                      </div>

                      <div>
                        <h3 className="font-serif text-xl font-bold text-primary group-hover:text-accent transition">
                          {project.title}
                        </h3>
                        {project.logline && (
                          <p className="text-sm text-secondary line-clamp-2 mt-1.5 leading-relaxed font-sans">
                            {project.logline}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-border-subtle font-sans">
                      {/* Stage Progress */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-tertiary font-medium">{currentStageName}</span>
                          <span className="text-accent font-bold font-mono">{progress}%</span>
                        </div>
                        <div className="w-full bg-surface-elevated rounded-full h-2 overflow-hidden border border-border-subtle">
                          <div
                            className="bg-accent h-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Metadata row */}
                      <div className="flex items-center justify-between text-xs text-tertiary font-medium">
                        <span>{project.scenes?.length || 0} Scenes</span>
                        <span>⚡ {connectedCount} Linked Entities</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Start Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateProject}
            className="surface w-full max-w-lg rounded-2xl border border-border p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-primary">
                Start a New Film Project
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-tertiary hover:text-primary font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-mono text-secondary">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Return to the Coast"
                  className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-sm text-primary placeholder-tertiary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-secondary">Project Format</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as ProjectProjectType)}
                    className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none font-mono"
                  >
                    <option value="short">Short Film</option>
                    <option value="feature">Feature Film</option>
                    <option value="documentary">Documentary</option>
                    <option value="proof_of_concept">Proof of Concept</option>
                    <option value="series_pilot">Series Pilot</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-secondary">Est. Runtime (Min)</label>
                  <input
                    type="number"
                    value={runtime || ""}
                    onChange={(e) => setRuntime(Number(e.target.value) || undefined)}
                    placeholder="e.g. 15"
                    className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs font-mono text-primary placeholder-tertiary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-secondary">Country of Origin</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United Kingdom / Norway"
                  className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-secondary">Premise / Logline</label>
                <textarea
                  rows={3}
                  value={logline}
                  onChange={(e) => setLogline(e.target.value)}
                  placeholder="Core conflict or narrative premise..."
                  className="w-full rounded-xl border border-border bg-surface-elevated p-3 text-xs text-primary placeholder-tertiary focus:border-accent focus:outline-none leading-relaxed"
                />
              </div>
              {error && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-mono text-rose-400">
                  {error}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-4 py-2 text-xs font-mono text-tertiary hover:text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="rounded-xl bg-accent px-5 py-2 text-xs font-mono font-semibold text-accent-contrast disabled:opacity-50 hover:opacity-90 cursor-pointer"
              >
                {loading ? "Creating..." : "Initialize Workspace →"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
