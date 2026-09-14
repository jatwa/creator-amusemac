'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { Network, Sparkles, Film, Camera, User, Clapperboard, Award, ArrowUpRight, CheckCircle2, ChevronRight } from '@/components/cinematic/icons'

interface GraphNode {
  id: string
  category: 'masterpiece' | 'director' | 'optics' | 'rig' | 'lighting' | 'ai_model' | 'festival'
  label: string
  subtitle: string
  connections: string[] // node ids
  brief: {
    overview: string
    keyInsight: string
    promptSnippet: string
    relatedTools: string[]
  }
}

const NODES: GraphNode[] = [
  {
    id: 'blade-runner-2049',
    category: 'masterpiece',
    label: 'Blade Runner 2049',
    subtitle: 'Dir. Denis Villeneuve • DP Roger Deakins',
    connections: ['deakins', 'anamorphic', 'silhouette-light', 'kling', 'cannes'],
    brief: {
      overview: 'Monumental scale through restrained single-source silhouettes, golden amber dust atmospheres, and deep geometric perspective.',
      keyInsight: 'Avoid busy multi-color lighting; rely on high contrast silhouette blocking against diffused amber or cyan background washes.',
      promptSnippet: 'Monumental brutalist interior, solitary figure in sharp silhouette against massive amber glass window, volumetric dust rays, Arri Alexa Mini, Master Prime 35mm, Deakins cinematography style --ar 239:100',
      relatedTools: ['Director\'s Studio', 'Cinematography Lexicon', 'Lighting Ratio Calculator'],
    },
  },
  {
    id: 'deakins',
    category: 'director',
    label: 'Roger Deakins ASC BSC',
    subtitle: 'Master of Naturalistic Simplicity',
    connections: ['blade-runner-2049', 'master-prime', 'technocrane', 'veo'],
    brief: {
      overview: 'Legendary cinematographer renowned for motivated practical lighting, spherical prime clarity, and unforced camera movement.',
      keyInsight: 'Every light source must have a believable physical reason to exist in the scene. Keep movement motivated by actor psychology.',
      promptSnippet: 'Naturalistic motivated side light through linen curtains, soft shadow rolloff, Zeiss Master Prime 32mm, 24fps deliberate pace, 180-degree shutter, uncompressed film grain',
      relatedTools: ['Optical Rationale Engine', 'Motivated Light Assistant'],
    },
  },
  {
    id: 'anamorphic',
    category: 'optics',
    label: 'Hawk V-Lite 2x Anamorphic',
    subtitle: 'Optical Oval Bokeh & Flare Geometry',
    connections: ['blade-runner-2049', 'russian-arm', 'kling', 'sundance'],
    brief: {
      overview: '2x squeeze factor delivers organic horizontal streaking flares, vertical oval bokeh, and subtle edge barrel distortion.',
      keyInsight: 'Anamorphic compression draws the viewer into characters by separating subjects cleanly from soft, creamy backgrounds.',
      promptSnippet: 'Shot on Hawk V-Lite 45mm Anamorphic T2.2, 2.39:1 aspect ratio, horizontal blue streak flares, rich oval bokeh, organic focus falloff, 35mm film texture',
      relatedTools: ['Lens Package Selector', 'Aspect Ratio Converter'],
    },
  },
  {
    id: 'master-prime',
    category: 'optics',
    label: 'Zeiss Master Prime 35mm',
    subtitle: 'Zero Distortion Reference Sharpness',
    connections: ['deakins', 'steadicam', 'midjourney', 'cannes'],
    brief: {
      overview: 'Flawless optical resolution with virtually no chromatic aberration or geometric distortion across the entire field.',
      keyInsight: 'Use for modern, clinical, architectural, or psychological thrillers where surgical precision is required.',
      promptSnippet: 'Crisp architectural keyframe, Zeiss Master Prime 35mm T1.3, zero distortion, razor sharp subject separation, deep shadow fidelity, natural color reproduction',
      relatedTools: ['Optics Lexicon', 'Director Recipe Slip'],
    },
  },
  {
    id: 'silhouette-light',
    category: 'lighting',
    label: 'Chiaroscuro Silhouette Ratios',
    subtitle: '8:1 Key-to-Fill Contrast Geometry',
    connections: ['blade-runner-2049', 'anamorphic', 'flux', 'venice'],
    brief: {
      overview: 'Dramatic sculptural lighting technique separating characters as sharp graphic silhouettes against luminous backgrounds.',
      keyInsight: 'Eliminate frontal fill light; push hard directional rim from 135 degrees behind the subject.',
      promptSnippet: 'Chiaroscuro low-key lighting, 8:1 contrast ratio, deep ink-black shadows, rim light cutting through heavy volumetric atmosphere, cinematic realism',
      relatedTools: ['Lighting Setup Guide', 'Atmosphere Synthesizer'],
    },
  },
  {
    id: 'russian-arm',
    category: 'rig',
    label: 'Russian Arm / Motocrane',
    subtitle: 'High-Velocity Dynamic Vehicle Tracking',
    connections: ['anamorphic', 'kling', 'runway'],
    brief: {
      overview: 'Roof-mounted gyro-stabilized 360-degree crane arm enabling fluid multi-axis vehicle pursuit shots at high speeds.',
      keyInsight: 'Generates thrilling low-angle sweeping movements inches from asphalt without camera shake.',
      promptSnippet: 'High-speed tracking shot from Russian Arm camera rig, sweeping low-angle pursuit along wet neon highway at 80mph, camera diving inches from road, 24fps motion blur',
      relatedTools: ['Camera Rig Selector', 'Kinematics Synthesizer'],
    },
  },
  {
    id: 'steadicam',
    category: 'rig',
    label: 'Steadicam Floating One-er',
    subtitle: 'Continuous Unbroken Spatial Immersion',
    connections: ['master-prime', 'deakins', 'wan'],
    brief: {
      overview: 'Body-worn stabilization allowing unbroken continuous takes through complex architectural spaces and doorways.',
      keyInsight: 'Creates immersive viewer proximity, letting the camera explore spatial geography alongside the protagonist.',
      promptSnippet: 'Unbroken Steadicam continuous shot navigating down narrow concrete corridors, floating smooth tracking, 24fps organic motion, cinematic tension',
      relatedTools: ['Shot Planner', 'Camera Movement Lexicon'],
    },
  },
  {
    id: 'kling',
    category: 'ai_model',
    label: 'Kling AI 2.0 Master',
    subtitle: 'Physics-Accurate Video Inference',
    connections: ['blade-runner-2049', 'anamorphic', 'russian-arm'],
    brief: {
      overview: 'Industry-standard temporal consistency and fluid-accurate physical simulations for high-end cinematic generation.',
      keyInsight: 'Responds best to explicit camera trajectories, shutter angle specs, and light bounce descriptors.',
      promptSnippet: 'Cinematic video sequence, Kling 2.0 master render, realistic water reflection physics, 24fps smooth frame rate, optical lens characteristics',
      relatedTools: ['Engine Translator', 'Negative Prompt Tuner'],
    },
  },
  {
    id: 'cannes',
    category: 'festival',
    label: 'Cannes & Venice Delivery',
    subtitle: 'DCI-P3 4K D-Cinema Master Standards',
    connections: ['blade-runner-2049', 'master-prime', 'silhouette-light'],
    brief: {
      overview: 'Prestige festival standards demanding uncompressed dynamic range, 24.000 fps cadence, and authentic film colorimetry.',
      keyInsight: 'Ensure all generated assets adhere to 2.39:1 or 1.85:1 theatrical containers without digital sharpening or plastic textures.',
      promptSnippet: 'Festival award-winner cinematography, DCI-P3 color gamut, 35mm photochemical tone curve, uncompressed master still, cinematic mastery',
      relatedTools: ['Festival Workflow Pack', 'Deliverables Checker'],
    },
  },
]

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  masterpiece: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30', label: 'Masterpiece' },
  director: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Auteur / DP' },
  optics: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', label: 'Optics & Glass' },
  rig: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Camera Rig' },
  lighting: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', label: 'Lighting Ratio' },
  ai_model: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'AI Engine' },
  festival: { bg: 'bg-amber-300/10', text: 'text-amber-200', border: 'border-amber-300/30', label: 'Festival / Standard' },
}

