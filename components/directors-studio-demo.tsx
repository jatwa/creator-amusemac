"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

type EngineType = "RUNWAY" | "KLING" | "LUMA" | "MIDJOURNEY / IMAGE";

const VEHICLE_OPTIONS = [
  "Matte Black Sports Car",
  "Metallic Emerald Luxury SUV",
  "Vintage Silver Roadster",
] as const;

const CAMERA_OPTIONS = [
  "Russian Arm",
  "Low Dolly",
  "Drone Tracking",
  "Handheld",
] as const;

const LENS_OPTIONS = [
  "24mm",
  "35mm Anamorphic",
  "50mm",
] as const;

const LIGHTING_OPTIONS = [
  "Cold Blue Night",
  "Soft Commercial",
  "Headlight Backlight",
] as const;

const WEATHER_OPTIONS = [
  "Heavy Rain",
  "Misty Fog",
  "Post-Storm Haze",
] as const;

const ENVIRONMENT_OPTIONS = [
  "Mountain Road",
  "Coastal Highway",
  "Desert Canyon",
] as const;

const ENGINE_TABS: EngineType[] = [
  "RUNWAY",
  "KLING",
  "LUMA",
  "MIDJOURNEY / IMAGE",
];

export function DirectorsStudioDemo() {
  const [vehicle, setVehicle] = useState<string>(VEHICLE_OPTIONS[0]);
  const [camera, setCamera] = useState<string>(CAMERA_OPTIONS[0]);
  const [lens, setLens] = useState<string>(LENS_OPTIONS[1]);
  const [lighting, setLighting] = useState<string>(LIGHTING_OPTIONS[0]);
  const [weather, setWeather] = useState<string>(WEATHER_OPTIONS[0]);
  const [environment, setEnvironment] = useState<string>(ENVIRONMENT_OPTIONS[0]);
  const [selectedEngine, setSelectedEngine] = useState<EngineType>("RUNWAY");
  const [copied, setCopied] = useState(false);

  // Dynamic Prompt generation matching model-specific director syntax
  const generatedPrompt = useMemo(() => {
    switch (selectedEngine) {
      case "RUNWAY":
        return `[Camera: ${camera} tracking at 24fps] Low-angle tracking shot of a ${vehicle} accelerating through a ${environment} at night during ${weather}, camera maintaining pace beside the vehicle, dynamic reflections across the bodywork, controlled ${lighting}, ${lens} cinematic rendering, premium automotive commercial cinematography, 2.39:1, 24fps.`;
      case "KLING":
        return `Low-angle tracking shot of a ${vehicle} accelerating through a ${environment} at night during ${weather}, ${camera} dynamic motion, realistic tire spray and wet road physics, dynamic reflections across the bodywork, controlled ${lighting}, ${lens} optics, authentic automotive reflections, 10s continuous single take, 24fps.`;
      case "LUMA":
        return `Dynamic 3D ${camera} shot of a ${vehicle} accelerating through a ${environment} at night during ${weather}, camera maintaining pace beside the vehicle, rapid spatial parallax, controlled ${lighting}, ${lens} cinematic blur, automotive commercial motion.`;
      case "MIDJOURNEY / IMAGE":
        return `Cinematic 35mm film still of a ${vehicle} speeding through a ${environment} at night during ${weather}, ${camera} perspective, dynamic reflections across the bodywork, controlled ${lighting}, shot on ${lens}, 24fps film stock emulation --ar 2.39:1 --style raw --v 6.1`;
      default:
        return `Low-angle tracking shot of a ${vehicle} accelerating through a ${environment} at night during ${weather}, camera maintaining pace beside the vehicle, dynamic reflections across the bodywork, controlled ${lighting}, ${lens} cinematic rendering, premium automotive commercial cinematography, 24fps.`;
    }
  }, [vehicle, camera, lens, lighting, weather, environment, selectedEngine]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section id="directors-studio" className="shell py-16 sm:py-24 border-t border-border-subtle">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
        <span className="eyebrow block mb-3 text-accent font-mono tracking-widest uppercase text-xs font-semibold">
          DIRECTOR&apos;S STUDIO
        </span>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-primary leading-tight">
          Stop prompting. Start directing.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-secondary leading-relaxed max-w-2xl mx-auto">
          Build cinematic AI shots by controlling the same visual decisions a director and cinematographer make on set.
        </p>
      </div>

      {/* Main Interactive Studio Card */}
      <div className="surface rounded-3xl border border-border bg-surface-elevated overflow-hidden shadow-subtle">
        {/* Sample Recipe Header Bar */}
        <div className="border-b border-border/80 bg-surface px-6 py-5 sm:px-8 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold px-2 py-0.5 rounded bg-accent/10">
                AUTOMOTIVE / COMMERCIAL
              </span>
              <span className="text-xs font-mono text-tertiary">Sample Recipe #01</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
              Rain-Soaked Mountain Chase
            </h3>
          </div>

          {/* Visual Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-mono text-secondary">
              {lens}
            </span>
            <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-mono text-secondary">
              {camera}
            </span>
            <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-mono text-secondary">
              Night / {weather}
            </span>
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-mono text-accent">
              2.39:1
            </span>
            <span className="rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-mono text-secondary">
              24fps
            </span>
          </div>
        </div>

        {/* Studio Grid: Left Controls + Right Live Output */}
        <div className="grid lg:grid-cols-12 gap-0">
          {/* Left Column: Directorial Control Panel (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 border-b lg:border-b-0 lg:border-r border-border/70">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="text-xs font-mono uppercase tracking-wider text-tertiary">
                Director Controls &amp; Optics
              </span>
              <span className="text-[11px] font-mono text-secondary">
                6 Parameters Active
              </span>
            </div>

            {/* VEHICLE CONTROL */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                <span className="text-accent">01.</span> Vehicle
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {VEHICLE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setVehicle(opt)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border text-left transition-all ${
                      vehicle === opt
                        ? "border-accent bg-accent/15 text-primary font-semibold shadow-sm"
                        : "border-border bg-surface text-secondary hover:text-primary hover:border-border-hover"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* CAMERA CONTROL */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                <span className="text-accent">02.</span> Camera Rig
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CAMERA_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCamera(opt)}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border text-center transition-all ${
                      camera === opt
                        ? "border-accent bg-accent/15 text-primary font-semibold shadow-sm"
                        : "border-border bg-surface text-secondary hover:text-primary hover:border-border-hover"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* LENS & LIGHTING DUAL ROW */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* LENS */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                  <span className="text-accent">03.</span> Focal Length / Optics
                </label>
                <div className="flex flex-col gap-1.5">
                  {LENS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLens(opt)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border text-left transition-all ${
                        lens === opt
                          ? "border-accent bg-accent/15 text-primary font-semibold"
                          : "border-border bg-surface text-secondary hover:text-primary"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* LIGHTING */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                  <span className="text-accent">04.</span> Lighting Design
                </label>
                <div className="flex flex-col gap-1.5">
                  {LIGHTING_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLighting(opt)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border text-left transition-all ${
                        lighting === opt
                          ? "border-accent bg-accent/15 text-primary font-semibold"
                          : "border-border bg-surface text-secondary hover:text-primary"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* WEATHER & ENVIRONMENT DUAL ROW */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* WEATHER */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                  <span className="text-accent">05.</span> Atmosphere / Weather
                </label>
                <div className="flex flex-col gap-1.5">
                  {WEATHER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWeather(opt)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border text-left transition-all ${
                        weather === opt
                          ? "border-accent bg-accent/15 text-primary font-semibold"
                          : "border-border bg-surface text-secondary hover:text-primary"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* ENVIRONMENT */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-secondary flex items-center gap-2">
                  <span className="text-accent">06.</span> Location / Terrain
                </label>
                <div className="flex flex-col gap-1.5">
                  {ENVIRONMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setEnvironment(opt)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border text-left transition-all ${
                        environment === opt
                          ? "border-accent bg-accent/15 text-primary font-semibold"
                          : "border-border bg-surface text-secondary hover:text-primary"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Model Translator & Output (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-surface/50 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Model Target Tabs */}
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-tertiary block mb-2">
                  Target AI Model Architecture
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5">
                  {ENGINE_TABS.map((engine) => (
                    <button
                      key={engine}
                      type="button"
                      onClick={() => setSelectedEngine(engine)}
                      className={`px-2.5 py-1.5 text-[11px] font-mono font-medium rounded-lg border transition-all ${
                        selectedEngine === engine
                          ? "border-accent bg-foreground text-background font-semibold shadow-sm"
                          : "border-border bg-surface text-secondary hover:text-primary"
                      }`}
                    >
                      {engine}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Output Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-tertiary">
                    Generated Director Recipe
                  </span>
                  <span className="text-[10px] font-mono text-accent font-medium">
                    {selectedEngine} SYNTAX
                  </span>
                </div>

                <div className="relative rounded-2xl border border-border bg-background p-4 sm:p-5 text-xs sm:text-sm font-mono leading-relaxed text-primary select-all shadow-inner">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={`${selectedEngine}-${vehicle}-${camera}-${lens}-${lighting}-${weather}-${environment}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="break-words"
                    >
                      {generatedPrompt}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* Action Buttons: Copy Recipe */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex-1 rounded-full px-5 py-3 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
                    copied
                      ? "bg-emerald-600 text-white"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>RECIPE COPIED</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                      <span>COPY RECIPE</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom CTA to Full Studio */}
            <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
              <span className="text-xs text-tertiary font-mono">
                50+ verified cinematic formulas in catalog
              </span>
              <Link
                href="/prompts/factory"
                className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                <span>Explore Director&apos;s Studio</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
