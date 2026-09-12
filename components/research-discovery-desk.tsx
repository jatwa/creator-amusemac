"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ResearchRecord } from "@/data/film-intelligence-types";

interface ResearchDiscoveryDeskProps {
  initialRecords: ResearchRecord[];
}

export function ResearchDiscoveryDesk({ initialRecords }: ResearchDiscoveryDeskProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("all");

  const topics = useMemo(() => {
    const set = new Set<string>();
    initialRecords.forEach((r) => set.add(r.topic));
    return Array.from(set);
  }, [initialRecords]);

  const filteredRecords = useMemo(() => {
    return initialRecords.filter((r) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQ = r.researchQuestion.toLowerCase().includes(q);
        const matchesTopic = r.topic.toLowerCase().includes(q);
        const matchesSummary = r.findingsSummary.toLowerCase().includes(q);
        const matchesStatements = r.statements.some((s) => s.statement.toLowerCase().includes(q));
        if (!matchesQ && !matchesTopic && !matchesSummary && !matchesStatements) {
          return false;
        }
      }

      // Topic filter
      if (selectedTopic !== "all" && r.topic !== selectedTopic) {
        return false;
      }

      // Entity type filter
      if (selectedEntityType !== "all" && r.entityType !== selectedEntityType) {
        return false;
      }

      return true;
    });
  }, [initialRecords, searchQuery, selectedTopic, selectedEntityType]);

  return (
    <div className="space-y-8">
      {/* Search & Topic Selector */}
      <div className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research questions, verified claims, optical science, or festival rules..."
              className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 pl-11 text-xs sm:text-sm text-primary placeholder:text-tertiary focus:border-accent focus:outline-none transition"
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
                className="absolute right-3.5 top-3.5 text-xs text-tertiary hover:text-primary font-mono"
              >
                ✕
              </button>
            )}
          </div>

          <span className="text-xs font-mono text-tertiary">
            Showing <strong className="text-primary">{filteredRecords.length}</strong> of {initialRecords.length} research trails
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle">
          <span className="text-[10px] font-mono uppercase text-tertiary mr-2">Research Focus:</span>
          <button
            onClick={() => setSelectedTopic("all")}
            className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
              selectedTopic === "all"
                ? "bg-primary text-background font-semibold"
                : "bg-surface-elevated text-secondary hover:text-primary border border-border"
            }`}
          >
            All Fields
          </button>
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition ${
                selectedTopic === t
                  ? "bg-primary text-background font-semibold"
                  : "bg-surface-elevated text-secondary hover:text-primary border border-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Research Record Card Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredRecords.map((record) => {
          const factCount = record.statements.filter((s) => s.nature === "FACT").length;
          const interpretationCount = record.statements.filter((s) => s.nature === "INTERPRETATION").length;
          const inferenceCount = record.statements.filter((s) => s.nature === "INFERENCE").length;

          return (
            <article
              key={record.id}
              className="group surface rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-subtle hover:border-accent/50 transition relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-surface-elevated border border-border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-accent">
                      {record.topic}
                    </span>
                    <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                      {record.verificationStatus}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-tertiary">
                    Verified: {record.verifiedDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-primary group-hover:text-accent transition leading-snug">
                    <Link href={`/research/${record.slug}`}>
                      {record.researchQuestion}
                    </Link>
                  </h3>
                  <p className="text-xs text-secondary mt-2 line-clamp-3 leading-relaxed">
                    {record.findingsSummary}
                  </p>
                </div>
              </div>

              {/* Statement-Level Trust Ledger Metrics */}
              <div className="space-y-3 pt-4 border-t border-border-subtle">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {factCount} FACTS
                    </span>
                    {interpretationCount > 0 && (
                      <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                        {interpretationCount} INTERPRETATIONS
                      </span>
                    )}
                    {inferenceCount > 0 && (
                      <span className="text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                        {inferenceCount} INFERENCES
                      </span>
                    )}
                  </div>
                  <span className="text-tertiary">
                    {record.sources.length} Verified Sources
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-tertiary">
                    Audited by: {record.verifiedBy}
                  </span>
                  <Link
                    href={`/research/${record.slug}`}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition inline-flex items-center gap-1"
                  >
                    <span>Inspect Evidence</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <div className="surface rounded-3xl border border-border p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-primary">No research records match your criteria.</p>
          <p className="text-xs text-secondary">Try selecting a different field or clearing your search term.</p>
          <button
            onClick={() => {
              setSelectedTopic("all");
              setSelectedEntityType("all");
              setSearchQuery("");
            }}
            className="mt-2 rounded-full bg-surface-elevated border border-border px-4 py-2 text-xs font-mono text-accent"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
