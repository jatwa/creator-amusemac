export type CreatorIntelligenceActionId =
  | "quick_search"
  | "deep_search"
  | "creative_research"
  | "film_research"
  | "story_analysis"
  | "screenplay_breakdown"
  | "scene_analysis"
  | "shot_breakdown"
  | "shot_cards"
  | "character_analysis"
  | "visual_bible"
  | "cinematography_analysis"
  | "model_recommendation"
  | "model_comparison"
  | "prompt_generation"
  | "prompt_optimization"
  | "scene_to_video_workflow"
  | "full_story_intelligence"
  | "production_intelligence";

export type CreatorIntelligenceAction = {
  id: CreatorIntelligenceActionId;
  label: string;
  shortDescription: string;
  estimatedTokens: number;
};

export const CREATOR_INTELLIGENCE_ACTIONS: Record<CreatorIntelligenceActionId, CreatorIntelligenceAction> = {
  quick_search: { id: "quick_search", label: "Quick Search", shortDescription: "Focused answer with relevant sources.", estimatedTokens: 500 },
  deep_search: { id: "deep_search", label: "Deep Research", shortDescription: "Multi-source research and synthesis.", estimatedTokens: 2_000 },
  creative_research: { id: "creative_research", label: "Creative Research", shortDescription: "References, visual lineage and creative directions.", estimatedTokens: 2_500 },
  film_research: { id: "film_research", label: "Film / Topic Research", shortDescription: "A detailed research dossier for a film or topic.", estimatedTokens: 3_000 },
  story_analysis: { id: "story_analysis", label: "Story Analysis", shortDescription: "Structure, themes, characters, conflicts and beats.", estimatedTokens: 5_000 },
  screenplay_breakdown: { id: "screenplay_breakdown", label: "Screenplay Breakdown", shortDescription: "Scenes, characters, locations, props and production requirements.", estimatedTokens: 8_000 },
  scene_analysis: { id: "scene_analysis", label: "Scene Analysis", shortDescription: "Scene objective, beats and visual direction.", estimatedTokens: 2_000 },
  shot_breakdown: { id: "shot_breakdown", label: "Shot Breakdown", shortDescription: "Shot-by-shot camera, lens, movement and composition.", estimatedTokens: 3_000 },
  shot_cards: { id: "shot_cards", label: "Shot Cards", shortDescription: "Production-ready shot cards linked to directorial intent.", estimatedTokens: 2_500 },
  character_analysis: { id: "character_analysis", label: "Character Analysis", shortDescription: "Character arc, behaviour and visual identity.", estimatedTokens: 2_000 },
  visual_bible: { id: "visual_bible", label: "Visual Bible", shortDescription: "Character, environment, colour and visual language.", estimatedTokens: 7_500 },
  cinematography_analysis: { id: "cinematography_analysis", label: "Cinematography Analysis", shortDescription: "Lens, framing, camera, lighting and movement.", estimatedTokens: 3_500 },
  model_recommendation: { id: "model_recommendation", label: "AI Model Recommendation", shortDescription: "Best-fit model/tool with reasoning and alternatives.", estimatedTokens: 1_500 },
  model_comparison: { id: "model_comparison", label: "Model Comparison", shortDescription: "Scenario-specific model trade-offs.", estimatedTokens: 2_500 },
  prompt_generation: { id: "prompt_generation", label: "Prompt Generation", shortDescription: "Production-ready model-specific prompt.", estimatedTokens: 1_000 },
  prompt_optimization: { id: "prompt_optimization", label: "Prompt Optimization", shortDescription: "Improve an existing prompt and constraints.", estimatedTokens: 750 },
  scene_to_video_workflow: { id: "scene_to_video_workflow", label: "Scene → Video Workflow", shortDescription: "Shot, model, prompt and generation workflow.", estimatedTokens: 5_000 },
  full_story_intelligence: { id: "full_story_intelligence", label: "Full Story Intelligence", shortDescription: "Story, scenes, characters and visual strategy.", estimatedTokens: 15_000 },
  production_intelligence: { id: "production_intelligence", label: "Production Intelligence", shortDescription: "Breakdown, shots, tools and execution workflow.", estimatedTokens: 12_000 },
};

export type CreatorIntelligenceExecutionMode = "automatic" | "semi_automatic" | "manual";

export const EXECUTION_MODES = {
  automatic: {
    id: "automatic" as const,
    label: "Automatic",
    tagline: "Let Creator Intel decide and execute.",
    description: "Creator Intel selects the relevant steps and runs the workflow.",
  },
  semi_automatic: {
    id: "semi_automatic" as const,
    label: "Semi-Automatic",
    tagline: "You direct. Creator Intel executes.",
    description: "Choose the steps; Creator Intel handles the execution and preserves progress.",
  },
  manual: {
    id: "manual" as const,
    label: "Manual",
    tagline: "You control every decision.",
    description: "Run each intelligence module yourself and decide what happens next.",
  },
};

export const DEFAULT_BREAKDOWN_MODULES = [
  { id: "story_analysis", label: "Story Analysis", tokens: 2_000 },
  { id: "character_analysis", label: "Character Analysis", tokens: 3_000 },
  { id: "screenplay_breakdown", label: "Scene Breakdown", tokens: 6_000 },
  { id: "film_research", label: "Location / Research", tokens: 2_000 },
  { id: "visual_bible", label: "Production Design / Visual Bible", tokens: 2_000 },
  { id: "shot_breakdown", label: "Shot Breakdown", tokens: 3_000 },
] as const;
