import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
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
import { CategoryGrid } from "@/components/category-grid";
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
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />
      <Hero />

      {/* STAGE 1: CREATIVE INTENT & DOMAINS */}
      <section id="categories" className="shell py-20 sm:py-28 border-t border-border-subtle">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Domain Selection"
            title="What are you making?"
            description="Choose your creative discipline to explore curated tool stacks, prompt formulas, and production pipelines."
            viewAllHref="/categories"
            viewAllLabel="All Categories"
          />
          <CategoryGrid />
        </Reveal>
      </section>

      {/* STAGE 2: FLAGSHIP VIDEO GENERATION SPOTLIGHT BANNER */}
      <section className="shell py-10">
        <Reveal variant="fade-up">
          <div className="surface p-8 sm:p-14 relative overflow-hidden bg-surface-elevated rounded-3xl border border-border shadow-subtle">
            <div className="relative z-10 max-w-3xl">
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold mb-3 block">
                Flagship Intelligence
              </span>
              <h2 className="text-2xl sm:text-4xl font-semibold tracking-tight text-primary leading-tight">
                Cinematic AI Video Generation Engine Matrix
              </h2>
              <p className="mt-4 text-sm sm:text-base text-secondary leading-relaxed font-normal">
                Compare verified video engines including Runway Gen-3 Alpha, Kling AI 1.5, Google Veo 2, Luma Dream Machine, MiniMax Hailuo, and Wan 2.1 across camera coordinate syntax, character persistence, and physics coherence.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/categories/video"
                  className="rounded-full bg-foreground px-6 py-2.5 text-xs sm:text-sm font-medium text-background transition-opacity hover:opacity-90 shadow-sm"
                >
                  Launch Video Hub →
                </Link>
                <Link
                  href="/compare/runway-vs-kling"
                  className="text-xs sm:text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  Read Runway vs Kling Breakdown
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* STAGE 3: CURATED TOOL INTELLIGENCE */}
      <section id="tools" className="shell py-20 sm:py-28 border-t border-border-subtle">
        <Reveal variant="fade-up">
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
        </Reveal>
      </section>

      {/* STAGE 4: PRODUCTION STORIES & CASE STUDIES */}
      <section id="stories" className="shell py-20 sm:py-28 border-t border-border-subtle">
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
                className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 flex flex-col justify-between space-y-4 hover:border-accent/40 transition group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                      {story.genre}
                    </span>
                    <span className="text-xs font-mono text-tertiary">{story.runtime}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-primary group-hover:text-accent transition">
                    <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                    {story.summary}
                  </p>
                </div>
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs">
                  <span className="text-tertiary font-mono">{story.director}</span>
                  <Link href={`/stories/${story.slug}`} className="text-accent font-medium hover:underline">
                    Read Shot Breakdown →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* STAGE 5: PROMPT RECIPES & FORMULA LIBRARY */}
      <section id="prompts" className="shell py-20 sm:py-28 border-t border-border-subtle">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Prompt Architecture"
            title="Prompt Factory &amp; Model Translator"
            description="Convert high-level creative concepts into model-specific syntax for Runway, Kling, Veo, Midjourney, and Flux."
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

      {/* STAGE 6: AI FILM FESTIVAL DIRECTORY SPOTLIGHT */}
      <section id="festivals" className="shell py-20 sm:py-28 border-t border-border-subtle">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Festival Intelligence"
            title="AI Film Festival Directory &amp; Deadlines"
            description="Verified international deadlines, competition rules, prize grants, and ethical AI disclosure guidelines."
            viewAllHref="/festivals"
            viewAllLabel="All Film Festivals"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {upcomingFestivals.map((fest) => (
              <div
                key={fest.id}
                className="surface rounded-2xl border border-border bg-surface p-6 flex flex-col justify-between space-y-4 shadow-subtle hover:border-accent/40 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                      {fest.hostCity}
                    </span>
                    <span className="text-xs font-mono text-rose-400 font-medium">
                      Due: {fest.deadline.split(",")[0]}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-primary">{fest.name}</h3>
                  <p className="text-xs text-secondary">{fest.prizes}</p>
                </div>
                <div className="pt-2 border-t border-border-subtle flex justify-between items-center text-xs">
                  <span className="text-tertiary font-mono">Season {fest.seasonYear}</span>
                  <Link href="/festivals" className="text-accent font-medium hover:underline">
                    Rules &amp; Checklist →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* STAGE 7: VERDICT-FIRST COMPARISONS */}
      <section id="compare" className="shell py-20 sm:py-28 border-t border-border-subtle">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Editorial Decisions"
            title="Model &amp; Tool Comparisons"
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

      {/* STAGE 8: PRODUCTION WORKFLOWS */}
      <section id="workflows" className="shell py-20 sm:py-28 border-t border-border-subtle">
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

      {/* STAGE 9: CREATOR JOURNAL & MASTERCLASSES */}
      <section id="media" className="shell py-20 sm:py-28 border-t border-border-subtle">
        <Reveal variant="fade-up">
          <SectionHeading
            label="Media &amp; Essays"
            title="Creator Journal &amp; Video Masterclasses"
            description="Technical essays, benchmark dissections, and director timeline walkthroughs."
            viewAllHref="/blog"
            viewAllLabel="Read All Essays"
          />

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Journal Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Creator Journal
                </span>
                <Link href="/blog" className="text-xs text-secondary hover:text-primary transition-colors">
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
              <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Video Masterclasses
                </span>
                <Link href="/videos" className="text-xs text-secondary hover:text-primary transition-colors">
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

      <AdSlot slotId="home-bottom" label="Production Intelligence Sponsor" />

      <Footer />
    </main>
  );
}
