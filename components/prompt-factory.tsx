"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CameraLexiconItem, Prompt } from "@/data/types";

interface PromptFactoryProps {
  prompts: Prompt[];
  lexicon: CameraLexiconItem[];
}

type TargetEngine = "runway" | "kling" | "veo" | "luma" | "minimax" | "midjourney" | "flux" | "wan";

const ENGINE_CONFIGS: Record<
  TargetEngine,
  { name: string; icon: string; category: "video" | "image"; syntaxHint: string }
> = {
  runway: {
    name: "Runway Gen-3 Alpha",
    icon: "✦",
    category: "video",
    syntaxHint: "Injects directional 6-DOF camera coordinate syntax and anamorphic lens emulation.",
  },
  kling: {
    name: "Kling AI 1.5",
    icon: "🌊",
    category: "video",
    syntaxHint: "Injects spatio-temporal physical mass, momentum, and fluid hydrodynamic modifiers.",
  },
  veo: {
    name: "Google Veo 2",
    icon: "🎥",
    category: "video",
    syntaxHint: "Injects professional cinematographic lens language and 4K lighting falloff parameters.",
  },
  luma: {
    name: "Luma Dream Machine",
    icon: "⚡",
    category: "video",
    syntaxHint: "Injects 3D camera parallax and high-speed motion vectors.",
  },
  minimax: {
    name: "MiniMax / Hailuo Video",
    icon: "👤",
    category: "video",
    syntaxHint: "Injects natural skin texture, eye contact saccades, and organic lighting.",
  },
  midjourney: {
    name: "Midjourney v6.1",
    icon: "🎨",
    category: "image",
    syntaxHint: "Appends `--ar 2.39:1 --style raw --v 6.1` and film stock emulsion tags.",
  },
  flux: {
    name: "Flux.1 Pro",
    icon: "🔤",
    category: "image",
    syntaxHint: "Applies natural language descriptive syntax and in-image typography parameters.",
  },
  wan: {
    name: "Wan 2.1 (ComfyUI)",
    icon: "🔒",
    category: "video",
    syntaxHint: "Applies ComfyUI node prompt conditioning for open-weight local pipelines.",
  },
};

export function PromptFactory({ prompts, lexicon }: PromptFactoryProps) {
  const [conceptText, setConceptText] = useState<string>(
    "Luxury jewelry commercial, woman walking through rain-slicked old architecture at dusk."
  );
  const [selectedEngine, setSelectedEngine] = useState<TargetEngine>("runway");
  const [activeLexiconCategory, setActiveLexiconCategory] = useState<string>("all");
  const [copied, setCopied] = useState(false);

  // Model-specific syntax translator logic based purely on factual model parameters
  const translatePrompt = (concept: string, engine: TargetEngine): string => {
    const clean = concept.trim().replace(/\.+$/, "");
    switch (engine) {
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
  };

  const translatedPrompt = translatePrompt(conceptText, selectedEngine);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const insertLexiconToken = (tokenSyntax: string) => {
    setConceptText((prev) => `${prev.trim().replace(/\.+$/, "")}, ${tokenSyntax}`);
  };

  const filteredLexicon = lexicon.filter(
    (l) => activeLexiconCategory === "all" || l.category === activeLexiconCategory
  );

  return (
    <div className="space-y-12">
      {/* Interactive Model Translator Studio */}
      <section className="surface p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-subtle space-y-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            Prompt Factory &amp; Translator
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mt-1 tracking-tight">
            Universal Concept → Model-Specific Syntax Translator
          </h2>
          <p className="text-xs sm:text-sm text-secondary mt-0.5 font-normal">
            Type a creative scene concept in plain English, choose your target engine, and generate verified syntax based on each model&apos;s latent architecture.
          </p>
        </div>

        {/* Input Textarea */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono uppercase text-tertiary block">
            Creative Scene Concept:
          </label>
          <textarea
            value={conceptText}
            onChange={(e) => setConceptText(e.target.value)}
            rows={3}
            placeholder="Describe your scene, subject, lighting, and mood..."
            className="w-full rounded-xl border border-border bg-surface-elevated p-4 text-xs sm:text-sm text-primary placeholder:text-tertiary focus:border-accent/40 outline-none leading-relaxed transition font-normal"
          />
        </div>

        {/* Engine Selector Pills */}
        <div className="space-y-2.5">
          <span className="text-[11px] font-mono uppercase text-tertiary block">
            Target AI Model Architecture:
          </span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ENGINE_CONFIGS) as TargetEngine[]).map((eng) => {
              const config = ENGINE_CONFIGS[eng];
              const isSelected = selectedEngine === eng;
              return (
                <motion.button
                  key={eng}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedEngine(eng)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-foreground text-background shadow-sm"
                      : "border border-border bg-surface-elevated text-secondary hover:text-primary hover:border-border-bright"
                  }`}
                >
                  <span>{config.icon}</span>
                  <span>{config.name}</span>
                </motion.button>
              );
            })}
          </div>
          <p className="text-[11px] text-accent font-mono pt-1">
            {ENGINE_CONFIGS[selectedEngine].syntaxHint}
          </p>
        </div>

        {/* Output Translated Syntax Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedEngine}-${conceptText}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-accent/25 bg-surface-elevated p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="text-xs font-semibold text-primary">
                Generated {ENGINE_CONFIGS[selectedEngine].name} Syntax
              </span>
              <span className="text-[10px] text-accent font-mono">24fps Production Ready</span>
            </div>

            <p className="font-mono text-xs sm:text-sm text-primary leading-relaxed select-all">
              &quot;{translatedPrompt}&quot;
            </p>

            <div className="pt-2 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopy}
                className={`rounded-full px-5 py-2 text-xs font-medium transition shadow-sm ${
                  copied
                    ? "bg-accent text-accent-foreground"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                {copied ? "✓ Copied to Clipboard!" : "Copy Translated Prompt"}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Camera & Lens Optical Lexicon */}
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
              Click any optical token below to insert its verified syntax directly into your active prompt above.
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
              className="rounded-xl border border-border-subtle bg-surface-elevated p-4 flex flex-col justify-between space-y-3 group hover:border-accent/40 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono uppercase text-tertiary block">
                  {item.category}
                </span>
                <h4 className="text-sm font-semibold text-primary mt-1">{item.name}</h4>
                <p className="text-[11px] text-secondary mt-2 leading-relaxed">
                  {item.cinematicEffect}
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
                <span className="font-mono text-[10px] text-tertiary">{item.focalLengthOrVector.split(",")[0]}</span>
                <button
                  onClick={() => insertLexiconToken(item.promptSyntax)}
                  className="text-xs text-accent font-mono hover:underline"
                  title="Insert into Prompt Box"
                >
                  + Insert Syntax
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
