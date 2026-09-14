"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

interface CameraSetup {
  id: string;
  name: string;
  category: string;
  timecode: string;
  fps: string;
  aspectRatio: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
  rig: string;
  wb: string;
  focusDist: string;
  shotIntent: string;
  lightingSpec: string;
  promptSyntax: string;
}

const CAMERA_SETUPS: CameraSetup[] = [
  {
    id: "setup-01",
    name: "01. Night Pursuit",
    category: "AUTOMOTIVE / CHASE",
    timecode: "01:14:28:18",
    fps: "24.000 FPS",
    aspectRatio: "2.39:1",
    lens: "35mm Cooke Anamorphic",
    aperture: "T2.8",
    shutter: "1/48",
    iso: "800",
    rig: "Russian Arm Pursuit Crane",
    wb: "5600K Daylight",
    focusDist: "12.4 FT",
    shotIntent: "Low-angle dynamic tracking shot skimming 1 foot off wet asphalt, horizontal cyan streak flares.",
    lightingSpec: "Cold blue ambient skylight with high-intensity vehicle headlight backlight.",
    promptSyntax: "[Camera: Russian Arm low tracking at 24fps] Matte black sports car accelerating through mountain pass at night during heavy rain, 35mm anamorphic prime lens, 2.39:1.",
  },
  {
    id: "setup-02",
    name: "02. Steadicam Corridor",
    category: "NARRATIVE / NEO-NOIR",
    timecode: "00:42:09:04",
    fps: "24.000 FPS",
    aspectRatio: "2.39:1",
    lens: "50mm Prime",
    aperture: "f/1.8",
    shutter: "1/48",
    iso: "1250",
    rig: "3-Axis Steadicam Gimbal",
    wb: "3200K Tungsten",
    focusDist: "6.2 FT",
    shotIntent: "Fluid floating human-eye camera following protagonist through rain-slicked hallway reflections.",
    lightingSpec: "High-contrast motivated sodium vapor streetlights with chiaroscuro rim separation.",
    promptSyntax: "Smooth Steadicam single-take tracking shot following detective from behind through dimly lit urban corridor, volumetric atmosphere, 24fps.",
  },
  {
    id: "setup-03",
    name: "03. Aerial Canyon Dive",
    category: "ACTION / VISTA",
    timecode: "02:08:55:12",
    fps: "60.000 FPS",
    aspectRatio: "2.39:1",
    lens: "24mm Ultra-Wide",
    aperture: "f/4.0",
    shutter: "1/120",
    iso: "400",
    rig: "Acrobatic FPV Drone",
    wb: "4800K Golden Dusk",
    focusDist: "INF",
    shotIntent: "High-velocity vertical descent down granite canyon face, pulling up sharply over river rapids.",
    lightingSpec: "Direct low-angle golden hour sunlight casting dramatic elongated ridge shadows.",
    promptSyntax: "FPV acrobatic drone diving vertically down sheer granite cliff at sunset, pulling up 5 feet above river rapids, motion blur on foreground rocks, 4k 24fps.",
  },
  {
    id: "setup-04",
    name: "04. Tourbillon Macro",
    category: "COMMERCIAL / LUXURY",
    timecode: "00:18:32:20",
    fps: "24.000 FPS",
    aspectRatio: "16:9",
    lens: "100mm Macro 1:1",
    aperture: "T2.8",
    shutter: "1/48",
    iso: "200",
    rig: "Micro-Dolly Linear Slide",
    wb: "5000K Neutral",
    focusDist: "0.8 FT",
    shotIntent: "Razor-thin depth of field revealing oscillating escapement balance wheels and synthetic rubies.",
    lightingSpec: "Surgical diffused overhead softbox with dual specular fiber-optic edge kickers.",
    promptSyntax: "Extreme macro 100mm lens shot of titanium luxury watch escapement mechanism in motion, razor-thin depth of field, glistening metallic bevels.",
  },
];

