'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Cpu, Check, Copy, ArrowUpRight, Zap, Play, Layers, Sparkles } from '@/components/cinematic/icons'

interface EngineProfile {
  id: string
  name: string
  version: string
  category: 'Video Engine' | 'Image Engine'
  specialty: string
  motionCharacteristics: string
  strengths: string[]
  syntaxPattern: string
  compiledPrompt: string
  negativePrompt: string
  cameraDirective: string
}

const ENGINES: EngineProfile[] = [
  {
    id: 'kling',
    name: 'Kling AI',
    version: '2.0 Master',
    category: 'Video Engine',
    specialty: 'Physical inertia, fluid dynamics, and complex optical reflections',
    motionCharacteristics: 'Heavy physical realism, accurate wet floor light dispersion, organic coat movement',
    strengths: ['Accurate fluid physics', 'High temporal stability', 'Native 1080p photorealism'],
    syntaxPattern: '[Subject Action] + [Camera Trajectory] + [Lighting Geometry] + [Optical Texture]',
    compiledPrompt: 'Cinematic wide shot: A lone detective in a wet charcoal trenchcoat walks slowly down the central aisle of an abandoned Art Deco theater. Rain drips from the collapsed ceiling, pooling on decayed velvet seats. Slow push-in tracking shot at 24fps. Volumetric cyan and amber neon signs spill through shattered skylights, creating anamorphic streak reflections across water puddles on the marble floor. Shot on Arri Alexa 65, 35mm Master Prime, photorealistic cinema render, hyper-detailed textures.',
    negativePrompt: 'cartoon, low quality, oversaturated, morphing hands, CGI shine, blurry, frame stutter, video noise, smooth plastic skin',
    cameraDirective: 'Camera: Slow Push-in (Z-axis +0.3) • Speed: 24 FPS • Focal: 35mm',
  },
  {
    id: 'runway',
    name: 'Runway',
    version: 'Gen-3 Alpha',
    category: 'Video Engine',
    specialty: 'High-speed camera choreography and dramatic directorial cues',
    motionCharacteristics: 'Directable camera control tokens, dramatic atmosphere shifts, cinematic temporal pacing',
    strengths: ['Precise camera control tags', 'Dynamic lighting transitions', 'High character expressiveness'],
    syntaxPattern: '[Camera Movement Cue] + [Scene Description] + [Cinematography Style] + [Atmosphere]',
    compiledPrompt: 'Slow steady forward dolly shot moving toward a solitary figure in a damp overcoat standing inside a decaying 1930s Art Deco cinema palace. Shafts of moody cyan moonlight and flickering tungsten marquee light pierce through rain falling from broken rafters. Highly cinematic film still, anamorphic lens bokeh, photorealistic texture, haze, 24fps motion, award-winning cinematography.',
    negativePrompt: 'static, flat lighting, jittery motion, deformed geometry, unrealistic physics, washed out colors',
    cameraDirective: 'Camera: Dolly Forward 20% • Pan: Neutral • Tilt: -5 deg • Motion: 4',
  },
  {
    id: 'veo',
    name: 'Google Veo',
    version: 'Veo 2',
    category: 'Video Engine',
    specialty: 'Semantic visual consistency, high definition grain, and complex atmospheric lighting',
    motionCharacteristics: 'Subtle micro-movements, authentic 4K film gate emulation, natural environmental motion',
    strengths: ['Exceptional prompt fidelity', 'Photochemical color curves', 'Realistic ambient light bounce'],
    syntaxPattern: '[Directorial Style] + [Subject & Action] + [Cinematography Rig] + [Lighting & Color]',
    compiledPrompt: 'A 24fps cinematic film sequence directed by Roger Deakins. An investigator navigates the flooded ground floor of a derelict art deco movie theater at midnight. Wet floor mirrors amber and cyan neon glow filtering through shattered glass ceiling. Shot on Arri Alexa Mini LF, Cooke Anamorphic /i 40mm T2.3. Atmospheric haze, water droplets caught in backlit rim light, natural film grain, uncompressed cinematic master.',
    negativePrompt: 'oversharpened, 3D render look, unnatural motion artifacts, blown out highlights, plastic surfaces',
    cameraDirective: 'Camera: Ground-level tracking shot • Aperture: T2.3 • Shutter: 180 deg',
  },
  {
    id: 'luma',
    name: 'Luma',
    version: 'Dream Machine 1.6',
    category: 'Video Engine',
    specialty: 'Sweeping continuous perspective shifts and fluid subject tracking',
    motionCharacteristics: 'Expansive 3D spatial awareness, seamless trajectory arcs, dynamic depth of field',
    strengths: ['Expansive camera arcs', 'Fluid depth transitions', 'Fast turnaround generation'],
    syntaxPattern: '[Movement Trajectory] + [Scene & Mood] + [Lighting Architecture] + [Style]',
    compiledPrompt: 'Continuous cinematic tracking shot following from behind an investigator walking into a ruined grand theater hall. Rain falls steadily into shallow reflective pools across the ornate floor. Moody noir atmosphere with warm tungsten sidelight and cool cyan backlights shimmering in water ripples. 35mm motion picture film style, 24fps, high quality visual fidelity.',
    negativePrompt: 'distorted geometry, jump cuts, artificial glow, low resolution, warped architecture',
    cameraDirective: 'Camera: Orbit Tracking Shot • Horizon: Level • Inertia: High',
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    version: 'Hailuo 01',
    category: 'Video Engine',
    specialty: 'Human emotional nuance, fabric textures, and organic micro-movements',
    motionCharacteristics: 'Naturalistic cloth drape physics, organic step cadence, subtle facial tension',
    strengths: ['Ultra-realistic human movement', 'Natural fabric motion', 'Rich shadow tonal range'],
    syntaxPattern: '[Character Emotion/Action] + [Environment Details] + [Camera Perspective] + [Cinematography]',
    compiledPrompt: 'Close tracking shot of a weary investigator stepping across puddles inside an abandoned Art Deco movie palace. Rain pours gently from open roof sections, soaking their dark wool trenchcoat. Flickering neon lights outside cast vivid blue and amber reflections on the damp surfaces. Realistic cinematic movement, natural lighting, deep contrast, 35mm film grain, 24fps.',
    negativePrompt: 'bad anatomy, unrealistic fabric behavior, artificial CGI look, choppy animation, overexposed',
    cameraDirective: 'Camera: Waist-level Steadicam • Tracking: Lateral-Forward • DOF: Shallow',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    version: 'v6.1',
    category: 'Image Engine',
    specialty: 'Authorial composition, photographic grain authenticity, and chromatic nuance',
    motionCharacteristics: 'Static Reference Frame / Master Shot Keyframe',
    strengths: ['Unmatched optical richness', 'Kodak 5219 emulsion emulation', 'Subtle micro-textures'],
    syntaxPattern: '[Subject/Action] + [Camera/Optics] + [Lighting Ratio] + [Film Stock] + [Parameters]',
    compiledPrompt: 'Cinematic wide film still of a solitary investigator inside a flooded, abandoned 1930s Art Deco cinema hall, rain pouring through the shattered domed ceiling, amber and teal neon reflections across black water on marble floors, shot on Panavision Millennium DXL2 with Primo Anamorphic lenses, chiaroscuro lighting, atmospheric dust and mist, Kodak Vision3 500T 5219 color grade --ar 239:100 --v 6.1 --style raw --stylize 250',
    negativePrompt: 'illustration, 3d render, cartoon, glowing skin, oversaturated, vignette blur, digital look',
    cameraDirective: 'Aspect Ratio: 2.39:1 Anamorphic • Style: Raw • Stylize: 250',
  },
  {
    id: 'flux',
    name: 'Flux.1',
    version: 'Schnell / Dev',
    category: 'Image Engine',
    specialty: 'Hyper-precise anatomical coherence, architecture accuracy, and edge sharpness',
    motionCharacteristics: 'Ultra-crisp Keyframe / Production Concept Still',
    strengths: ['Flawless Art Deco architectural geometry', 'Zero prompt bleeding', 'Sub-millimeter detail'],
    syntaxPattern: '[Exact Scene Anatomy] + [Lighting Physics] + [Camera Lens Spec] + [Format/Medium]',
    compiledPrompt: 'A master cinematic keyframe: A lone investigator wearing a damp wool coat walks down the sloping carpeted aisle of an abandoned Art Deco movie theater. Shallow water covers the floor, creating mirror reflections of decaying gold-leaf arches and distant streetlamp neon spilling through collapsed roof skylights. Shot on Leica SL2 with Summilux-C 35mm T1.4, high micro-contrast, volumetric fog, natural film grain texture.',
    negativePrompt: 'blurry, distorted architecture, extra limbs, bad proportions, plastic render, noise artifacts',
    cameraDirective: 'Aperture: f/1.4 • Sensor: Full Frame 47MP • Color Science: Leica Color',
  },
  {
    id: 'wan',
    name: 'Wan Video',
    version: '2.1 Open-Source',
    category: 'Video Engine',
    specialty: 'Open cinematic weights, deep spatio-temporal coherence, and textural weight',
    motionCharacteristics: 'Heavy cinematic weight, dense atmospheric particle physics, authentic depth rolloff',
    strengths: ['Open weights customizability', 'Dense volumetric fog simulation', 'Consistent perspective grid'],
    syntaxPattern: '[Scene Atmosphere] + [Actor Movement] + [Optics & Rig] + [Render Target]',
    compiledPrompt: 'Cinematic master shot inside an expansive dilapidated Art Deco theater, rain water flooding the lower seating area. A lone figure in a wet trenchcoat slowly advances down the aisle. Amber sodium lighting mixes with cold cyan night skylight, casting long dramatic reflections across the mirror-like water surface. Anamorphic lens distortion, shallow depth of field, 24fps cinematic cadence, film stock texture, high fidelity.',
    negativePrompt: 'unstable frames, flickering light artifacts, washed out blacks, low quality textures, cartoonish',
    cameraDirective: 'Resolution: 1080p Cine • Frame Rate: 24 FPS • Shutter: 180 deg',
  },
]

