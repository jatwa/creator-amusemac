'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { FileText, Camera, Sliders, Sun, ListOrdered, BookOpen, Award, Terminal, ArrowUpRight, Check, Sparkles, Film } from '@/components/cinematic/icons'

interface DeskPanel {
  id: string
  title: string
  label: string
  icon: React.ElementType
  badge: string
  summary: string
  dossierFields: { name: string; value: string; note?: string }[]
  directorialRationale: string
  studioAction: { label: string; href: string }
}

const DESK_PANELS: DeskPanel[] = [
  {
    id: 'script-breakdown',
    title: 'Script Breakdown & Narrative Intention',
    label: 'Script & Scene',
    icon: FileText,
    badge: 'SCENE 42 EXT. / NIGHT',
    summary: 'Deconstruct script text into psychological beats, character motivation, subtext, and pacing requirements before calling a single prompt.',
    dossierFields: [
      { name: 'Dramatic Objective', value: 'Investigator discovers evidence of a vanished syndicate' },
      { name: 'Emotional Cadence', value: 'Mounting dread transitioning into quiet realization' },
      { name: 'Environmental Tension', value: 'Relentless acid rain breaching architectural sanctuary' },
      { name: 'Pacing Metric', value: '24.000 FPS • Deliberate 8-second unbroken shot hold' },
    ],
    directorialRationale: 'The camera must maintain psychological restraint. Do not cut early. Allow the character’s internal realization to command the spatial frame.',
    studioAction: { label: 'Deconstruct Scene in Studio', href: '/prompts/factory' },
  },
  {
    id: 'optics-package',
    title: 'Optics & Glass Package Selection',
    label: 'Lens & Glass',
    icon: Camera,
    badge: 'ANAMORPHIC PRIME 45MM',
    summary: 'Choose glass for emotional geometry, oval bokeh characteristics, horizontal flare distortion, and falloff fallibility.',
    dossierFields: [
      { name: 'Glass Lineage', value: 'Hawk V-Lite 45mm Anamorphic T2.2 (2x Squeeze)' },
      { name: 'Aperture Setting', value: 'T2.8 (Deep character focus with creamy anamorphic background)' },
      { name: 'Distortion Profile', value: 'Gentle barrel distortion at frame periphery, organic oval bokeh' },
      { name: 'Flare Signature', value: 'Subtle cobalt-blue horizontal streaks from motivated headlights' },
    ],
    directorialRationale: 'Spherical primes are too clean for this noir atmosphere. Hawk V-Lite anamorphics provide the necessary optical friction and emotional weight.',
    studioAction: { label: 'Configure Glass in Studio', href: '/prompts/factory' },
  },
  {
    id: 'camera-rig',
    title: 'Camera Rig & Kinematics Engineering',
    label: 'Rig & Kinematics',
    icon: Sliders,
    badge: 'TECHNOCRANE 30 + FLUID TRACK',
    summary: 'Define physical camera trajectories, stabilization modes, inertia damping, and three-dimensional coordinate movements.',
    dossierFields: [
      { name: 'Support System', value: 'Technocrane 30 Telescopic Arm on heavy-duty Mitchell base' },
      { name: 'Trajectory Arc', value: 'Forward push-in descending from +2.4m to eye-level (+1.6m)' },
      { name: 'Movement Velocity', value: '0.4 m/s steady linear deceleration into a dead stop' },
      { name: 'Shutter Angle', value: '180.0° (Authentic 1/48s cinematic motion blur cadence)' },
    ],
    directorialRationale: 'A floating descent creates an omniscient, inescapable feeling of surveillance before locking into intimate character alignment.',
    studioAction: { label: 'Set Rig Kinematics in Studio', href: '/prompts/factory' },
  },
  {
    id: 'lighting-ratio',
    title: 'Lighting Architecture & Contrast Geometry',
    label: 'Lighting & Ratios',
    icon: Sun,
    badge: '8:1 KEY-TO-FILL (CHIAROSCURO)',
    summary: 'Engineer lighting keys, fills, kicks, Kelvin temperatures, and diffusion materials for filmic depth separation.',
    dossierFields: [
      { name: 'Key Light Source', value: '20K Tungsten Fresnel bounced into 12x12 unbleached muslin (3200K)' },
      { name: 'Edge / Rim Light', value: 'Arri SkyPanel S60-C cyan wash (6500K + Cyan gel) backlighting rain' },
      { name: 'Key-to-Fill Ratio', value: '8:1 Contrast Ratio (Ink-black negative fill on camera side)' },
      { name: 'Volumetric Medium', value: 'Reel EFX DF-50 Diffusion Hazer (Subtle atmospheric suspension)' },
    ],
    directorialRationale: 'High contrast ratio carves the actor’s silhouette while edge cyan backlighting separates water droplets from the deep background.',
    studioAction: { label: 'Balance Ratios in Studio', href: '/prompts/factory' },
  },
  {
    id: 'shot-list',
    title: 'Shot List & Spatial Blocking Matrix',
    label: 'Shot List & Block',
    icon: ListOrdered,
    badge: 'SHOT 42A • MASTER ESTABLISHING',
    summary: 'Coordinate subject staging, eyelines, coverage requirements, and frame quadrant rules for continuity.',
    dossierFields: [
      { name: 'Shot Classification', value: 'Wide Establishing Master → Medium Tracking Transition' },
      { name: 'Framing Rule', value: '2.39:1 Wide Aspect, subject anchored in lower-right third quadrant' },
      { name: 'Eyeline Vector', value: 'Left-to-Right 15° off-axis toward hidden architectural archway' },
      { name: 'Coverage Strategy', value: 'Single continuous master one-er, zero editorial cuts required' },
    ],
    directorialRationale: 'By keeping the subject in the lower-right third, the vast derelict architecture in the upper left looms over the character.',
    studioAction: { label: 'Save to Toolkit Project', href: '/toolkit' },
  },
  {
    id: 'research-dossier',
    title: 'Film Reference & Historical R&D Dossier',
    label: 'Film Research',
    icon: BookOpen,
    badge: 'CINEMATOGRAPHIC LINEAGE',
    summary: 'Ground prompt generation in master cinematography references, auteur techniques, and art historical lineage.',
    dossierFields: [
      { name: 'Primary Lineage', value: 'Blade Runner (1982, Jordan Cronenweth) + The Batman (2022, Greig Fraser)' },
      { name: 'Color Palette Emulsion', value: 'Kodak Vision3 500T 5219 photochemical color curve' },
      { name: 'Architectural Style', value: '1930s Monumental Art Deco with distressed water damage' },
      { name: 'Textural Quality', value: 'Micro-scratched lacquer, wet velvet, and heavy rain misting' },
    ],
    directorialRationale: 'Combining Fraser’s high-contrast LED volume techniques with Cronenweth’s atmospheric smoke creates timeless visual depth.',
    studioAction: { label: 'Explore Film Research Database', href: '/prompts' },
  },
  {
    id: 'festival-standards',
    title: 'Festival Delivery & D-Cinema Standards',
    label: 'Festival Delivery',
    icon: Award,
    badge: 'DCI-P3 4K THEATRICAL',
    summary: 'Ensure final AI generative assets meet strict international festival projection criteria and mastering guidelines.',
    dossierFields: [
      { name: 'Color Space Target', value: 'DCI-P3 / ACEScc Academy Color Encoding System' },
      { name: 'Container Resolution', value: '4096 x 1716 DCI 4K Scope Container (2.3869:1 Exact)' },
      { name: 'Master Frame Rate', value: '24.000 FPS True Cinema Native Cadence' },
      { name: 'Dynamic Range Range', value: '16+ Stops Uncompressed Rec.2020 / HDR10 Mastering' },
    ],
    directorialRationale: 'Professional film festival juries immediately reject synthetic AI artifacts, frame rate pulldowns, or blown-out 8-bit clipping.',
    studioAction: { label: 'Check Festival Specs in Studio', href: '/prompts/factory' },
  },
  {
    id: 'engine-compiler',
    title: 'AI Engine Compiler & Recipe Slip Execution',
    label: 'Compiler Slip',
    icon: Terminal,
    badge: 'DIRECTOR RECIPE SLIP #42',
    summary: 'Synthesize all 7 directorial layers into an executable, model-specific prompt recipe slip with negative suppressions.',
    dossierFields: [
      { name: 'Primary Engine Target', value: 'Kling 2.0 Master / Runway Gen-3 Alpha / Veo 2' },
      { name: 'Aspect Lock Token', value: '--ar 239:100 (2.39:1 Anamorphic Scope)' },
      { name: 'Suppression Rules', value: 'No digital sheen, no artificial plastic skin, no video noise' },
      { name: 'Confidence Score', value: '99.4% Cinematographic Coherence Rating' },
    ],
    directorialRationale: 'Direct translation eliminates AI hallucination by anchoring every token to real-world optical and lighting physics.',
    studioAction: { label: 'Open Studio Compiler Now', href: '/prompts/factory' },
  },
]

