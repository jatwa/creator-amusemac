"use client";

import { useState } from "react";
import Link from "next/link";

interface ShotPreset {
  id: string;
  title: string;
  category: string;
  icon: string;
  challenge: string;
  recommendedStack: {
    primary: { name: string; slug: string; reason: string };
    secondary: { name: string; slug: string; reason: string };
    workflowTip: string;
  };
  samplePromptSyntax: string;
}

const SHOT_PRESETS: ShotPreset[] = [
  {
    id: "preset-commercial",
    title: "Realistic Luxury / Automotive Commercial",
    category: "Commercial",
    icon: "🚘",
    challenge: "High-speed reflections, metal surfaces, and precise camera tracking without motion blur artifacts.",
    recommendedStack: {
      primary: {
        name: "Runway Gen-3 Alpha",
        slug: "runway-gen-3-alpha",
        reason: "Best-in-class camera coordinate syntax for vehicle tracking and anamorphic lens emulation."
      },
      secondary: {
        name: "Flux.1 + LoRA",
        slug: "flux",
        reason: "Generate photorealistic 4K master keyframes to feed as start-frame I2V references."
      },
      workflowTip: "Lock the car silhouette using Flux.1 first, then animate in Runway Gen-3 with custom speed curves."
    },
    samplePromptSyntax: "Low-angle tracking shot on Russian Arm following sleek obsidian sports car on rain-slicked asphalt, neon rim lights, anamorphic 35mm lens, photorealistic 24fps motion blur."
  },
  {
    id: "preset-character",
    title: "Character Performance & Dialogue Close-Up",
    category: "Narrative",
    icon: "🎭",
    challenge: "Preserving facial identity, natural blinking, eye micro-saccades, and lip sync.",
    recommendedStack: {
      primary: {
        name: "Runway Act-One",
        slug: "runway-gen-3-alpha",
        reason: "Direct facial expression and performance capture from single webcam reference video."
      },
      secondary: {
        name: "MiniMax / Hailuo Video-01",
        slug: "minimax-hailuo-ai",
        reason: "Unmatched subtle human emotion and organic skin texture rendering."
      },
      workflowTip: "Record the actor speaking the lines on webcam, then transfer to AI character using Act-One."
    },
    samplePromptSyntax: "Extreme cinematic close-up of weary cybernetic detective speaking into intercom, subtle emotional tremor, volumetric neon mist, shallow depth of field, 85mm lens."
  },
  {
    id: "preset-physics",
    title: "Complex Physical Dynamics & Fluids",
    category: "VFX / Food",
    icon: "🌊",
    challenge: "Accurate gravity, splashing liquids, steam, cloth simulation, and interaction with hands.",
    recommendedStack: {
      primary: {
        name: "Kling AI 1.5",
        slug: "kling-ai",
        reason: "Industry benchmark for real-world physical dynamics and multi-element collision simulation."
      },
      secondary: {
        name: "Runway Gen-3",
        slug: "runway-gen-3-alpha",
        reason: "Use motion brush to isolate fluid velocity from the static background environment."
      },
      workflowTip: "Use Kling's start-frame to end-frame interpolation to enforce pouring and splash termination."
    },
    samplePromptSyntax: "Macro high-speed 1000fps shot of rich dark espresso splashing into crystal glass, cascading foam droplets, dynamic fluid refraction, golden studio backlight."
  },
  {
    id: "preset-cinematic-cam",
    title: "Complex Camera Choreography (FPV / Orbit)",
    category: "Cinematography",
    icon: "🎥",
    challenge: "Long sustained camera movements without geometric distortion or scene melting.",
    recommendedStack: {
      primary: {
        name: "Runway Gen-3 Alpha",
        slug: "runway-gen-3-alpha",
        reason: "6-DOF directional camera coordinate system with orbital and vertigo zolly control."
      },
      secondary: {
        name: "Luma Dream Machine 1.5",
        slug: "luma-dream-machine",
        reason: "Exceptional 3D parallax depth for high-speed fly-throughs."
      },
      workflowTip: "Combine [Camera Move] syntax with motion intensity scale (5-7) to avoid frame tearing."
    },
    samplePromptSyntax: "FPV drone diving down steep concrete skyscraper canyon at sunset, pulling up smoothly into 180-degree orbital rotation around rooftop protagonist, wide 18mm lens."
  },
  {
    id: "preset-fast-social",
    title: "Fast-Turnaround 9:16 Social Ads",
    category: "Social",
    icon: "📱",
    challenge: "Rapid iteration cycles (sub-60s generations) with vibrant colors and instant vertical framing.",
    recommendedStack: {
      primary: {
        name: "Luma Dream Machine 1.5",
        slug: "luma-dream-machine",
        reason: "Fastest generation turnaround times under 60 seconds per clip."
      },
      secondary: {
        name: "Kling AI 1.5",
        slug: "kling-ai",
        reason: "Affordable credit allowances and native 9:16 vertical render outputs."
      },
      workflowTip: "Generate 5 variations rapidly in Luma, pick the best hero shot, and extend in Kling."
    },
    samplePromptSyntax: "Vertical 9:16 vibrant streetwear model walking forward in bustling Tokyo neon alley, dynamic handheld motion, bold chromatic contrast, punchy commercial grade."
  },
  {
    id: "preset-private-studio",
    title: "Confidential Studio IP & Local GPU Execution",
    category: "Production",
    icon: "🔒",
    challenge: "Zero third-party data transmission, strict copyright safety, and custom LoRA character training.",
    recommendedStack: {
      primary: {
        name: "Wan 2.1 (Open Weights)",
        slug: "wan-2-1",
        reason: "100% private local execution on ComfyUI with zero per-clip cloud API costs."
      },
      secondary: {
        name: "Flux.1 Dev (Self-Hosted)",
        slug: "flux",
        reason: "Train custom IP LoRAs locally and chain into Wan 2.1 I2V pipeline."
      },
      workflowTip: "Deploy on a local 24GB VRAM workstation with IP-Adapter for deterministic character locking."
    },
    samplePromptSyntax: "Master visual effects plate of proprietary hero character navigating subterranean cavern, custom LoRA trigger weights, volumetric dust motes, cinematic 2.39:1 anamorphic."
  }
];

