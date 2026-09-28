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

      {/* 01 — POSITIONING: THE INTELLIGENCE LAYER */}
      <Hero />

      {/* 02 — THE PROBLEM: FILMMAKING IS NOW A FRAGMENTED AI STACK */}
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
                ChatGPT for the idea. Midjourney for the frame. Kling for motion. Runway for another shot. ElevenLabs for voice. Then Premiere to make sense of it all.
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

      {/* 03 — THE NEW MODEL: CREATOR INTEL AS THE INTELLIGENCE LAYER */}
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
                  Creator Intel sits above the AI filmmaking stack. It helps you decide what to research, how to direct the shot, which engine fits the job, and how to translate the decision into an executable workflow.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/prompts/factory" className="rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition">
                    Try Director&apos;s Studio →
                  </Link>
                  <Link href="/compare" className="rounded-xl border border-white/15 bg-white/[0.03] px-5 py-3 text-xs font-semibold text-neutral-200 hover:border-amber-400/40 hover:text-white transition">
                    Compare AI Models
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-black/45 p-5 sm:p-7">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">CREATOR INTEL OS</span>
                  <span className="flex items-center gap-2 text-[10px] font-mono text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> INTELLIGENCE ACTIVE</span>
                </div>
                <div className="space-y-2">
                  {[
                    ["01", "RESEARCH", "References, films, techniques, visual lineage"],
                    ["02", "DIRECT", "Lens, camera, light, blocking, movement"],
                    ["03", "VISUALIZE", "Shot design and production-ready prompt"],
                    ["04", "GENERATE", "Model-specific translation for the right engine"],
                    ["05", "REFINE", "Compare, diagnose, iterate, finish"],
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

      {/* 04 — DIRECTOR'S WORKFLOW */}
      <section className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="The Intelligence Workflow"
            title="From idea to executable shot."
            description="A filmmaker-first workflow that turns creative intent into research, directorial decisions, model selection, generation and refinement."
          />
          <div className="grid gap-3 sm:grid-cols-5">
            {[
              ["01", "IDEA", "What are you trying to make?"],
              ["02", "RESEARCH", "What visual language supports it?"],
              ["03", "DIRECT", "How should the shot actually work?"],
              ["04", "GENERATE", "Which engine can execute it?"],
              ["05", "REFINE", "What changes get you closer?"],
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

      {/* 05 — INTERACTIVE PROOF */}
      <Reveal variant="fade-up">
        <CinematicViewfinder />
      </Reveal>
      <Reveal variant="fade-up">
        <IntentDeck />
      </Reveal>
      <Reveal variant="fade-up">
        <DirectorsStudioDemo />
      </Reveal>

      {/* 06 — WHAT THE INTELLIGENCE ACTUALLY CONNECTS */}
      <Reveal variant="fade-up">
        <KnowledgeCanvas />
      </Reveal>
      <Reveal variant="fade-up">
        <EightMindsMatrix />
      </Reveal>
      <Reveal variant="fade-up">
        <DirectorsDesk />
      </Reveal>

      {/* 07 — MODEL INTELLIGENCE */}
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
                  Compare engines by camera control, motion fidelity, consistency, references, physics and actual production use cases.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/categories/video" className="rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition">
                  Explore Video Hub →
                </Link>
                <Link href="/compare" className="rounded-xl border border-white/15 px-5 py-3 text-xs font-semibold text-neutral-200 hover:border-amber-400/40 transition">
                  Head-to-Head
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 08 — TOOLS */}
      <section id="tools" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Intelligence Dossiers"
            title="The filmmaker&apos;s AI stack."
            description="Production tools evaluated for real creative workflows — not just another AI tools directory."
            viewAllHref="/tools"
            viewAllLabel={`View all ${toolsData.length} Tools`}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool, index) => <ToolCard key={tool.id} tool={tool} index={index} />)}
          </div>
        </Reveal>
      </section>

      {/* 09 — PROOF / STORIES */}
      <section id="stories" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Production Case Studies"
            title="See the decisions behind the result."
            description="Deconstructed multi-model workflows and shot-by-shot production intelligence."
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

      {/* 10 — VAULT / VALUE */}
      <section id="why-vault" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <div className="surface p-8 sm:p-12 relative overflow-hidden bg-neutral-900/90 rounded-3xl border border-amber-400/30 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">PRO VAULT</span>
                <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white font-serif">Keep the intelligence behind the shot.</h2>
              </div>
              <Link href="/vault" className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 hover:bg-amber-300 transition shrink-0">Explore The Vault →</Link>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
              {[
                ["01", "Directorial Vision", "Narrative intent, character emotion and motivated visual tone."],
                ["02", "Physical Optics", "Focal length, camera movement, lighting and visual language."],
                ["03", "Engine Translation", "Turn the creative decision into model-specific instructions."],
                ["04", "Production Memory", "Save recipes, projects, references and repeatable workflows."],
              ].map(([n, title, copy]) => (
                <div key={n} className="rounded-2xl border border-white/[0.08] bg-black/40 p-5">
                  <span className="font-mono text-amber-400 font-bold text-sm">{n}</span>
                  <h3 className="mt-3 font-bold text-white">{title}</h3>
                  <p className="mt-2 text-neutral-400 leading-relaxed">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* 11 — PROMPTS / COMPARISONS / WORKFLOWS */}
      <section id="prompts" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading label="Prompt Architecture" title="Recipes, comparisons and repeatable workflows." description="Move from a directorial decision to an executable production recipe." viewAllHref="/prompts" viewAllLabel={`Explore ${promptsData.length} Prompts`} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPrompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)}
          </div>
        </Reveal>
      </section>

      <section id="compare" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading label="Decision Engine" title="Head-to-head intelligence." description="Scenario-based comparisons that help you understand the trade-offs between models and tools." viewAllHref="/compare" viewAllLabel="All Comparisons" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredComparisons.map((comp) => <ComparisonCard key={comp.id} comparison={comp} />)}
          </div>
        </Reveal>
      </section>

      <section id="workflows" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading label="Pipeline Blueprints" title="Production workflows you can actually run." description="Step-by-step recipes from concept and master image generation to motion synthesis and post finishing." viewAllHref="/workflows" viewAllLabel="All Workflows" />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredWorkflows.map((wf) => <WorkflowCard key={wf.id} workflow={wf} />)}
          </div>
        </Reveal>
      </section>

      {/* 12 — FESTIVAL + JOURNAL */}
      <section id="festivals" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading label="Festival Intelligence" title="From production to submission." description="Verified festival information, deadlines, competition rules and delivery intelligence." viewAllHref="/festivals" viewAllLabel="All Film Festivals" />
          <div className="grid gap-6 md:grid-cols-3">
            {upcomingFestivals.map((fest) => (
              <div key={fest.id} className="rounded-2xl border border-white/[0.08] bg-neutral-900/60 p-6 flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">{fest.hostCity}</span>
                    <span className="text-xs font-mono text-rose-400 font-medium">Due: {fest.deadline.split(",")[0]}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{fest.name}</h3>
                  <p className="text-xs text-neutral-400">{fest.prizes}</p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center text-xs">
                  <span className="text-neutral-500 font-mono">Season {fest.seasonYear}</span>
                  <Link href="/festivals" className="text-amber-400 font-mono font-medium hover:underline">Rules & Checklist →</Link>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="media" className="shell py-20 sm:py-24 border-t border-white/[0.06]">
        <Reveal variant="fade-up">
          <SectionHeading label="Media & Essays" title="Keep learning between productions." description="Technical essays, benchmark dissections and director walkthroughs." viewAllHref="/blog" viewAllLabel="Read All Essays" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">Creator Journal</span>
                <Link href="/blog" className="text-xs font-mono text-amber-400 hover:underline">View Journal →</Link>
              </div>
              {latestBlogs.map((post) => <EditorialCard key={post.id} post={post} />)}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400">Video Masterclasses</span>
                <Link href="/videos" className="text-xs font-mono text-amber-400 hover:underline">View Masterclasses →</Link>
              </div>
              <div className="grid gap-4">
                {latestVideos.map((video) => <VideoCard key={video.id} video={video} />)}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 13 — TIMELINE / FINAL CTA */}
      <Reveal variant="fade-up">
        <TimelineTransition />
      </Reveal>
      <Reveal variant="fade-up">
        <FinalFrame />
      </Reveal>

      <AdSlot slotId="home-bottom" label="Production Intelligence Sponsor" />
      <Footer />
    </main>
  );
}
