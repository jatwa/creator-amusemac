"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Technique, TechniqueCategory, TechniqueDifficulty, ToolProductionStage } from "@/data/film-intelligence-types";

interface TechniqueDiscoveryDeskProps {
  initialTechniques: Technique[];
}

export function TechniqueDiscoveryDesk({ initialTechniques }: TechniqueDiscoveryDeskProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedStage, setSelectedStage] = useState<string>("ALL");

  const filteredTechniques = useMemo(() => {
    return initialTechniques.filter((tech) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = tech.name.toLowerCase().includes(q);
        const aliasMatch = tech.alternateNames.some((alt) => alt.toLowerCase().includes(q));
        const descMatch = tech.description.toLowerCase().includes(q);
        const purposeMatch = tech.creativePurpose.toLowerCase().includes(q);
        const visualMatch = tech.visualCharacteristics.toLowerCase().includes(q);
        const useMatch = tech.whenToUse.some((u) => u.toLowerCase().includes(q));
        const toolMatch = tech.relatedTools.some((t) => t.toLowerCase().includes(q));

        if (!nameMatch && !aliasMatch && !descMatch && !purposeMatch && !visualMatch && !useMatch && !toolMatch) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== "ALL" && tech.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "ALL" && tech.difficulty !== selectedDifficulty) {
        return false;
      }

      // Production Stage filter
      if (selectedStage !== "ALL" && tech.productionStage !== selectedStage) {
        return false;
      }

      return true;
    });
  }, [initialTechniques, searchQuery, selectedCategory, selectedDifficulty, selectedStage]);

  const stats = useMemo(() => {
    return {
      total: initialTechniques.length,
      optical: initialTechniques.filter((t) => t.category === "LENS_OPTICS" || t.category === "CAMERA").length,
      aiPipelines: initialTechniques.filter((t) => t.category === "VFX_AI").length,
      colorScience: initialTechniques.filter((t) => t.category === "COLOR" || t.category === "LIGHTING").length,
    };
  }, [initialTechniques]);

  const categories: { label: string; value: string }[] = [
    { label: "All Disciplines", value: "ALL" },
    { label: "Camera & Movement", value: "CAMERA" },
    { label: "Lens & Optics", value: "LENS_OPTICS" },
    { label: "Lighting & Chiaroscuro", value: "LIGHTING" },
    { label: "Color Science", value: "COLOR" },
    { label: "Editing & Montage", value: "EDITING" },
    { label: "VFX & AI Pipelines", value: "VFX_AI" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats Metric Ledger */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Verified Techniques</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.total}</div>
          <div className="text-[11px] text-secondary mt-0.5">Director Decision Ledgers</div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-accent">Camera & Optics</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.optical}</div>
          <div className="text-[11px] text-secondary mt-0.5">Physical & Virtual Kinematics</div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">AI & VFX Pipelines</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.aiPipelines}</div>
          <div className="text-[11px] text-secondary mt-0.5">Generative & Neural Workflows</div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Color & Lighting</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.colorScience}</div>
          <div className="text-[11px] text-secondary mt-0.5">ACES & DCI Color Science</div>
        </div>
      </div>

      {/* Control Bar: Search & Category Filter Pills */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cinema techniques by name, aliases (e.g. Zolly, Scope), creative purpose, optics, or tools..."
            className="w-full rounded-2xl border border-border bg-surface-elevated px-5 py-3.5 pl-11 text-sm text-primary placeholder:text-tertiary focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition font-normal"
          />
          <svg
            className="absolute left-4 top-3.5 h-4 w-4 text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3 text-xs font-mono text-tertiary hover:text-primary transition"
            >
              CLEAR ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills & Dropdown Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat.value
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              aria-label="Filter by Mastery Level"
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-primary outline-none focus:border-accent/40 font-medium"
            >
              <option value="ALL">All Mastery Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="MASTER">Master Grade</option>
            </select>

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              aria-label="Filter by Production Stage"
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-primary outline-none focus:border-accent/40 font-medium"
            >
              <option value="ALL">All Production Stages</option>
              <option value="PRE_PRODUCTION">Pre-Production</option>
              <option value="PRODUCTION">Production</option>
              <option value="EDITORIAL">Editorial</option>
              <option value="COLOR">Color</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Technique Catalog Grid */}
      {filteredTechniques.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
          <div className="text-sm font-semibold text-primary">No cinema techniques matched your query parameters.</div>
          <p className="text-xs text-secondary max-w-md mx-auto">
            Try adjusting your search terms or clearing discipline and difficulty filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setSelectedDifficulty("ALL");
              setSelectedStage("ALL");
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredTechniques.map((tech) => (
            <div
              key={tech.id}
              className="surface rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between hover:border-accent/40 transition group space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Category, Stage, Difficulty */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-surface-elevated border border-border-subtle px-2.5 py-0.5 text-[10px] font-mono uppercase text-accent font-semibold">
                      {tech.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-mono text-tertiary">
                      {tech.productionStage.replace(/_/g, " ")}
                    </span>
                  </div>

                  <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-[10px] font-mono font-medium text-accent">
                    {tech.difficulty}
                  </span>
                </div>

                {/* Title & Aliases */}
                <div>
                  <h3 className="text-lg font-bold text-primary group-hover:text-accent transition">
                    <Link href={`/techniques/${tech.slug}`}>{tech.name}</Link>
                  </h3>
                  {tech.alternateNames.length > 0 && (
                    <div className="text-[11px] font-mono text-tertiary mt-0.5">
                      aka {tech.alternateNames.join(", ")}
                    </div>
                  )}
                </div>

                {/* Creative Purpose */}
                <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                  {tech.creativePurpose}
                </p>

                {/* Visual Characteristics */}
                <div className="rounded-xl bg-surface-elevated border border-border-subtle p-3 space-y-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Visual Signature</div>
                  <div className="text-xs text-primary leading-relaxed line-clamp-2">
                    {tech.visualCharacteristics}
                  </div>
                </div>

                {/* Key Use Case Bullet */}
                {tech.whenToUse.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">Director Decision</div>
                    <div className="text-secondary line-clamp-1">
                      → {tech.whenToUse[0]}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Link */}
              <div className="pt-3 mt-3 border-t border-border-subtle flex items-center justify-between">
                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-tertiary">
                  {tech.relatedTools.slice(0, 2).map((tool) => (
                    <span key={tool} className="rounded bg-surface-elevated px-1.5 py-0.5">
                      {tool}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/techniques/${tech.slug}`}
                  className="text-xs font-mono text-accent hover:underline font-semibold"
                >
                  Director Dossier →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