export function VideoShotAdvisor() {
  const [selectedId, setSelectedId] = useState<string>(SHOT_PRESETS[0].id);
  const [copied, setCopied] = useState(false);

  const activePreset = SHOT_PRESETS.find((p) => p.id === selectedId) || SHOT_PRESETS[0];

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(activePreset.samplePromptSyntax);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="surface p-6 sm:p-10 border-lime/30 bg-panel/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-lime/40 bg-lime/10 px-2 py-0.5 font-mono text-[11px] font-bold text-lime">
              DIRECTOR TOOLKIT
            </span>
            <span className="text-xs text-zinc-500 font-mono">Shot-Specific Stack Matcher</span>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">
            Which AI Video Model Should I Use for This Shot?
          </h2>
          <p className="mt-1 text-sm text-zinc-300">
            Select your scene objective below to receive verified model recommendations, camera syntax, and pipeline tips.
          </p>
        </div>
      </div>

      {/* Preset Selector Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {SHOT_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedId(preset.id)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition flex items-center gap-2 ${
              selectedId === preset.id
                ? "bg-lime text-black shadow-glow"
                : "border border-line bg-black/40 text-zinc-300 hover:border-lime hover:text-white"
            }`}
          >
            <span>{preset.icon}</span>
            <span>{preset.title}</span>
          </button>
        ))}
      </div>

      {/* Active Preset Recommendation Card */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Challenge & Model Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-line/60 bg-black/40 p-6">
            <div className="text-xs font-mono uppercase text-zinc-400">Cinematic Challenge</div>
            <p className="mt-2 text-base text-zinc-100 leading-relaxed font-medium">
              {activePreset.challenge}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Primary Model */}
            <div className="rounded-xl border border-lime/40 bg-lime/5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-lime">
                  ✦ Primary Video Engine
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">Recommended</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-white">
                {activePreset.recommendedStack.primary.name}
              </h3>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                {activePreset.recommendedStack.primary.reason}
              </p>
            </div>

            {/* Secondary Model */}
            <div className="rounded-xl border border-line bg-panel p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-zinc-400">
                  ⌁ Secondary / Master Frame
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">Chaining</span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-white">
                {activePreset.recommendedStack.secondary.name}
              </h3>
              <p className="mt-2 text-xs text-zinc-300 leading-relaxed">
                {activePreset.recommendedStack.secondary.reason}
              </p>
            </div>
          </div>

          {/* Pro Director Tip */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 text-xs text-zinc-300 flex items-start gap-3">
            <span className="text-amber-400 font-bold text-sm">💡</span>
            <div>
              <strong className="text-amber-300 font-mono">Director&apos;s Pro Tip: </strong>
              {activePreset.recommendedStack.workflowTip}
            </div>
          </div>
        </div>

        {/* Verified Prompt Syntax Box */}
        <div className="rounded-xl border border-line bg-black/60 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-line/60 pb-3">
              <span className="text-xs font-mono uppercase text-lime font-bold">
                Camera &amp; Lens Syntax
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">24fps Verified</span>
            </div>
            <div className="mt-4 rounded-lg border border-zinc-800 bg-black/80 p-4 font-mono text-xs text-zinc-200 leading-relaxed select-all">
              &quot;{activePreset.samplePromptSyntax}&quot;
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-line/60 flex items-center justify-between gap-3">
            <button
              onClick={handleCopyPrompt}
              className="w-full rounded-xl bg-lime px-4 py-2.5 text-xs font-bold text-black hover:bg-white transition flex items-center justify-center gap-2"
            >
              <span>{copied ? "✓ Copied Syntax!" : "⌁ Copy Shot Prompt"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
