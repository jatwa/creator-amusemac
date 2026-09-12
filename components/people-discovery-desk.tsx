"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Person, PersonRole } from "@/data/film-intelligence-types";

interface PeopleDiscoveryDeskProps {
  initialPeople: Person[];
}

export function PeopleDiscoveryDesk({ initialPeople }: PeopleDiscoveryDeskProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedCountry, setSelectedCountry] = useState<string>("ALL");

  const filteredPeople = useMemo(() => {
    return initialPeople.filter((person) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = person.name.toLowerCase().includes(q);
        const aliasMatch = person.alternateNames.some((alt) => alt.toLowerCase().includes(q));
        const bioMatch = person.biography.toLowerCase().includes(q);
        const countryMatch = person.country.toLowerCase().includes(q);
        const filmMatch = person.filmography.some((f) => f.title.toLowerCase().includes(q));
        const accoladeMatch = person.festivalAccolades.some((a) => a.awardTitle.toLowerCase().includes(q) || a.festivalName.toLowerCase().includes(q));

        if (!nameMatch && !aliasMatch && !bioMatch && !countryMatch && !filmMatch && !accoladeMatch) {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== "ALL") {
        const matchesRole = person.primaryRole === selectedRole || person.secondaryRoles.includes(selectedRole as PersonRole);
        if (!matchesRole) return false;
      }

      // Country filter
      if (selectedCountry !== "ALL" && person.country !== selectedCountry) {
        return false;
      }

      return true;
    });
  }, [initialPeople, searchQuery, selectedRole, selectedCountry]);

  const stats = useMemo(() => {
    return {
      total: initialPeople.length,
      directors: initialPeople.filter((p) => p.primaryRole === "DIRECTOR" || p.secondaryRoles.includes("DIRECTOR")).length,
      accoladed: initialPeople.filter((p) => p.festivalAccolades.length > 0).length,
      aiPioneers: initialPeople.filter((p) => p.primaryRole === "AI_ARTIST" || p.secondaryRoles.includes("AI_ARTIST")).length,
    };
  }, [initialPeople]);

  const roleTabs: { label: string; value: string }[] = [
    { label: "All Creatives", value: "ALL" },
    { label: "Directors", value: "DIRECTOR" },
    { label: "Cinematographers", value: "CINEMATOGRAPHER" },
    { label: "VFX Supervisors", value: "VFX_SUPERVISOR" },
    { label: "AI Artists", value: "AI_ARTIST" },
    { label: "Screenwriters", value: "SCREENWRITER" },
    { label: "Editors", value: "EDITOR" },
  ];

  const countries = Array.from(new Set(initialPeople.map((p) => p.country))).sort();

  return (
    <div className="space-y-8">
      {/* Top Stats Metric Ledger */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Filmmakers & Artists</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.total}</div>
          <div className="text-[11px] text-secondary mt-0.5">Canonical Person Profiles</div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-accent">Auteur Directors</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.directors}</div>
          <div className="text-[11px] text-secondary mt-0.5">Feature & Spec Directors</div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Festival Laureates</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.accoladed}</div>
          <div className="text-[11px] text-secondary mt-0.5">Cannes / Sundance / Tribeca</div>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface p-4">
          <div className="text-[10px] font-mono uppercase tracking-wider text-accent">Virtual & AI Leads</div>
          <div className="text-xl sm:text-2xl font-bold text-primary mt-1">{stats.aiPioneers}</div>
          <div className="text-[11px] text-secondary mt-0.5">Prompt & Pipeline Architects</div>
        </div>
      </div>

      {/* Control Bar: Search & Role Pills */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search filmmakers by name, aliases, role, country, filmography, or festival awards..."
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

        {/* Role Filter Tabs & Country Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
          <div className="flex flex-wrap gap-1.5">
            {roleTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedRole(tab.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  selectedRole === tab.value
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            aria-label="Filter by Country of Activity"
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-primary outline-none focus:border-accent/40 font-medium"
          >
            <option value="ALL">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* People Catalog Grid */}
      {filteredPeople.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
          <div className="text-sm font-semibold text-primary">No filmmakers matched your search criteria.</div>
          <p className="text-xs text-secondary max-w-md mx-auto">
            Try adjusting your search terms or clearing role and country filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRole("ALL");
              setSelectedCountry("ALL");
            }}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-mono text-secondary hover:text-primary transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPeople.map((person) => (
            <div
              key={person.id}
              className="surface rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between hover:border-accent/40 transition group space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Primary Role & Country */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-surface-elevated border border-border-subtle px-2.5 py-0.5 text-[10px] font-mono uppercase text-accent font-semibold">
                    {person.primaryRole.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs font-mono text-tertiary">
                    {person.country}
                  </span>
                </div>

                {/* Name & Aliases */}
                <div>
                  <h3 className="text-lg font-bold text-primary group-hover:text-accent transition">
                    <Link href={`/people/${person.slug}`}>{person.name}</Link>
                  </h3>
                  {person.alternateNames.length > 0 && (
                    <div className="text-[11px] font-mono text-tertiary mt-0.5">
                      aka {person.alternateNames.join(", ")}
                    </div>
                  )}
                </div>

                {/* Bio Excerpt */}
                <p className="text-xs text-secondary line-clamp-3 leading-relaxed">
                  {person.biography}
                </p>

                {/* Filmography Snapshot */}
                <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Key Works</div>
                  <div className="space-y-1">
                    {person.filmography.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-primary font-medium truncate">{item.title}</span>
                        <span className="text-[10px] font-mono text-tertiary shrink-0">({item.year})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Festival Accolades */}
                {person.festivalAccolades.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary">Accolades</div>
                    <div className="flex flex-wrap gap-1">
                      {person.festivalAccolades.map((acc, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono text-amber-300"
                        >
                          ★ {acc.festivalName} ({acc.year})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Link */}
              <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
                <span className="text-[10px] font-mono text-tertiary">
                  {person.secondaryRoles.map((r) => r.replace(/_/g, " ")).join(" • ") || "Creative Lead"}
                </span>
                <Link
                  href={`/people/${person.slug}`}
                  className="text-xs font-mono text-accent hover:underline font-semibold"
                >
                  Filmmaker Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
