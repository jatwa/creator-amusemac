"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface DecisionObjective {
  id: string;
  title: string;
  category: string;
  icon: string;
  challenge: string;
  primaryModel: string;
  backupModel: string;
  whyPrimary: string;
  whyBackup: string;
  promptSyntax: string;
  productionPipeline: string;
  limitations: string;
}

const OBJECTIVES: DecisionObjective[] = [
  {
    id: "car-commercial",
    title: "Car Commercial",
    category: "Commercial",
    icon: "🚘",
    challenge: "High-speed reflections, asphalt parallax, and camera tracking without wheel spoke distortion.",
    primaryModel: "Runway Gen-3 Alpha",
    backupModel: "Kling AI 1.5",
    whyPrimary: "Unmatched 6-DOF camera tracking syntax for Russian Arm vehicle moves and anamorphic lens emulation.",
    whyBackup: "Superior asphalt reflection physics and dynamic speed motion.",
    promptSyntax: "Low-angle Russian arm tracking shot following matte obsidian sports car on rain-slicked highway, neon streaks, anamorphic 35mm lens, 24fps motion blur.",
    productionPipeline: "1. Lock master vehicle frame in Flux.1. 2. Feed to Runway I2V with pan/tilt coordinates. 3. Upscale in Topaz Video AI to 4K ProRes.",
    limitations: "Watch for wheel rotation artifacting if speed parameter exceeds 7."
  },
  {
    id: "fashion-film",
    title: "Fashion & Luxury Film",
    category: "Commercial",
    icon: "👗",
    challenge: "Fabric drape physics, delicate silk movement, and high-fashion photographic color science.",
    primaryModel: "Midjourney v6.1 + Runway Gen-3",
    backupModel: "MiniMax / Hailuo Video-01",
    whyPrimary: "Midjourney locks haute couture aesthetics; Runway animates fabric drape with subtle wind motion.",
    whyBackup: "Hailuo handles soft natural lighting and realistic model eye contact effortlessly.",
    promptSyntax: "Cinematic medium slow-motion shot of haute couture model in billowing emerald silk gown walking down Parisian boulevard at dusk, 35mm Kodak Portra.",
    productionPipeline: "1. Generate editorial still in Midjourney with `--style raw`. 2. Import into Runway I2V with Motion Brush on fabric. 3. Color grade in DaVinci.",
    limitations: "Complex patterned fabrics like houndstooth may shimmer during fast movement."
  },
  {
    id: "character-dialogue",
    title: "Character Dialogue & Performance",
    category: "Narrative",
    icon: "🎭",
    challenge: "Preserving facial identity, natural blinking, eye saccades, and subtle micro-expressions.",
    primaryModel: "Runway Act-One",
    backupModel: "MiniMax / Hailuo Video-01",
    whyPrimary: "Direct performance capture from actor webcam footage eliminates uncanny valley robot stares.",
    whyBackup: "MiniMax generates organic human skin texture and natural eyelid movement.",
    promptSyntax: "Extreme close-up of tired spaceship pilot speaking into radio headset, subtle brow furrow and lip tremor, warm cockpit amber fill light, 85mm lens.",
    productionPipeline: "1. Record live actor delivering line on webcam. 2. Route driving video through Act-One onto target character plate. 3. Sync audio stem.",
    limitations: "Extreme head rotations beyond 45 degrees can distort facial landmark tracking."
  },
  {
    id: "action-sequence",
    title: "High-Energy Action Sequence",
    category: "Action",
    icon: "💥",
    challenge: "Fast multi-body choreography, explosive debris physics, and realistic human momentum.",
    primaryModel: "Kling AI 1.5 (Pro 10s)",
    backupModel: "Runway Gen-3 Alpha",
    whyPrimary: "Spatio-temporal attention simulates physical gravity, acrobatic momentum, and collision impact.",
    whyBackup: "Runway provides rapid camera pan and tilt options to follow the action trajectory.",
    promptSyntax: "Dynamic tracking shot of martial artist executing flying roundhouse kick in rainy alleyway, water droplets scattering violently, neon backlighting, 24fps.",
    productionPipeline: "1. Establish start & end keyframes in Kling. 2. Enable 10s Pro generation. 3. Cut rapid shots in timeline with sound FX.",
    limitations: "Multi-character limbs can briefly cross or fuse during rapid grappling maneuvers."
  },
  {
    id: "product-film",
    title: "Product Tabletop & Commercial",
    category: "Commercial",
    icon: "☕",
    challenge: "Macro fluid dynamics, pouring liquids, condensation droplets, and pristine packaging reflections.",
    primaryModel: "Kling AI 1.5",
    backupModel: "Flux.1 Pro + Luma Dream Machine",
    whyPrimary: "Industry benchmark for fluid hydrodynamics, splashing espresso, and melting foam.",
    whyBackup: "Flux.1 guarantees crisp branded logo text, while Luma animates smooth orbital product spins.",
    promptSyntax: "Macro 1000fps high-speed shot of golden espresso pouring into crystal glass on black slate, cascading droplets, golden studio rim lighting, 8k.",
    productionPipeline: "1. Generate crisp product pack in Flux.1. 2. Feed start plate into Kling 1.5 for slow-motion fluid simulation. 3. Add sound FX in post.",
    limitations: "Ensure liquid viscosity is explicitly described (e.g. 'thick viscous oil' vs 'light splashing water')."
  },
  {
    id: "music-video",
    title: "Music Video & Style Transfer",
    category: "Creative",
    icon: "🎵",
    challenge: "Rhythmic pacing, psychedelic camera transitions, and expressive visual transformations.",
    primaryModel: "Runway Gen-3 + Luma Dream Machine",
    backupModel: "Kling AI 1.5",
    whyPrimary: "Runway's camera rolls and Luma's 3D spatial depth allow surreal infinite zoom and orbit effects.",
    whyBackup: "Kling's video extension tool allows chaining long flowing musical sequences.",
    promptSyntax: "Hypnotic continuous spiral zoom through psychedelic neon cloudscape, morphing geometry, vibrant magenta and ultraviolet hues, fluid camera velocity.",
    productionPipeline: "1. Match visual beats to audio BPM markers. 2. Generate camera zooms in Runway. 3. Composite multi-layer effects in After Effects.",
    limitations: "Rapid flashing effects should be monitored for temporal compression artifacts."
  },
  {
    id: "architecture",
    title: "Architectural & Interior Walkthrough",
    category: "Spatial",
    icon: "🏛️",
    challenge: "Strict perspective lines, realistic sunlight falloff, and stable structural geometry.",
    primaryModel: "Midjourney v6.1 + Runway Gen-3",
    backupModel: "Flux.1 + ComfyUI Depth ControlNet",
    whyPrimary: "Midjourney understands brutalist, Scandinavian, and modern architectural materials flawlessly.",
    whyBackup: "ControlNet depth maps enforce exact 3D CAD blocking derived from Rhino or Blender.",
    promptSyntax: "Slow architectural Steadicam push through minimalist concrete villa in Kyoto, morning sunlight casting geometric shadows through bamboo screens, 24mm wide lens.",
    productionPipeline: "1. Render CAD depth map. 2. Skin with Flux/Midjourney. 3. Push forward smoothly in Runway I2V.",
    limitations: "Complex repetitive patterns (e.g. brick walls) may crawl if camera moves too quickly."
  },
  {
    id: "vfx-plate",
    title: "VFX Background Plate & Matte",
    category: "VFX",
    icon: "🛸",
    challenge: "High dynamic range lighting, stable camera parallax, and clean depth separation for green-screen comping.",
    primaryModel: "Runway Gen-3 Alpha (Text-to-Video)",
    backupModel: "Wan 2.1 (Open Weights)",
    whyPrimary: "Generates clean cinematic 2.39:1 widescreen plates with realistic atmospheric haze and depth.",
    whyBackup: "Wan 2.1 allows running uncompressed EXR plates locally on studio render nodes.",
    promptSyntax: "Wide cinematic establishing shot of subterranean cybernetic factory, towering steam cooling towers, drifting industrial smog, cinematic anamorphic 2.39:1.",
    productionPipeline: "1. Generate plate in Runway. 2. Upscale in Topaz to 4K ProRes 4444. 3. Track 3D camera in Nuke/After Effects.",
    limitations: "Avoid busy foreground debris if you need clean roto lines for live-action actors."
  },
  {
    id: "documentary",
    title: "Documentary Archival Reconstruction",
    category: "Narrative",
    icon: "📜",
    challenge: "Period-accurate wardrobe, authentic 16mm/35mm archival film grain, and subtle non-dramatic motion.",
    primaryModel: "Midjourney v6.1 + Runway Gen-3",
    backupModel: "Kling AI 1.5",
    whyPrimary: "Midjourney captures vintage historical photo textures (Kodak Tri-X, sepia tint, Daguerreotype).",
    whyBackup: "Kling generates subtle ambient breathing and slow camera panning without modern CGI sheen.",
    promptSyntax: "Archival 16mm black and white film footage of 1920s steelworkers on high-rise girder, dust motes in sunlight, authentic film scratches and gate weave, 16fps.",
    productionPipeline: "1. Prompt historical look in Midjourney using `--style raw`. 2. Add subtle camera drift in Runway. 3. Apply 16mm grain overlay.",
    limitations: "AI models often default to modern teeth and skin cleanliness without explicit vintage prompts."
  },
  {
    id: "social-ad",
    title: "Fast Social Ad (9:16 Vertical)",
    category: "Social",
    icon: "📱",
    challenge: "Sub-60s turn-around, punchy vertical framing, and bold high-contrast color grading.",
    primaryModel: "Luma Dream Machine 1.5",
    backupModel: "Kling AI 1.5 (9:16 Mode)",
    whyPrimary: "Fastest generation turn-around times under 40 seconds per 5s clip.",
    whyBackup: "Native 9:16 vertical render outputs with generous daily credit allowances.",
    promptSyntax: "Vertical 9:16 dynamic commercial shot of energetic runner in neon cyberpunk city, handheld camera tracking forward, punchy color contrast, commercial grade.",
    productionPipeline: "1. Rapidly generate 6 variations in Luma. 2. Pick hero shot. 3. Add captions in Descript and export for Reels/TikTok.",
    limitations: "720p base resolution requires upscaling for 4K vertical displays."
  }
];

