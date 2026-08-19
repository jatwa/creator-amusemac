"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VideoEngine } from "@/data/types";

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
      <div className="surface p-6 sm:p-8 space-y-6 border-border bg-surface shadow-subtle transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
              Video Engine Comparison Matrix
            </h2>
            <p className="text-xs sm:text-sm text-secondary font-normal mt-1">
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
              className="w-full rounded-full border border-border bg-surface-elevated px-4 py-2 text-xs text-primary placeholder:text-tertiary outline-none focus:border-accent/40 transition"
            />
          </div>
        </div>

        {/* Filters Group */}
        <div className="space-y-4 pt-4 border-t border-border-subtle">
          {/* Pricing Model Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-tertiary font-mono mr-2 text-[11px]">Pricing:</span>
            {["all", "freemium", "open source", "paid"].map((p) => (
              <motion.button
                key={p}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPricingFilter(p)}
                className={`rounded-full px-3.5 py-1 text-xs capitalize transition ${
                  pricingFilter === p
                    ? "bg-foreground text-background font-medium shadow-sm"
                    : "border border-border bg-surface-elevated text-secondary hover:text-primary hover:border-border-bright"
                }`}
              >
                {p}
              </motion.button>
            ))}
          </div>

          {/* Capability Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-tertiary font-mono mr-2 text-[11px]">Capability:</span>
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
              <motion.button
                key={c.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCapabilityFilter(c.key)}
                className={`rounded-full px-3.5 py-1 text-xs transition ${
                  capabilityFilter === c.key
                    ? "bg-foreground text-background font-medium shadow-sm"
                    : "border border-border bg-surface-elevated text-secondary hover:text-primary hover:border-border-bright"
                }`}
              >
                {c.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-secondary px-2 font-mono">
        <span>Showing {filteredEngines.length} of {engines.length} verified video engines</span>
        <span className="hidden sm:inline">Source-backed factual data • Qualitative editorial scores</span>
      </div>

      {/* Empty State */}
      {filteredEngines.length === 0 && (
        <div className="surface p-12 text-center space-y-4">
          <div className="text-3xl text-tertiary font-mono">◌</div>
          <h3 className="text-lg font-semibold text-primary">No matching video engines found</h3>
          <p className="text-xs text-secondary max-w-md mx-auto">
            No engines matched your current search query &quot;{searchQuery}&quot; or active capability filters.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSearchQuery("");
              setPricingFilter("all");
              setCapabilityFilter("all");
            }}
            className="rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:opacity-90 transition"
          >
            Reset All Filters
          </motion.button>
        </div>
      )}

      {/* Desktop Multi-Column Comparison Table */}
      {filteredEngines.length > 0 && (
        <div className="hidden lg:block overflow-x-auto rounded-2xl border border-border bg-surface shadow-subtle">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-elevated font-mono text-tertiary uppercase text-[11px]">
                <th className="py-4 px-5">Engine / Developer</th>
                <th className="py-4 px-4">Pricing &amp; Free Tier</th>
                <th className="py-4 px-4">Resolution &amp; Duration</th>
                <th className="py-4 px-4">Camera &amp; Motion Control</th>
                <th className="py-4 px-4">Audio &amp; Dialogue</th>
                <th className="py-4 px-4">Commercial Rights</th>
                <th className="py-4 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredEngines.map((engine) => (
                <tr
                  key={engine.id}
                  className="hover:bg-surface-hover transition-colors group cursor-pointer"
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
                    <div className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">
                      {engine.name}
                    </div>
                    <div className="text-[11px] text-tertiary font-mono mt-0.5">
                      {engine.company}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span
                        title="Creator Qualitative Assessment (1.0 - 5.0)"
                        className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent font-medium cursor-help"
                      >
                        ★ {engine.rating}
                      </span>
                      <span className="text-[10px] text-tertiary font-mono">
                        {engine.pricingModel}
                      </span>
                    </div>
                  </td>

                  {/* Pricing */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-primary">{engine.startingPrice}</div>
                    <div className="text-[11px] text-secondary mt-1 line-clamp-1">
                      {engine.freeTier}
                    </div>
                  </td>

                  {/* Resolution & Duration */}
                  <td className="py-4 px-4">
                    <div className="font-medium text-accent">{engine.maxResolution}</div>
                    <div className="text-[11px] text-secondary mt-1">{engine.maxDuration}</div>
                  </td>

                  {/* Camera & Motion */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="text-secondary line-clamp-2 leading-relaxed">
                      {engine.cameraControl}
                    </div>
                  </td>

                  {/* Audio */}
                  <td className="py-4 px-4">
                    <div className="text-secondary">{engine.audio}</div>
                    {engine.lipSync && (
                      <span className="mt-1 inline-block rounded bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent font-mono">
                        Lip Sync ✓
                      </span>
                    )}
                  </td>

                  {/* Commercial Rights */}
                  <td className="py-4 px-4">
                    <div className="text-secondary line-clamp-2">{engine.commercialUse}</div>
                    <div className="text-[10px] text-tertiary font-mono mt-1">
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
                      className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
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
            <motion.div
              key={engine.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedEngine(engine)}
              className="surface surface-hover p-6 space-y-4 cursor-pointer"
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
                  <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                    {engine.pricingModel}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold text-primary">{engine.name}</h3>
                  <p className="text-xs text-tertiary font-mono">{engine.company}</p>
                </div>
                <span
                  title="Creator Editorial Qualitative Assessment"
                  className="rounded-full bg-surface-elevated border border-border px-2 py-1 font-mono text-xs text-accent font-medium"
                >
                  ★ {engine.rating}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-subtle text-xs">
                <div>
                  <span className="text-tertiary font-mono text-[10px] uppercase">Starting Price</span>
                  <p className="font-medium text-primary mt-0.5">{engine.startingPrice}</p>
                </div>
                <div>
                  <span className="text-tertiary font-mono text-[10px] uppercase">Max Resolution</span>
                  <p className="font-medium text-accent mt-0.5">{engine.maxResolution}</p>
                </div>
              </div>

              <div className="text-xs text-secondary">
                <span className="text-tertiary font-mono text-[10px] uppercase block mb-1">
                  Camera Control
                </span>
                <p className="line-clamp-2 leading-relaxed">{engine.cameraControl}</p>
              </div>

              <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                <span className="text-tertiary font-mono text-[11px]">Verified {engine.lastVerified}</span>
                <span className="text-accent font-medium">Inspect Engine →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Methodology Explainer Note */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs text-secondary flex items-start gap-3">
        <span className="text-accent font-medium font-mono">ℹ</span>
        <p className="leading-relaxed font-normal">
          <strong className="text-primary font-medium">Editorial Rating Methodology: </strong>
          Scores reflect qualitative assessments (1.0–5.0 scale) conducted by the Creator testing desk across four criteria: physical motion coherence, camera coordinate precision, facial identity stability, and prompt adherence. Scores are qualitative editorial reviews and not synthetic synthetic benchmarks.
        </p>
      </div>

      {/* Engine Modal / Detail Drawer with Motion */}
      <AnimatePresence>
        {selectedEngine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="surface max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border-border shadow-2xl bg-surface"
            >
              <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                <div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-mono text-accent font-medium">
                    {selectedEngine.pricingModel} • {selectedEngine.model}
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold text-primary">{selectedEngine.name}</h3>
                  <p className="text-xs text-tertiary font-mono">{selectedEngine.company}</p>
                </div>
                <button
                  onClick={() => setSelectedEngine(null)}
                  className="rounded-full p-2 text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 transition"
                >
                  ✕
                </button>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
                  <span className="text-tertiary font-mono text-[10px] uppercase">Max Resolution</span>
                  <p className="font-semibold text-accent mt-1">{selectedEngine.maxResolution}</p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
                  <span className="text-tertiary font-mono text-[10px] uppercase">Max Duration</span>
                  <p className="font-semibold text-primary mt-1">{selectedEngine.maxDuration}</p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
                  <span className="text-tertiary font-mono text-[10px] uppercase">Audio Support</span>
                  <p className="font-semibold text-primary mt-1">{selectedEngine.audio}</p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="space-y-3">
                <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs">
                  <div className="font-medium text-accent font-mono uppercase text-[11px] mb-2">
                    Verified Strengths
                  </div>
                  <ul className="space-y-1.5 text-secondary">
                    {selectedEngine.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs">
                  <div className="font-medium text-tertiary font-mono uppercase text-[11px] mb-2">
                    Limitations &amp; Caveats
                  </div>
                  <ul className="space-y-1.5 text-secondary">
                    {selectedEngine.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-tertiary">✗</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best Use Cases */}
              <div className="text-xs">
                <span className="text-tertiary font-mono uppercase text-[10px] block mb-2">
                  Optimal Production Use Cases
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedEngine.bestUseCases.map((u, i) => (
                    <span
                      key={i}
                      className="rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-secondary"
                    >
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Links & Verification */}
              <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4 text-xs">
                <span className="text-tertiary font-mono text-[11px]">
                  Verified on {selectedEngine.lastVerified} via official source
                </span>
                <div className="flex items-center gap-3">
                  <motion.a
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    href={selectedEngine.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background hover:opacity-90 transition shadow-sm"
                  >
                    Official Engine Site ↗
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
