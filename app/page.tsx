import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { CinematicViewfinder } from "@/components/cinematic/cinematic-viewfinder";
import { IntentDeck } from "@/components/cinematic/intent-deck";
import { DirectorsStudioDemo } from "@/components/directors-studio-demo";
import { KnowledgeCanvas } from "@/components/cinematic/knowledge-canvas";
import { EightMindsMatrix } from "@/components/cinematic/eight-minds-matrix";
import { DirectorsDesk } from "@/components/cinematic/directors-desk";
import { TimelineTransition } from "@/components/cinematic/timeline-transition";
import { FinalFrame } from "@/components/cinematic/final-frame";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import {
  ToolCard,
  PromptCard,
  EditorialCard,
  VideoCard,
  ComparisonCard,
  WorkflowCard,
} from "@/components/ui-cards";
import {
  toolsData,
  promptsData,
  comparisonsData,
  workflowsData,
} from "@/data/platform-data";
import { getAllStories, getAllFestivals } from "@/data/content";
import { db } from "@/lib/db/repository";
import { AdSlot } from "@/components/ad-slot";

export default function Home() {
  const featuredTools = toolsData.slice(0, 6);
  const featuredPrompts = promptsData.slice(0, 3);
  const featuredComparisons = comparisonsData.slice(0, 3);
  const featuredWorkflows = workflowsData.slice(0, 2);
  const featuredStories = getAllStories().slice(0, 2);
  const upcomingFestivals = getAllFestivals().slice(0, 3);
  const latestBlogs = db.getPublishedBlogs().slice(0, 2);
  const latestVideos = db.getPublishedVideos().slice(0, 2);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 overflow-x-hidden">
      <Navigation />

      {/* 1. CINEMATIC HERO */}
      <Hero />

      {/* 2. DIRECTOR'S VIEWFINDER: LIVE TELEMETRY & OPTICAL HUD */}
      <Reveal variant="fade-up">
        <CinematicViewfinder />
      </Reveal>

      {/* 3. "WHAT ARE YOU MAKING?": FORMAT ARCHETYPES INTENT DECK */}
      <Reveal variant="fade-up">
        <IntentDeck />
      </Reveal>

      {/* 4. DIRECTOR'S STUDIO INTERACTIVE WORKSTATION */}
      <Reveal variant="fade-up">
        <DirectorsStudioDemo />
      </Reveal>

      {/* 5. "EVERYTHING IN CINEMA IS CONNECTED": CINEMA INTELLIGENCE GRAPH */}
      <Reveal variant="fade-up">
        <KnowledgeCanvas />
      </Reveal>

      {/* 6. "ONE SCENE. EIGHT MINDS.": ENGINE TRANSLATION MATRIX */}
      <Reveal variant="fade-up">
        <EightMindsMatrix />
      </Reveal>

      {/* 7. "THE DIRECTOR'S DESK": LAYERED WORKSTATION DOSSIERS */}
      <Reveal variant="fade-up">
        <DirectorsDesk />
      </Reveal>

      {/* 8. KINETIC MILESTONE TIMELINE: IDEA → SHOT → SCENE → FILM */}
      <Reveal variant="fade-up">
        <TimelineTransition />
      </Reveal>

      {/* 9. FLAGSHIP VIDEO GENERATION SPOTLIGHT BANNER */}
      <section className="shell py-12">
        <Reveal variant="fade-up">
          <div className="surface p-8 sm:p-12 relative overflow-hidden bg-neutral-900/80 rounded-3xl border border-white/[0.08] shadow-2xl">
            <div className="relative z-10 max-w-3xl">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold mb-3 block">
                Flagship Model Intelligence
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight font-sans">
                The Director&apos;s AI Model Guide
              </h2>
              <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
                Compare AI video models by camera control, motion fidelity, visual consistency, physics, references, and production use cases.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/categories/video"
                  className="rounded-xl bg-amber-400 px-6 py-3 text-xs sm:text-sm font-bold text-neutral-950 transition-all hover:bg-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                >
                  Launch Video Hub →
                </Link>
                <Link
                  href="/compare/runway-vs-kling"
                  className="text-xs sm:text-sm font-mono text-neutral-400 hover:text-white transition-colors"
                >
                  Read Runway vs Kling Breakdown →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 10. CURATED TOOL INTELLIGENCE */}
      <section id="tools" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Intelligence Dossiers"
            title="The Filmmaker's AI Stack"
            description="Production tools evaluated for real creative workflows — not just another AI tools directory."
            viewAllHref="/tools"
            viewAllLabel={`View all ${toolsData.length} Tools`}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 11. PRODUCTION STORIES & CASE STUDIES */}
      <section id="stories" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Production Case Studies"
            title="Real Productions: Shot by Shot"
            description="Deconstructed multi-model workflows for automotive commercials, narrative sci-fi previs, and virtual productions."
            viewAllHref="/stories"
            viewAllLabel="View all Stories"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredStories.map((story) => (
              <div
                key={story.id}
                className="rounded-3xl border border-white/[0.08] bg-neutral-900/60 p-6 sm:p-8 flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                      {story.genre}
                    </span>
                    <span className="text-xs font-mono text-neutral-500">{story.runtime}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition">
                    <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                    {story.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono">{story.director}</span>
                  <Link href={`/stories/${story.slug}`} className="text-amber-400 font-mono font-medium hover:underline">
                    Read Shot Breakdown →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 12. WHY VAULT? CONVERSION SECTION */}
      <section id="why-vault" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <div className="surface p-8 sm:p-12 relative overflow-hidden bg-neutral-900/90 rounded-3xl border border-amber-400/30 shadow-2xl space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold mb-2 block">
                  PRO VAULT INTELLIGENCE
                </span>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif">
                  Why The Director's Vault?
                </h2>
              </div>
              <Link
                href="/vault"
                className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 hover:bg-amber-300 transition shrink-0"
              >
                Explore The Vault →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 font-sans text-xs">
              <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5 space-y-2">
                <span className="font-mono text-amber-400 font-bold text-sm block">01. Directorial Vision</span>
                <p className="text-neutral-300 leading-relaxed">
                  Lock narrative intent, character emotion, and motivated lighting tone before generating.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5 space-y-2">
                <span className="font-mono text-amber-400 font-bold text-sm block">02. Physical Optics</span>
                <p className="text-neutral-300 leading-relaxed">
                  Calibrated Cooke/Zeiss focal lengths, 2x anamorphic squeeze, and 3:1 key-to-fill ratios.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5 space-y-2">
                <span className="font-mono text-amber-400 font-bold text-sm block">03. Engine Translation</span>
                <p className="text-neutral-300 leading-relaxed">
                  Direct translation for Runway Gen-3, Kling 1.5, and Flux.1 with artifact-suppression negatives.
                </p>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5 space-y-2">
                <span className="font-mono text-amber-400 font-bold text-sm block">04. Screen-Ready Takes</span>
                <p className="text-neutral-300 leading-relaxed">
                  Zero plastic sheen or jittery motion. Grounded physical inertia and natural highlight roll-off.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 13. PROMPT RECIPES & FORMULA LIBRARY */}
      <section id="prompts" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Prompt Architecture"
            title="Director Recipe Vault & Model Translators"
            description="Calibrated cinematography blueprints for Runway, Kling, Luma, Midjourney, and Flux.1."
            viewAllHref="/prompts"
            viewAllLabel={`Explore ${promptsData.length} Prompts`}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 13. AI FILM FESTIVAL DIRECTORY SPOTLIGHT */}
      <section id="festivals" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Festival Intelligence"
            title="AI Film Festival Directory & Deadlines"
            description="Verified international deadlines, competition rules, prize grants, and ethical AI disclosure guidelines."
            viewAllHref="/festivals"
            viewAllLabel="All Film Festivals"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {upcomingFestivals.map((fest) => (
              <div
                key={fest.id}
                className="rounded-2xl border border-white/[0.08] bg-neutral-900/60 p-6 flex flex-col justify-between space-y-4 shadow-subtle hover:border-amber-400/40 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                      {fest.hostCity}
                    </span>
                    <span className="text-xs font-mono text-rose-400 font-medium">
                      Due: {fest.deadline.split(",")[0]}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{fest.name}</h3>
                  <p className="text-xs text-neutral-400">{fest.prizes}</p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-mono">Season {fest.seasonYear}</span>
                  <Link href="/festivals" className="text-amber-400 font-mono font-medium hover:underline">
                    Rules & Checklist →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 14. VERDICT-FIRST COMPARISONS */}
      <section id="compare" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Editorial Decisions"
            title="Model & Tool Comparisons"
            description="Direct head-to-head assessments. Clear verdict summaries when competing models overlap."
            viewAllHref="/compare"
            viewAllLabel="All Comparisons"
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredComparisons.map((comp) => (
              <ComparisonCard key={comp.id} comparison={comp} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 15. PRODUCTION WORKFLOWS */}
      <section id="workflows" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Pipeline Blueprints"
            title="End-to-End Production Workflows"
            description="Step-by-step pipeline recipes from concept and master image generation to motion synthesis and post finishing."
            viewAllHref="/workflows"
            viewAllLabel="All Workflows"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredWorkflows.map((wf) => (
              <WorkflowCard key={wf.id} workflow={wf} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 16. CREATOR JOURNAL & MASTERCLASSES */}
      <section id="media" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Media & Essays"
            title="Creator Journal & Video Masterclasses"
            description="Technical essays, benchmark dissections, and director timeline walkthroughs."
            viewAllHref="/blog"
            viewAllLabel="Read All Essays"
          />

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Journal Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                  Creator Journal
                </span>
                <Link href="/blog" className="text-xs font-mono text-amber-400 hover:underline">
                  View Journal →
                </Link>
              </div>
              <div className="space-y-4">
                {latestBlogs.map((post) => (
                  <EditorialCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            {/* Masterclasses Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">
                  Video Masterclasses
                </span>
                <Link href="/videos" className="text-xs font-mono text-amber-400 hover:underline">
                  View Masterclasses →
                </Link>
              </div>
              <div className="grid gap-4">
                {latestVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 17. FINAL FRAME: "YOU HAVE THE IDEA. NOW DIRECT IT." */}
      <Reveal variant="fade-up">
        <FinalFrame />
      </Reveal>

      <AdSlot slotId="home-bottom" label="Production Intelligence Sponsor" />

      <Footer />
    </main>
  );
}
