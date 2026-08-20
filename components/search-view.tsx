"use client";

import { useState, useMemo, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { searchAllEntities, getToolById } from "@/data/content";

export function SearchView() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<
    "all" | "tools" | "prompts" | "stories" | "festivals" | "kits" | "blogs" | "videos" | "workflows" | "tutorials" | "comparisons"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [, startTransition] = useTransition();

  // Unified multi-entity search with synonym dictionary support
  const results = useMemo(() => {
    const rawResults = searchAllEntities(query);

    const filteredTools = rawResults.tools.filter((t) =>
      selectedCategory === "all" || t.category.toLowerCase() === selectedCategory.toLowerCase()
    );

    const filteredPrompts = rawResults.prompts.filter((p) =>
      selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase()
    );

    return {
      tools: filteredTools,
      prompts: filteredPrompts,
      stories: rawResults.stories,
      festivals: rawResults.festivals,
      kits: rawResults.kits,
      blogs: rawResults.blogs,
      videos: rawResults.videos,
      tutorials: rawResults.tutorials,
      workflows: rawResults.workflows,
      comparisons: rawResults.comparisons,
    };
  }, [query, selectedCategory]);

  const totalCount =
    results.tools.length +
    results.prompts.length +
    results.stories.length +
    results.festivals.length +
    results.kits.length +
    results.blogs.length +
    results.videos.length +
    results.tutorials.length +
    results.workflows.length +
    results.comparisons.length;

  const handleQueryChange = (val: string) => {
    startTransition(() => {
      setQuery(val);
    });
  };

  const quickPillSearches = [
    { label: "AI Video", q: "video" },
    { label: "Camera Coordinates", q: "camera" },
    { label: "35mm Stills", q: "film" },
    { label: "Open Weights", q: "open" },
    { label: "Audio & Music", q: "audio" },
    { label: "DaVinci Grading", q: "color" },
    { label: "Film Festivals", q: "festival" },
    { label: "Previs Kits", q: "previs" },
  ];

  return (
    <div className="space-y-8">
      {/* Search Input Box */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search verified tools, prompt tokens, camera optics, case studies, or festivals..."
            className="w-full rounded-2xl border border-border bg-surface-elevated px-5 py-4 pl-12 text-sm sm:text-base text-primary placeholder:text-tertiary focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition shadow-subtle font-normal"
          />
          <svg
            className="absolute left-4 top-4 sm:top-4.5 h-5 w-5 text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {query && (
            <button
              onClick={() => handleQueryChange("")}
              className="absolute right-4 top-4 text-xs font-mono text-tertiary hover:text-primary transition"
            >
              CLEAR ✕
            </button>
          )}
        </div>

        {/* Quick Search Shortcut Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono uppercase text-tertiary mr-1">
            Suggested:
          </span>
          {quickPillSearches.map((pill) => (
            <button
              key={pill.label}
              onClick={() => handleQueryChange(pill.q)}
              className="rounded-full border border-border-subtle bg-surface px-2.5 py-1 text-[11px] text-secondary hover:text-primary hover:border-border-bright transition"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: `All Results (${totalCount})` },
            { id: "tools", label: `Tools (${results.tools.length})` },
            { id: "prompts", label: `Prompts (${results.prompts.length})` },
            { id: "stories", label: `Stories (${results.stories.length})` },
            { id: "festivals", label: `Festivals (${results.festivals.length})` },
            { id: "kits", label: `Kits (${results.kits.length})` },
            { id: "workflows", label: `Workflows (${results.workflows.length})` },
            { id: "comparisons", label: `Compare (${results.comparisons.length})` },
            { id: "blogs", label: `Journal (${results.blogs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              // @ts-expect-error valid union
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                activeTab === tab.id
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-primary outline-none focus:border-accent/40 font-medium"
        >
          <option value="all">All Disciplines</option>
          <option value="video">Video Generation</option>
          <option value="image">Image Direction</option>
          <option value="editing">Editing &amp; Post</option>
          <option value="audio">Voice &amp; Audio</option>
          <option value="vfx">Upscaling &amp; VFX</option>
          <option value="3d">3D &amp; VFX</option>
        </select>
      </div>

      {/* Results View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${query}-${activeTab}-${selectedCategory}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-12"
        >
          {totalCount === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
              <span className="text-2xl">🔍</span>
              <h3 className="text-base font-semibold text-primary">No matching records found</h3>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Try searching for a broader term like &quot;video&quot;, &quot;Runway&quot;, &quot;Kling&quot;, &quot;anamorphic&quot;, or &quot;LUT&quot;.
              </p>
            </div>
          ) : (
            <>
              {/* Tools Section */}
              {(activeTab === "all" || activeTab === "tools") && results.tools.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Tools &amp; Models ({results.tools.length})
                    </span>
                    <Link href="/tools" className="text-[11px] text-accent font-mono hover:underline">
                      View full directory →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition group flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-accent">
                              {tool.category}
                            </span>
                            <span className="text-[11px] font-mono text-tertiary">
                              {tool.pricing.model}
                            </span>
                          </div>
                          <h4 className="text-base font-semibold text-primary mt-1 group-hover:text-accent transition">
                            {tool.name}
                          </h4>
                          <p className="text-xs text-secondary mt-1 line-clamp-2 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-tertiary">
                          <span className="truncate max-w-[180px]">{tool.bestFor.split(",")[0]}</span>
                          <span className="text-accent font-mono">Dossier →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories Section */}
              {(activeTab === "all" || activeTab === "stories") && results.stories.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Production Case Studies ({results.stories.length})
                    </span>
                    <Link href="/stories" className="text-[11px] text-accent font-mono hover:underline">
                      View all case studies →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.stories.map((story) => (
                      <Link
                        key={story.id}
                        href={`/stories/${story.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition group space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {story.genre}
                          </span>
                          <span className="text-[11px] font-mono text-tertiary">{story.runtime}</span>
                        </div>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition">
                          {story.title}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {story.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompts Section */}
              {(activeTab === "all" || activeTab === "prompts") && results.prompts.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Prompt Recipes ({results.prompts.length})
                    </span>
                    <Link href="/prompts" className="text-[11px] text-accent font-mono hover:underline">
                      Open Prompt Factory →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.prompts.map((prompt) => (
                      <Link
                        key={prompt.id}
                        href={`/prompts/${prompt.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition group space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent">
                            {prompt.useCase.split("/")[0]}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-primary group-hover:text-accent transition">
                          {prompt.title}
                        </h4>
                        <p className="font-mono text-xs text-secondary line-clamp-2 bg-surface-elevated p-2.5 rounded-xl border border-border-subtle">
                          &quot;{prompt.promptText}&quot;
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Festivals Section */}
              {(activeTab === "all" || activeTab === "festivals") && results.festivals.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      AI Film Festivals ({results.festivals.length})
                    </span>
                    <Link href="/festivals" className="text-[11px] text-accent font-mono hover:underline">
                      View festival directory →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.festivals.map((fest) => (
                      <div
                        key={fest.id}
                        className="surface rounded-2xl border border-border bg-surface p-5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {fest.hostCity}, {fest.country}
                          </span>
                          <span className="text-xs font-mono text-rose-400 font-medium">
                            Due: {fest.deadline}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-primary">{fest.name}</h4>
                        <p className="text-xs text-secondary">{fest.prizes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Workflows Section */}
              {(activeTab === "all" || activeTab === "workflows") && results.workflows.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Production Workflows ({results.workflows.length})
                    </span>
                    <Link href="/workflows" className="text-[11px] text-accent font-mono hover:underline">
                      View all workflows →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.workflows.map((wf) => (
                      <Link
                        key={wf.id}
                        href={`/workflows/${wf.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition group space-y-2"
                      >
                        <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                          {wf.category} • {wf.difficulty}
                        </span>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition">
                          {wf.title}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {wf.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparisons Section */}
              {(activeTab === "all" || activeTab === "comparisons") && results.comparisons.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Head-to-Head Comparisons ({results.comparisons.length})
                    </span>
                    <Link href="/compare" className="text-[11px] text-accent font-mono hover:underline">
                      View all comparisons →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.comparisons.map((c) => {
                      const tA = getToolById(c.toolAId)?.name || "Tool A";
                      const tB = getToolById(c.toolBId)?.name || "Tool B";
                      return (
                        <Link
                          key={c.id}
                          href={`/compare/${c.slug}`}
                          className="surface rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition group space-y-2"
                        >
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {c.category}
                          </span>
                          <h4 className="text-base font-semibold text-primary group-hover:text-accent transition">
                            {tA} vs {tB}
                          </h4>
                          <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                            {c.summaryVerdict}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
