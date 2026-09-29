import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { ShotDecisionEngine } from "@/components/cinematic/shot-decision-engine";
import { DirectorsStudioDemo } from "@/components/directors-studio-demo";
import { FinalFrame } from "@/components/cinematic/final-frame";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ToolCard } from "@/components/ui-cards";
import { toolsData } from "@/data/platform-data";
import { getAllStories } from "@/data/content";
import { AdSlot } from "@/components/ad-slot";

export default function Home() {
  const featuredTools = toolsData.slice(0, 4);
  const featuredStories = getAllStories().slice(0, 2);

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 overflow-x-hidden">
      <Navigation />

      {/* 01 — ENTRY & PRIMARY INTAKE */}
      <Hero />

      {/* 02 — TRANSFORMATION: FROM STORY TO EXECUTION */}
      <section className="shell py-16 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-400 font-semibold block">
              FROM STORY TO EXECUTION
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
              Your script tells you what happens.
              <br />
              <span className="font-serif italic font-normal text-amber-200">
                Creator Intel helps decide how to build the shot.
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto font-sans">
              Turn story intent into research, visual decisions, shot design, model selection and production-ready execution.
            </p>
          </div>

          {/* Cinematic Pipeline Flow */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {[
              { step: "01", name: "SCRIPT / IDEA", desc: "Story premise" },
              { step: "02", name: "INTENT", desc: "Emotional tone" },
              { step: "03", name: "RESEARCH", desc: "Visual lineage" },
              { step: "04", name: "DIRECT", desc: "Optics & lighting" },
              { step: "05", name: "SHOT", desc: "Framing & rig" },
              { step: "06", name: "MODEL", desc: "Engine fit" },
              { step: "07", name: "RECIPE", desc: "Exact syntax" },
              { step: "08", name: "GENERATE", desc: "Final plate" },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/[0.08] bg-neutral-900/70 p-4 flex flex-col justify-between hover:border-amber-400/40 transition group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 font-bold">{item.step}</span>
                    {idx < 7 && (
                      <span className="text-[10px] font-mono text-neutral-600 group-hover:text-amber-400/60 transition hidden lg:inline">
                        →
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-xs font-bold text-white tracking-wide">{item.name}</h3>
                </div>
                <p className="mt-2 text-[10px] font-mono text-neutral-500 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 03 — THE PROBLEM: WHAT THE SHOT ACTUALLY NEEDS */}
      <section className="shell py-20 sm:py-28 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-400 font-semibold block">
                THE PROBLEM
              </span>
              <h2 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05] font-sans">
                You don&apos;t need another AI tool.
                <br />
                <span className="font-serif italic font-normal text-amber-200">
                  You need to know what the shot needs.
                </span>
              </h2>
              <p className="mt-6 text-base sm:text-lg text-neutral-400 leading-relaxed font-sans">
                Your creative process is spread across models, generators, research tabs and editing tools. The hard part is no longer finding another tool — it is deciding what the shot actually needs.
              </p>

              {/* Core Determination Pillars */}
              <div className="mt-8 grid sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">01 • WHAT</span>
                  <p className="mt-1 text-xs font-semibold text-neutral-200 font-sans">What to shoot</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">02 • HOW</span>
                  <p className="mt-1 text-xs font-semibold text-neutral-200 font-sans">How to shoot it</p>
                </div>
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">03 • WHICH</span>
                  <p className="mt-1 text-xs font-semibold text-neutral-200 font-sans">Which model executes</p>
                </div>
              </div>
            </div>

            {/* Concrete Scene Decision Breakdown Card */}
            <div className="rounded-3xl border border-white/[0.08] bg-neutral-900/80 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                  DECISION BLUEPRINT EXAMPLE
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                  CONNECTED
                </span>
              </div>

              <div className="mt-5 space-y-4 text-xs font-mono">
                <div className="rounded-xl border border-white/[0.07] bg-black/50 p-4">
                  <span className="text-[10px] uppercase text-neutral-500 block mb-1">SCENE</span>
                  <p className="text-sm font-serif italic text-neutral-200">
                    &ldquo;A woman waits alone at an empty railway station at night.&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">CREATIVE INTENT</span>
                    <span className="text-amber-300 font-semibold">Isolation / Suspense</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">SHOT DESIGN</span>
                    <span className="text-neutral-200 font-semibold">Wide → Slow Push-In</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">LENS</span>
                    <span className="text-neutral-200 font-semibold">50mm Anamorphic</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">CAMERA &amp; MOVEMENT</span>
                    <span className="text-neutral-200 font-semibold">Controlled Dolly (2.5m push)</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">LIGHTING</span>
                    <span className="text-neutral-200 font-semibold">Cold ambient + warm practical</span>
                  </div>
                  <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
                    <span className="text-[10px] text-neutral-500 uppercase block">ATMOSPHERE</span>
                    <span className="text-neutral-200 font-semibold">Light haze / night ambience</span>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.04] p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-500 block">MODEL OPTIONS</span>
                    <span className="text-xs font-bold text-neutral-200">Runway Gen-3 · Kling 1.5 · Veo</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-1 rounded">
                    PROMPT-LOCKED
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 04 — THE CREATOR INTEL MODEL: ONE CREATIVE DECISION */}
      <section className="shell pb-20 sm:pb-28">
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.09] via-neutral-900 to-neutral-950 p-8 sm:p-12 shadow-2xl">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/[0.08] blur-3xl pointer-events-none" />
            <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-400 font-semibold block">
                  THE CREATOR INTEL MODEL
                </span>
                <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans leading-tight">
                  One creative decision.
                  <br />
                  <span className="font-serif italic font-normal text-amber-200">
                    Every tool speaks the same language.
                  </span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl font-sans">
                  Creator Intel connects your story, research, shot design, camera decisions, model selection and generation — without replacing the tools you already use.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/prompts/factory" className="rounded-xl bg-amber-400 px-6 py-3.5 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition shadow-md shadow-amber-400/20">
                    Enter Director&apos;s Studio →
                  </Link>
                  <Link href="/compare" className="rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-xs font-semibold text-neutral-200 hover:border-amber-400/40 hover:text-white transition">
                    Compare AI Models
                  </Link>
                </div>
              </div>

              {/* Integrated Visual Architecture */}
              <div className="rounded-2xl border border-white/[0.08] bg-black/50 p-5 sm:p-7">
                <div className="mb-4 flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">INTELLIGENCE UNIFIED</span>
                  <span className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> SYSTEM ACTIVE
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    ["01", "YOUR IDEA", "Premise, screenplay, treatment"],
                    ["02", "CREATIVE INTENT", "Tone, genre stakes, thematic spine"],
                    ["03", "SHOT DESIGN", "Framing, composition, narrative beats"],
                    ["04", "OPTICS & LIGHT", "Camera rig, lens, shutter, lighting ratios"],
                    ["05", "MODEL FIT", "Kinematics & fidelity evaluation"],
                    ["06", "RECIPE SYNTAX", "Engine-locked syntax with negative filters"],
                    ["07", "GENERATION", "Runway · Kling · Veo · Luma · Flux"],
                  ].map(([n, title, copy]) => (
                    <div key={n} className="grid grid-cols-[28px_130px_1fr] items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">{n}</span>
                      <span className="text-[11px] font-bold tracking-wide text-white">{title}</span>
                      <span className="hidden sm:block text-[11px] font-mono text-neutral-500">{copy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 05 — SHOT DECISION ENGINE (INTERACTIVE WORKBENCH) */}
      <Reveal variant="fade-up">
        <ShotDecisionEngine />
      </Reveal>

      {/* 06 — DIRECTOR'S STUDIO */}
      <Reveal variant="fade-up">
        <DirectorsStudioDemo />
      </Reveal>

      {/* 07 — MODEL INTELLIGENCE */}
      <section className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <div className="rounded-3xl border border-white/[0.08] bg-neutral-900/80 p-8 sm:p-12 shadow-2xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">
                  MODEL INTELLIGENCE
                </span>
                <h2 className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">
                  Don&apos;t ask which AI is best.
                  <br />
                  <span className="font-serif italic font-normal text-amber-200">Ask which one fits the shot.</span>
                </h2>
                <p className="mt-4 max-w-2xl text-sm sm:text-base text-neutral-400 leading-relaxed font-sans">
                  Compare engines by camera control, motion fidelity, consistency, references, physics and real production use cases.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/categories/video" className="rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition">
                  Explore Video Models →
                </Link>
                <Link href="/compare" className="rounded-xl border border-white/15 px-5 py-3 text-xs font-semibold text-neutral-200 hover:border-amber-400/40 transition">
                  Head-to-Head Comparisons
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 08 — TOOL INTELLIGENCE DOSSIERS */}
      <section id="tools" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Intelligence Dossiers"
            title="The filmmaker&apos;s AI stack."
            description="A curated sample of the tool intelligence layer. The full directory lives in Tools."
            viewAllHref="/tools"
            viewAllLabel={`View all ${toolsData.length} Tools`}
          />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* 09 — PRODUCTION CASE STUDIES */}
      <section id="stories" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Production Case Studies"
            title="See the decisions behind the result."
            description="Real production breakdowns of how creative intent becomes an executable multi-model workflow."
            viewAllHref="/stories"
            viewAllLabel="View all Stories"
          />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredStories.map((story) => (
              <div key={story.id} className="rounded-3xl border border-white/[0.08] bg-neutral-900/60 p-6 sm:p-8 flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">{story.genre}</span>
                    <span className="text-xs font-mono text-neutral-500">{story.runtime}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition">
                    <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{story.summary}</p>
                </div>
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-mono">{story.director}</span>
                  <Link href={`/stories/${story.slug}`} className="text-amber-400 font-mono font-medium hover:underline">Read Shot Breakdown →</Link>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 10 — PRO VAULT */}
      <section id="vault" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-neutral-900/90 p-8 sm:p-12 shadow-2xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">PRO VAULT</span>
                <h2 className="mt-2 max-w-2xl text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif">
                  Keep the intelligence behind the shot.
                </h2>
                <p className="mt-4 max-w-2xl text-sm text-neutral-400 leading-relaxed font-sans">
                  Save directorial recipes, references, model translations and repeatable production decisions.
                </p>
              </div>
              <Link href="/vault" className="rounded-xl bg-amber-400 px-6 py-3 text-xs sm:text-sm font-bold text-neutral-950 hover:bg-amber-300 transition shrink-0">
                Explore The Vault →
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["01", "Directorial Vision"],
                ["02", "Physical Optics"],
                ["03", "Engine Translation"],
                ["04", "Production Memory"],
              ].map(([n, title]) => (
                <div key={n} className="rounded-2xl border border-white/[0.08] bg-black/40 p-5">
                  <span className="font-mono text-amber-400 font-bold text-sm">{n}</span>
                  <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 11 — EXPLORE CREATOR INTEL */}
      <section className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Explore Creator Intel"
            title="Go deeper when the production needs it."
            description="The homepage stays focused. The specialist tools, research and publishing intelligence live one click away."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["PROMPTS", "Build and refine production recipes.", "/prompts"],
              ["COMPARE", "Understand model trade-offs by scenario.", "/compare"],
              ["WORKFLOWS", "Run repeatable production pipelines.", "/workflows"],
              ["RESEARCH", "Go deeper into films, techniques and references.", "/research"],
              ["FESTIVALS", "Track submission intelligence and delivery requirements.", "/festivals"],
              ["JOURNAL", "Read essays, benchmarks and creator notes.", "/blog"],
              ["VIDEOS", "Watch masterclasses and production breakdowns.", "/videos"],
              ["TOOLS", "Browse the full filmmaker AI intelligence stack.", "/tools"],
            ].map(([title, copy, href]) => (
              <Link key={title} href={href} className="group rounded-2xl border border-white/[0.08] bg-neutral-900/60 p-5 hover:border-amber-400/40 transition">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">{title}</span>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400 group-hover:text-neutral-200 transition font-sans">{copy}</p>
                <span className="mt-4 inline-block text-[10px] font-mono text-neutral-600 group-hover:text-amber-400 transition">OPEN →</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 12 — FINAL CTA */}
      <Reveal variant="fade-up">
        <FinalFrame />
      </Reveal>

      <AdSlot slotId="home-bottom" label="Production Intelligence Sponsor" />
      <Footer />
    </main>
  );
}
