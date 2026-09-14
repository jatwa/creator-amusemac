"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { CameraLexiconItem, Prompt, DirectorShotConfig } from "@/data/types";
import { FilmProject } from "@/data/film-intelligence-types";

interface PromptFactoryProps {
  prompts: Prompt[];
  lexicon: CameraLexiconItem[];
}

export type TargetEngine =
  | "runway"
  | "kling"
  | "veo"
  | "luma"
  | "minimax"
  | "midjourney"
  | "flux"
  | "wan";

export const ENGINE_CONFIGS: Record<
  TargetEngine,
  {
    name: string;
    icon: string;
    category: "video" | "image";
    syntaxHint: string;
    negativeHint: string;
  }
> = {
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
    syntaxHint: "Appends `--ar [ratio] --style raw --v 6.1` and 35mm film stock emulsion tags.",
    negativeHint: "Uses `--no` parameter flags for non-photographic artifacts.",
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

// Preset Director Shot Templates
const PRESET_SHOTS: (DirectorShotConfig & { name: string })[] = [
  {
    name: "Rain-Soaked Mountain Chase",
    shotTitle: "Rain-Soaked Mountain Chase",
    shotCategory: "AUTOMOTIVE / COMMERCIAL",
    subject: "Matte Black Sports Car",
    action: "accelerating through a hairpin turn with headlights blazing",
    cameraRig: "Russian Arm",
    cameraMovement: "Low-angle dynamic pursuit tracking beside the chassis",
    lens: "Cooke Anamorphic 2.39:1",
    framing: "Low-Angle Hero Tracking",
    composition: "Layered Depth Planes with wet asphalt reflections in foreground",
    lighting: "Cold Blue Night with Headlight Backlight",
    environment: "Rain-Soaked Mountain Road",
    weather: "Heavy Rain",
    timeOfDay: "Night",
    aspectRatio: "2.39:1 (Cinemascope)",
    fps: "24fps (Standard Cinematic)",
    duration: "5 Seconds (Standard AI Take)",
    visualStyle: "Premium Automotive Commercial",
    mood: "High-Energy Action",
  },
  {
    name: "Neo-Noir Corridor Stalk",
    shotTitle: "Nocturnal Alleyway Investigation",
    shotCategory: "NARRATIVE / NEO-NOIR",
    subject: "Trench-coated Detective",
    action: "walking deliberately through pooling neon reflections with smoke rising from subway grates",
    cameraRig: "Steadicam Single-Take",
    cameraMovement: "Slow deliberate push-in following protagonist from behind",
    lens: "35mm Prime",
    framing: "Medium Establishing",
    composition: "Dynamic Diagonal Leading Lines framed by towering fire escapes",
    lighting: "High-Contrast Motivated Chiaroscuro with Cyan & Sodium Vapor",
    environment: "Rain-Drenched Urban Corridor",
    weather: "Misty Fog",
    timeOfDay: "Midnight",
    aspectRatio: "2.39:1 (Cinemascope)",
    fps: "24fps (Standard Cinematic)",
    duration: "10 Seconds (Extended Physical Take)",
    visualStyle: "35mm Hollywood Feature Film",
    mood: "Tense Neo-Noir",
  },
  {
    name: "Emotional Golden Hour Monologue",
    shotTitle: "Dusk Harbor Contemplation",
    shotCategory: "DRAMA / CHARACTER",
    subject: "Weathered Fisherman",
    action: "gazing silently toward the receding tide as warm wind catches his collar",
    cameraRig: "Low Dolly",
    cameraMovement: "Slow creeping push-in maintaining eye-level intimacy",
    lens: "85mm Portrait",
    framing: "Tight Character Close-Up",
    composition: "Rule of Thirds with generous negative space toward the horizon",
    lighting: "Soft Warm Golden Hour Key with Natural Skylight Fill",
    environment: "Coastal Harbor Dock",
    weather: "Golden Dust Haze",
    timeOfDay: "Golden Hour / Dusk",
    aspectRatio: "16:9 (Theatrical / Commercial)",
    fps: "24fps (Standard Cinematic)",
    duration: "5 Seconds (Standard AI Take)",
    visualStyle: "Tactile Arthouse Drama",
    mood: "Intimate & Reflective",
  },
  {
    name: "Microscopic Luxury Watch Craft",
    shotTitle: "Tourbillon Escapement Macro",
    shotCategory: "COMMERCIAL / PRODUCT",
    subject: "Exposed Titanium Tourbillon Watch Movement",
    action: "gears oscillating with mechanical precision while ruby balance bearings catch light",
    cameraRig: "Vertigo Dolly Zoom",
    cameraMovement: "Macro static lock-off with micro-rotational pan",
    lens: "100mm Macro",
    framing: "Extreme Macro",
    composition: "Center-Weighted Symmetric with razor-thin focal plane",
    lighting: "Surgical Commercial Rim Accents with Diffused Overhead Softbox",
    environment: "Dark Minimalist Studio Stage",
    weather: "Clear Atmosphere",
    timeOfDay: "Studio Controlled",
    aspectRatio: "16:9 (Theatrical / Commercial)",
    fps: "60fps (Slow Motion)",
    duration: "5 Seconds (Standard AI Take)",
    visualStyle: "Luxury Commercial Cinematography",
    mood: "Precision & Elegance",
  },
];

const RIG_OPTIONS = [
  "Russian Arm",
  "Steadicam Single-Take",
  "FPV Drone Dive",
  "Vertigo Dolly Zoom",
  "Low Dolly",
  "Handheld",
  "Technocrane Orbit",
  "Static Tripod Lock-off",
];

const LENS_OPTIONS = [
  "Cooke Anamorphic 2.39:1",
  "35mm Prime",
  "85mm Portrait",
  "100mm Macro",
  "24mm Ultra-Wide",
  "50mm Standard",
];

const FRAMING_OPTIONS = [
  "Low-Angle Hero Tracking",
  "Tight Character Close-Up",
  "Wide Cinematic Establishing",
  "Medium Two-Shot",
  "Extreme Macro",
  "Over-the-Shoulder Tracking",
  "High-Angle Bird's Eye",
];

const COMPOSITION_OPTIONS = [
  "Layered Depth Planes",
  "Rule of Thirds with Lead Room",
  "Dynamic Diagonal Leading Lines",
  "Center-Weighted Symmetric",
  "High Negative Space Isolation",
];

const LIGHTING_OPTIONS = [
  "Cold Blue Night with Headlight Backlight",
  "High-Contrast Motivated Chiaroscuro",
  "Soft Warm Golden Hour Key",
  "Sodium Vapor Streetlights (Amber / Cyan)",
  "Diffused Overhead Softbox with Rim Lights",
  "Harsh Direct Sunlight with Deep Shadows",
];

const WEATHER_OPTIONS = [
  "Heavy Rain",
  "Misty Fog",
  "Post-Storm Haze",
  "Clear Night",
  "Golden Dust Haze",
  "Snow Flurry",
  "Clear Atmosphere",
];

const TIME_OPTIONS = [
  "Night",
  "Golden Hour / Dusk",
  "Blue Hour",
  "Overcast Midday",
  "Dawn",
  "Midnight",
  "Studio Controlled",
];

const ASPECT_OPTIONS = [
  "2.39:1 (Cinemascope)",
  "16:9 (Theatrical / Commercial)",
  "4:3 (Academy Standard)",
  "9:16 (Vertical Cinematic)",
  "1:1 (Square)",
];

const FPS_OPTIONS = [
  "24fps (Standard Cinematic)",
  "60fps (Slow Motion)",
  "120fps (High Speed Action)",
];

const DURATION_OPTIONS = [
  "5 Seconds (Standard AI Take)",
  "10 Seconds (Extended Physical Take)",
  "Single Frame (Keyframe Still)",
];

const STYLE_OPTIONS = [
  "Premium Automotive Commercial",
  "35mm Hollywood Feature Film",
  "Tactile Arthouse Drama",
  "Neo-Noir Thriller",
  "Luxury Commercial Cinematography",
  "Cinematic Documentary",
];

export function PromptFactory({ prompts, lexicon }: PromptFactoryProps) {
  const { data: session, status } = useSession();

  // Mode: "director" (Visual Decisions) or "freeform" (Natural Language Translator)
  const [activeMode, setActiveMode] = useState<"director" | "freeform">("director");

  // Director Shot Config State
  const [shotConfig, setShotConfig] = useState<DirectorShotConfig>(PRESET_SHOTS[0]);

  // Freeform Natural Language Concept State
  const [conceptText, setConceptText] = useState<string>(
    "Luxury jewelry commercial, woman walking through rain-slicked old architecture at dusk."
  );

  // Selected Model Engine
  const [selectedEngine, setSelectedEngine] = useState<TargetEngine>("runway");

  // Active Lexicon Filter
  const [activeLexiconCategory, setActiveLexiconCategory] = useState<string>("all");

  // Copy Feedback State
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Toolkit Project Integration State
  const [userProjects, setUserProjects] = useState<FilmProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // Fetch user projects if authenticated
  useEffect(() => {
    if (status !== "authenticated") return;

    async function loadProjects() {
      try {
        const res = await fetch("/api/toolkit/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.projects && Array.isArray(data.projects)) {
            setUserProjects(data.projects);
            if (data.projects.length > 0) {
              setSelectedProjectId(data.projects[0].id);
            }
          }
        }
      } catch (err) {
        console.warn("[Director's Studio] Project fetch error:", err);
      }
    }

    loadProjects();
  }, [status]);

  // Find active optical lexicon item if matching current lens or rig
  const activeLensLexicon = useMemo(() => {
    return lexicon.find(
      (item) =>
        item.name.toLowerCase().includes(shotConfig.lens?.toLowerCase() || "") ||
        (shotConfig.lens || "").toLowerCase().includes(item.name.toLowerCase())
    );
  }, [shotConfig.lens, lexicon]);

  const activeRigLexicon = useMemo(() => {
    return lexicon.find(
      (item) =>
        item.name.toLowerCase().includes(shotConfig.cameraRig?.toLowerCase() || "") ||
        (shotConfig.cameraRig || "").toLowerCase().includes(item.name.toLowerCase())
    );
  }, [shotConfig.cameraRig, lexicon]);

  // OUTPUT A: Human-Readable Director Recipe Slip
  const directorRecipeText = useMemo(() => {
    const lines = [
      `SHOT: ${shotConfig.shotTitle || "Untitled Cinematic Shot"}`,
      `CATEGORY: ${shotConfig.shotCategory || "DIRECTOR RECIPE"}`,
      `SUBJECT: ${shotConfig.subject || "Subject"}`,
      `ACTION: ${shotConfig.action || "Action"}`,
      `CAMERA: ${shotConfig.cameraRig || "Rig"} — ${shotConfig.cameraMovement || "Movement"}`,
      `LENS: ${shotConfig.lens || "Lens"}`,
      `FRAMING: ${shotConfig.framing || "Framing"} (${shotConfig.composition || "Composition"})`,
      `LIGHTING: ${shotConfig.lighting || "Lighting"}`,
      `ENVIRONMENT: ${shotConfig.environment || "Environment"} (${shotConfig.timeOfDay || "Time"}, ${shotConfig.weather || "Weather"})`,
      `FORMAT: ${shotConfig.aspectRatio || "2.39:1"} | ${shotConfig.fps || "24fps"} | ${shotConfig.duration || "5s"}`,
      `VISUAL INTENT: ${shotConfig.visualStyle || "Cinematic"} — ${shotConfig.mood || "Atmospheric"}`,
    ];
    return lines.join("\n");
  }, [shotConfig]);

  // OUTPUT B: Model-Specific Prompt Compiler
  const modelPrompt = useMemo(() => {
    if (activeMode === "freeform") {
      const clean = conceptText.trim().replace(/\.+$/, "");
      switch (selectedEngine) {
        case "runway":
          return `[Camera: Low-angle Russian arm tracking shot, truck right at 24fps] ${clean}, anamorphic 35mm prime lens, volumetric dusk lighting, subtle chassis vibration, cinematic 2.39:1 motion cadence.`;
        case "kling":
          return `${clean}, slow motion fluid dynamics, realistic water droplet splashing on stone pavement, natural physical momentum, studio rim lighting, 10s continuous single take, 1080p.`;
        case "veo":
          return `Cinematic 4K shot: ${clean}, Panavision C-Series anamorphic optics, diffused golden hour key light with natural atmospheric falloff, steady camera movement, photorealistic color science.`;
        case "luma":
          return `Dynamic 3D camera fly-through: ${clean}, rapid spatial parallax between foreground arches and background sky, smooth acceleration curve, vibrant contrast.`;
        case "minimax":
          return `Intimate cinematic medium shot: ${clean}, authentic human skin pores and eye moisture reflections, natural breathing movement, soft streetlamp illumination, photorealistic 24fps.`;
        case "midjourney":
          return `A 35mm cinematic film still of ${clean}, soft dusk skylight, Kodak Vision3 500T grain, Cooke anamorphic lens flare, directed by Denis Villeneuve --ar 2.39:1 --style raw --v 6.1`;
        case "flux":
          return `A photorealistic editorial photograph: ${clean}, crisp gold necklace with embossed text "LUMEN", natural chiaroscuro shadow, 85mm portrait lens at f/1.8, razor sharp focus.`;
        case "wan":
          return `Master video plate: ${clean}, ComfyUI Wan 2.1 14B diffusion pass, 1080p widescreen, custom cinematic LoRA weights (0.85), realistic ambient mist.`;
        default:
          return clean;
      }
    }

    // Structured Director Decisions compile:
    const s = shotConfig.subject || "subject";
    const a = shotConfig.action || "in motion";
    const env = shotConfig.environment || "environment";
    const w = shotConfig.weather || "clear atmosphere";
    const t = shotConfig.timeOfDay || "night";
    const rig = shotConfig.cameraRig || "camera rig";
    const move = shotConfig.cameraMovement || "tracking shot";
    const lens = shotConfig.lens || "35mm prime";
    const frame = shotConfig.framing || "cinematic shot";
    const comp = shotConfig.composition || "rule of thirds";
    const light = shotConfig.lighting || "motivated lighting";
    const style = shotConfig.visualStyle || "cinematic feature";
    const fps = (shotConfig.fps || "24fps").split(" ")[0];
    const arRaw = (shotConfig.aspectRatio || "2.39:1").split(" ")[0];

    switch (selectedEngine) {
      case "runway":
        return `[Camera: ${rig} - ${move} at ${fps}] ${frame} of ${s} ${a} through ${env} at ${t} during ${w}, ${comp}, dynamic reflections across surfaces, controlled ${light}, shot on ${lens}, ${style} cinematography, ${arRaw}, ${fps}.`;
      case "kling":
        return `${frame} of ${s} ${a} through ${env} at ${t} during ${w}, ${rig} ${move}, natural physical momentum and realistic atmospheric physics, controlled ${light}, ${lens} optics, ${comp}, ${shotConfig.duration || "10s"} continuous take, ${fps}.`;
      case "veo":
        return `Cinematic 4K shot: ${frame} of ${s} ${a} through ${env}, ${rig} ${move}, ${lens} optics with natural atmospheric falloff, ${light}, ${comp}, photorealistic color science, ${arRaw}, ${fps}.`;
      case "luma":
        return `Dynamic 3D ${rig} ${move} shot of ${s} ${a} in ${env} during ${w}, high-speed spatial parallax, ${light}, ${lens} optical rendering, ${style} cadence.`;
      case "minimax":
        return `Intimate ${frame} of ${s} ${a} in ${env}, natural textures and organic atmospheric interactions, ${move}, ${light}, ${lens}, ${fps}.`;
      case "midjourney":
        return `A cinematic 35mm film still of ${s} ${a} in ${env} at ${t} during ${w}, ${frame}, ${rig} perspective, ${comp}, ${light}, shot on ${lens}, Kodak film stock emulsion, ${style} --ar ${arRaw} --style raw --v 6.1`;
      case "flux":
        return `A photorealistic editorial photograph: ${frame} of ${s} ${a} in ${env} at ${t}, ${comp}, ${light}, shot on ${lens}, razor sharp focus, ${style}.`;
      case "wan":
        return `Master video plate: ${frame} of ${s} ${a} in ${env}, ComfyUI Wan 2.1 14B diffusion pass, ${rig} ${move}, ${light}, ${lens}, cinematic LoRA weights (0.85).`;
      default:
        return `${frame} of ${s} ${a} in ${env}, ${rig}, ${lens}, ${light}, ${fps}.`;
    }
  }, [shotConfig, selectedEngine, activeMode, conceptText]);

  // OUTPUT C: Engine-Aware Resolved Negative Prompt
  const negativePrompt = useMemo(() => {
    switch (selectedEngine) {
      case "midjourney":
        return `--no plastic, oversaturated, deformed, blurry, extra limbs, watermark, text, signature`;
      case "runway":
        return `Distorted geometry, warped chassis, unnatural motion acceleration, morphing objects, erratic camera jitter, low resolution, blown-out highlights`;
      case "kling":
        return `Unnatural physics, sudden morphing, jittery frame interpolation, bad anatomy, deformed wheels, floating artifacts, compression noise`;
      case "veo":
        return `Overexposed, muddy shadows, low dynamic range, cartoonish render, unnatural face geometry, plastic textures, artificial sheen`;
      case "luma":
        return `3D model artifacting, spatial warping, blurry background smearing, sudden jump cuts, deformed meshes, ghosting vectors`;
      case "minimax":
        return `Wax skin, artificial eye reflections, unnatural head movements, robotic gestures, flickering shadows, deformed fingers`;
      case "flux":
        return `Blurry, cartoon, CGI render, 3d illustration, low quality, oversaturated, missing details, malformed proportions`;
      case "wan":
        return `Deformed hands, bad anatomy, frame ghosting, flickering lighting, noisy artifacts, unnatural jump cuts`;
      default:
        return `Blurry, low resolution, deformed, morphing, unnatural artifacts`;
    }
  }, [selectedEngine]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_SHOTS[number]) => {
    setShotConfig({ ...preset });
  };

  const handleSaveToProject = async () => {
    if (!selectedProjectId) {
      setSaveErrorMsg("Please select a target project first.");
      return;
    }

    setIsSavingProject(true);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    try {
      // 1. Fetch target project
      const projRes = await fetch(`/api/toolkit/projects/${selectedProjectId}`);
      if (!projRes.ok) {
        throw new Error("Could not retrieve the selected project.");
      }
      const projData = await projRes.json();
      const currentProject = projData.project;

      // 2. Build new shot item
      const scenes = currentProject.scenes || [];
      const targetSceneIndex = 0; // default to first scene or create scene
      const sceneId = scenes[targetSceneIndex]?.id || "sc-01";

      const newShot = {
        id: `sh-${Date.now()}`,
        shotNumber: (scenes[targetSceneIndex]?.shots?.length || 0) + 1,
        shotType: shotConfig.framing || "Low-Angle Hero Tracking",
        framing: `${shotConfig.subject || "Subject"} - ${shotConfig.action || "Action"}`,
        cameraMovement: `${shotConfig.cameraRig || "Camera"} (${shotConfig.cameraMovement || "Move"})`,
        lens: shotConfig.lens || "35mm Prime",
        composition: shotConfig.composition || "Layered Depth Planes",
        lighting: shotConfig.lighting || "Motivated Lighting",
        action: shotConfig.action || "",
        soundDialogueNote: `${shotConfig.mood || "Cinematic"} / ${shotConfig.visualStyle || ""}`,
        estimatedDurationSec: parseInt(shotConfig.duration || "5") || 5,
        toolId: `tool-${selectedEngine}`,
        promptId: `rec-${Date.now()}`,
      };

      if (scenes.length === 0) {
        scenes.push({
          id: sceneId,
          sceneNumber: 1,
          title: shotConfig.shotTitle || "Scene 01",
          slugline: `EXT. ${shotConfig.environment?.toUpperCase() || "LOCATION"} - ${shotConfig.timeOfDay?.toUpperCase() || "NIGHT"}`,
          timeOfDay: shotConfig.timeOfDay || "NIGHT",
          locationType: "EXT",
          locationName: shotConfig.environment || "Location Stage",
          synopsis: `Director shot recipe: ${shotConfig.shotTitle || "Shot"}`,
          characters: [shotConfig.subject?.split(" ")[0] || "Subject"],
          storyPurpose: shotConfig.visualStyle || "Cinematic Production",
          techniqueIds: [],
          toolIds: [`tool-${selectedEngine}`],
          promptIds: [],
          shots: [newShot],
        });
      } else {
        scenes[targetSceneIndex].shots = [
          ...(scenes[targetSceneIndex].shots || []),
          newShot,
        ];
      }

      // 3. Save via existing PATCH API
      const patchRes = await fetch(`/api/toolkit/projects/${selectedProjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenes }),
      });

      if (!patchRes.ok) {
        const patchData = await patchRes.json();
        throw new Error(patchData.error || "Failed to save shot to project.");
      }

      setSaveSuccessMsg(`Shot added to ${currentProject.title} (Scene ${targetSceneIndex + 1})!`);
      setTimeout(() => setSaveSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error("[Save to Project Error]:", err);
      setSaveErrorMsg(err.message || "Failed to save shot.");
    } finally {
      setIsSavingProject(false);
    }
  };

  const insertLexiconToken = (tokenSyntax: string, field: "lens" | "cameraRig" | "cameraMovement") => {
    if (activeMode === "freeform") {
      setConceptText((prev) => `${prev.trim().replace(/\.+$/, "")}, ${tokenSyntax}`);
    } else {
      setShotConfig((prev) => ({
        ...prev,
        [field]: tokenSyntax,
      }));
    }
  };

  const filteredLexicon = lexicon.filter(
    (l) => activeLexiconCategory === "all" || l.category === activeLexiconCategory
  );

  return (
    <div className="space-y-12">
      {/* MODE SWITCHER / HEADER INTRO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-accent font-semibold px-2 py-0.5 rounded bg-accent/10">
              DIRECTOR&apos;S STUDIO V1
            </span>
            <span className="text-xs font-mono text-tertiary">
              Cinematography Intelligence Layer
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
            Stop prompting. Start directing.
          </h2>
          <p className="text-xs sm:text-sm text-secondary mt-1 max-w-2xl font-normal">
            Structure your shot through authentic directorial and optical decisions — translating camera rigs, lenses, lighting, and composition into verified model syntax.
          </p>
        </div>

        {/* Mode Toggle Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full border border-border bg-surface self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveMode("director")}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition ${
              activeMode === "director"
                ? "bg-foreground text-background font-semibold shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            Directorial Controls
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("freeform")}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition ${
              activeMode === "freeform"
                ? "bg-foreground text-background font-semibold shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            Natural Language Translator
          </button>
        </div>
      </div>

      {/* WORKSPACE GRID: LEFT CONTROLS (7 COLS) + RIGHT DUAL OUTPUTS (5 COLS) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN: DIRECTORIAL DECISION WORKSPACE
        ======================================================== */}
        <div className="lg:col-span-7 space-y-8">
          {activeMode === "director" ? (
            <div className="space-y-8">
              {/* PRESET RECIPES SELECTOR */}
              <div className="surface p-5 sm:p-6 rounded-3xl border border-border bg-surface shadow-subtle space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-tertiary">
                    Load Director Preset Recipe:
                  </span>
                  <span className="text-[11px] font-mono text-accent">
                    {PRESET_SHOTS.length} Verified Standards
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_SHOTS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition ${
                        shotConfig.shotTitle === preset.shotTitle
                          ? "border-accent bg-accent/15 text-primary font-semibold shadow-sm"
                          : "border-border bg-surface-elevated text-secondary hover:text-primary"
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 1. DIRECTORIAL DECISION (STORY & SCENE) */}
              <div className="surface p-6 sm:p-7 rounded-3xl border border-border bg-surface shadow-subtle space-y-5">
                <div className="border-b border-border-subtle pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
                    01. DIRECTORIAL DECISION
                  </span>
                  <h3 className="text-base font-semibold text-primary mt-0.5">
                    Subject, Action &amp; Location
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-secondary">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={shotConfig.subject || ""}
                      onChange={(e) =>
                        setShotConfig({ ...shotConfig, subject: e.target.value })
                      }
                      placeholder="e.g. Matte Black Sports Car, Cyberpunk Courier, Grounded Detective..."
                      className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs sm:text-sm text-primary placeholder:text-tertiary outline-none focus:border-accent/40"
                    />
                  </div>

                  {/* Action */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-secondary">
                      Action / Movement Behavior
                    </label>
                    <input
                      type="text"
                      value={shotConfig.action || ""}
                      onChange={(e) =>
                        setShotConfig({ ...shotConfig, action: e.target.value })
                      }
                      placeholder="e.g. accelerating through a sharp turn, gazing out over the water..."
                      className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs sm:text-sm text-primary placeholder:text-tertiary outline-none focus:border-accent/40"
                    />
                  </div>

                  {/* Environment & Weather Dual Grid */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-secondary">
                        Environment / Terrain
                      </label>
                      <input
                        type="text"
                        value={shotConfig.environment || ""}
                        onChange={(e) =>
                          setShotConfig({
                            ...shotConfig,
                            environment: e.target.value,
                          })
                        }
                        placeholder="e.g. Mountain Road, Urban Corridor..."
                        className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs text-primary placeholder:text-tertiary outline-none focus:border-accent/40"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-secondary">
                        Weather / Atmosphere
                      </label>
                      <select
                        value={shotConfig.weather || WEATHER_OPTIONS[0]}
                        onChange={(e) =>
                          setShotConfig({ ...shotConfig, weather: e.target.value })
                        }
                        className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary outline-none focus:border-accent/40"
                      >
                        {WEATHER_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Time of Day */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-secondary">
                      Time of Day
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TIME_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setShotConfig({ ...shotConfig, timeOfDay: opt })
                          }
                          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition ${
                            shotConfig.timeOfDay === opt
                              ? "border-accent bg-accent/15 text-primary font-semibold"
                              : "border-border bg-surface-elevated text-secondary hover:text-primary"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. CINEMATOGRAPHY & OPTICS */}
              <div className="surface p-6 sm:p-7 rounded-3xl border border-border bg-surface shadow-subtle space-y-5">
                <div className="border-b border-border-subtle pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
                    02. CINEMATOGRAPHY &amp; OPTICS
                  </span>
                  <h3 className="text-base font-semibold text-primary mt-0.5">
                    Rig, Movement, Optics &amp; Framing
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Rig */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-secondary">
                      Camera Rig
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {RIG_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setShotConfig({ ...shotConfig, cameraRig: opt })
                          }
                          className={`px-2 py-1.5 text-[11px] font-medium rounded-lg border text-center transition ${
                            shotConfig.cameraRig === opt
                              ? "border-accent bg-accent/15 text-primary font-semibold"
                              : "border-border bg-surface-elevated text-secondary hover:text-primary"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lens */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-secondary">
                      Lens / Optics Choice
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {LENS_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setShotConfig({ ...shotConfig, lens: opt })
                          }
                          className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg border text-left transition ${
                            shotConfig.lens === opt
                              ? "border-accent bg-accent/15 text-primary font-semibold"
                              : "border-border bg-surface-elevated text-secondary hover:text-primary"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cinematography Intelligence Rationale Box */}
                  {(activeLensLexicon || activeRigLexicon) && (
                    <div className="rounded-2xl border border-accent/25 bg-accent/5 p-4 space-y-2 text-xs">
                      <span className="font-mono text-[10px] uppercase text-accent font-semibold block">
                        Optical Intelligence Rationale:
                      </span>
                      {activeLensLexicon && (
                        <p className="text-secondary leading-relaxed">
                          <strong className="text-primary font-medium">
                            {activeLensLexicon.name}:
                          </strong>{" "}
                          {activeLensLexicon.cinematicEffect}
                        </p>
                      )}
                      {activeRigLexicon && (
                        <p className="text-secondary leading-relaxed">
                          <strong className="text-primary font-medium">
                            {activeRigLexicon.name}:
                          </strong>{" "}
                          {activeRigLexicon.cinematicEffect}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Framing & Composition Dual Row */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-secondary">
                        Shot Framing
                      </label>
                      <select
                        value={shotConfig.framing || FRAMING_OPTIONS[0]}
                        onChange={(e) =>
                          setShotConfig({ ...shotConfig, framing: e.target.value })
                        }
                        className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary outline-none focus:border-accent/40"
                      >
                        {FRAMING_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-secondary">
                        Composition Principle
                      </label>
                      <select
                        value={shotConfig.composition || COMPOSITION_OPTIONS[0]}
                        onChange={(e) =>
                          setShotConfig({
                            ...shotConfig,
                            composition: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary outline-none focus:border-accent/40"
                      >
                        {COMPOSITION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. LOOK, ATMOSPHERE & FORMAT */}
              <div className="surface p-6 sm:p-7 rounded-3xl border border-border bg-surface shadow-subtle space-y-5">
                <div className="border-b border-border-subtle pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
                    03. LOOK, ATMOSPHERE &amp; FORMAT
                  </span>
                  <h3 className="text-base font-semibold text-primary mt-0.5">
                    Lighting Design, Mood &amp; Frame Standards
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Lighting */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-secondary">
                      Lighting Design
                    </label>
                    <select
                      value={shotConfig.lighting || LIGHTING_OPTIONS[0]}
                      onChange={(e) =>
                        setShotConfig({ ...shotConfig, lighting: e.target.value })
                      }
                      className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary outline-none focus:border-accent/40"
                    >
                      {LIGHTING_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visual Style & Mood */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-secondary">
                        Visual Style
                      </label>
                      <select
                        value={shotConfig.visualStyle || STYLE_OPTIONS[0]}
                        onChange={(e) =>
                          setShotConfig({
                            ...shotConfig,
                            visualStyle: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary outline-none focus:border-accent/40"
                      >
                        {STYLE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-secondary">
                        Mood / Intent
                      </label>
                      <input
                        type="text"
                        value={shotConfig.mood || ""}
                        onChange={(e) =>
                          setShotConfig({ ...shotConfig, mood: e.target.value })
                        }
                        placeholder="e.g. High-Energy Action, Neo-Noir..."
                        className="w-full rounded-xl border border-border bg-surface-elevated px-3.5 py-2 text-xs text-primary outline-none focus:border-accent/40"
                      />
                    </div>
                  </div>

                  {/* Format Row (Aspect Ratio, FPS, Duration) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-secondary">
                        Aspect Ratio
                      </label>
                      <select
                        value={shotConfig.aspectRatio || ASPECT_OPTIONS[0]}
                        onChange={(e) =>
                          setShotConfig({
                            ...shotConfig,
                            aspectRatio: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-border bg-surface-elevated px-2.5 py-2 text-xs text-primary outline-none focus:border-accent/40 font-mono"
                      >
                        {ASPECT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-secondary">
                        Frame Rate (FPS)
                      </label>
                      <select
                        value={shotConfig.fps || FPS_OPTIONS[0]}
                        onChange={(e) =>
                          setShotConfig({ ...shotConfig, fps: e.target.value })
                        }
                        className="w-full rounded-xl border border-border bg-surface-elevated px-2.5 py-2 text-xs text-primary outline-none focus:border-accent/40 font-mono"
                      >
                        {FPS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-secondary">
                        Take Duration
                      </label>
                      <select
                        value={shotConfig.duration || DURATION_OPTIONS[0]}
                        onChange={(e) =>
                          setShotConfig({
                            ...shotConfig,
                            duration: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-border bg-surface-elevated px-2.5 py-2 text-xs text-primary outline-none focus:border-accent/40 font-mono"
                      >
                        {DURATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* NATURAL LANGUAGE FREEFORM TRANSLATOR MODE */
            <div className="surface p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-subtle space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                  Natural Language Concept Mode
                </span>
                <h3 className="text-xl font-semibold text-primary mt-1">
                  Creative Scene Description
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Type a scene description in natural English to translate it into model-specific syntax.
                </p>
              </div>

              <div className="space-y-2">
                <textarea
                  value={conceptText}
                  onChange={(e) => setConceptText(e.target.value)}
                  rows={4}
                  placeholder="Describe your scene, subject, camera moves, and mood..."
                  className="w-full rounded-2xl border border-border bg-surface-elevated p-4 text-xs sm:text-sm text-primary placeholder:text-tertiary focus:border-accent/40 outline-none leading-relaxed transition font-normal"
                />
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            RIGHT COLUMN: DUAL LIVE OUTPUTS + ACTIONS (5 COLS)
        ======================================================== */}
        <div className="lg:col-span-5 space-y-6 sticky top-20">
          {/* OUTPUT A: DIRECTOR RECIPE SLIP */}
          <div className="surface rounded-3xl border border-border bg-surface overflow-hidden shadow-subtle">
            <div className="border-b border-border-subtle bg-surface-elevated px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                OUTPUT A: Director Recipe Slip
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(directorRecipeText, "recipe")}
                className="text-xs text-accent font-mono hover:underline inline-flex items-center gap-1"
              >
                {copiedType === "recipe" ? "✓ Copied!" : "Copy Recipe"}
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-4 font-mono text-[11px] sm:text-xs leading-relaxed text-secondary select-all whitespace-pre-wrap">
                {directorRecipeText}
              </div>
            </div>
          </div>

          {/* OUTPUT B: MODEL-READY PROMPT & RESOLVED NEGATIVE PROMPT */}
          <div className="surface rounded-3xl border border-border bg-surface-elevated overflow-hidden shadow-subtle space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                OUTPUT B: Model-Ready Prompt
              </span>
              <span className="text-[10px] font-mono text-accent">
                {ENGINE_CONFIGS[selectedEngine].name}
              </span>
            </div>

            {/* Model Selector Tabs */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-tertiary block">
                Select Model Architecture:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(Object.keys(ENGINE_CONFIGS) as TargetEngine[]).map((eng) => {
                  const isSelected = selectedEngine === eng;
                  return (
                    <button
                      key={eng}
                      type="button"
                      onClick={() => setSelectedEngine(eng)}
                      className={`px-2 py-1.5 text-[11px] font-mono font-medium rounded-lg border transition ${
                        isSelected
                          ? "border-accent bg-foreground text-background font-semibold shadow-sm"
                          : "border-border bg-surface text-secondary hover:text-primary"
                      }`}
                    >
                      {eng.toUpperCase()}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-accent font-mono pt-1">
                {ENGINE_CONFIGS[selectedEngine].syntaxHint}
              </p>
            </div>

            {/* Prompt Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-tertiary">
                  Model Prompt:
                </span>
                <span className="text-[10px] font-mono text-tertiary">
                  {modelPrompt.length} chars
                </span>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4 font-mono text-xs sm:text-sm leading-relaxed text-primary select-all">
                &quot;{modelPrompt}&quot;
              </div>
            </div>

            {/* Engine-Aware Negative Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-tertiary">
                  Negative Prompt:
                </span>
                <span className="text-[10px] font-mono text-accent">
                  Engine Resolved
                </span>
              </div>
              <div className="rounded-xl border border-border-subtle bg-surface p-3 font-mono text-[11px] leading-relaxed text-secondary select-all">
                {negativePrompt}
              </div>
            </div>

            {/* Copy Action Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => copyToClipboard(modelPrompt, "prompt")}
                className={`rounded-xl py-2.5 text-xs font-semibold transition text-center shadow-sm ${
                  copiedType === "prompt"
                    ? "bg-emerald-600 text-white"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {copiedType === "prompt" ? "✓ PROMPT COPIED" : "COPY PROMPT"}
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(negativePrompt, "negative")}
                className={`rounded-xl py-2.5 text-xs font-semibold border transition text-center ${
                  copiedType === "negative"
                    ? "border-emerald-600 bg-emerald-600/10 text-emerald-500"
                    : "border-border bg-surface text-secondary hover:text-primary hover:border-border-hover"
                }`}
              >
                {copiedType === "negative" ? "✓ NEGATIVE COPIED" : "COPY NEGATIVE"}
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  `${modelPrompt}\n\nNegative Prompt:\n${negativePrompt}`,
                  "complete"
                )
              }
              className={`w-full rounded-xl py-2 text-xs font-medium border transition ${
                copiedType === "complete"
                  ? "border-emerald-600 text-emerald-500 font-semibold"
                  : "border-border bg-surface text-secondary hover:text-primary"
              }`}
            >
              {copiedType === "complete"
                ? "✓ COMPLETE PROMPT & NEGATIVE COPIED"
                : "COPY COMPLETE PROMPT + NEGATIVE"}
            </button>
          </div>

          {/* SAVE TO DIRECTOR PROJECT (TOOLKIT PERSISTENCE) */}
          <div className="surface rounded-3xl border border-border bg-surface p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                Director&apos;s Toolkit Integration
              </span>
              <span className="text-[10px] font-mono text-accent">
                Private Persistence
              </span>
            </div>

            {status === "authenticated" ? (
              <div className="space-y-3">
                <p className="text-xs text-secondary leading-relaxed">
                  Save this compiled shot recipe directly into your Director&apos;s Toolkit film project shot list.
                </p>

                {userProjects.length > 0 ? (
                  <div className="space-y-2">
                    <label className="text-[11px] font-mono text-tertiary block">
                      Target Film Project:
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface-elevated px-3 py-2 text-xs text-primary outline-none focus:border-accent/40"
                    >
                      {userProjects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.format || "FEATURE"})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      disabled={isSavingProject}
                      onClick={handleSaveToProject}
                      className="w-full rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground hover:opacity-90 transition disabled:opacity-50 mt-2 shadow-sm"
                    >
                      {isSavingProject
                        ? "Saving Shot to Project..."
                        : "SAVE TO DIRECTOR PROJECT"}
                    </button>

                    {saveSuccessMsg && (
                      <p className="text-xs text-emerald-500 font-medium pt-1">
                        ✓ {saveSuccessMsg}
                      </p>
                    )}
                    {saveErrorMsg && (
                      <p className="text-xs text-rose-500 font-medium pt-1">
                        {saveErrorMsg}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <p className="text-tertiary">
                      You do not have any active film projects in your Toolkit.
                    </p>
                    <Link
                      href="/toolkit"
                      className="inline-block rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition"
                    >
                      Create First Project in Toolkit →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-secondary leading-relaxed">
                  Sign in with Google to save custom recipes directly into your Director&apos;s Toolkit project shot lists.
                </p>
                <button
                  type="button"
                  onClick={() => signIn("google")}
                  className="w-full rounded-full border border-border bg-surface-elevated py-2.5 text-xs font-semibold text-primary hover:border-accent/40 transition"
                >
                  Sign in to Save Shots →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          BOTTOM SECTION: OPTICAL & RIG KNOWLEDGE BASE LEXICON
      ======================================================== */}
      <section className="surface p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-subtle space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
              Optical Knowledge Base
            </span>
            <h3 className="text-xl font-semibold text-primary mt-1 tracking-tight">
              Camera &amp; Lens Lexicon for AI Filmmakers
            </h3>
            <p className="text-xs text-secondary mt-0.5 font-normal">
              Click any optical token below to insert its verified syntax directly into your active Director&apos;s Studio setup above.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-tertiary font-mono text-[11px]">Category:</span>
            <select
              value={activeLexiconCategory}
              onChange={(e) => setActiveLexiconCategory(e.target.value)}
              className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-primary outline-none focus:border-accent/40 font-medium"
            >
              <option value="all">All Optics &amp; Moves</option>
              <option value="Optics / Lenses">Optics / Lenses</option>
              <option value="Camera Movement">Camera Movement</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredLexicon.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl border border-border-subtle bg-surface-elevated p-4 flex flex-col justify-between space-y-3 group hover:border-accent/40 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-tertiary block">
                  {item.category}
                </span>
                <h4 className="text-sm font-semibold text-primary mt-1">
                  {item.name}
                </h4>
                <p className="text-[11px] text-secondary mt-2 leading-relaxed">
                  {item.cinematicEffect}
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                <span className="font-mono text-[10px] text-tertiary">
                  {item.focalLengthOrVector.split(",")[0]}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    insertLexiconToken(
                      item.name,
                      item.category.includes("Lens") ? "lens" : "cameraRig"
                    )
                  }
                  className="text-xs text-accent font-mono hover:underline"
                  title="Apply to Director Studio"
                >
                  + Apply to Studio
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
