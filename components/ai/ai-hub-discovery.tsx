"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import type {
  AIEntity,
  AIContentItem,
} from "@/data/film-intelligence-types";

interface AIHubDiscoveryProps {
  initialEntities: AIEntity[];
  initialContent: AIContentItem[];
}

export function AIHubDiscovery({
  initialEntities,
  initialContent,
}: AIHubDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"entities" | "content">("entities");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedContentType, setSelectedContentType] = useState<string>("ALL");
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>("ALL");

  // Categories list
  const categories: { label: string; value: string }[] = [
    { label: "All Categories", value: "ALL" },
    { label: "Video Generation", value: "FOUNDATION_VIDEO" },
    { label: "Image Generation", value: "IMAGE_GENERATION" },
    { label: "Audio & Voice", value: "AUDIO_VOICE_MUSIC" },
    { label: "Multimodal & VFX", value: "MULTIMODAL_SUITE" },
    { label: "Open Weights & Local", value: "OPEN_WEIGHTS_ECOSYSTEM" },
    { label: "Finishing & Upscaling", value: "POST_PRODUCTION_FINISHING" },
  ];

  // Content Types list
  const contentTypes: { label: string; value: string }[] = [
    { label: "All Content", value: "ALL" },
    { label: "YouTube Videos", value: "YOUTUBE_VIDEO" },
    { label: "Tutorials & Guides", value: "TUTORIAL" },
    { label: "Editorial Articles", value: "ARTICLE" },
    { label: "Case Studies", value: "CASE_STUDY" },
  ];

  // Filtered entities
  const filteredEntities = useMemo(() => {
    return initialEntities.filter((entity) => {
      const devOrg = entity.developerOrganization || entity.vendor || "";
      const strengths = entity.cinemaStrengths || [];
      const models = entity.modelsAndProducts || [];

      const matchesSearch =
        !searchQuery ||
        entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        devOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entity.tagline || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        strengths.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        models.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "ALL" ||
        entity.category === selectedCategory ||
        (entity.secondaryCategories && entity.secondaryCategories.includes(selectedCategory as any));

      return matchesSearch && matchesCategory;
    });
  }, [initialEntities, searchQuery, selectedCategory]);

  // Filtered content items
  const filteredContent = useMemo(() => {
    return initialContent.filter((item) => {
      const summaryText = item.summary || item.description || "";
      const pub = item.sourcePublisher || item.publisher || "";
      const tags = item.cinemaTags || item.tags || [];
      const disciplines = item.technicalDisciplines || [];
      const entityId = item.aiEntityId || (item.aiEntityIds && item.aiEntityIds[0]) || "";

      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        summaryText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        disciplines.some((d: string) => d.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        selectedContentType === "ALL" ||
        item.contentType === selectedContentType ||
        (selectedContentType === "YOUTUBE_VIDEO" && item.contentType === "VIDEO");

      const matchesEntity =
        selectedEntityFilter === "ALL" ||
        entityId === selectedEntityFilter ||
        (item.aiEntityIds && item.aiEntityIds.includes(selectedEntityFilter));

      return matchesSearch && matchesType && matchesEntity;
    });
  }, [initialContent, searchQuery, selectedContentType, selectedEntityFilter]);

  return (
    <div className="space-y-10">
      {/* Quick Access Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-tertiary">
            Quick Access Entities ({initialEntities.length})
          </span>
          <span className="text-[11px] font-mono text-accent">
            Curated Intelligence Ledger
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {initialEntities.map((ent) => (
            <Link
              key={ent.id}
              href={`/ai/${ent.slug}`}
              className="group flex-shrink-0 flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2 hover:border-accent/40 hover:bg-surface-elevated transition shadow-subtle"
            >
              <div className="h-2 w-2 rounded-full bg-accent/70 group-hover:bg-accent group-hover:scale-125 transition-all" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-primary group-hover:text-accent transition leading-tight">
                  {ent.name}
                </span>
                <span className="text-[10px] font-mono text-tertiary">
                  {ent.developerOrganization || ent.vendor || "AI Engine"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Filter & Search Controls */}
      <div className="space-y-4 rounded-2xl border border-border bg-surface-elevated/60 p-6 shadow-subtle backdrop-blur-md">
        {/* Search input & View Selector */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AI entities, models, DoP camera controls, video benchmarks, tutorials..."
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 pl-11 text-sm text-primary placeholder:text-tertiary focus:border-accent/50 focus:ring-1 focus:ring-accent/50 outline-none transition"
            />
            <svg
              className="absolute left-3.5 top-3.5 h-4 w-4 text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-xs font-mono text-tertiary hover:text-primary transition"
              >
                CLEAR ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl border border-border bg-surface p-1">
            <button
              onClick={() => setActiveView("entities")}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                activeView === "entities"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-secondary hover:text-primary"
              }`}
            >
              AI Entities ({filteredEntities.length})
            </button>
            <button
              onClick={() => setActiveView("content")}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                activeView === "content"
                  ? "bg-foreground text-background shadow-sm"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Verified Content & Sources ({filteredContent.length})
            </button>
          </div>
        </div>

        {/* Secondary Category / Type Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-4">
          {activeView === "entities" ? (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono text-tertiary uppercase mr-1">
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    selectedCategory === cat.value
                      ? "bg-accent text-white"
                      : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4 w-full justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-tertiary uppercase mr-1">
                  Content Type:
                </span>
                {contentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedContentType(type.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      selectedContentType === type.value
                        ? "bg-accent text-white"
                        : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Entity Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-tertiary uppercase">
                  Entity:
                </span>
                <select
                  value={selectedEntityFilter}
                  onChange={(e) => setSelectedEntityFilter(e.target.value)}
                  aria-label="Filter by AI Entity"
                  className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-primary outline-none focus:border-accent/50"
                >
                  <option value="ALL">All AI Entities</option>
                  {initialEntities.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Content */}
      <AnimatePresence mode="wait">
        {activeView === "entities" ? (
          <motion.div
            key="entities-grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {filteredEntities.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <p className="text-sm font-semibold text-primary">
                  No AI entities match your criteria
                </p>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Try clearing the search or selecting &ldquo;All Categories&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                  }}
                  className="text-xs font-mono text-accent hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEntities.map((entity) => {
                  const devOrg = entity.developerOrganization || entity.vendor || "AI Engine";
                  const overviewText = entity.overview || entity.description || "";
                  const models = entity.modelsAndProducts || [];
                  const strengths = entity.cinemaStrengths || [];
                  const officialSite = entity.officialLinks?.website || entity.officialWebsite;
                  const officialDocs = entity.officialLinks?.documentation || entity.officialDocumentation;

                  return (
                    <div
                      key={entity.id}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-subtle hover:border-accent/40 hover:bg-surface-elevated transition duration-200"
                    >
                      <div className="space-y-4">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                            {devOrg}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                              {entity.verificationStatus}
                            </span>
                          </div>
                        </div>

                        {/* Title & Tagline */}
                        <div>
                          <Link href={`/ai/${entity.slug}`}>
                            <h3 className="text-lg font-bold text-primary group-hover:text-accent transition flex items-center gap-2">
                              <span>{entity.name}</span>
                              <span className="text-xs font-normal text-tertiary opacity-0 group-hover:opacity-100 transition">
                                →
                              </span>
                            </h3>
                          </Link>
                          <p className="text-xs font-medium text-secondary mt-1">
                            {entity.tagline}
                          </p>
                        </div>

                        {/* Brief Overview */}
                        <p className="text-xs text-tertiary line-clamp-3 leading-relaxed">
                          {overviewText}
                        </p>

                        {/* Models and Strengths Chips */}
                        <div className="space-y-2 pt-2 border-t border-border-subtle">
                          <div className="flex items-center justify-between text-[10px] font-mono text-tertiary">
                            <span>Verified Models ({models.length}):</span>
                            <span>{(entity.licensingModel || "Commercial").replace(/_/g, " ")}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {models.slice(0, 3).map((m) => (
                              <span
                                key={m.id}
                                className="rounded-md border border-border-subtle bg-surface px-2 py-0.5 text-[10px] font-mono text-secondary"
                              >
                                {m.name}
                              </span>
                            ))}
                            {models.length > 3 && (
                              <span className="rounded-md border border-border-subtle bg-surface px-1.5 py-0.5 text-[10px] font-mono text-tertiary">
                                +{models.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Cinema Strengths highlight */}
                          {strengths.length > 0 && (
                            <div className="pt-2">
                              <div className="text-[10px] font-mono text-tertiary uppercase mb-1">
                                Cinema Strengths:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {strengths.slice(0, 2).map((st: string, i: number) => (
                                  <span
                                    key={i}
                                    className="rounded bg-accent/10 text-accent px-2 py-0.5 text-[10px] font-medium"
                                  >
                                    {st}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-5 mt-4 border-t border-border-subtle flex items-center justify-between">
                        <Link
                          href={`/ai/${entity.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          Open Dossier <span>→</span>
                        </Link>

                        <div className="flex items-center gap-3 text-xs font-mono text-tertiary">
                          {officialSite && (
                            <a
                              href={officialSite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition"
                              title="Official Website"
                            >
                              Site ↗
                            </a>
                          )}
                          {officialDocs && (
                            <a
                              href={officialDocs}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition"
                              title="Documentation"
                            >
                              Docs ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="content-grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {filteredContent.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
                <p className="text-sm font-semibold text-primary">
                  No verified content items match your filter
                </p>
                <p className="text-xs text-secondary max-w-sm mx-auto">
                  Try selecting &ldquo;All Content&rdquo; or a different AI entity.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedContentType("ALL");
                    setSelectedEntityFilter("ALL");
                  }}
                  className="text-xs font-mono text-accent hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredContent.map((item) => {
                  const parentEntity = initialEntities.find(
                    (e) => e.id === item.aiEntityId || (item.aiEntityIds && item.aiEntityIds.includes(e.id))
                  );
                  const summaryText = item.summary || item.description || "";
                  const pub = item.sourcePublisher || item.publisher || "Source";
                  const dateText = item.publishedDate || item.publishedAt || "Recently Verified";
                  const tags = item.cinemaTags || item.tags || [];
                  const isVideo = item.contentType === "YOUTUBE_VIDEO" || item.contentType === "VIDEO";

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 shadow-subtle hover:border-accent/40 transition duration-200 space-y-4"
                    >
                      <div className="space-y-3">
                        {/* Header Badges */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                            {pub}
                          </span>
                          <span className="rounded-full bg-surface-elevated border border-border px-2 py-0.5 text-[10px] font-mono text-secondary">
                            {item.contentType.replace(/_/g, " ")}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-bold text-primary leading-snug">
                          {item.title}
                        </h4>

                        {/* YouTube Video Embed Preview if present */}
                        {isVideo && item.embedUrl && (
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black/40 my-3">
                            <iframe
                              src={item.embedUrl}
                              title={item.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="h-full w-full border-0"
                            />
                          </div>
                        )}

                        {/* Summary */}
                        <p className="text-xs text-secondary line-clamp-3 leading-relaxed">
                          {summaryText}
                        </p>

                        {/* Editorial Takeaways */}
                        {item.editorialTakeaways && (
                          <div className="rounded-xl border border-border-subtle bg-surface-elevated/70 p-3 text-[11px] text-tertiary">
                            <span className="font-semibold text-primary block mb-0.5">
                              Intelligence Takeaway:
                            </span>
                            {item.editorialTakeaways}
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {tags.slice(0, 3).map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="rounded-md border border-border-subtle bg-surface px-2 py-0.5 text-[10px] font-mono text-tertiary"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer & Source Attribution */}
                      <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                        {parentEntity ? (
                          <Link
                            href={`/ai/${parentEntity.slug}`}
                            className="text-[11px] font-mono text-tertiary hover:text-accent transition"
                          >
                            Entity: {parentEntity.name} →
                          </Link>
                        ) : (
                          <span className="text-[10px] font-mono text-tertiary">
                            {item.sourcePlatform || "Web"}
                          </span>
                        )}

                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                        >
                          {isVideo ? "Watch Original ↗" : "Read Original ↗"}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