export function DirectorsDesk() {
  const [activePanelId, setActivePanelId] = useState<string>('script-breakdown')
  const activePanel = DESK_PANELS.find((p) => p.id === activePanelId) || DESK_PANELS[0]

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Operating System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans">
            THE DIRECTOR&apos;S <span className="font-serif italic font-normal text-amber-200">DESK.</span>
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-2xl">
            A comprehensive film production workstation. Move between script breakdown, lens package, lighting architecture, camera kinematics, and AI prompt synthesis seamlessly.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/toolkit"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 hover:border-amber-400/40 bg-white/[0.03] text-xs font-mono text-neutral-300 hover:text-white transition-all group"
          >
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Director&apos;s Toolkit</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400" />
          </Link>
        </div>
      </div>

      {/* Layered Dossier Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
        {DESK_PANELS.map((panel) => {
          const Icon = panel.icon
          const isActive = panel.id === activePanelId
          return (
            <button
              key={panel.id}
              onClick={() => setActivePanelId(panel.id)}
              className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all duration-200 border ${
                isActive
                  ? 'bg-amber-400/10 border-amber-400/70 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30'
                  : 'bg-neutral-950/60 border-white/[0.06] text-neutral-400 hover:text-neutral-200 hover:border-white/20'
              }`}
            >
              <Icon className={`w-4 h-4 mb-2 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
              <span className="text-[11px] font-semibold tracking-tight font-sans line-clamp-1">{panel.label}</span>
            </button>
          )
        })}
      </div>

      {/* Main Dossier Workstation Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePanel.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-neutral-950/90 border border-white/[0.09] rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/[0.08] gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <activePanel.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-neutral-400 border border-white/[0.08]">
                  {activePanel.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mt-1">
                  {activePanel.title}
                </h3>
              </div>
            </div>

            <Link
              href={activePanel.studioAction.href}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <span>{activePanel.studioAction.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-sm text-neutral-300 max-w-3xl mb-8 leading-relaxed font-sans">
            {activePanel.summary}
          </p>

          {/* Dossier Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {activePanel.dossierFields.map((field, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-neutral-900/60 border border-white/[0.05] space-y-2 flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90">
                  {field.name}
                </span>
                <p className="text-xs sm:text-sm font-medium text-neutral-100 leading-snug">
                  {field.value}
                </p>
                {field.note && (
                  <span className="text-[10px] font-mono text-neutral-500">{field.note}</span>
                )}
              </div>
            ))}
          </div>

          {/* Directorial Rationale Quote Bar */}
          <div className="p-4 sm:p-5 rounded-xl bg-black/60 border border-white/[0.08] flex items-start gap-3">
            <div className="p-1.5 rounded bg-amber-400/10 text-amber-400 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Directorial Execution Rationale
              </div>
              <p className="text-xs sm:text-sm text-amber-200/90 font-serif italic leading-relaxed">
                &ldquo;{activePanel.directorialRationale}&rdquo;
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
