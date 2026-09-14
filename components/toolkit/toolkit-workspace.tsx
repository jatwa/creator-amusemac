"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FilmProject, ToolkitStage } from "@/data/film-intelligence-types";
import { StageNavigator, STAGES } from "./stage-navigator";
import { ProjectIntelligencePanel } from "./project-intelligence-panel";

// Stage Views
import { ConceptStageView } from "./stage-views/concept-stage-view";
import { ResearchStageView } from "./stage-views/research-stage-view";
import { StoryStageView } from "./stage-views/story-stage-view";
import { VisualLanguageStageView } from "./stage-views/visual-language-stage-view";
import { PreProductionStageView } from "./stage-views/preproduction-stage-view";
import { ProductionStageView } from "./stage-views/production-stage-view";
import { PostStageView } from "./stage-views/post-stage-view";
import { FestivalStageView } from "./stage-views/festival-stage-view";
import { ArchiveStageView } from "./stage-views/archive-stage-view";

interface ToolkitWorkspaceProps {
  initialProject: FilmProject;
}

export function ToolkitWorkspace({ initialProject }: ToolkitWorkspaceProps) {
  const [project, setProject] = useState<FilmProject>(initialProject);
  const [currentStage, setCurrentStage] = useState<ToolkitStage>(
    (initialProject.currentStage && STAGES.some((s) => s.id === initialProject.currentStage)
      ? (initialProject.currentStage as ToolkitStage)
      : "01_CONCEPT")
  );
  const [completedStages, setCompletedStages] = useState<ToolkitStage[]>(
    (initialProject.completedStages as ToolkitStage[]) || []
  );
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");

  // Debounced / Triggered server sync
  const saveProjectToServer = useCallback(
    async (updatedProject: FilmProject) => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/toolkit/projects/${updatedProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProject),
        });
        if (res.ok) {
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
      } catch (err) {
        console.error("Failed to auto-save project:", err);
        setSaveStatus("error");
      }
    },
    []
  );

  const handleUpdateProject = (updates: Partial<FilmProject>) => {
    setProject((prev) => {
      const next = { ...prev, ...updates };
      saveProjectToServer(next);
      return next;
    });
  };

  const handleSelectStage = (stage: ToolkitStage) => {
    setCurrentStage(stage);
    handleUpdateProject({ currentStage: stage });
  };

  const handleToggleStageCompletion = (stage: ToolkitStage) => {
    const isCompleted = completedStages.includes(stage);
    const nextCompleted = isCompleted
      ? completedStages.filter((s) => s !== stage)
      : [...completedStages, stage];

    setCompletedStages(nextCompleted);
    handleUpdateProject({ completedStages: nextCompleted });
  };

  const handleNextStage = () => {
    const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
    if (currentIndex >= 0 && currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1].id;
      // Also mark current stage complete if not already
      if (!completedStages.includes(currentStage)) {
        const nextCompleted = [...completedStages, currentStage];
        setCompletedStages(nextCompleted);
        handleUpdateProject({ currentStage: nextStage, completedStages: nextCompleted });
      } else {
        handleUpdateProject({ currentStage: nextStage });
      }
      setCurrentStage(nextStage);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Project Bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/toolkit"
              className="text-xs font-mono text-tertiary hover:text-primary transition flex items-center gap-1"
            >
              <span>←</span>
              <span>All Projects</span>
            </Link>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary truncate max-w-[200px] sm:max-w-xs font-serif">
                {project.title}
              </span>
              <span className="rounded bg-surface-elevated border border-border px-2 py-0.5 text-[10px] font-mono text-secondary uppercase">
                {project.projectType || "film"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              {saveStatus === "saving" && (
                <span className="text-accent flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  All changes synced
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-400">Offline / Local copy</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 space-y-6">
        {/* Stage Stepper Navigator */}
        <StageNavigator
          currentStage={currentStage}
          completedStages={completedStages}
          onSelectStage={handleSelectStage}
        />

        {/* 2-Column Stage View & Project Intelligence Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Stage Workspace */}
          <section className="lg:col-span-8">
            {currentStage === "01_CONCEPT" && (
              <ConceptStageView
                project={project}
                onUpdateProject={handleUpdateProject}
                onNextStage={handleNextStage}
                onMarkComplete={() => handleToggleStageCompletion("01_CONCEPT")}
                isCompleted={completedStages.includes("01_CONCEPT")}
              />
            )}
            {currentStage === "02_RESEARCH" && (
              <ResearchStageView
                project={project}
                onUpdateProject={handleUpdateProject}
                onNextStage={handleNextStage}
                onMarkComplete={() => handleToggleStageCompletion("02_RESEARCH")}
                isCompleted={completedStages.includes("02_RESEARCH")}
              />
            )}
            {currentStage === "03_STORY" && (
              <StoryStageView
                project={project}
                onUpdateProject={handleUpdateProject}
                onNextStage={handleNextStage}
                onMarkComplete={() => handleToggleStageCompletion("03_STORY")}
                isCompleted={completedStages.includes("03_STORY")}
              />
            )}
            {currentStage === "04_VISUAL_LANGUAGE" && (
              <VisualLanguageStageView
                project={project}
                onUpdateProject={handleUpdateProject}
                onNextStage={handleNextStage}
                onMarkComplete={() => handleToggleStageCompletion("04_VISUAL_LANGUAGE")}
                isCompleted={completedStages.includes("04_VISUAL_LANGUAGE")}
              />
            )}
            {currentStage === "05_PRE_PRODUCTION" && (
              <PreProductionStageView
                project={project}
                onUpdateProject={handleUpdateProject}
                onNextStage={handleNextStage}
                onMarkComplete={() => handleToggleStageCompletion("05_PRE_PRODUCTION")}
                isCompleted={completedStages.includes("05_PRE_PRODUCTION")}
              />
            )}
            {currentStage === "06_PRODUCTION" && (
              <ProductionStageView
                project={project}
                onUpdateProject={handleUpdateProject}
                onNextStage={handleNextStage}
                onMarkComplete={() => handleToggleStageCompletion("06_PRODUCTION")}
                isCompleted={completedStages.includes("06_PRODUCTION")}
              />
            )}
            {currentStage === "07_POST" && (
              <PostStageView
                project={project}
                onUpdateProject={handleUpdateProject}
                onNextStage={handleNextStage}
                onMarkComplete={() => handleToggleStageCompletion("07_POST")}
                isCompleted={completedStages.includes("07_POST")}
              />
            )}
            {currentStage === "08_FESTIVAL" && (
              <FestivalStageView
                project={project}
                onUpdateProject={handleUpdateProject}
                onNextStage={handleNextStage}
                onMarkComplete={() => handleToggleStageCompletion("08_FESTIVAL")}
                isCompleted={completedStages.includes("08_FESTIVAL")}
              />
            )}
            {currentStage === "09_ARCHIVE" && (
              <ArchiveStageView
                project={project}
                onUpdateProject={handleUpdateProject}
                onNextStage={handleNextStage}
                onMarkComplete={() => handleToggleStageCompletion("09_ARCHIVE")}
                isCompleted={completedStages.includes("09_ARCHIVE")}
              />
            )}
          </section>

          {/* Connected Intelligence Sidebar */}
          <aside className="lg:col-span-4">
            <ProjectIntelligencePanel
              project={project}
              onNavigateStage={handleSelectStage}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
