'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Film, Tv, Sparkles, Music, Video, Clapperboard, ArrowUpRight, Check, SlidersHorizontal, Camera, Disc } from '@/components/cinematic/icons'

interface FormatArchetype {
  id: string
  title: string
  tagline: string
  icon: React.ElementType
  aspectRatio: string
  sensor: string
  optics: string
  rig: string
  lighting: string
  pacing: string
  palette: string
  recommendedEngine: string
  samplePromptSnippet: string
  presetParam: string
}

const FORMATS: FormatArchetype[] = [
  {
    id: 'feature-film',
    title: 'Feature Film',
    tagline: 'Expansive narrative scale, deliberate pacing, and optical gravity.',
    icon: Film,
    aspectRatio: '2.39:1 Anamorphic',
    sensor: 'Large Format (Arri Alexa 65 / Venice 2)',
    optics: 'Hawk V-Lite 45mm Anamorphic T2.2',
    rig: 'Chapman Peewee Dolly with 50ft fluid track',
    lighting: 'Single-source tungsten push through 12x12 unbleached muslin, 4:1 key-to-fill ratio',
    pacing: '24.000 FPS • Deliberate Push-in • Unhurried cuts',
    palette: 'Kodak Vision3 5219 500T tone curve, deep shadow retention, subtle amber roll-off',
    recommendedEngine: 'Kling 2.0 / Midjourney v6.1',
    samplePromptSnippet: 'Cinematic wide narrative master shot, Arri Alexa 65, Hawk V-Lite 45mm Anamorphic, 2.39:1 ratio, 24fps film cadence, volumetric tungsten lighting, atmospheric haze, photo-chemically authentic 35mm grain --ar 239:100 --v 6.1 --style raw',
    presetParam: 'feature_film',
  },
  {
    id: 'premium-series',
    title: 'Prestige Series',
    tagline: 'Episodic character intimacy with multi-layered textural continuity.',
    icon: Tv,
    aspectRatio: '2.00:1 Univisium',
    sensor: 'Full Frame (Sony Venice 2 8K)',
    optics: 'Cooke S7/i Full Frame Plus 32mm Prime',
    rig: 'Technocrane 30 Telescopic Arm with Remote Head',
    lighting: 'Practical motivated fluorescents balanced with diffused LED softbox overhead grids',
    pacing: '23.976 FPS • Dynamic Continuous Tracking',
    palette: 'Cool slate-blue undertones, muted emerald interior accents, crisp highlight rolloff',
    recommendedEngine: 'Runway Gen-3 Alpha / Wan 2.1',
    samplePromptSnippet: 'Univisium 2.00:1 cinematic sequence shot on Sony Venice 2, Cooke S7/i 32mm, smooth Technocrane floating tracking shot through corridors, prestige television aesthetic, naturalistic low-key lighting --c 15',
    presetParam: 'prestige_series',
  },
  {
    id: 'commercial-spec',
    title: 'Spec Commercial',
    tagline: 'High-energy precision, kinetic product heroics, and hyper-clean optics.',
    icon: Sparkles,
    aspectRatio: '16:9 / 9:16 Social Cut',
    sensor: 'High-Speed Cine (Phantom Flex4K / Red V-Raptor)',
    optics: 'Leica Summilux-C 50mm T1.4 & 100mm Macro',
    rig: 'Bolt High-Speed Cinebot Motion Control Arm',
    lighting: 'High-key rim lighting, precision laser-cut gobos, specular chrome edge highlights',
    pacing: '60 - 120 FPS High-Speed Slomo • Precision Snaps',
    palette: 'Vibrant contrast, razor-sharp edge micro-contrast, hyper-pristine color rendering',
    recommendedEngine: 'Flux.1 Schnell / Kling 2.0',
    samplePromptSnippet: 'High-end luxury commercial hero capture, Phantom Flex4K at 120fps high-speed capture, Leica Summilux-C 100mm macro, Bolt Cinebot motion control arc, razor sharp liquid droplets, specular highlight sparkle',
    presetParam: 'commercial_spec',
  },
  {
    id: 'music-video',
    title: 'Music Video',
    tagline: 'Rhythmic defiance, expressive optical distortions, and radical color palettes.',
    icon: Music,
    aspectRatio: '4:3 Academy / 2.39:1 Split',
    sensor: 'Super 35 / Super 16mm Analog Gate',
    optics: 'Kowa Prominar Anamorphic 40mm (Vintage flares)',
    rig: 'Custom Snorricam Rig / Low-angle Handheld Gimbal',
    lighting: 'Pulsing dual-tone neon (Magenta & Cyan), strobing sodium vapour, direct lens flares',
    pacing: '24 / 48 FPS Step-Framed • Syncopated Zoom Bursts',
    palette: 'Cross-processed Ektachrome reversal look, halation fringing, electric neon saturation',
    recommendedEngine: 'Luma Dream Machine / Veo 2',
    samplePromptSnippet: 'Avant-garde music video visual, Super 16mm grain texture, Kowa Prominar 40mm vintage anamorphic horizontal streak flares, Snorricam chest-mounted POV, intense kinetic pacing, saturated magenta and cyan wash',
    presetParam: 'music_video',
  },
  {
    id: 'documentary',
    title: 'Cinematic Doc',
    tagline: 'Observational truth, available natural light, and visceral human immersion.',
    icon: Video,
    aspectRatio: '1.85:1 Flat',
    sensor: 'Super 35 / Full Frame Dual Native ISO',
    optics: 'Angénieux Optimo Ultra 24-290mm Cine Zoom',
    rig: 'Easyrig Vario 5 with Flowcine Serene Handheld',
    lighting: '100% Motivated available ambient daylight, negative fill foam core for shadow carve',
    pacing: '24.000 FPS • Organic Breathing Camera • Unrehearsed',
    palette: 'Documentary naturalism, neutral skin tones, realistic daylight balance (5600K)',
    recommendedEngine: 'MiniMax Hailuo / Midjourney v6.1',
    samplePromptSnippet: 'Observational cinema verite documentary capture, handheld Easyrig 35mm naturalistic shot, Angenieux Optimo zoom, available morning golden hour light, honest documentary texture, human emotion without artificial gloss',
    presetParam: 'cinematic_doc',
  },
  {
    id: 'short-film',
    title: 'Festival Short',
    tagline: 'Poetic economy of frame, unconventional blocking, and intimate auteur signatures.',
    icon: Clapperboard,
    aspectRatio: '1.33:1 (4:3) / 1.66:1 European Flat',
    sensor: 'Super 35 Sensor (Arri Alexa Mini LF)',
    optics: 'Zeiss Super Speed Mk III 28mm T1.3 (Vintage B-Speeds)',
    rig: 'Steadicam Archer 2 with Low-Mode Bracket',
    lighting: 'Soft overhead china ball lantern, deep silhouette contrast, subtle mist diffusion',
    pacing: '24.000 FPS • Lingering Medium Close-ups',
    palette: 'Muted earth tones, olive drab, desaturated umber, filmic organic halation',
    recommendedEngine: 'Wan 2.1 / Kling 2.0',
    samplePromptSnippet: 'Indie festival award-winning short film aesthetic, 1.33:1 aspect ratio, Arri Alexa Mini, Zeiss Super Speed 28mm T1.3 wide open, intimate medium close-up, soft china ball illumination, poetic melancholic tone, rich shadow detail',
    presetParam: 'festival_short',
  },
]