export function KnowledgeCanvas() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('blade-runner-2049')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null)

  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[0]
  const connectedNodes = NODES.filter((n) => selectedNode.connections.includes(n.id))

  const filteredNodes = activeCategoryFilter
    ? NODES.filter((n) => n.category === activeCategoryFilter)
    : NODES

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Cinema Intelligence Graph</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-sans">
            EVERYTHING IN CINEMA <br className="hidden sm:inline" />
            <span className="font-serif italic font-normal text-amber-200">IS CONNECTED.</span>
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-2xl">
            Films, lenses, camera rigs, lighting ratios, auteurs, and AI models are not isolated prompt tags. They form a deeply interconnected cinematographic operating system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 hover:border-amber-400/40 bg-white/[0.03] text-xs font-mono text-neutral-300 hover:text-white transition-all group"
          >
            <Network className="w-3.5 h-3.5 text-amber-400" />
            <span>Explore 500+ Knowledge Nodes</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400" />
          </Link>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        <button
          onClick={() => setActiveCategoryFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
            activeCategoryFilter === null
              ? 'bg-amber-400 text-neutral-950 font-bold'
              : 'bg-white/[0.04] text-neutral-400 hover:text-neutral-200 border border-white/[0.06]'
          }`}
        >
          All Nodes ({NODES.length})
        </button>
        {Object.entries(CATEGORY_STYLES).map(([key, style]) => (
          <button
            key={key}
            onClick={() => setActiveCategoryFilter(activeCategoryFilter === key ? null : key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
              activeCategoryFilter === key
                ? `${style.bg} ${style.text} ${style.border} font-semibold`
                : 'bg-white/[0.03] text-neutral-400 hover:text-neutral-200 border-white/[0.06]'
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      {/* Interactive Graph & Intelligence Brief split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Node Map (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-950/80 border border-white/[0.09] rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-300">Interactive Cinema Topology</span>
              </div>
              <span className="font-mono text-[10px] text-neutral-500">CLICK TO INSPECT LINKAGES</span>
            </div>

            {/* Node Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {filteredNodes.map((node) => {
                const isSelected = node.id === selectedNodeId
                const isConnectedToSelected = selectedNode.connections.includes(node.id)
                const style = CATEGORY_STYLES[node.category]

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-4 rounded-xl text-left transition-all duration-200 border relative ${
                      isSelected
                        ? 'bg-neutral-900 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/50'
                        : isConnectedToSelected
                        ? 'bg-neutral-900/40 border-amber-400/30 hover:border-amber-400/50'
                        : 'bg-neutral-950/60 border-white/[0.06] hover:border-white/20'
                    }`}
                  >
                    {isConnectedToSelected && !isSelected && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-400/10 text-[9px] font-mono text-amber-300 border border-amber-400/20">
                        LINKED
                      </span>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border ${style.bg} ${style.text} ${style.border}`}>
                        {style.label}
                      </span>
                    </div>

                    <h4 className={`text-sm font-bold tracking-tight ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                      {node.label}
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5 truncate">{node.subtitle}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>Linked connections: {selectedNode.connections.length} active nodes</span>
            <span className="text-amber-400/80">Active node: {selectedNode.label}</span>
          </div>
        </div>

        {/* Right: Detailed Dossier & Prompt Recipe (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-950/90 border border-white/[0.09] rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${CATEGORY_STYLES[selectedNode.category].bg} ${CATEGORY_STYLES[selectedNode.category].text} ${CATEGORY_STYLES[selectedNode.category].border}`}>
                    {CATEGORY_STYLES[selectedNode.category].label}
                  </span>
                  <span className="text-neutral-500 text-xs font-mono">• Node #{selectedNode.id}</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-sans">{selectedNode.label}</h3>
                <p className="text-xs font-mono text-amber-300/80 mt-1">{selectedNode.subtitle}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-white/[0.05] space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">Directorial Overview</div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">{selectedNode.brief.overview}</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-400/[0.04] border border-amber-400/20 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Key Cinematographic Rule</span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed font-sans">{selectedNode.brief.keyInsight}</p>
              </div>

              {/* Sample Prompt Extraction */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                  <span>Synthesized Prompt Derivative</span>
                  <span className="text-amber-400">AUTONOMOUS RECIPE</span>
                </div>
                <div className="p-3.5 bg-black/80 rounded-lg border border-white/[0.06] font-mono text-xs text-neutral-300 leading-relaxed select-all">
                  {selectedNode.brief.promptSnippet}
                </div>
              </div>

              {/* Connected Nodes Badges */}
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Connected System Nodes</div>
                <div className="flex flex-wrap gap-2">
                  {connectedNodes.map((cn) => (
                    <button
                      key={cn.id}
                      onClick={() => setSelectedNodeId(cn.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] text-neutral-300 font-mono transition-colors"
                    >
                      <span>{cn.label}</span>
                      <ChevronRight className="w-3 h-3 text-neutral-500" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-500">Part of the Creator Intel Knowledge Engine</span>
            <Link
              href="/prompts/factory"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              <span>Build from this Node</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
