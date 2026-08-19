import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { VideoHubHero } from "@/components/video-hub-hero";
import { VideoShotAdvisor } from "@/components/video-shot-advisor";
import { VideoEngineMatrix } from "@/components/video-engine-matrix";
import { ToolCard, PromptCard, EditorialCard, VideoCard, WorkflowCard } from "@/components/ui-cards";
import {
  categoriesData,
  toolsData,
  promptsData,
  tutorialsData,
  workflowsData,
  videoEnginesData,
  blogsData,
  videosData,
} from "@/data/platform-data";
import { getCategoryBySlug } from "@/data/content";

export async function generateStaticParams() {
  return categoriesData.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Category Not Found" };

  if (slug === "video") {
    return {
      title: "AI Video Generation Intelligence Hub — Creator by Amusemac",
      description:
        "Director-level comparison of AI video engines: Runway Gen-3 Alpha, Kling AI, Google Veo, Luma Dream Machine, MiniMax, Wan 2.1, and Flux animation pipelines.",
      openGraph: {
        title: "AI Video Generation Intelligence Hub — Creator by Amusemac",
        description:
          "Cinematic shot direction, diffusion models, transformer engines, camera syntax, and physics adherence for visual storytellers.",
      },
    };
  }

  return {
    title: `${cat.name} AI Tools & Workflows — Creator by Amusemac`,
    description: cat.description,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);

  if (!cat) {
    notFound();
  }

  const isVideoHub = slug.toLowerCase() === "video";

  const categoryTools = toolsData.filter(
    (t) => t.category.toLowerCase() === cat.slug.toLowerCase()
  );

  const categoryPrompts = promptsData.filter(
    (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
  );

  const categoryTutorials = tutorialsData.filter(
    (tut) =>
      tut.category.toLowerCase().includes(cat.slug.toLowerCase()) ||
      tut.requiredToolIds.some((id) => categoryTools.some((t) => t.id === id))
  );

  const categoryWorkflows = workflowsData.filter(
    (wf) =>
      wf.category.toLowerCase().includes(cat.slug.toLowerCase()) ||
      wf.steps.some((s) =>
        s.recommendedToolIds.some((id) => categoryTools.some((t) => t.id === id))
      )
  );

  const relatedBlogs = blogsData.filter(
    (b) =>
      b.tags.some((tag) => tag.toLowerCase().includes(cat.slug.toLowerCase())) ||
      b.category.toLowerCase().includes(cat.slug.toLowerCase())
  );

  const relatedVideos = videosData.filter(
    (v) =>
      v.category.toLowerCase().includes(cat.slug.toLowerCase()) ||
      v.tags.some((tag) => tag.toLowerCase().includes(cat.slug.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Flagship Video Hub or Standard Category Header */}
      {isVideoHub ? (
        <VideoHubHero
          engineCount={videoEnginesData.length}
          verifiedDate="August 2026"
        />
      ) : (
        <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
          <div className="shell">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tertiary mb-6">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-primary transition-colors">
                Categories
              </Link>
              <span>/</span>
              <span className="text-secondary">{cat.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl text-primary font-mono">{cat.icon}</span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {cat.badge}
                </span>
                <h1 className="mt-2 text-3xl sm:text-5xl font-semibold text-primary tracking-tight">
                  {cat.name}
                </h1>
              </div>
            </div>

            <p className="mt-4 text-base sm:text-lg text-secondary max-w-3xl leading-relaxed font-normal">
              {cat.description}
            </p>
          </div>
        </div>
      )}

      <div className="shell py-14 space-y-20">
        {/* If Video Hub: Render Shot Advisor & Multi-Dimensional Matrix */}
        {isVideoHub && (
          <>
            <VideoShotAdvisor />
            <VideoEngineMatrix engines={videoEnginesData} />
          </>
        )}

        {/* Tools Section */}
        {categoryTools.length > 0 && (
          <section>
            <SectionHeading
              label="Curated Stack"
              title={isVideoHub ? "Primary Video Tool Suites" : `Top ${cat.name} Tools`}
              description="Evaluated for real production quality, control, and reliability."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Prompts Section */}
        {categoryPrompts.length > 0 && (
          <section>
            <SectionHeading
              label="Prompt Recipes"
              title={isVideoHub ? "Cinematic Video Prompts" : `Tested ${cat.name} Prompts`}
              description="Production-ready prompts with customizable variables and model settings."
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryPrompts.map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          </section>
        )}

        {/* Workflows & Tutorials */}
        {(categoryWorkflows.length > 0 || categoryTutorials.length > 0) && (
          <section>
            <SectionHeading
              label="Production Systems"
              title="Workflows & Guides"
              description="End-to-end pipelines utilizing this domain."
            />

            <div className="grid gap-6 sm:grid-cols-2">
              {categoryWorkflows.map((wf) => (
                <WorkflowCard key={wf.id} workflow={wf} />
              ))}
              {categoryTutorials.map((tut) => (
                <Link
                  key={tut.id}
                  href={`/tutorials/${tut.slug}`}
                  className="surface surface-hover p-6 block group"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    Tutorial Guide
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-primary group-hover:text-accent transition-colors">
                    {tut.title}
                  </h3>
                  <p className="mt-2 text-xs text-secondary line-clamp-2">{tut.goal}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Masterclasses & Articles */}
        {(relatedVideos.length > 0 || relatedBlogs.length > 0) && (
          <section>
            <SectionHeading
              label="Media & Masterclasses"
              title="Production Breakdowns & Analysis"
              description="Deep dives and video breakdowns on model capabilities."
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedVideos.map((vid) => (
                <VideoCard key={vid.id} video={vid} />
              ))}

              {relatedBlogs.map((blog) => (
                <EditorialCard key={blog.id} post={blog} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
