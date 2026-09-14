"use client";

import React, { useState } from "react";
import { MediaHubItem } from "@/lib/adapters/tool-intelligence-adapter";
import {
  Play,
  Film,
  Sparkles,
  ArrowUpRight,
  BookOpen,
  Check,
  Zap,
} from "@/components/cinematic/icons";

interface ToolMediaHubProps {
  toolName: string;
  items: MediaHubItem[];
}

type TabType = "ALL" | "OFFICIAL" | "MASTERCLASS" | "TUTORIAL" | "REVIEW";

const TAB_LABELS: { type: TabType; label: string }[] = [
  { type: "ALL", label: "All Media" },
  { type: "OFFICIAL", label: "Official Demos" },
  { type: "MASTERCLASS", label: "Masterclasses" },
  { type: "TUTORIAL", label: "Tutorials" },
  { type: "REVIEW", label: "Filmmaker Reviews" },
];

export function ToolMediaHub({ toolName, items }: ToolMediaHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [activeVideoId, setActiveVideoId] = useState<string>(
    items.length > 0 ? items[0].id : ""
  );

  const filteredItems = items.filter((item) => {
    if (activeTab === "ALL") return true;
    return item.type === activeTab;
  });

  const activeVideo = items.find((it) => it.id === activeVideoId) || items[0];

  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/40 p-8 text-center">
        <Film className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
        <p className="text-sm text-neutral-400 font-sans">
          Curated masterclasses and workflow breakdowns for {toolName} are being indexed by the directorial desk.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="media">
      {/* Media Hub Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-semibold">
              SEE IT IN ACTION
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Visual Benchmarks &amp; Video Breakdown
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans mt-1">
            Audited real-world production footage, prompting masterclasses, and unvarnished technical reviews.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-neutral-950 border border-white/[0.08] self-start sm:self-auto">
          {TAB_LABELS.map((tab) => {
            const count =
              tab.type === "ALL"
                ? items.length
                : items.filter((i) => i.type === tab.type).length;
            if (count === 0 && tab.type !== "ALL") return null;

            const isSelected = activeTab === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => {
                  setActiveTab(tab.type);
                  const firstOfTab =
                    tab.type === "ALL"
                      ? items[0]
                      : items.find((i) => i.type === tab.type);
                  if (firstOfTab) setActiveVideoId(firstOfTab.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-400 text-neutral-950 font-bold shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-neutral-950/20 text-neutral-950"
                      : "bg-white/[0.06] text-neutral-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Video Showcase Player */}
      {activeVideo && (
        <div className="rounded-2xl border border-white/[0.1] bg-neutral-950 overflow-hidden shadow-2xl">
          <div className="relative aspect-video w-full bg-neutral-900">
            {activeVideo.embedUrl ? (
              <iframe
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-neutral-900 to-neutral-950">
                <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mb-4">
                  <Play className="w-8 h-8 text-amber-400 fill-current ml-1" />
                </div>
                <h4 className="text-lg font-bold text-white max-w-md mb-2">
                  {activeVideo.title}
                </h4>
                <p className="text-xs text-neutral-400 max-w-md mb-4 font-sans">
                  {activeVideo.description ||
                    "Direct camera test and prompting masterclass recording."}
                </p>
                <a
                  href={activeVideo.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs font-mono transition-all"
                >
                  <span>Open Video in Source Player</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Active Video Meta Strip */}
          <div className="p-4 sm:p-6 bg-neutral-900/80 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[10px] font-mono uppercase font-bold tracking-wider">
                  {activeVideo.type}
                </span>
                {activeVideo.publisher && (
                  <span className="text-xs text-neutral-400 font-mono">
                    via {activeVideo.publisher}
                  </span>
                )}
                {activeVideo.duration && (
                  <span className="text-xs text-neutral-500 font-mono">
                    • {activeVideo.duration}
                  </span>
                )}
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white font-sans">
                {activeVideo.title}
              </h4>
              {activeVideo.description && (
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  {activeVideo.description}
                </p>
              )}
            </div>

            <a
              href={activeVideo.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-mono text-neutral-200 hover:text-white transition-colors shrink-0"
            >
              <span>Watch on External Site</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          </div>
        </div>
      )}

      {/* Playlist Grid */}
      {filteredItems.length > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isPlaying = item.id === activeVideo?.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveVideoId(item.id)}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                  isPlaying
                    ? "bg-amber-400/10 border-amber-400/60 ring-1 ring-amber-400/30"
                    : "bg-neutral-950/60 border-white/[0.06] hover:bg-neutral-900 hover:border-white/20"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                        item.type === "OFFICIAL"
                          ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          : item.type === "MASTERCLASS"
                          ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                          : item.type === "TUTORIAL"
                          ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                          : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      }`}
                    >
                      {item.type}
                    </span>
                    {isPlaying ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <Play className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
                    )}
                  </div>

                  <h5 className="text-xs font-bold text-neutral-200 line-clamp-2 font-sans group-hover:text-white transition-colors">
                    {item.title}
                  </h5>
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <span className="truncate max-w-[120px]">{item.publisher || "Production Test"}</span>
                  {item.duration && <span>{item.duration}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
