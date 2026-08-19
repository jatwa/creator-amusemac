"use client";

import React from "react";
import { motion } from "motion/react";
import { RoleMode } from "@/data/types";

interface RoleModeSelectorProps {
  currentRole: RoleMode;
  onRoleChange: (role: RoleMode) => void;
  className?: string;
}

export const ROLE_CONFIGS: Record<
  RoleMode,
  { label: string; icon: string; focus: string; description: string }
> = {
  director: {
    label: "Director",
    icon: "🎬",
    focus: "Story & Performance",
    description: "Prioritizes narrative arc, actor emotion, camera choreography, and visual pacing.",
  },
  cinematographer: {
    label: "Cinematographer",
    icon: "🎥",
    focus: "Lens & Lighting",
    description: "Prioritizes focal length, optical bokeh, exposure ratios, and dynamic camera coordinate precision.",
  },
  production_designer: {
    label: "Production Designer",
    icon: "🎨",
    focus: "Set & Continuity",
    description: "Prioritizes world-building, material textures, architectural consistency, and color palette lock.",
  },
  editor: {
    label: "Editor",
    icon: "✂️",
    focus: "Pacing & Assembly",
    description: "Prioritizes cut points, temporal motion blur, NLE integration, and multi-track audio sync.",
  },
  producer: {
    label: "Creative Producer",
    icon: "💼",
    focus: "Budget & Rights",
    description: "Prioritizes commercial indemnification, compute latency, team seat limits, and credit cost.",
  },
};

export function RoleModeSelector({
  currentRole,
  onRoleChange,
  className = "",
}: RoleModeSelectorProps) {
  const roles: RoleMode[] = [
    "director",
    "cinematographer",
    "production_designer",
    "editor",
    "producer",
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-widest text-tertiary">
          Production Role Perspective
        </span>
        <span className="text-[11px] text-accent font-mono">
          Focus: {ROLE_CONFIGS[currentRole].focus}
        </span>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => {
          const config = ROLE_CONFIGS[r];
          const isSelected = currentRole === r;

          return (
            <motion.button
              key={r}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onRoleChange(r)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition flex items-center gap-2 ${
                isSelected
                  ? "bg-foreground text-background shadow-sm"
                  : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
              }`}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Role Perspective Focus Banner */}
      <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3 text-xs text-secondary flex items-start gap-2.5">
        <span className="text-base">{ROLE_CONFIGS[currentRole].icon}</span>
        <div>
          <strong className="text-primary font-medium">
            {ROLE_CONFIGS[currentRole].label} Mode:{" "}
          </strong>
          <span>{ROLE_CONFIGS[currentRole].description}</span>
        </div>
      </div>
    </div>
  );
}