export function IntentDeck() {
  const [selectedFormat, setSelectedFormat] = useState<FormatArchetype>(FORMATS[0])
  const [copiedSnippet, setCopiedSnippet] = useState(false)

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(selectedFormat.samplePromptSnippet)
    setCopiedSnippet(true)
    setTimeout(() => setCopiedSnippet(false), 2000)
  }

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Production Archetypes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans">
            WHAT ARE YOU <span className="font-serif italic font-normal text-amber-200">MAKING?</span>
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl">
            Select your format. Creator Intel auto-calibrates sensor size, aspect ratio, glass geometry, camera rig kinematics, and engine syntax.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/prompts/factory"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 hover:border-amber-400/40 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-mono text-neutral-300 hover:text-white transition-all duration-200 group"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch All 6 Archetypes in Studio</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Format Selector Pills / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-10">
        {FORMATS.map((fmt) => {
          const Icon = fmt.icon
          const isActive = selectedFormat.id === fmt.id
          return (
            <button
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt)}
              className={`relative flex flex-col items-start p-4 rounded-xl text-left transition-all duration-200 border ${
                isActive
                  ? 'bg-neutral-900/90 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.12)]'
                  : 'bg-neutral-950/60 border-white/[0.07] hover:border-white/20 hover:bg-neutral-900/40'
              }`}
            >
              {isActive && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
              )}
              <div className={`p-2 rounded-lg mb-3 ${isActive ? 'bg-amber-400/10 text-amber-300' : 'bg-white/[0.04] text-neutral-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-sm font-semibold tracking-tight ${isActive ? 'text-white' : 'text-neutral-300'}`}>
                {fmt.title}
              </span>
              <span className="font-mono text-[10px] text-neutral-500 mt-1">
                {fmt.aspectRatio.split(' ')[0]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Detail Showcase Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedFormat.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="relative bg-neutral-950/80 border border-white/[0.09] rounded-2xl p-6 sm:p-8 overflow-hidden backdrop-blur-md"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            {/* Left: Directorial Specification Sheet (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-[11px] uppercase tracking-wider font-semibold">
                  {selectedFormat.title} Specification
                </span>
                <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-400 font-mono text-[11px]">
                  RATIO: {selectedFormat.aspectRatio}
                </span>
                <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-400 font-mono text-[11px]">
                  ENGINE: {selectedFormat.recommendedEngine}
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-sans tracking-tight">
                  {selectedFormat.tagline}
                </h3>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/[0.05] space-y-1">
                  <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                    <Camera className="w-3 h-3 text-amber-400/80" />
                    <span>Optics & Glass</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 font-medium">{selectedFormat.optics}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/[0.05] space-y-1">
                  <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                    <Disc className="w-3 h-3 text-amber-400/80" />
                    <span>Sensor & Gate</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 font-medium">{selectedFormat.sensor}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/[0.05] space-y-1">
                  <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                    <SlidersHorizontal className="w-3 h-3 text-amber-400/80" />
                    <span>Camera Rig & Kinematics</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 font-medium">{selectedFormat.rig}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-white/[0.05] space-y-1">
                  <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-400/80" />
                    <span>Cadence & Pacing</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-200 font-medium">{selectedFormat.pacing}</p>
                </div>
              </div>

              {/* Lighting & Emulsion Notes */}
              <div className="p-4 rounded-xl bg-neutral-900/40 border border-white/[0.05] space-y-2">
                <div className="text-neutral-500 font-mono text-[10px] uppercase tracking-wider">Lighting Architecture & Color Science</div>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedFormat.lighting}</p>
                <p className="text-xs text-amber-300/80 font-mono text-[11px] pt-1 border-t border-white/[0.04]">{selectedFormat.palette}</p>
              </div>
            </div>

            {/* Right: Real-time Compiled Prompt Recipe (5 cols) */}
            <div className="lg:col-span-5 flex flex-col h-full justify-between space-y-4 bg-black/60 rounded-xl p-5 border border-white/[0.08]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-400">Model-Specific Recipe</span>
                  </div>
                  <span className="font-mono text-[10px] text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded">
                    {selectedFormat.recommendedEngine}
                  </span>
                </div>

                <div className="mt-4 p-3.5 bg-neutral-950 rounded-lg border border-white/[0.05] font-mono text-xs text-neutral-300 leading-relaxed select-all">
                  {selectedFormat.samplePromptSnippet}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopySnippet}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition-all"
                  >
                    {copiedSnippet ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied Recipe Slip</span>
                      </>
                    ) : (
                      <>
                        <span>Copy Recipe Prompt</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/prompts/factory?preset=${selectedFormat.presetParam}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  >
                    <span>Direct In Studio</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <p className="text-[11px] text-neutral-500 font-mono text-center">
                  Includes calibrated negative prompt, aspect lock & camera rig token
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
