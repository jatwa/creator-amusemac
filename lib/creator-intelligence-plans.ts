export type ExecutionMode = "automatic" | "semi_automatic" | "manual";

export interface IntelligenceModule {
  id: string;
  name: string;
  category: "Narrative" | "Production" | "Optics" | "Direction";
  purpose: string;
  description: string;
  estimatedTokensBase: number;
  tokensPer1000Chars: number;
  outputArtifacts: string[];
}

export const CANONICAL_INTELLIGENCE_MODULES: IntelligenceModule[] = [
  {
    id: "story_analysis",
    name: "Story & Narrative Structure",
    category: "Narrative",
    purpose: "Extract core dramatic conflict, logline, three-act pacing, and thematic spine.",
    description: "Evaluates narrative arcs, stakes, pacing friction, and cinematic premise alignment.",
    estimatedTokensBase: 1500,
    tokensPer1000Chars: 120,
    outputArtifacts: ["Logline & Premise Matrix", "Three-Act Arc Breakdown", "Thematic Keynotes"],
  },
  {
    id: "character_analysis",
    name: "Character Arcs & Dynamics",
    category: "Narrative",
    purpose: "Map protagonist/antagonist dynamics, internal motivations, and dialogue voice.",
    description: "Builds character profiles, relationship tension vectors, and casting archetypes.",
    estimatedTokensBase: 1800,
    tokensPer1000Chars: 140,
    outputArtifacts: ["Dramatis Personae Dossiers", "Conflict Dynamics Map", "Voice & Cadence Guides"],
  },
  {
    id: "screenplay_breakdown",
    name: "Scene-by-Scene Breakdown",
    category: "Production",
    purpose: "Identify INT/EXT sluglines, Day/Night conditions, locations, and logistical density.",
    description: "Extracts physical production requirements, scene indexes, and coverage complexities.",
    estimatedTokensBase: 2500,
    tokensPer1000Chars: 220,
    outputArtifacts: ["Slugline Registry", "Location & Lighting Index", "Scene Complexity Matrix"],
  },
  {
    id: "film_research",
    name: "Cinema Precedents & Research",
    category: "Optics",
    purpose: "Ground the piece in cinema history, reference films, genre tropes, and festival targets.",
    description: "Discovers cinematic references, historical aesthetics, and disqualification vectors.",
    estimatedTokensBase: 1200,
    tokensPer1000Chars: 90,
    outputArtifacts: ["Film Reference Ledger", "Visual Precedent Citations", "Festival Strategy Alignment"],
  },
  {
    id: "visual_bible",
    name: "Visual Language & Aesthetic Bible",
    category: "Optics",
    purpose: "Define lighting contrast ratios, color palettes, camera movements, and aspect ratios.",
    description: "Establishes the visual identity, camera optics (e.g. Anamorphic vs Spherical), and color grading.",
    estimatedTokensBase: 2000,
    tokensPer1000Chars: 160,
    outputArtifacts: ["Color Space & Lighting Matrix", "Optics & Lens Blueprint", "Camera Rig & Movement Deck"],
  },
  {
    id: "shot_breakdown",
    name: "Directorial Shot & Prompt Deck",
    category: "Direction",
    purpose: "Compile camera-locked scene shots and model-specific prompt recipes.",
    description: "Generates production shot lists and translation syntax for Runway Gen-3, Kling 1.5, Flux, and Midjourney.",
    estimatedTokensBase: 3000,
    tokensPer1000Chars: 280,
    outputArtifacts: ["Shot-by-Shot Coverage List", "Model-Tuned Prompt Slips", "Artifact Suppression Negatives"],
  },
];

export interface ExecutionModeConfig {
  mode: ExecutionMode;
  title: string;
  subtitle: string;
  description: string;
  recommendedFor: string;
  icon: string;
}

export const EXECUTION_MODES: Record<ExecutionMode, ExecutionModeConfig> = {
  automatic: {
    mode: "automatic",
    title: "Autonomous Intelligence",
    subtitle: "End-to-End Pipeline Execution",
    description: "Executes all selected modules sequentially and aggregates findings into a unified Director Project.",
    recommendedFor: "Feature screenplays, short films, and complete commercial treatments.",
    icon: "⚡",
  },
  semi_automatic: {
    mode: "semi_automatic",
    title: "Director-in-the-Loop",
    subtitle: "Interactive Stage Review",
    description: "Pauses after each intelligence stage for human directorial approval and variable calibration.",
    recommendedFor: "Complex narratives requiring strict visual style tuning.",
    icon: "🎯",
  },
  manual: {
    mode: "manual",
    title: "Modular Inspection",
    subtitle: "On-Demand Stage Execution",
    description: "Allows granular triggering and inspection of individual modules without continuous execution.",
    recommendedFor: "Quick research queries, scene-only checks, and prompt lookups.",
    icon: "⚙",
  },
};

export function estimateModuleTokens(
  moduleId: string,
  charCount: number | null
): { estimatedTokens: number; formatted: string } {
  const mod = CANONICAL_INTELLIGENCE_MODULES.find((m) => m.id === moduleId);
  if (!mod) return { estimatedTokens: 1000, formatted: "~1.0K tokens" };

  const chars = Math.max(0, charCount || 5000);
  const scaling = Math.round((chars / 1000) * mod.tokensPer1000Chars);
  const total = mod.estimatedTokensBase + scaling;

  const formatted = total >= 1000 ? `~${(total / 1000).toFixed(1)}K tokens` : `~${total} tokens`;
  return { estimatedTokens: total, formatted };
}

export function estimateTotalWorkflowTokens(
  selectedModuleIds: string[],
  charCount: number | null
): { totalTokens: number; formatted: string } {
  let sum = 0;
  for (const id of selectedModuleIds) {
    sum += estimateModuleTokens(id, charCount).estimatedTokens;
  }

  const formatted = sum >= 1000 ? `~${(sum / 1000).toFixed(1)}K tokens` : `~${sum} tokens`;
  return { totalTokens: sum, formatted };
}