export function EightMindsMatrix() {
  const [selectedEngine, setSelectedEngine] = useState<EngineProfile>(ENGINES[0])
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedNegative, setCopiedNegative] = useState(false)

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(selectedEngine.compiledPrompt)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  const handleCopyNegative = () => {
    navigator.clipboard.writeText(selectedEngine.negativePrompt)
    setCopiedNegative(true)
    setTimeout(() => setCopiedNegative(false), 2000)
  }

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Engine Translation Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans">
            ONE SCENE. <span className="font-serif italic font-normal text-amber-200">EIGHT MINDS.</span>
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-2xl">
            See how the exact same cinematic master scene translates across 8 industry-leading AI models. Creator Intel calibrates syntax, tokens, and camera physics for each engine.
          </p>
        </div>

        <div className="p-3 bg-neutral-950/80 border border-white/[0.08] rounded-xl text-left font-mono text-xs max-w-xs">
          <div className="text-neutral-500 uppercase text-[10px] mb-1">Unified Directorial Cue:</div>
          <div className="text-neutral-300 font-sans text-xs italic">
            "Detective enters a flooded Art Deco cinema in the rain. Neon reflections, 24fps push-in."
          </div>
        </div>
      </div>

      {/* Engine Selection Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        {ENGINES.map((engine) => {
          const isSelected = selectedEngine.id === engine.id
          return (
            <button
              key={engine.id}
              onClick={() => setSelectedEngine(engine)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-amber-400/10 border-amber-400/60 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'bg-neutral-950/60 border-white/[0.07] text-neutral-400 hover:text-neutral-200 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-neutral-600'}`} />
                <span className="text-xs font-semibold tracking-wide font-sans">{engine.name}</span>
                <span className="text-[10px] font-mono text-neutral-500">{engine.version}</span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Engine Intelligence Board */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedEngine.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-950/80 border border-white/[0.09] rounded-2xl p-6 sm:p-8 backdrop-blur-md relative"
        >
          {/* Left: Model Capabilities & Physics (5 cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white font-sans">{selectedEngine.name}</h3>
                    <p className="text-xs font-mono text-neutral-400">{selectedEngine.version} • {selectedEngine.category}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-neutral-400">
                  AUTO-TRANSLATED
                </span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/[0.05] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Core Engine Specialty</div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">{selectedEngine.specialty}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/[0.05] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Motion & Physics Dynamics</div>
                <p className="text-xs text-neutral-300 leading-relaxed">{selectedEngine.motionCharacteristics}</p>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Key Model Strengths</div>
                <div className="flex flex-wrap gap-2">
                  {selectedEngine.strengths.map((str, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-[11px] text-neutral-300 font-mono">
                      ✓ {str}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-mono">{selectedEngine.cameraDirective}</span>
              <Link
                href="/prompts/factory"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors group"
              >
                <span>Direct in Studio</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right: Compiled Prompt & Negative Formulation (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 bg-black/60 rounded-xl p-5 sm:p-6 border border-white/[0.08]">
            <div className="space-y-4">
              {/* Syntax Recipe Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs uppercase tracking-wider text-neutral-300">Engine Syntax Formula</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-500">FORMAT CALIBRATED</span>
              </div>
              <div className="font-mono text-[11px] text-amber-300/90 bg-neutral-900/80 px-3 py-2 rounded-lg border border-amber-400/20">
                {selectedEngine.syntaxPattern}
              </div>

              {/* Master Prompt Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Generated Positive Prompt</span>
                  <button
                    onClick={handleCopyPrompt}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <div className="p-4 bg-neutral-950 rounded-lg border border-white/[0.06] font-mono text-xs text-neutral-200 leading-relaxed select-all">
                  {selectedEngine.compiledPrompt}
                </div>
              </div>

              {/* Negative Prompt Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Calibrated Negative Suppression Prompt</span>
                  <button
                    onClick={handleCopyNegative}
                    className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    {copiedNegative ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNegative ? 'Copied' : 'Copy Negative'}</span>
                  </button>
                </div>
                <div className="p-3 bg-neutral-950/70 rounded-lg border border-white/[0.04] font-mono text-[11px] text-neutral-400 leading-relaxed select-all">
                  {selectedEngine.negativePrompt}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-neutral-500">
                Optimized for native {selectedEngine.name} inference tokenization
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={`/prompts/factory?engine=${selectedEngine.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute in Studio</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}
