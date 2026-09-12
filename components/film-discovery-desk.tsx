"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Film, FilmFormat } from "@/data/film-intelligence-types";
import { canonicalPeople } from "@/data/films-canonical";

interface FilmDiscoveryDeskProps {
  initialFilms: Film[];
}

export function FilmDiscoveryDesk({ initialFilms }: FilmDiscoveryDeskProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string>("ALL");
  const [selectedFestival, setSelectedFestival] = useState<string>("ALL");
  const [selectedAspect, setSelectedAspect] = useState<string>("ALL");

  // Helper to resolve person slug by id
  const getPersonSlug = (personId: string) => {
    const p = canonicalPeople.find((person) => person.id === personId);
    return p ? p.slug : personId.replace("person-", "");
  };

  const filteredFilms = useMemo(() => {
    return initialFilms.filter((film) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = film.title.toLowerCase().includes(q);
        const loglineMatch = film.logline.toLowerCase().includes(q);
        const synopsisMatch = film.synopsis.toLowerCase().includes(q);
        const directorMatch = film.directors.some((d) => (d.displayName || "").toLowerCase().includes(q));
        const genreMatch = film.genres.some((g) => g.toLowerCase().includes(q));
        const cameraMatch = film.technicalSpecs.cameraSystems?.some((c) => c.toLowerCase().includes(q));
        const lensMatch = film.technicalSpecs.lenses?.some((l) => l.toLowerCase().includes(q));
        const aiMatch = film.technicalSpecs.aiGenerativeModels?.some((m) => m.toLowerCase().includes(q));
        
        if (!titleMatch && !loglineMatch && !synopsisMatch && !directorMatch && !genreMatch && !cameraMatch && !lensMatch && !aiMatch) {
          return false;
        }
      }

      // Format filter
      if (selectedFormat !== "ALL" && film.format !== selectedFormat) {
        return false;
      }

      // Festival filter
      if (selectedFestival !== "ALL") {
        const matchesFestival =
          film.premiereFestivalId === selectedFestival ||
          film.festivalHistory.some((h) => h.festivalId === selectedFestival);
        if (!matchesFestival) return false;
      }

      // Aspect ratio filter
      if (selectedAspect !== "ALL") {
        if (selectedAspect === "ANAMORPHIC" && !film.technicalSpecs.aspectRatio.includes("2.39:1")) return false;
        if (selectedAspect === "FLAT" && !film.technicalSpecs.aspectRatio.includes("1.85:1")) return false;
      }

      return true;
    });
  }, [initialFilms, searchQuery, selectedFormat, selectedFestival, selectedAspect]);

  const stats = useMemo(() => {
    return {
      total: initialFilms.length,
      worldPremieres: initialFilms.filter((f) => f.premiereStatus === "WORLD_PREMIERE").length,
      anamorphicCount: initialFilms.filter((f) => f.technicalSpecs.aspectRatio.includes("2.39:1")).length,
      aiEnabled: initialFilms.filter((f) => f.technicalSpecs.aiGenerativeModels && f.technicalSpecs.aiGenerativeModels.length > 0).length,
    };
  }, [initialFilms]);

  const formats: { label: string; value: string }[] = [
    { label: "All Formats", value: "ALL" },
    { label: "Shorts", value: "SHORT" },
    { label: "AI Narratives", value: "AI_NARRATIVE" },
    { label: "Commercials", value: "COMMERCIAL" },
    { label: "Experimental", value: "EXPERIMENTAL" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Stats Metric Ledger */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Verified Works</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.total}</div>
          <div className="text-[11px] text-secondary mt-0.5">DCI Mastered & Documented</div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-accent">World Premieres</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.worldPremieres}</div>
          <div className="text-[11px] text-secondary mt-0.5">A-List & AI Circuit Selections</div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">2.39:1 Anamorphic</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.anamorphicCount}</div>
          <div className="text-[11px] text-secondary mt-0.5">Widescreen Theatrical Optics</div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-accent">AI & Virtual Pipelines</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.aiEnabled}</div>
          <div className="text-[11px] text-secondary mt-0.5">Multi-Model Neural Workflows</div>
        </div>
      </div>

      {/* Control Bar: Search & Quick Format Pills */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search films by title, director, lenses, camera systems, AI models, or festival selections..."
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

        {/* Format Buttons & Dropdown Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div className="flex flex-wrap gap-1.5">
            {formats.map((fmt) => (
              <button
                key={fmt.value}
                onClick={() => setSelectedFormat(fmt.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  selectedFormat === fmt.value
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedFestival}
              onChange={(e) => setSelectedFestival(e.target.value)}
              aria-label="Filter by Festival Circuit"
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-primary outline-none focus:border-accent/40 font-medium"
            >
              <option value="ALL">All Festival Circuits</option>
              <option value="fest-cannes">Festival de Cannes</option>
              <option value="fest-sundance">Sundance Film Festival</option>
              <option value="fest-tribeca">Tribeca Festival</option>
              <option value="fest-runway">Runway AI Film Festival</option>
            </select>

            <select
              value={selectedAspect}
              onChange={(e) => setSelectedAspect(e.target.value)}
              aria-label="Filter by Optical Aspect Ratio"
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-primary outline-none focus:border-accent/40 font-medium"
            >
              <option value="ALL">All Optical Aspect Ratios</option>
              <option value="ANAMORPHIC">2.39:1 Anamorphic / Scope</option>
              <option value="FLAT">1.85:1 DCI Flat</option>
            </select>
          </div>
        </div>
      </div>

      {/* Film Catalog Grid */}
      {filteredFilms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
          <div className="text-sm font-semibold text-primary">No cinematic works matched your search parameters.</div>
          <p className="text-xs text-secondary max-w-md mx-auto">
            Try adjusting your search terms or clearing format and festival filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedFormat("ALL");
              setSelectedFestival("ALL");
              setSelectedAspect("ALL");
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredFilms.map((film) => (
            <div
              key={film.id}
              className="surface rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between hover:border-accent/40 transition group"
            >
              <div className="space-y-4">
                {/* Header: Format, Year, Runtime, Premiere Status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-surface-elevated border border-border-subtle px-2.5 py-0.5 text-[10px] font-mono uppercase text-accent font-semibold">
                      {film.format.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-mono text-tertiary">
                      {film.releaseYear} • {film.runtimeMinutes} min
                    </span>
                  </div>

                  <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-[10px] font-mono font-medium text-accent">
                    {film.premiereStatus.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Title & Logline */}
                <div>
                  <h3 className="text-lg font-bold text-primary group-hover:text-accent transition">
                    <Link href={`/films/${film.slug}`}>{film.title}</Link>
                  </h3>
                  {film.originalTitle && film.originalTitle !== film.title && (
                    <div className="text-xs font-mono text-tertiary mt-0.5">
                      {film.originalTitle}
                    </div>
                  )}
                  <p className="text-xs text-secondary mt-2 line-clamp-3 leading-relaxed">
                    {film.logline}
                  </p>
                </div>

                {/* Creative Team Relational Badges */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Creative Leadership</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {film.directors.map((dir) => (
                      <Link
                        key={dir.personId}
                        href={`/people/${getPersonSlug(dir.personId)}`}
                        className="inline-flex items-center gap-1 rounded-md bg-surface-elevated border border-border-subtle px-2 py-0.5 text-primary hover:border-accent/50 hover:text-accent transition"
                      >
                        <span className="text-tertiary text-[10px]">DIR:</span>
                        <span className="font-medium">{dir.displayName}</span>
                      </Link>
                    ))}
                    {film.cinematographers.map((dp) => (
                      <Link
                        key={dp.personId}
                        href={`/people/${getPersonSlug(dp.personId)}`}
                        className="inline-flex items-center gap-1 rounded-md bg-surface-elevated border border-border-subtle px-2 py-0.5 text-secondary hover:border-accent/50 hover:text-accent transition"
                      >
                        <span className="text-tertiary text-[10px]">DP:</span>
                        <span>{dp.displayName}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications Summary */}
                <div className="rounded-xl bg-surface-elevated border border-border-subtle p-3 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Technical Master</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-tertiary">Aspect: </span>
                      <span className="text-primary font-mono">{film.technicalSpecs.aspectRatio}</span>
                    </div>
                    <div>
                      <span className="text-tertiary">Color: </span>
                      <span className="text-primary font-mono">{film.technicalSpecs.colorSpace?.split("/")[0] || "DCI"}</span>
                    </div>
                  </div>
                  {film.technicalSpecs.aiGenerativeModels && film.technicalSpecs.aiGenerativeModels.length > 0 && (
                    <div className="text-[11px] pt-1 border-t border-border-subtle">
                      <span className="text-accent font-mono text-[10px]">AI PIPELINE: </span>
                      <span className="text-secondary">{film.technicalSpecs.aiGenerativeModels.join(", ")}</span>
                    </div>
                  )}
                </div>

                {/* Festival Laurels & History */}
                {film.festivalHistory.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Festival Circuit</div>
                    <div className="flex flex-wrap gap-1.5">
                      {film.festivalHistory.map((fest, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300 font-mono"
                        >
                          ★ {fest.festivalName} ({fest.year}) {fest.awardWon ? `— ${fest.awardWon}` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Link */}
              <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between">
                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-tertiary">
                  {film.genres.slice(0, 3).map((genre) => (
                    <span key={genre} className="rounded bg-surface-elevated px-1.5 py-0.5">
                      #{genre}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/films/${film.slug}`}
                  className="text-xs font-mono text-accent hover:underline flex items-center gap-1 font-semibold"
                >
                  Technical Dossier →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