export function VideoShotAdvisor() {
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>(OBJECTIVES[0].id);
  const [sourceType, setSourceType] = useState<"text" | "image" | "video" | "storyboard">("image");
  const [priorityDriver, setPriorityDriver] = useState<"camera" | "physics" | "character" | "speed" | "privacy" | "cost">("camera");
  const [copied, setCopied] = useState(false);

  const activeObj = OBJECTIVES.find((o) => o.id === selectedObjectiveId) || OBJECTIVES[0];

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(activeObj.promptSyntax);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section className="surface p-6 sm:p-10 border-border bg-surface shadow-subtle transition-colors rounded-3xl space-y-8">
      {/* Header */}
      <div className="border-b border-border-subtle pb-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
          Interactive Decision Engine
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl font-semibold text-primary tracking-tight">
          Shot Advisor: What Are You Creating?
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-secondary font-normal">
          Select your scene objective, input source, and primary constraint to calculate the optimal AI model stack.
        </p>
      </div>

      {/* Step 1: 10 Scene Objectives */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-widest text-tertiary block mb-3">
          Step 1: Choose Scene Objective ({OBJECTIVES.length} Verified Production Types)
        </span>
        <div className="flex flex-wrap gap-2">
          {OBJECTIVES.map((obj) => {
            const isSelected = selectedObjectiveId === obj.id;
            return (
              <motion.button
                key={obj.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedObjectiveId(obj.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border bg-surface-elevated text-secondary hover:text-primary hover:border-border-bright"
                }`}
              >
                <span>{obj.icon}</span>
                <span>{obj.title}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Step 2 & 3: Source Material & Priority Driver */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border-subtle">
        {/* Source Material */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-tertiary block mb-2.5">
            Step 2: Starting Asset Source
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(["text", "image", "video", "storyboard"] as const).map((src) => (
              <button
                key={src}
                onClick={() => setSourceType(src)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                  sourceType === src
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold"
                    : "border border-border bg-surface-elevated text-secondary hover:text-primary"
                }`}
              >
                {src === "text" ? "📝 Text Prompt" : src === "image" ? "🖼️ Keyframe Image (I2V)" : src === "video" ? "🎥 Video Reference (V2V)" : "📐 Storyboard Sketch"}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Driver */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-tertiary block mb-2.5">
            Step 3: Primary Priority Constraint
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(["camera", "physics", "character", "speed", "privacy", "cost"] as const).map((pri) => (
              <button
                key={pri}
                onClick={() => setPriorityDriver(pri)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
                  priorityDriver === pri
                    ? "bg-accent/15 text-accent border border-accent/40 font-semibold"
                    : "border border-border bg-surface-elevated text-secondary hover:text-primary"
                }`}
              >
                {pri === "camera" ? "🎥 Camera 6-DOF" : pri === "physics" ? "🌊 Physical Realism" : pri === "character" ? "👤 Character Face Lock" : pri === "speed" ? "⚡ Render Speed" : pri === "privacy" ? "🔒 Local / Private" : "💰 Budget / Free"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculated Recommendation Output */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeObj.id}-${sourceType}-${priorityDriver}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-border-subtle"
        >
          {/* Main Intelligence Output */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cinematic Challenge */}
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-tertiary block">
                Production Challenge
              </span>
              <p className="mt-1 text-xs sm:text-sm text-primary leading-relaxed">
                {activeObj.challenge}
              </p>
            </div>

            {/* Model Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold block">
                  Primary Video Engine
                </span>
                <h4 className="text-base font-bold text-primary">{activeObj.primaryModel}</h4>
                <p className="text-xs text-secondary leading-relaxed">{activeObj.whyPrimary}</p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-secondary font-semibold block">
                  Backup / Secondary Model
                </span>
                <h4 className="text-base font-bold text-primary">{activeObj.backupModel}</h4>
                <p className="text-xs text-secondary leading-relaxed">{activeObj.whyBackup}</p>
              </div>
            </div>

            {/* Pipeline Steps & Limitations */}
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs space-y-2">
              <div>
                <strong className="text-primary font-semibold">Recommended 3-Step Pipeline: </strong>
                <span className="text-secondary">{activeObj.productionPipeline}</span>
              </div>
              <div className="pt-2 border-t border-border-subtle text-secondary">
                <strong className="text-tertiary font-semibold">Watch Out For: </strong>
                <span>{activeObj.limitations}</span>
              </div>
            </div>
          </div>

          {/* Prompt Syntax Box */}
          <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
                <span className="text-xs font-semibold text-primary">Verified Shot Prompt</span>
                <span className="text-[10px] text-accent font-mono">24fps Syntax</span>
              </div>
              <p className="mt-3 rounded-lg border border-border bg-surface p-3 font-mono text-xs text-primary leading-relaxed select-all">
                &quot;{activeObj.promptSyntax}&quot;
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyPrompt}
              className={`w-full rounded-full px-4 py-2.5 text-xs font-medium transition shadow-sm ${
                copied
                  ? "bg-accent text-accent-foreground"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              {copied ? "✓ Copied Shot Prompt!" : "Copy Shot Prompt Recipe"}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
