import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard, PromptCard, EditorialCard, VideoCard, ComparisonCard, WorkflowCard } from "@/components/ui-cards";
import { CategoryGrid } from "@/components/category-grid";
import { toolsData, promptsData, comparisonsData, workflowsData } from "@/data/platform-data";
import { db } from "@/lib/db/repository";

export default function Home() {
  const featuredTools = toolsData.slice(0, 3);
  const featuredPrompts = promptsData.slice(0, 3);
  const featuredComparisons = comparisonsData.slice(0, 3);
  const featuredWorkflows = workflowsData.slice(0, 2);
  const latestBlogs = db.getPublishedBlogs().slice(0, 2);
  const latestVideos = db.getPublishedVideos().slice(0, 2);

  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />
      <Hero />

      {/* STAGE 1: CREATIVE INTENT & DOMAINS */}
      <section id="categories" className="shell py-16 sm:py-24 border-b border-line/60">
        <SectionHeading
          label="Domain Selection"
          title="What are you making?"
          description="Choose your creative discipline to explore curated tool stacks, prompt formulas, and production pipelines."
          viewAllHref="/categories"
          viewAllLabel="All Categories"
        />
        <CategoryGrid />
      </section>

      {/* STAGE 2: FLAGSHIP VIDEO GENERATION SPOTLIGHT BANNER */}
      <section className="shell py-12">
        <div className="surface p-8 sm:p-12 relative overflow-hidden border-lime/30 bg-gradient-to-r from-panel via-panel-hover to-zinc-950">
          <div className="absolute top-0 right-0 h-64 w-64 bg-lime/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-3 py-1 font-mono text-xs font-semibold text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulse" />
              FLAGSHIP INTELLIGENCE HUB
            </div>
            <h2 className="mt-4 text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Cinematic AI Video Generation Engine Matrix
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
              Compare 6 verified video engines including Runway Gen-3 Alpha, Kling AI 1.5, Google Veo, Luma Dream Machine, MiniMax, and Wan 2.1 across camera coordinate syntax, character persistence, and physics coherence.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/categories/video"
                className="rounded-full bg-lime px-6 py-2.5 text-xs sm:text-sm font-semibold text-black transition hover:bg-white"
              >
                Launch Video Hub →
              </Link>
              <Link
                href="/compare/runway-vs-kling"
                className="text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition"
              >
                Read Runway vs Kling Breakdown
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 3: CURATED TOOL INTELLIGENCE */}
      <section id="tools" className="shell py-16 sm:py-24 border-b border-line/60">
        <SectionHeading
          label="Intelligence Dossiers"
          title="Featured AI Production Tools"
          description="Audited without hype. Real capabilities, commercial pricing breakdown, and verified filmmaking use cases."
          viewAllHref="/tools"
          viewAllLabel={`View all ${toolsData.length} Tools`}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTools.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </section>

      {/* STAGE 4: PROMPT RECIPES & FORMULA LIBRARY */}
      <section id="prompts" className="shell py-16 sm:py-24 border-b border-line/60">
        <SectionHeading
          label="Prompt Formulas"
          title="Production-Tested Prompt Recipes"
          description="Structured prompts with variable placeholders engineered for cinematic framing, lens geometry, and lighting setups."
          viewAllHref="/prompts"
          viewAllLabel={`Explore ${promptsData.length} Prompts`}
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>

      {/* STAGE 5: VERDICT-FIRST COMPARISONS */}
      <section id="compare" className="shell py-16 sm:py-24 border-b border-line/60">
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
      </section>

      {/* STAGE 6: PRODUCTION WORKFLOWS */}
      <section id="workflows" className="shell py-16 sm:py-24 border-b border-line/60">
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
      </section>

      {/* STAGE 7: CREATOR JOURNAL & MASTERCLASSES */}
      <section id="media" className="shell py-16 sm:py-24">
        <SectionHeading
          label="Media & Essays"
          title="Creator Journal & Video Masterclasses"
          description="Technical essays, benchmark dissections, and director timeline walkthroughs."
          viewAllHref="/blog"
          viewAllLabel="Read All Essays"
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Journal Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-line/60">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime">
                Creator Journal
              </span>
              <Link href="/blog" className="text-xs text-zinc-400 hover:text-white transition">
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
            <div className="flex items-center justify-between pb-2 border-b border-line/60">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime">
                Video Masterclasses
              </span>
              <Link href="/videos" className="text-xs text-zinc-400 hover:text-white transition">
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
      </section>

      <Footer />
    </main>
  );
}
