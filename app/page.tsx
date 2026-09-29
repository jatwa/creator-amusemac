import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { CinematicViewfinder } from "@/components/cinematic/cinematic-viewfinder";
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

      {/* 01 — ENTRY */}
      <Hero />

      {/* 02 — THE PROBLEM */}
      <section className="shell py-20 sm:py-28 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-400">
                THE PROBLEM
              </span>
              <h2 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
                More AI tools.
                <br />
                <span className="font-serif italic font-normal text-amber-200">
                  More decisions.
                </span>
              </h2>
              <p className="mt-6 max-w-2xl text-base sm:text-lg text-neutral-400 leading-relaxed">
                Your creative process is spread across models, generators, research tabs and editing tools. The hard part is no longer finding another tool — it is deciding what the shot actually needs.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-neutral-900/70 p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  THE OLD STACK
                </span>
                <span className="text-[10px] font-mono text-red-400">FRAGMENTED</span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["IDEA", "RESEARCH", "IMAGE", "VIDEO", "VOICE", "EDIT"].map((item, i) => (
                  <div key={item} className="rounded-xl border border-white/[0.07] bg-black/40 p-4">
                    <span className="text-[10px] font-mono text-neutral-500">0{i + 1}</span>
                    <p className="mt-2 text-sm font-semibold text-neutral-200">{item}</p>
                    <p className="mt-1 text-[10px] font-mono text-neutral-600">NEW TAB</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 03 — THE NEW MODEL */}
      <section className="shell pb-20 sm:pb-28">
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.09] via-neutral-900 to-neutral-950 p-8 sm:p-12">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/[0.08] blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-amber-400">
                  THE NEW MODEL
                </span>
                <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white">
                  One intelligence layer.
                  <br />
                  <span className="font-serif italic font-normal text-amber-200">
                    Your tools stay yours.
                  </span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                  Creator Intel connects research, directorial intent, shot design, model selection and refinement before you commit to a generation.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/prompts/factory" className="rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition">
                    Enter Director&apos;s Studio →
                  </Link>
                  <Link href="/compare" className="rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-xs font-semibold text-neutral-200 hover:border-amber-400/40 hover:text-white transition">
                    Compare Models
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-5 sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">CREATOR INTEL OS</span>
                  <span className="flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> INTELLIGENCE ACTIVE
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    ["01", "RESEARCH", "References, films, techniques"],
                    ["02", "DIRECT", "Lens, camera, light, movement"],
                    ["03", "VISUALIZE", "Shot design and production intent"],
                    ["04", "GENERATE", "Model-specific execution"],
                    ["05", "REFINE", "Compare, diagnose, iterate"],
                  ].map(([n, title, copy]) => (
                    <div key={n} className="grid grid-cols-[32px_100px_1fr] items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3">
                      <span className="text-[10px] font-mono text-amber-400">{n}</span>
                      <span className="text-[11px] font-bold tracking-wide text-white">{title}</span>
                      <span className="hidden sm:block text-[11px] text-neutral-500">{copy}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 04 — THE CORE WORKFLOW */}
      <section className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="The Intelligence Workflow"
            title="From idea to executable shot."
            description="The core loop: understand the intent, make the creative decision, choose the right engine, then refine the result."
          />
          <div className="grid gap-3 sm:grid-cols-5">
            {[
              ["01", "IDEA", "What are you trying to make?"],
              ["02", "RESEARCH", "What visual language supports it?"],
              ["03", "DIRECT", "How should the shot work?"],
              ["04", "GENERATE", "Which engine can execute it?"],
              ["05", "REFINE", "What gets you closer?"],
            ].map(([n, title, copy]) => (
              <div key={n} className="relative rounded-2xl border border-white/[0.08] bg-neutral-900/60 p-5">
                <span className="text-[10px] font-mono text-amber-400">{n}</span>
                <h3 className="mt-3 text-base font-bold text-white">{title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">{copy}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 05 — PRODUCT PROOF */}
      <Reveal variant="fade-up">
        <CinematicViewfinder />
      </Reveal>
      <Reveal variant="fade-up">
        <DirectorsStudioDemo />
      </Reveal>

      {/* 06 — MODEL INTELLIGENCE */}
      <section className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <div className="rounded-3xl border border-white/[0.08] bg-neutral-900/80 p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                  MODEL INTELLIGENCE
                </span>
                <h2 className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-white">
                  Don&apos;t ask which AI is best.
                  <br />
                  <span className="font-serif italic font-normal text-amber-200">Ask which one fits the shot.</span>
                </h2>
                <p className="mt-4 max-w-2xl text-sm sm:text-base text-neutral-400 leading-relaxed">
                  Compare engines by camera control, motion fidelity, consistency, references, physics and real production use cases.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/categories/video" className="rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition">
                  Explore Video Models →
                </Link>
                <Link href="/compare" className="rounded-xl border border-white/15 px-5 py-3 text-xs font-semibold text-neutral-200 hover:border-amber-400/40 transition">
                  Head-to-Head
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 07 — TOOL INTELLIGENCE */}
      <section id="tools" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Intelligence Dossiers"
            title="The filmmaker&apos;s AI stack."
            description="A small sample of the tool intelligence layer. The full directory lives in Tools."
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

      {/* 08 — PROOF */}
      <section id="stories" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Production Case Studies"
            title="See the decisions behind the result."
            description="Two examples of how creative intent becomes an executable multi-model workflow."
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

      {/* 09 — PRO VAULT */}
      <section id="vault" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-neutral-900/90 p-8 sm:p-12 shadow-2xl">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">PRO VAULT</span>
                <h2 className="mt-2 max-w-2xl text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif">
                  Keep the intelligence behind the shot.
                </h2>
                <p className="mt-4 max-w-2xl text-sm text-neutral-400 leading-relaxed">
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

      {/* 10 — EXPLORE THE REST */}
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
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">{title}</span>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400 group-hover:text-neutral-200 transition">{copy}</p>
                <span className="mt-4 inline-block text-[10px] font-mono text-neutral-600 group-hover:text-amber-400 transition">OPEN →</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 11 — FINAL CTA */}
      <Reveal variant="fade-up">
        <FinalFrame />
      </Reveal>

      <AdSlot slotId="home-bottom" label="Production Intelligence Sponsor" />
      <Footer />
    </main>
  );
}
