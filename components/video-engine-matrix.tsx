"use client";

import { useState } from "react";
import { VideoEngine } from "@/data/types";
import Link from "next/link";

export function VideoEngineMatrix({ engines }: { engines: VideoEngine[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [pricingFilter, setPricingFilter] = useState<string>("all");
  const [capabilityFilter, setCapabilityFilter] = useState<string>("all");
  const [selectedEngine, setSelectedEngine] = useState<VideoEngine | null>(null);

  // Filter engines
  const filteredEngines = engines.filter((engine) => {
    const matchesSearch =
      !searchQuery ||
      engine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engine.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engine.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      engine.bestUseCases.some((u) => u.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPricing =
      pricingFilter === "all" ||
      engine.pricingModel.toLowerCase() === pricingFilter.toLowerCase();

    const matchesCapability =
      capabilityFilter === "all" ||
      (capabilityFilter === "t2v" && engine.t2v) ||
      (capabilityFilter === "i2v" && engine.i2v) ||
      (capabilityFilter === "v2v" && engine.v2v) ||
      (capabilityFilter === "camera" && engine.cameraControl !== "Basic Pan/Zoom") ||
      (capabilityFilter === "audio" && engine.audio !== "None" && engine.audio !== "Silent") ||
      (capabilityFilter === "lip-sync" && engine.lipSync) ||
      (capabilityFilter === "api" && engine.apiAvailability);

    return matchesSearch && matchesPricing && matchesCapability;
  });

  return (
    <section className="space-y-8">
      {/* Matrix Controls & Search */}
      <div className="surface p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Video Engine Comparison Matrix</h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Filter diffusion models, transformer engines, resolution caps, and commercial rights.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search engines, models, use-cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-line bg-black/60 px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-lime"
            />
          </div>
        </div>

        {/* Filters Group */}
        <div className="space-y-4 pt-4 border-t border-line/60">
          {/* Pricing Model Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 font-mono mr-2">Pricing:</span>
            {["all", "freemium", "open source", "paid"].map((p) => (
              <button
                key={p}
                onClick={() => setPricingFilter(p)}
                className={`rounded-lg px-3 py-1.5 font-semibold capitalize transition ${
                  pricingFilter === p
                    ? "bg-lime text-black"
                    : "border border-line bg-panel text-zinc-300 hover:border-lime"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Capability Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 font-mono mr-2">Capability:</span>
            {[
              { key: "all", label: "All Capabilities" },
              { key: "t2v", label: "Text-to-Video" },
              { key: "i2v", label: "Image-to-Video" },
              { key: "v2v", label: "Video-to-Video" },
              { key: "camera", label: "Advanced Camera Control" },
              { key: "audio", label: "Native Audio / Sound FX" },
              { key: "lip-sync", label: "Lip Sync Support" },
              { key: "api", label: "Developer API" },
            ].map((c) => (
              <button
                key={c.key}
                onClick={() => setCapabilityFilter(c.key)}
                className={`rounded-lg px-3 py-1.5 font-semibold transition ${
                  capabilityFilter === c.key
                    ? "bg-lime text-black"
                    : "border border-line bg-panel text-zinc-300 hover:border-lime"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-2 font-mono">
        <span>Showing {filteredEngines.length} of {engines.length} verified video engines</span>
        <span className="hidden sm:inline">Source-backed factual data • Qualitative editorial scores</span>
      </div>

      {/* Empty State */}
      {filteredEngines.length === 0 && (
        <div className="surface p-12 text-center space-y-4">
          <div className="text-3xl">🔍</div>
          <h3 className="text-lg font-bold text-white">No matching video engines found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            No engines matched your current search query &quot;{searchQuery}&quot; or active capability filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setPricingFilter("all");
              setCapabilityFilter("all");
            }}
            className="rounded-xl bg-lime px-4 py-2 text-xs font-bold text-black hover:bg-white transition"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Desktop Multi-Column Comparison Table */}
      {filteredEngines.length > 0 && (
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-line bg-panel/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-line bg-black/60 font-mono text-zinc-400 uppercase text-[11px]">
                <th className="py-4 px-5">Engine / Developer</th>
                <th className="py-4 px-4">Pricing &amp; Free Tier</th>
                <th className="py-4 px-4">Resolution &amp; Duration</th>
                <th className="py-4 px-4">Camera &amp; Motion Control</th>
                <th className="py-4 px-4">Audio &amp; Dialogue</th>
                <th className="py-4 px-4">Commercial Rights</th>
                <th className="py-4 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredEngines.map((engine) => (
                <tr
                  key={engine.id}
                  className="hover:bg-lime/5 transition group cursor-pointer"
                  onClick={() => setSelectedEngine(engine)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedEngine(engine);
                    }
                  }}
                  aria-label={`View specs for ${engine.name}`}
                >
                  {/* Engine / Company */}
                  <td className="py-4 px-5">
                    <div className="font-bold text-white text-sm group-hover:text-lime transition">
                      {engine.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {engine.company}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        title="Creator Editorial Qualitative Assessment (1.0 - 5.0) based on physical motion coherence, camera fidelity, and artifact resistance."
                        className="rounded bg-lime/10 px-1.5 py-0.5 text-[10px] font-mono text-lime font-bold cursor-help"
                      >
                        ★ {engine.rating}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {engine.pricingModel}
                      </span>
                    </div>
                  </td>

                  {/* Pricing */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-zinc-100">{engine.startingPrice}</div>
                    <div className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                      {engine.freeTier}
                    </div>
                  </td>

                  {/* Resolution & Duration */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-lime">{engine.maxResolution}</div>
                    <div className="text-[11px] text-zinc-400 mt-1">{engine.maxDuration}</div>
                  </td>

                  {/* Camera & Motion */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="text-zinc-200 line-clamp-2 leading-relaxed">
                      {engine.cameraControl}
                    </div>
                  </td>

                  {/* Audio */}
                  <td className="py-4 px-4">
                    <div className="text-zinc-200">{engine.audio}</div>
                    {engine.lipSync && (
                      <span className="mt-1 inline-block rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] text-emerald-400 font-mono">
                        Lip Sync ✓
                      </span>
                    )}
                  </td>

                  {/* Commercial Rights */}
                  <td className="py-4 px-4">
                    <div className="text-zinc-300 line-clamp-2">{engine.commercialUse}</div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-1">
                      Verified: {engine.lastVerified}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEngine(engine);
                      }}
                      className="rounded-lg border border-line bg-black/60 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-lime hover:text-white transition"
                    >
                      View Specs →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile Card View (390px / 768px) */}
      {filteredEngines.length > 0 && (
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEngines.map((engine) => (
            <div
              key={engine.id}
              onClick={() => setSelectedEngine(engine)}
              className="surface p-6 space-y-4 hover:border-lime/40 transition cursor-pointer"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setSelectedEngine(engine);
                }
              }}
              aria-label={`View specs for ${engine.name}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full border border-lime/30 bg-lime/10 px-2.5 py-0.5 text-[10px] font-mono text-lime font-bold">
                    {engine.pricingModel.toUpperCase()}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-white">{engine.name}</h3>
                  <p className="text-xs text-zinc-400 font-mono">{engine.company}</p>
                </div>
                <span
                  title="Creator Editorial Qualitative Assessment"
                  className="rounded-md border border-line bg-black/60 px-2 py-1 font-mono text-xs text-lime font-bold"
                >
                  ★ {engine.rating}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line/60 text-xs">
                <div>
                  <span className="text-zinc-500 font-mono text-[10px] uppercase">Starting Price</span>
                  <p className="font-semibold text-white mt-0.5">{engine.startingPrice}</p>
                </div>
                <div>
                  <span className="text-zinc-500 font-mono text-[10px] uppercase">Max Resolution</span>
                  <p className="font-semibold text-lime mt-0.5">{engine.maxResolution}</p>
                </div>
              </div>

              <div className="text-xs text-zinc-300">
                <span className="text-zinc-500 font-mono text-[10px] uppercase block mb-1">
                  Camera Control
                </span>
                <p className="line-clamp-2 leading-relaxed">{engine.cameraControl}</p>
              </div>

              <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                <span className="text-zinc-500 font-mono text-[11px]">Verified {engine.lastVerified}</span>
                <span className="text-lime font-semibold">Inspect Engine →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Methodology Explainer Note */}
      <div className="rounded-xl border border-line/60 bg-black/40 p-4 text-xs text-zinc-400 flex items-start gap-3">
        <span className="text-lime font-bold font-mono">ℹ</span>
        <p className="leading-relaxed">
          <strong className="text-white">Editorial Rating Methodology: </strong>
          Scores reflect qualitative assessments (1.0–5.0 scale) conducted by the Creator by Amusemac testing desk across four criteria: physical motion coherence (liquid/collision fidelity), camera coordinate precision, facial identity stability, and prompt adherence. Scores are qualitative editorial reviews and not synthetic synthetic benchmarks.
        </p>
      </div>

      {/* Engine Modal / Detail Drawer */}
      {selectedEngine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="surface max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border-lime/40 shadow-glow">
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div>
                <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-mono text-lime font-bold">
                  {selectedEngine.pricingModel} • {selectedEngine.model}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-white">{selectedEngine.name}</h3>
                <p className="text-xs text-zinc-400 font-mono">{selectedEngine.company}</p>
              </div>
              <button
                onClick={() => setSelectedEngine(null)}
                className="rounded-full p-2 text-zinc-400 hover:text-white hover:bg-white/10 transition"
              >
                ✕
              </button>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-line bg-black/40 p-3">
                <span className="text-zinc-500 font-mono text-[10px] uppercase">Max Resolution</span>
                <p className="font-bold text-lime mt-1">{selectedEngine.maxResolution}</p>
              </div>
              <div className="rounded-xl border border-line bg-black/40 p-3">
                <span className="text-zinc-500 font-mono text-[10px] uppercase">Max Duration</span>
                <p className="font-bold text-white mt-1">{selectedEngine.maxDuration}</p>
              </div>
              <div className="rounded-xl border border-line bg-black/40 p-3">
                <span className="text-zinc-500 font-mono text-[10px] uppercase">Audio Support</span>
                <p className="font-bold text-white mt-1">{selectedEngine.audio}</p>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 text-xs">
                <div className="font-bold text-emerald-400 font-mono uppercase text-[11px] mb-2">
                  ✦ Verified Strengths
                </div>
                <ul className="space-y-1.5 text-zinc-200">
                  {selectedEngine.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-4 text-xs">
                <div className="font-bold text-red-400 font-mono uppercase text-[11px] mb-2">
                  ⚠ Limitations &amp; Caveats
                </div>
                <ul className="space-y-1.5 text-zinc-300">
                  {selectedEngine.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best Use Cases */}
            <div className="text-xs">
              <span className="text-zinc-400 font-mono uppercase text-[10px] block mb-2">
                Optimal Production Use Cases
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedEngine.bestUseCases.map((u, i) => (
                  <span
                    key={i}
                    className="rounded-lg border border-line bg-panel px-3 py-1.5 text-zinc-200"
                  >
                    {u}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Links & Verification */}
            <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-zinc-500 font-mono text-[11px]">
                Verified on {selectedEngine.lastVerified} via official source
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={selectedEngine.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-lime px-4 py-2 text-xs font-bold text-black hover:bg-white transition"
                >
                  Official Engine Site ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
