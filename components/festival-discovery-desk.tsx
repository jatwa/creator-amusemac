"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { FestivalWithCurrentEdition } from "@/data/festivals-canonical";
import { FestivalPrestigeTier, FestivalRegion, PremiereType } from "@/data/film-intelligence-types";

interface FestivalDiscoveryDeskProps {
  initialFestivals: FestivalWithCurrentEdition[];
}

export function FestivalDiscoveryDesk({ initialFestivals }: FestivalDiscoveryDeskProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedPremiere, setSelectedPremiere] = useState<string>("all");
  const [selectedAiPolicy, setSelectedAiPolicy] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredFestivals = useMemo(() => {
    return initialFestivals.filter(({ festival, currentEdition }) => {
      // Search text filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = festival.name.toLowerCase().includes(q);
        const matchesCity = festival.hostCity.toLowerCase().includes(q);
        const matchesCountry = festival.hostCountry.toLowerCase().includes(q);
        const matchesDesc = festival.description.toLowerCase().includes(q);
        const matchesFocus = festival.focusCategories.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesCountry && !matchesDesc && !matchesFocus) {
          return false;
        }
      }

      // Tier filter
      if (selectedTier !== "all" && festival.prestigeTier !== selectedTier) {
        return false;
      }

      // Region filter
      if (selectedRegion !== "all" && festival.region !== selectedRegion) {
        return false;
      }

      // Premiere requirement filter
      if (selectedPremiere !== "all") {
        const hasPremiere = currentEdition?.premiereRules.some(
          (r) => r.requiredPremiere === selectedPremiere
        );
        if (!hasPremiere) return false;
      }

      // AI Policy filter
      if (selectedAiPolicy !== "all") {
        if (selectedAiPolicy === "disclosure_required" && !currentEdition?.aiDisclosurePolicy.required) {
          return false;
        }
        if (selectedAiPolicy === "ai_welcomed" && currentEdition?.aiDisclosurePolicy.required === false) {
          return false;
        }
      }

      // Edition Status filter
      if (selectedStatus !== "all" && currentEdition?.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [
    initialFestivals,
    searchQuery,
    selectedTier,
    selectedRegion,
    selectedPremiere,
    selectedAiPolicy,
    selectedStatus,
  ]);

  const getTierLabel = (tier: FestivalPrestigeTier) => {
    switch (tier) {
      case "TIER_1_A_LIST":
        return "Tier 1 • A-List";
      case "TIER_2_MAJOR_INDUSTRY":
        return "Tier 2 • Major Industry";
      case "TIER_3_GENRE_REGIONAL":
        return "Tier 3 • Genre & Doc";
      case "TIER_4_SPECIALIZED_DISCOVERY":
        return "Tier 4 • Specialized / AI";
      case "TIER_5_ACADEMIC_STUDENT":
        return "Tier 5 • Academic";
      default:
        return tier;
    }
  };

  const formatPremiere = (premiere?: PremiereType) => {
    if (!premiere) return "Check Edition Rules";
    return premiere.replace(/_/g, " ");
  };

  const getNextDeadlineInfo = (currentEdition?: FestivalWithCurrentEdition["currentEdition"]) => {
    if (!currentEdition || !currentEdition.deadlines) {
      return { label: "Deadlines TBD", date: "Announcing Soon", status: "UNKNOWN" };
    }
    const d = currentEdition.deadlines;
    if (d.regularDeadline) {
      return {
        label: "Regular Deadline",
        date: d.regularDeadline,
        status: currentEdition.status === "CALL_FOR_ENTRIES" ? "OPEN" : "UPCOMING",
      };
    }
    if (d.earlyBirdDeadline) {
      return {
        label: "Early Bird Deadline",
        date: d.earlyBirdDeadline,
        status: "UPCOMING",
      };
    }
    return {
      label: "Next Deadline",
      date: d.notificationDate ? `Notification: ${d.notificationDate}` : "TBA",
      status: "OPEN",
    };
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Header Bar */}
      <div className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by festival name, host city, program focus (e.g. AI, Short, Feature, Doc)..."
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

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-tertiary">
              Showing <strong className="text-primary">{filteredFestivals.length}</strong> of {initialFestivals.length} circuits
            </span>
          </div>
        </div>

        {/* Multi-Dimensional Filter Selectors */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 text-xs">
          {/* Prestige Tier */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
              Prestige Tier
            </label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
            >
              <option value="all">All Prestige Tiers</option>
              <option value="TIER_1_A_LIST">Tier 1 • A-List (Cannes, Venice, etc.)</option>
              <option value="TIER_2_MAJOR_INDUSTRY">Tier 2 • Major Industry (Tribeca, etc.)</option>
              <option value="TIER_3_GENRE_REGIONAL">Tier 3 • Genre & Doc (IDFA, etc.)</option>
              <option value="TIER_4_SPECIALIZED_DISCOVERY">Tier 4 • Specialized AI & Discovery</option>
            </select>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
              Circuit Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
            >
              <option value="all">All Regions</option>
              <option value="EUROPE">Europe</option>
              <option value="NORTH_AMERICA">North America</option>
              <option value="ASIA_PACIFIC">Asia Pacific</option>
              <option value="GLOBAL">Global</option>
            </select>
          </div>

          {/* Premiere Requirement */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
              Premiere Exclusivity
            </label>
            <select
              value={selectedPremiere}
              onChange={(e) => setSelectedPremiere(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
            >
              <option value="all">All Premiere Types</option>
              <option value="WORLD_PREMIERE">World Premiere</option>
              <option value="INTERNATIONAL_PREMIERE">International Premiere</option>
              <option value="CONTINENTAL_PREMIERE">Continental Premiere</option>
              <option value="NATIONAL_PREMIERE">National Premiere</option>
              <option value="NO_PREMIERE_REQUIREMENT">No Premiere Restriction</option>
            </select>
          </div>

          {/* AI / Synthetic Policy */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
              AI / Synthetic Policy
            </label>
            <select
              value={selectedAiPolicy}
              onChange={(e) => setSelectedAiPolicy(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
            >
              <option value="all">All AI Policies</option>
              <option value="disclosure_required">Disclosure Required</option>
              <option value="ai_welcomed">AI Native Welcomed</option>
            </select>
          </div>

          {/* Submission Status */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
              Edition Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary focus:border-accent focus:outline-none"
            >
              <option value="all">All Edition Statuses</option>
              <option value="CALL_FOR_ENTRIES">Call For Entries Open</option>
              <option value="UPCOMING">Upcoming Edition</option>
              <option value="CONCLUDED">Concluded</option>
            </select>
          </div>
        </div>

        {/* Active Filter Clear Reset */}
        {(selectedTier !== "all" || selectedRegion !== "all" || selectedPremiere !== "all" || selectedAiPolicy !== "all" || selectedStatus !== "all" || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 border-t border-border-subtle">
            <span className="text-[11px] text-tertiary">Active Filters:</span>
            <button
              onClick={() => {
                setSelectedTier("all");
                setSelectedRegion("all");
                setSelectedPremiere("all");
                setSelectedAiPolicy("all");
                setSelectedStatus("all");
                setSearchQuery("");
              }}
              className="rounded-full bg-surface-elevated border border-border px-3 py-1 text-[11px] font-mono text-accent hover:text-primary transition"
            >
              Reset All Filters ✕
            </button>
          </div>
        )}
      </div>

      {/* Festival Decision Card Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredFestivals.map(({ festival, currentEdition }) => {
          const deadline = getNextDeadlineInfo(currentEdition);
          const primaryPremiere = currentEdition?.premiereRules[0]?.requiredPremiere;

          return (
            <article
              key={festival.id}
              className="group surface rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-subtle hover:border-accent/50 transition relative overflow-hidden"
            >
              {/* Card Header & Location */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-surface-elevated border border-border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-accent">
                      {getTierLabel(festival.prestigeTier)}
                    </span>
                    {festival.academyAwardQualifying && (
                      <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono uppercase text-amber-300 font-semibold">
                        OSCAR® QUALIFYING
                      </span>
                    )}
                    {festival.fiapfAccredited && (
                      <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-mono uppercase text-blue-300 font-semibold">
                        FIAPF
                      </span>
                    )}
                    {festival.baftaQualifying && (
                      <span className="rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-mono uppercase text-purple-300 font-semibold">
                        BAFTA
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-tertiary">
                    {festival.hostCity}, {festival.hostCountry}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-primary group-hover:text-accent transition">
                    <Link href={`/festivals/${festival.slug}`}>
                      {festival.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                    {festival.description}
                  </p>
                </div>
              </div>

              {/* Decision Metrics Matrix */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-surface-elevated/60 border border-border-subtle p-4 text-xs">
                {/* Current Edition & Season */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-tertiary block">
                    Current Edition
                  </span>
                  <p className="font-semibold text-primary">
                    {currentEdition ? (
                      <Link
                        href={`/festivals/${festival.slug}/${currentEdition.year}`}
                        className="hover:text-accent transition underline decoration-dotted"
                      >
                        {currentEdition.year} ({currentEdition.season})
                      </Link>
                    ) : (
                      "Edition Pending"
                    )}
                  </p>
                </div>

                {/* Next Relevant Deadline */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-tertiary block">
                    {deadline.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-semibold text-rose-400">
                      {deadline.date}
                    </span>
                  </div>
                </div>

                {/* Premiere Requirement */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-tertiary block">
                    Premiere Status
                  </span>
                  <span className="inline-block font-mono text-[11px] text-amber-300">
                    {formatPremiere(primaryPremiere)}
                  </span>
                </div>

                {/* AI Policy */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-tertiary block">
                    AI Policy
                  </span>
                  <span className="inline-block font-mono text-[11px] text-emerald-400">
                    {currentEdition?.aiDisclosurePolicy.required
                      ? "Disclosure Required"
                      : "Generative Welcomed"}
                  </span>
                </div>
              </div>

              {/* Card Footer with Verification & CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    <span>✓</span>
                    <span>SOURCE VERIFIED</span>
                  </span>
                  <span className="text-[10px] font-mono text-tertiary">
                    {festival.verifiedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {currentEdition && (
                    <Link
                      href={`/festivals/${festival.slug}/${currentEdition.year}`}
                      className="rounded-full bg-surface-elevated border border-border px-3.5 py-1.5 text-xs font-medium text-primary hover:border-accent hover:text-accent transition"
                    >
                      {currentEdition.year} Deadlines →
                    </Link>
                  )}
                  <Link
                    href={`/festivals/${festival.slug}`}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition"
                  >
                    View Festival
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredFestivals.length === 0 && (
        <div className="surface rounded-3xl border border-border p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-primary">No festivals match your current filter criteria.</p>
          <p className="text-xs text-secondary">Try resetting your filters or adjusting your search term.</p>
          <button
            onClick={() => {
              setSelectedTier("all");
              setSelectedRegion("all");
              setSelectedPremiere("all");
              setSelectedAiPolicy("all");
              setSelectedStatus("all");
              setSearchQuery("");
            }}
            className="mt-2 rounded-full bg-surface-elevated border border-border px-4 py-2 text-xs font-mono text-accent"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
