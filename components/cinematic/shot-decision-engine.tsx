"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

type IntentType = "Isolation" | "Suspense" | "Romance";
type ShotType = "Wide" | "Medium" | "Close" | "POV";
type CameraType = "Static" | "Dolly" | "Handheld" | "Crane";
type LensType = "24mm" | "35mm" | "50mm" | "85mm";
type LightType = "Natural" | "Practical" | "Stylized";
type EngineType = "RUNWAY" | "KLING" | "VEO";

export function ShotDecisionEngine() {
  const [intent, setIntent] = useState<IntentType>("Isolation");
  const [shotType, setShotType] = useState<ShotType>("Wide");
  const [camera, setCamera] = useState<CameraType>("Dolly");
  const [lens, setLens] = useState<LensType>("50mm");
  const [light, setLight] = useState<LightType>("Practical");
  const [selectedEngine, setSelectedEngine] = useState<EngineType>("RUNWAY");

  const recommendation = useMemo(() => {
    let shotTitle = "SHOT 04 • WIDE ESTABLISHING → SLOW PUSH-IN";
    if (shotType === "Close") shotTitle = "SHOT 08 • TIGHT INTIMATE CLOSE-UP";
    else if (shotType === "Medium") shotTitle = "SHOT 06 • MEDIUM WAIST PROFILE";
    else if (shotType === "POV") shotTitle = "SHOT 12 • FIRST-PERSON OBJECTIVE POV";

    let movementDesc = "Slow 2.5m push inward";
    if (camera === "Static") movementDesc = "Locked frame, zero mechanical drift";
    else if (camera === "Handheld") movementDesc = "Subtle organic human breathing sway";
    else if (camera === "Crane") movementDesc = "Slow descending vertical pedestal";

    let lightDesc = "Cold ambient + warm practical";
    if (light === "Natural") lightDesc = "Available moonlight & sodium platform spill";
    else if (light === "Stylized") lightDesc = "Chiaroscuro high-contrast neon edge kicker";

    let whyExplanation = "The compressed perspective and slow inward movement reinforce isolation without making the scene visually static.";
    if (intent === "Suspense") {
      whyExplanation = "Tight lens compression with creeping camera momentum builds anticipation of an off-screen arrival.";
    } else if (intent === "Romance") {
      whyExplanation = "Warm practical illumination balanced with soft anamorphic falloff creates an intimate cinematic mood.";
    }

    return {
      shotTitle,
      lensOptics: `${lens} Anamorphic T1.8`,
      cameraRig: `Controlled ${camera}`,
      movement: movementDesc,
      lighting: lightDesc,
      depth: "Subject isolated against compressed background",
      why: whyExplanation,
    };
  }, [intent, shotType, camera, lens, light]);

  return (
    <section className="shell py-20 sm:py-28 border-t border-white/[0.06]">
      <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-400 font-semibold block">
          SHOT DECISION ENGINE
        </span>
        <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
          Turn a creative idea into a production-ready shot.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto font-sans">
          Define what the scene needs. Creator Intel translates creative intent into camera, lens, movement, lighting and model decisions before you generate.
        </p>
      </div>

      {/* Interactive Workbench Container */}
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-stretch">
        {/* Left Side: What are you shooting? */}
        <div className="rounded-3xl border border-white/[0.08] bg-neutral-900/80 p-6 sm:p-8 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                01 • WHAT ARE YOU SHOOTING?
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                SCENE INTAKE
              </span>
            </div>

            {/* Scene Description Box */}
            <div className="rounded-2xl border border-white/[0.08] bg-black/50 p-4 sm:p-5">
              <span className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">
                Scene Description:
              </span>
              <p className="text-sm sm:text-base font-serif italic text-neutral-200 leading-relaxed">
                &ldquo;A woman waits alone at an empty railway station at night.&rdquo;
              </p>
            </div>

            {/* Selector 1: Intent */}
            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-2 font-medium">
                Creative Intent:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Isolation", "Suspense", "Romance"] as IntentType[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setIntent(val)}
                    className={`rounded-xl px-3 py-2.5 text-xs font-semibold transition text-center ${
                      intent === val
                        ? "bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20"
                        : "border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-amber-400/40 hover:text-white"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector 2: Shot Type */}
            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-2 font-medium">
                Framing / Shot Type:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["Wide", "Medium", "Close", "POV"] as ShotType[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setShotType(val)}
                    className={`rounded-xl px-2.5 py-2 text-xs font-semibold transition text-center ${
                      shotType === val
                        ? "bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20"
                        : "border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-amber-400/40 hover:text-white"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector 3: Camera Movement */}
            <div>
              <label className="text-xs font-mono uppercase text-neutral-400 block mb-2 font-medium">
                Camera Rig &amp; Movement:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["Static", "Dolly", "Handheld", "Crane"] as CameraType[]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCamera(val)}
                    className={`rounded-xl px-2.5 py-2 text-xs font-semibold transition text-center ${
                      camera === val
                        ? "bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20"
                        : "border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-amber-400/40 hover:text-white"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector 4: Lens & Light (Side by Side) */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 block mb-2 font-medium">
                  Lens Focal Length:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["24mm", "35mm", "50mm", "85mm"] as LensType[]).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLens(val)}
                      className={`rounded-xl px-2.5 py-2 text-xs font-semibold transition text-center ${
                        lens === val
                          ? "bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20"
                          : "border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-amber-400/40 hover:text-white"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-neutral-400 block mb-2 font-medium">
                  Lighting Style:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Natural", "Practical", "Stylized"] as LightType[]).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setLight(val)}
                      className={`rounded-xl px-2 py-2 text-[11px] font-semibold transition text-center ${
                        light === val
                          ? "bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/20"
                          : "border border-white/10 bg-white/[0.03] text-neutral-300 hover:border-amber-400/40 hover:text-white"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Creator Intel Recommends */}
        <div className="rounded-3xl border border-amber-400/30 bg-gradient-to-br from-neutral-900 via-neutral-900 to-black p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/[0.05] rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-5 relative z-10">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                02 • CREATOR INTEL RECOMMENDS
              </span>
              <span className="text-[10px] font-mono text-emerald-400">CALIBRATED</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${intent}-${shotType}-${camera}-${lens}-${light}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <span className="text-xs font-mono text-amber-400/90 font-bold tracking-wider block">
                    {recommendation.shotTitle}
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">LENS</span>
                    <span className="text-neutral-200 font-semibold">{recommendation.lensOptics}</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">CAMERA</span>
                    <span className="text-neutral-200 font-semibold">{recommendation.cameraRig}</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">MOVEMENT</span>
                    <span className="text-neutral-200 font-semibold">{recommendation.movement}</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">LIGHTING</span>
                    <span className="text-neutral-200 font-semibold">{recommendation.lighting}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5 text-xs">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">
                    DEPTH &amp; COMPOSITION
                  </span>
                  <span className="text-neutral-300 font-sans">{recommendation.depth}</span>
                </div>

                <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-4 text-xs">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">
                    WHY THIS SHOT WORKS:
                  </span>
                  <p className="text-neutral-300 font-sans leading-relaxed">
                    &ldquo;{recommendation.why}&rdquo;
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Execute With Engines */}
            <div className="pt-2 border-t border-white/[0.08]">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-2 font-medium">
                EXECUTE WITH:
              </span>
              <div className="flex flex-wrap gap-2">
                {(["RUNWAY", "KLING", "VEO"] as EngineType[]).map((eng) => (
                  <button
                    key={eng}
                    type="button"
                    onClick={() => setSelectedEngine(eng)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold transition ${
                      selectedEngine === eng
                        ? "bg-amber-400 text-neutral-950 shadow-sm"
                        : "border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {eng}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08]">
            <Link
              href="/prompts/factory"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 py-3.5 px-6 text-xs sm:text-sm font-bold text-neutral-950 transition shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
            >
              <span>GENERATE SHOT RECIPE</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
