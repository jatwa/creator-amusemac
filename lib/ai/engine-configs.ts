export type TargetEngine =
  | "runway"
  | "kling"
  | "veo"
  | "luma"
  | "minimax"
  | "midjourney"
  | "flux"
  | "wan";

export interface EngineConfig {
  name: string;
  icon: string;
  category: "video" | "image";
  syntaxHint: string;
  negativeHint: string;
}

export const ENGINE_CONFIGS: Record<TargetEngine, EngineConfig> = {
  runway: {
    name: "Runway Gen-3 Alpha",
    icon: "✦",
    category: "video",
    syntaxHint: "Injects directional 6-DOF camera coordinate syntax and anamorphic lens emulation.",
    negativeHint: "Removes warp artifacts, erratic camera shakes, and unnatural acceleration.",
  },
  kling: {
    name: "Kling AI 1.5",
    icon: "🌊",
    category: "video",
    syntaxHint: "Injects spatio-temporal physical mass, momentum, and fluid hydrodynamic modifiers.",
    negativeHint: "Suppresses sudden morphing, wheel deformation, and bad physics.",
  },
  veo: {
    name: "Google Veo 2",
    icon: "🎥",
    category: "video",
    syntaxHint: "Injects professional cinematographic lens language and 4K lighting falloff parameters.",
    negativeHint: "Prevents overexposed highlights, muddy contrast, and synthetic plastic sheen.",
  },
  luma: {
    name: "Luma Dream Machine",
    icon: "⚡",
    category: "video",
    syntaxHint: "Injects 3D camera parallax and high-speed motion vectors.",
    negativeHint: "Avoids 3D mesh artifacting and spatial background smearing.",
  },
  minimax: {
    name: "MiniMax / Hailuo",
    icon: "👤",
    category: "video",
    syntaxHint: "Injects natural skin texture, eye contact saccades, and organic lighting.",
    negativeHint: "Suppresses robotic gestures, wax skin, and artificial eye reflections.",
  },
  midjourney: {
    name: "Midjourney v6.1",
    icon: "🎨",
    category: "image",
    syntaxHint: "Appends --ar [ratio] --style raw --v 6.1 and 35mm film stock emulsion tags.",
    negativeHint: "Uses --no parameter flags for non-photographic artifacts.",
  },
  flux: {
    name: "Flux.1 Pro",
    icon: "🔤",
    category: "image",
    syntaxHint: "Applies natural language descriptive syntax and high-fidelity typography parameters.",
    negativeHint: "Suppresses CGI render aesthetic, oversaturation, and low-res details.",
  },
  wan: {
    name: "Wan 2.1 (ComfyUI)",
    icon: "🔒",
    category: "video",
    syntaxHint: "Applies ComfyUI node prompt conditioning for open-weight local pipelines.",
    negativeHint: "Filters out frame ghosting, flickering illumination, and noisy latent artifacts.",
  },
};
