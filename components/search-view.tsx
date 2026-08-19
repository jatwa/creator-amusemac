"use client";

import { useState, useMemo, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
      <div className="surface p-3 max-w-2xl mx-auto shadow-card flex items-center gap-3 border-line focus-within:border-lime/60 focus-within:shadow-glow-subtle transition">
        <span className="text-lime text-xl font-mono px-2">⌕</span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            const val = e.target.value;
            startTransition(() => {
              setQuery(val);
            });
          }}
          placeholder="Search tools, prompt formulas, essays, masterclasses, workflows..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-xs text-zinc-500 hover:text-white px-2 font-mono"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Tabs & Facet Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-line pb-6">
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
              activeTab === "all"
                ? "bg-lime text-black shadow-glow-subtle"
                : "border border-line bg-panel text-zinc-300 hover:border-lime hover:text-white"
            }`}
          >
            All Results ({results.totalCount})
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
              activeTab === "tools"
                ? "bg-lime text-black"
                : "border border-line bg-panel text-zinc-300 hover:border-lime hover:text-white"
            }`}
          >
            Tools ({results.tools.length})
          </button>
          <button
            onClick={() => setActiveTab("prompts")}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
              activeTab === "prompts"
                ? "bg-lime text-black"
                : "border border-line bg-panel text-zinc-300 hover:border-lime hover:text-white"
            }`}
          >
            Prompts ({results.prompts.length})
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
              activeTab === "blogs"
                ? "bg-lime text-black"
                : "border border-line bg-panel text-zinc-300 hover:border-lime hover:text-white"
            }`}
          >
            Journal ({results.blogs.length})
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
              activeTab === "videos"
                ? "bg-lime text-black"
                : "border border-line bg-panel text-zinc-300 hover:border-lime hover:text-white"
            }`}
          >
            Masterclasses ({results.videos.length})
          </button>
          <button
            onClick={() => setActiveTab("workflows")}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
              activeTab === "workflows"
                ? "bg-lime text-black"
                : "border border-line bg-panel text-zinc-300 hover:border-lime hover:text-white"
            }`}
          >
            Workflows ({results.workflows.length})
          </button>
          <button
            onClick={() => setActiveTab("comparisons")}
            className={`rounded-full px-3.5 py-1.5 font-semibold transition ${
              activeTab === "comparisons"
                ? "bg-lime text-black"
                : "border border-line bg-panel text-zinc-300 hover:border-lime hover:text-white"
            }`}
          >
            Comparisons ({results.comparisons.length})
          </button>
        </div>

        {/* Category & Pricing Selectors */}
        <div className="flex items-center gap-3 text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-line bg-panel px-3 py-1.5 text-zinc-300 outline-none focus:border-lime"
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
            className="rounded-lg border border-line bg-panel px-3 py-1.5 text-zinc-300 outline-none focus:border-lime"
          >
            <option value="all">All Pricing</option>
            <option value="free">Free</option>
            <option value="freemium">Freemium</option>
            <option value="paid">Paid</option>
            <option value="open-source">Open Source</option>
          </select>
        </div>
      </div>

      {/* Results Display */}
      {results.totalCount === 0 ? (
        <div className="surface p-12 text-center">
          <p className="text-lime text-3xl font-mono">◌</p>
          <h3 className="mt-4 text-lg font-bold text-white">No exact production matches found</h3>
          <p className="mt-2 text-sm text-zinc-400">
            Try searching for terms like &quot;video&quot;, &quot;Runway&quot;, &quot;commercial&quot;, &quot;Flux&quot;, or &quot;Midjourney&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Tools Result Section */}
          {(activeTab === "all" || activeTab === "tools") && results.tools.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="eyebrow text-xs">
                  Matched AI Tools ({results.tools.length})
                </h3>
                <Link href="/tools" className="text-xs text-zinc-400 hover:text-white transition font-mono">
                  All Tools →
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.tools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="surface surface-hover p-6 block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="eyebrow text-[10px]">
                        {tool.category}
                      </span>
                      <span className="rounded bg-ink px-2 py-0.5 font-mono text-[10px] text-zinc-400 border border-line">
                        {tool.pricing.model}
                      </span>
                    </div>
                    <h4 className="mt-2 text-lg font-bold text-white group-hover:text-lime transition">{tool.name}</h4>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{tool.description}</p>
                    <p className="mt-4 text-[11px] text-zinc-500 font-mono">Best for: {tool.bestFor.split(",")[0]}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Prompts Result Section */}
          {(activeTab === "all" || activeTab === "prompts") && results.prompts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="eyebrow text-xs">
                  Matched Prompt Recipes ({results.prompts.length})
                </h3>
                <Link href="/prompts" className="text-xs text-zinc-400 hover:text-white transition font-mono">
                  All Prompts →
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {results.prompts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/prompts/${p.slug}`}
                    className="surface surface-hover p-6 block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="eyebrow text-[10px]">{p.useCase}</span>
                      <span className="font-mono text-[10px] text-zinc-500 uppercase">{p.category}</span>
                    </div>
                    <h4 className="mt-2 text-lg font-bold text-white group-hover:text-lime transition">{p.title}</h4>
                    <p className="mt-3 rounded-lg border border-zinc-800 bg-ink p-3 font-mono text-xs text-zinc-300 line-clamp-2">
                      {p.promptText}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Blogs Result Section */}
          {(activeTab === "all" || activeTab === "blogs") && results.blogs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="eyebrow text-xs">
                  Matched Creator Journal Essays ({results.blogs.length})
                </h3>
                <Link href="/blog" className="text-xs text-zinc-400 hover:text-white transition font-mono">
                  All Journal Articles →
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {results.blogs.map((b) => (
                  <Link
                    key={b.id}
                    href={`/blog/${b.slug}`}
                    className="surface surface-hover p-6 block group"
                  >
                    <span className="eyebrow text-[10px]">{b.category}</span>
                    <h4 className="mt-2 text-lg font-bold text-white leading-snug group-hover:text-lime transition">{b.title}</h4>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{b.excerpt}</p>
                    <p className="mt-4 text-[11px] text-zinc-500 font-mono">By {b.author.name} • {b.readingTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Videos Result Section */}
          {(activeTab === "all" || activeTab === "videos") && results.videos.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="eyebrow text-xs">
                  Matched Masterclasses ({results.videos.length})
                </h3>
                <Link href="/videos" className="text-xs text-zinc-400 hover:text-white transition font-mono">
                  All Masterclasses →
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {results.videos.map((v) => (
                  <Link
                    key={v.id}
                    href={`/videos/${v.slug}`}
                    className="surface surface-hover p-6 block group"
                  >
                    <span className="eyebrow text-[10px]">▶ {v.platform.toUpperCase()}</span>
                    <h4 className="mt-2 text-lg font-bold text-white leading-snug group-hover:text-lime transition">{v.title}</h4>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{v.description}</p>
                    <p className="mt-4 text-[11px] text-zinc-500 font-mono">By {v.creator.name} • {v.duration}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Workflows Result Section */}
          {(activeTab === "all" || activeTab === "workflows") && results.workflows.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="eyebrow text-xs">
                  Matched Production Workflows ({results.workflows.length})
                </h3>
                <Link href="/workflows" className="text-xs text-zinc-400 hover:text-white transition font-mono">
                  All Workflows →
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {results.workflows.map((wf) => (
                  <Link
                    key={wf.id}
                    href={`/workflows/${wf.slug}`}
                    className="surface surface-hover p-6 block group"
                  >
                    <span className="eyebrow text-[10px]">{wf.category} Pipeline</span>
                    <h4 className="mt-2 text-lg font-bold text-white group-hover:text-lime transition">{wf.title}</h4>
                    <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{wf.summary}</p>
                    <p className="mt-3 text-[11px] text-zinc-500 font-mono">Timeline: {wf.estimatedTime} • {wf.steps.length} Phases</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comparisons Result Section */}
          {(activeTab === "all" || activeTab === "comparisons") && results.comparisons.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="eyebrow text-xs">
                  Matched Comparisons ({results.comparisons.length})
                </h3>
                <Link href="/compare" className="text-xs text-zinc-400 hover:text-white transition font-mono">
                  All Comparisons →
                </Link>
              </div>

              <div className="space-y-3">
                {results.comparisons.map((c) => {
                  const tA = getToolById(c.toolAId);
                  const tB = getToolById(c.toolBId);
                  return (
                    <Link
                      key={c.id}
                      href={`/compare/${c.slug}`}
                      className="surface surface-hover p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 block group"
                    >
                      <div>
                        <span className="eyebrow text-[10px]">{c.category}</span>
                        <h4 className="mt-1 text-base font-bold text-white group-hover:text-lime transition">
                          {tA?.name || "Tool A"} vs {tB?.name || "Tool B"}
                        </h4>
                        <p className="mt-1 text-xs text-zinc-400">{c.summaryVerdict}</p>
                      </div>
                      <span className="text-xs font-semibold text-lime shrink-0 font-mono">Read comparison →</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