export function CinematicViewfinder() {
  const [activeSetup, setActiveSetup] = useState<CameraSetup>(CAMERA_SETUPS[0]);
  const [gridVisible, setGridVisible] = useState(true);

  return (
    <section id="viewfinder" className="shell py-16 sm:py-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
              DIRECTOR&apos;S VIEWFINDER
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-primary">
            Calibrating the Shot
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-secondary max-w-xl font-normal">
            Real filmmaking starts behind the lens. Control physical camera telemetry, optical physics, and rig movement before generating a single frame.
          </p>
        </div>

        {/* Framing Grid Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono text-tertiary">Framing Grid:</span>
          <button
            type="button"
            onClick={() => setGridVisible(!gridVisible)}
            className={`px-3 py-1 text-xs font-mono rounded-full border transition ${
              gridVisible
                ? "border-accent/40 bg-accent/15 text-accent font-medium"
                : "border-border bg-surface text-secondary hover:text-primary"
            }`}
          >
            {gridVisible ? "2.39:1 ON" : "OFF"}
          </button>
        </div>
      </div>

      {/* Main Viewfinder Monitor */}
      <div className="relative rounded-3xl border border-border bg-black text-white overflow-hidden shadow-2xl">
        {/* Top Camera Status Bar */}
        <div className="border-b border-white/10 bg-black/80 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between text-[11px] font-mono gap-2 z-20 relative">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              REC
            </span>
            <span className="text-white/60">TC: {activeSetup.timecode}</span>
            <span className="text-amber-400 font-medium">{activeSetup.fps}</span>
          </div>

          <div className="flex items-center gap-3 text-white/70">
            <span className="hidden sm:inline">BAT: 94%</span>
            <span className="hidden sm:inline">MEDIA: 1.4 TB (ProRes 4444 XQ)</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-accent font-semibold">
              {activeSetup.aspectRatio}
            </span>
          </div>
        </div>

        {/* Viewfinder Optical Stage (Widescreen 2.39:1 Canvas) */}
        <div className="relative aspect-[21/9] sm:aspect-[2.39/1] min-h-[300px] sm:min-h-[420px] bg-gradient-to-b from-neutral-950 via-neutral-900 to-black p-6 flex flex-col justify-between overflow-hidden">
          {/* Subtle Background Cinematography Grid Overlay */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
              gridVisible ? "opacity-35" : "opacity-0"
            }`}
          >
            {/* Rule of Thirds Lines */}
            <div className="absolute inset-x-0 top-1/3 border-b border-white/15" />
            <div className="absolute inset-x-0 top-2/3 border-b border-white/15" />
            <div className="absolute inset-y-0 left-1/3 border-r border-white/15" />
            <div className="absolute inset-y-0 left-2/3 border-r border-white/15" />

            {/* Corner Reticles */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-accent" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-accent" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-accent" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-accent" />

            {/* Center Focus Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center pointer-events-none">
              <div className="w-8 border-t border-white/40" />
              <div className="absolute h-8 border-l border-white/40" />
              <div className="absolute w-2 h-2 rounded-full border border-accent" />
            </div>
          </div>

          {/* Active Shot Telemetry Overlay (Top Left & Top Right) */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-400/20">
                {activeSetup.category}
              </span>
              <h3 className="text-base sm:text-2xl font-semibold tracking-tight text-white mt-1">
                {activeSetup.name.split(". ")[1]}
              </h3>
            </div>

            <div className="text-left sm:text-right space-y-0.5 text-[10px] sm:text-[11px] font-mono text-white/70">
              <p>RIG: <span className="text-white font-medium">{activeSetup.rig}</span></p>
              <p>LENS: <span className="text-amber-400 font-medium">{activeSetup.lens}</span></p>
              <p className="hidden xs:block sm:block">EXP: <span className="text-white font-medium">{activeSetup.shutter} • {activeSetup.aperture} • ISO {activeSetup.iso}</span></p>
            </div>
          </div>

          {/* Center Cinematic Narrative Intent */}
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-2 py-3 sm:py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSetup.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-2"
              >
                <p className="text-xs sm:text-base text-white/90 font-mono leading-relaxed bg-black/60 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl border border-white/10 shadow-lg">
                  &ldquo;{activeSetup.shotIntent}&rdquo;
                </p>
                <p className="text-[10px] sm:text-xs text-amber-300/80 font-mono">
                  LIGHTING: {activeSetup.lightingSpec}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="relative z-10 flex flex-wrap items-end justify-between text-[10px] sm:text-[11px] font-mono text-white/60 gap-2">
            <div>
              <span>DIST: {activeSetup.focusDist}</span> • <span>WB: {activeSetup.wb}</span>
            </div>
            <Link
              href="/prompts/factory"
              className="text-amber-400 hover:underline font-semibold flex items-center gap-1 text-xs"
            >
              <span>Build this setup in Studio</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Setup Selector Deck Bar */}
        <div className="border-t border-white/10 bg-neutral-950 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/50">
              Switch Camera Rig &amp; Optics Setup:
            </span>
            <span className="text-[11px] font-mono text-accent">
              4 Production Setups Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CAMERA_SETUPS.map((setup) => {
              const isSelected = activeSetup.id === setup.id;
              return (
                <button
                  key={setup.id}
                  type="button"
                  onClick={() => setActiveSetup(setup)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-accent bg-accent/15 text-white font-medium shadow-md ring-1 ring-accent/30"
                      : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20"
                  }`}
                >
                  <p className="text-xs font-semibold text-white tracking-tight">
                    {setup.name}
                  </p>
                  <p className="text-[10px] font-mono text-white/50 mt-1 truncate">
                    {setup.lens} • {setup.rig.split(" ")[0]}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
