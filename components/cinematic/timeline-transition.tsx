'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Lightbulb, Camera, Clapperboard, Layers, Film, ArrowRight } from '@/components/cinematic/icons'

interface Milestone {
  id: string
  stage: string
  title: string
  icon: React.ElementType
  subtext: string
  metric: string
  detail: string
}

const MILESTONES: Milestone[] = [
  {
    id: 'idea',
    stage: '01',
    title: 'IDEA',
    icon: Lightbulb,
    subtext: 'Narrative Conception',
    metric: 'Raw Subtext & Tone',
    detail: 'Deconstruct raw story thoughts into dramatic stakes, emotional tone, and cinematic references.',
  },
  {
    id: 'shot',
    stage: '02',
    title: 'SHOT',
    icon: Camera,
    subtext: 'Optical Geometry',
    metric: 'Glass & Sensor Matrix',
    detail: 'Calibrate focal lengths, T-stops, anamorphic squeeze, camera rigs, and lighting ratios.',
  },
  {
    id: 'scene',
    stage: '03',
    title: 'SCENE',
    icon: Clapperboard,
    subtext: 'Spatial Blocking',
    metric: 'Actor & Camera Cadence',
    detail: 'Coordinate eyelines, subject movement, 24fps motion blur, and atmospheric volumetric depth.',
  },
  {
    id: 'sequence',
    stage: '04',
    title: 'SEQUENCE',
    icon: Layers,
    subtext: 'Rhythmic Continuity',
    metric: 'Multi-Prompt Coherence',
    detail: 'Maintain character, lighting, and textural consistency across consecutive generative takes.',
  },
  {
    id: 'film',
    stage: '05',
    title: 'FILM',
    icon: Film,
    subtext: 'Theatrical Master',
    metric: 'DCI-P3 Theatrical Cut',
    detail: 'Deliver festival-grade 4K 2.39:1 masters free from synthetic digital artifacts.',
  },
]

export function TimelineTransition() {
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null)

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.06] overflow-hidden">
      {/* Background kinetic track line */}
      <div className="text-center mb-16">
        <span className="font-mono text-xs tracking-widest text-amber-400 uppercase">Kinetic Directorial Milestones</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans mt-2">
          FROM THE FIRST THOUGHT TO THE <span className="font-serif italic font-normal text-amber-200">FINAL CUT.</span>
        </h2>
        <p className="mt-2 text-neutral-400 text-sm max-w-xl mx-auto">
          How Creator Intel scales with your production from initial spark to cinema delivery.
        </p>
      </div>

      {/* Interactive Milestone Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
        {MILESTONES.map((item, idx) => {
          const Icon = item.icon
          const isHovered = hoveredMilestone === item.id

          return (
            <motion.div
              key={item.id}
              onMouseEnter={() => setHoveredMilestone(item.id)}
              onMouseLeave={() => setHoveredMilestone(null)}
              className={`p-5 rounded-2xl border transition-all duration-300 relative flex flex-col justify-between ${
                isHovered
                  ? 'bg-neutral-900 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)] -translate-y-1'
                  : 'bg-neutral-950/70 border-white/[0.07] hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-amber-400/80">
                    {item.stage}
                  </span>
                  <div className={`p-2 rounded-lg ${isHovered ? 'bg-amber-400/20 text-amber-300' : 'bg-white/[0.04] text-neutral-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-bold tracking-tight text-white font-sans mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-neutral-400 mb-3">{item.subtext}</p>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">{item.detail}</p>
              </div>

              <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-neutral-500">
                <span>{item.metric}</span>
                {idx < MILESTONES.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-neutral-600 hidden md:inline" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
