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
    "all" | "techniques" | "films" | "people" | "tools" | "prompts" | "stories" | "festivals" | "research" | "kits" | "blogs" | "videos" | "workflows" | "tutorials" | "comparisons"
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
      canonicalWorkflows: rawResults.canonicalWorkflows || [],
      comparisons: rawResults.comparisons,
      research: rawResults.research,
      films: rawResults.films || [],
      people: rawResults.people || [],
      techniques: rawResults.techniques || [],
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
    (results.canonicalWorkflows?.length || 0) +
    results.comparisons.length +
    results.research.length +
    results.films.length +
    results.people.length +
    results.techniques.length;

  const handleQueryChange = (val: string) => {
    startTransition(() => {
      setQuery(val);
    });
  };

  const quickPillSearches = [
    { label: "Cinema Techniques", q: "anamorphic" },
    { label: "Films & Cinema", q: "film" },
    { label: "Filmmakers", q: "director" },
    { label: "AI Video", q: "video" },
    { label: "Camera Coordinates", q: "camera" },
    { label: "Open Weights", q: "open" },
    { label: "DaVinci Grading", q: "color" },
    { label: "Film Festivals", q: "festival" },
    { label: "Cinema Research", q: "dcp" },
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
            placeholder="Search cinema techniques, films, filmmakers, verified tools, prompts, camera optics, or research..."
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
            { id: "all", label: `All (${totalCount})` },
            { id: "techniques", label: `Techniques (${results.techniques.length})` },
            { id: "films", label: `Films (${results.films.length})` },
            { id: "people", label: `People (${results.people.length})` },
            { id: "festivals", label: `Festivals (${results.festivals.length})` },
            { id: "research", label: `Research (${results.research.length})` },
            { id: "tools", label: `Tools (${results.tools.length})` },
            { id: "prompts", label: `Prompts (${results.prompts.length})` },
            { id: "stories", label: `Stories (${results.stories.length})` },
            { id: "workflows", label: `Workflows (${(results.canonicalWorkflows?.length || 0) + results.workflows.length})` },
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
          aria-label="Filter by Discipline"
          className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-primary outline-none focus:border-accent/40 font-medium"
        >
          <option value="all">All Disciplines</option>
          <option value="Video Generation">Video Generation</option>
          <option value="Image Generation">Image Generation</option>
          <option value="Audio & Voice">Audio & Voice</option>
          <option value="Editing & VFX">Editing & VFX</option>
          <option value="3D & World Building">3D & World Building</option>
        </select>
      </div>

      {/* Results Rendering */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab}-${selectedCategory}-${query}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="space-y-12"
        >
          {totalCount === 0 ? (
            <div className="surface rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
              <div className="text-sm font-semibold text-primary">No results found for &ldquo;{query}&rdquo;</div>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Try searching for broader keywords like &ldquo;anamorphic&rdquo;, &ldquo;cannes&rdquo;, &ldquo;runway&rdquo;, or &ldquo;color&rdquo;.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("all");
                  setActiveTab("all");
                }}
                className="text-xs font-mono text-accent hover:underline"
              >
                Clear all search filters
              </button>
            </div>
          ) : (
            <>
              {/* Techniques Section */}
              {(activeTab === "all" || activeTab === "techniques") && results.techniques.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Cinema Techniques ({results.techniques.length})
                    </span>
                    <Link href="/techniques" className="text-[11px] text-accent font-mono hover:underline">
                      View all techniques →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.techniques.map((tech) => (
                      <Link
                        key={tech.id}
                        href={`/techniques/${tech.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 space-y-2 hover:border-accent/40 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {tech.category.replace(/_/g, " ")} • {tech.difficulty}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {tech.verificationStatus}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition leading-snug">
                          {tech.name}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {tech.creativePurpose}
                        </p>
                        <div className="text-[11px] font-mono text-tertiary pt-1">
                          Stage: {tech.productionStage.replace(/_/g, " ")}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Films Section */}
              {(activeTab === "all" || activeTab === "films") && results.films.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Canonical Films ({results.films.length})
                    </span>
                    <Link href="/films" className="text-[11px] text-accent font-mono hover:underline">
                      View all films →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.films.map((film) => (
                      <Link
                        key={film.id}
                        href={`/films/${film.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 space-y-2 hover:border-accent/40 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {film.format.replace(/_/g, " ")} • {film.releaseYear}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {film.premiereStatus.replace(/_/g, " ")}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition leading-snug">
                          {film.title}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {film.logline}
                        </p>
                        <div className="text-[11px] font-mono text-tertiary pt-1">
                          Aspect: {film.technicalSpecs.aspectRatio} • {film.countryOfOrigin.join("/")}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* People Section */}
              {(activeTab === "all" || activeTab === "people") && results.people.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Filmmakers & Talent ({results.people.length})
                    </span>
                    <Link href="/people" className="text-[11px] text-accent font-mono hover:underline">
                      View all filmmakers →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.people.map((person) => (
                      <Link
                        key={person.id}
                        href={`/people/${person.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 space-y-2 hover:border-accent/40 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {person.primaryRole.replace(/_/g, " ")}
                          </span>
                          <span className="text-[11px] font-mono text-tertiary">
                            {person.country}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition">
                          {person.name}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {person.biography}
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
                      Film Festivals ({results.festivals.length})
                    </span>
                    <Link href="/festivals" className="text-[11px] text-accent font-mono hover:underline">
                      View all festivals →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.festivals.map((fest) => (
                      <Link
                        key={fest.id}
                        href={`/festivals/${fest.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 space-y-2 hover:border-accent/40 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {fest.hostCity}, {fest.country}
                          </span>
                          <span className="text-[10px] font-mono text-tertiary">
                            {fest.deadline}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition">
                          {fest.name}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {fest.eligibility}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Research Section */}
              {(activeTab === "all" || activeTab === "research") && results.research.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Cinema Research Dossiers ({results.research.length})
                    </span>
                    <Link href="/research" className="text-[11px] text-accent font-mono hover:underline">
                      View research desk →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.research.map((rec) => (
                      <Link
                        key={rec.id}
                        href={`/research/${rec.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 space-y-2 hover:border-accent/40 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {rec.topic}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {rec.verificationStatus}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition leading-snug">
                          {rec.researchQuestion}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {rec.findingsSummary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools Section */}
              {(activeTab === "all" || activeTab === "tools") && results.tools.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Filmmaking Tools ({results.tools.length})
                    </span>
                    <Link href="/tools" className="text-[11px] text-accent font-mono hover:underline">
                      View all tools →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {results.tools.map((tool) => (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition group space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {tool.category}
                          </span>
                          <span className="text-[10px] font-mono text-tertiary">
                            {tool.pricing.model}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {tool.tagline}
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
                      Cinematic Prompts ({results.prompts.length})
                    </span>
                    <Link href="/prompts" className="text-[11px] text-accent font-mono hover:underline">
                      View prompt library →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.prompts.map((prompt) => (
                      <Link
                        key={prompt.id}
                        href={`/prompts/${prompt.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition group space-y-2"
                      >
                        <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                          {prompt.category} • {prompt.difficulty || "Director Grade"}
                        </span>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition">
                          {prompt.title}
                        </h4>
                        <p className="text-xs text-secondary font-mono bg-surface-elevated p-2.5 rounded-lg line-clamp-2">
                          {prompt.promptText}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Stories / Case Studies Section */}
              {(activeTab === "all" || activeTab === "stories") && results.stories.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Production Stories & Breakdowns ({results.stories.length})
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.stories.map((story) => (
                      <Link
                        key={story.id}
                        href={`/stories/${story.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 space-y-2 hover:border-accent/40 transition group"
                      >
                        <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                          {story.genre} • {story.runtime}
                        </span>
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

              {/* Workflows & Playbooks Section */}
              {(activeTab === "all" || activeTab === "workflows") && ((results.canonicalWorkflows?.length || 0) > 0 || results.workflows.length > 0) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Production Workflows &amp; Playbooks ({((results.canonicalWorkflows?.length || 0) + results.workflows.length)})
                    </span>
                    <Link href="/workflows" className="text-[11px] text-accent font-mono hover:underline">
                      View all workflows →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.canonicalWorkflows?.map((wf) => (
                      <Link
                        key={wf.id}
                        href={`/workflows/${wf.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 space-y-2 hover:border-accent/40 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {wf.category.replace(/_/g, " ")} • {wf.difficulty}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {wf.steps.length} Phases
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition leading-snug">
                          {wf.title}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {wf.summary}
                        </p>
                        <div className="text-[11px] font-mono text-tertiary pt-1">
                          Effort: {wf.estimatedEffort}
                        </div>
                      </Link>
                    ))}
                    {results.workflows.map((wf) => (
                      <Link
                        key={wf.id}
                        href={`/workflows/${wf.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 space-y-2 hover:border-accent/40 transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                            {wf.category} • {wf.difficulty}
                          </span>
                          <span className="text-[10px] font-mono text-tertiary">
                            {wf.estimatedTime}
                          </span>
                        </div>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition leading-snug">
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

              {/* Journal / Blog Section */}
              {(activeTab === "all" || activeTab === "blogs") && results.blogs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-primary">
                      Cinema Journal ({results.blogs.length})
                    </span>
                    <Link href="/journal" className="text-[11px] text-accent font-mono hover:underline">
                      View all articles →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.blogs.map((b) => (
                      <Link
                        key={b.id}
                        href={`/journal/${b.slug}`}
                        className="surface rounded-2xl border border-border bg-surface p-5 hover:border-accent/40 transition group space-y-2"
                      >
                        <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                          {b.category}
                        </span>
                        <h4 className="text-base font-semibold text-primary group-hover:text-accent transition">
                          {b.title}
                        </h4>
                        <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                          {b.excerpt}
                        </p>
                      </Link>
                    ))}
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
