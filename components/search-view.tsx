"use client";

import { useState, useMemo, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  toolsData,
  promptsData,
  tutorialsData,
  workflowsData,
  comparisonsData,
  blogsData,
  videosData,
} from "@/data/platform-data";
import { getToolById } from "@/data/content";

export function SearchView() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<
    "all" | "tools" | "prompts" | "blogs" | "videos" | "workflows" | "tutorials" | "comparisons"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPricing, setSelectedPricing] = useState<string>("all");
  const [, startTransition] = useTransition();

  // Multi-entity filtered search computation
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    const filteredTools = toolsData.filter((tool) => {
      const matchQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.bestFor.toLowerCase().includes(q) ||
        tool.keyFeatures.some((f) => f.toLowerCase().includes(q)) ||
        tool.category.toLowerCase().includes(q);

      const matchCat =
        selectedCategory === "all" || tool.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchPrice =
        selectedPricing === "all" || tool.pricing.model.toLowerCase() === selectedPricing.toLowerCase();

      return matchQuery && matchCat && matchPrice;
    });

    const filteredPrompts = promptsData.filter((prompt) => {
      const matchQuery =
        !q ||
        prompt.title.toLowerCase().includes(q) ||
        prompt.promptText.toLowerCase().includes(q) ||
        prompt.useCase.toLowerCase().includes(q) ||
        prompt.category.toLowerCase().includes(q);

      const matchCat =
        selectedCategory === "all" || prompt.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchQuery && matchCat;
    });

    const filteredBlogs = blogsData.filter((blog) => {
      if (blog.status !== "published") return false;
      return (
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.category.toLowerCase().includes(q) ||
        blog.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    });

    const filteredVideos = videosData.filter((video) => {
      if (video.status !== "published") return false;
      return (
        !q ||
        video.title.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q) ||
        video.creator.name.toLowerCase().includes(q) ||
        video.category.toLowerCase().includes(q) ||
        video.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    });

    const filteredTutorials = tutorialsData.filter((tut) => {
      return (
        !q ||
        tut.title.toLowerCase().includes(q) ||
        tut.goal.toLowerCase().includes(q) ||
        tut.category.toLowerCase().includes(q)
      );
    });

    const filteredWorkflows = workflowsData.filter((wf) => {
      return (
        !q ||
        wf.title.toLowerCase().includes(q) ||
        wf.summary.toLowerCase().includes(q) ||
        wf.steps.some(
          (s) => s.phaseName.toLowerCase().includes(q) || s.goal.toLowerCase().includes(q)
        )
      );
    });

    const filteredComparisons = comparisonsData.filter((comp) => {
      const tA = getToolById(comp.toolAId)?.name.toLowerCase() || "";
      const tB = getToolById(comp.toolBId)?.name.toLowerCase() || "";

      return (
        !q ||
        tA.includes(q) ||
        tB.includes(q) ||
        comp.summaryVerdict.toLowerCase().includes(q) ||
        comp.category.toLowerCase().includes(q)
      );
    });

    const totalCount =
      filteredTools.length +
      filteredPrompts.length +
      filteredBlogs.length +
      filteredVideos.length +
      filteredTutorials.length +
      filteredWorkflows.length +
      filteredComparisons.length;

    return {
      tools: filteredTools,
      prompts: filteredPrompts,
      blogs: filteredBlogs,
      videos: filteredVideos,
      tutorials: filteredTutorials,
      workflows: filteredWorkflows,
      comparisons: filteredComparisons,
      totalCount,
    };
  }, [query, selectedCategory, selectedPricing]);

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      <div className="surface p-2 max-w-2xl mx-auto shadow-subtle flex items-center gap-3 border-border bg-surface focus-within:border-accent/40 transition rounded-full">
        <span className="text-secondary text-base font-mono px-3">⌕</span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            startTransition(() => {
              setQuery(val);
            });
          }}
          placeholder="Search tools, prompt recipes, essays, masterclasses, workflows..."
          className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-tertiary font-normal"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-tertiary hover:text-primary px-3 font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs & Facet Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { key: "all", label: `All Results (${results.totalCount})` },
            { key: "tools", label: `Tools (${results.tools.length})` },
            { key: "prompts", label: `Prompts (${results.prompts.length})` },
            { key: "blogs", label: `Journal (${results.blogs.length})` },
            { key: "videos", label: `Masterclasses (${results.videos.length})` },
            { key: "workflows", label: `Workflows (${results.workflows.length})` },
            { key: "comparisons", label: `Comparisons (${results.comparisons.length})` },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.key as any)}
              className={`rounded-full px-3.5 py-1.5 font-medium transition ${
                activeTab === tab.key
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Category & Pricing Selectors */}
        <div className="flex items-center gap-3 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-secondary outline-none focus:border-accent/40 font-medium"
          >
            <option value="all">All Disciplines</option>
            <option value="video">Video Generation</option>
            <option value="image">Image Direction</option>
            <option value="editing">Editing &amp; Post</option>
            <option value="audio">Voice &amp; Audio</option>
            <option value="vfx">Upscaling &amp; VFX</option>
          </select>

          <select
            value={selectedPricing}
            onChange={(e) => setSelectedPricing(e.target.value)}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-secondary outline-none focus:border-accent/40 font-medium"
          >
            <option value="all">All Pricing</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
            <option value="open-source">Open Source</option>
          </select>
        </div>
      </div>

      {/* Results Display with AnimatePresence */}
      <AnimatePresence mode="wait">
        {results.totalCount === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="surface p-12 text-center"
          >
            <p className="text-tertiary text-3xl font-mono">◌</p>
            <h3 className="mt-4 text-lg font-semibold text-primary">No exact production matches found</h3>
            <p className="mt-2 text-sm text-secondary">
              Try searching for terms like &quot;video&quot;, &quot;Runway&quot;, &quot;commercial&quot;, &quot;Flux&quot;, or &quot;Midjourney&quot;.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={`results-${activeTab}-${query}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {/* Tools Result Section */}
            {(activeTab === "all" || activeTab === "tools") && results.tools.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Matched AI Tools ({results.tools.length})
                  </h3>
                  <Link href="/tools" className="text-xs text-secondary hover:text-primary transition-colors font-mono">
                    All Tools →
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.tools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                    >
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="surface surface-hover p-6 block group h-full"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-secondary">
                            {tool.category}
                          </span>
                          <span className="rounded-full bg-surface-elevated px-2 py-0.5 font-mono text-[10px] text-tertiary border border-border">
                            {tool.pricing.model}
                          </span>
                        </div>
                        <h4 className="mt-2 text-lg font-semibold text-primary group-hover:text-accent transition-colors">{tool.name}</h4>
                        <p className="mt-2 text-xs text-secondary line-clamp-2">{tool.description}</p>
                        <p className="mt-4 text-[11px] text-tertiary font-mono">Best for: {tool.bestFor.split(",")[0]}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Prompts Result Section */}
            {(activeTab === "all" || activeTab === "prompts") && results.prompts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Matched Prompt Recipes ({results.prompts.length})
                  </h3>
                  <Link href="/prompts" className="text-xs text-secondary hover:text-primary transition-colors font-mono">
                    All Prompts →
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {results.prompts.map((p) => (
                    <motion.div
                      key={p.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                    >
                      <Link
                        href={`/prompts/${p.slug}`}
                        className="surface surface-hover p-6 block group h-full"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-secondary">{p.useCase}</span>
                          <span className="font-mono text-[10px] text-tertiary uppercase">{p.category}</span>
                        </div>
                        <h4 className="mt-2 text-lg font-semibold text-primary group-hover:text-accent transition-colors">{p.title}</h4>
                        <p className="mt-3 rounded-lg border border-border bg-surface-elevated p-3 font-mono text-xs text-secondary line-clamp-2">
                          {p.promptText}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Blogs Result Section */}
            {(activeTab === "all" || activeTab === "blogs") && results.blogs.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Matched Creator Journal Essays ({results.blogs.length})
                  </h3>
                  <Link href="/blog" className="text-xs text-secondary hover:text-primary transition-colors font-mono">
                    All Journal Articles →
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {results.blogs.map((b) => (
                    <motion.div
                      key={b.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                    >
                      <Link
                        href={`/blog/${b.slug}`}
                        className="surface surface-hover p-6 block group h-full"
                      >
                        <span className="text-[10px] font-medium uppercase tracking-wider text-secondary">{b.category}</span>
                        <h4 className="mt-2 text-lg font-semibold text-primary leading-snug group-hover:text-accent transition-colors">{b.title}</h4>
                        <p className="mt-2 text-xs text-secondary line-clamp-2">{b.excerpt}</p>
                        <p className="mt-4 text-[11px] text-tertiary font-mono">By {b.author.name} • {b.readingTime}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Videos Result Section */}
            {(activeTab === "all" || activeTab === "videos") && results.videos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Matched Masterclasses ({results.videos.length})
                  </h3>
                  <Link href="/videos" className="text-xs text-secondary hover:text-primary transition-colors font-mono">
                    All Masterclasses →
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {results.videos.map((v) => (
                    <motion.div
                      key={v.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                    >
                      <Link
                        href={`/videos/${v.slug}`}
                        className="surface surface-hover p-6 block group h-full"
                      >
                        <span className="text-[10px] font-medium uppercase tracking-wider text-accent">▶ {v.platform.toUpperCase()}</span>
                        <h4 className="mt-2 text-lg font-semibold text-primary leading-snug group-hover:text-accent transition-colors">{v.title}</h4>
                        <p className="mt-2 text-xs text-secondary line-clamp-2">{v.description}</p>
                        <p className="mt-4 text-[11px] text-tertiary font-mono">By {v.creator.name} • {v.duration}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Workflows Result Section */}
            {(activeTab === "all" || activeTab === "workflows") && results.workflows.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Matched Production Workflows ({results.workflows.length})
                  </h3>
                  <Link href="/workflows" className="text-xs text-secondary hover:text-primary transition-colors font-mono">
                    All Workflows →
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {results.workflows.map((wf) => (
                    <motion.div
                      key={wf.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                    >
                      <Link
                        href={`/workflows/${wf.slug}`}
                        className="surface surface-hover p-6 block group h-full"
                      >
                        <span className="text-[10px] font-medium uppercase tracking-wider text-secondary">{wf.category} Pipeline</span>
                        <h4 className="mt-2 text-lg font-semibold text-primary group-hover:text-accent transition-colors">{wf.title}</h4>
                        <p className="mt-2 text-xs text-secondary line-clamp-2">{wf.summary}</p>
                        <p className="mt-3 text-[11px] text-tertiary font-mono">Timeline: {wf.estimatedTime} • {wf.steps.length} Phases</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Comparisons Result Section */}
            {(activeTab === "all" || activeTab === "comparisons") && results.comparisons.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Matched Comparisons ({results.comparisons.length})
                  </h3>
                  <Link href="/compare" className="text-xs text-secondary hover:text-primary transition-colors font-mono">
                    All Comparisons →
                  </Link>
                </div>

                <div className="space-y-3">
                  {results.comparisons.map((c) => {
                    const tA = getToolById(c.toolAId);
                    const tB = getToolById(c.toolBId);
                    return (
                      <motion.div
                        key={c.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                      >
                        <Link
                          href={`/compare/${c.slug}`}
                          className="surface surface-hover p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 block group"
                        >
                          <div>
                            <span className="text-[10px] font-medium uppercase tracking-wider text-secondary">{c.category}</span>
                            <h4 className="mt-1 text-base font-semibold text-primary group-hover:text-accent transition-colors">
                              {tA?.name || "Tool A"} vs {tB?.name || "Tool B"}
                            </h4>
                            <p className="mt-1 text-xs text-secondary">{c.summaryVerdict}</p>
                          </div>
                          <span className="text-xs font-medium text-accent shrink-0 font-mono">Read comparison →</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
