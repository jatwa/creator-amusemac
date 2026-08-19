import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { VideoHubHero } from "@/components/video-hub-hero";
import { VideoShotAdvisor } from "@/components/video-shot-advisor";
import { VideoEngineMatrix } from "@/components/video-engine-matrix";
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
      title: "AI Video Generation Intelligence Hub | Creator by Amusemac",
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
    title: `${cat.name} AI Tools & Workflows | Creator by Amusemac`,
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
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      {/* Flagship Video Hub or Standard Category Header */}
      {isVideoHub ? (
        <VideoHubHero
          engineCount={videoEnginesData.length}
          verifiedDate="August 2026"
        />
      ) : (
        <div className="border-b border-line bg-panel/50 py-12 sm:py-16">
          <div className="shell">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-6">
              <Link href="/" className="hover:text-lime">
                Home
              </Link>
              <span>/</span>
              <Link href="/categories" className="hover:text-lime">
                Categories
              </Link>
              <span>/</span>
              <span className="text-white">{cat.name}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl text-lime font-mono">{cat.icon}</span>
              <div>
                <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-0.5 text-xs font-semibold text-lime">
                  {cat.badge}
                </span>
                <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-white">
                  {cat.name}
                </h1>
              </div>
            </div>

            <p className="mt-4 text-base text-zinc-300 max-w-3xl leading-7">
              {cat.description}
            </p>
          </div>
        </div>
      )}

      <div className="shell py-12 space-y-16">
        {/* If Video Hub: Render Shot Advisor & Multi-Dimensional Matrix First */}
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

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="surface p-6 transition hover:border-lime block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-lime uppercase">
                      {tool.subcategories[0]}
                    </span>
                    <span className="rounded bg-black/40 px-2 py-0.5 text-[11px] text-zinc-400 font-mono">
                      {tool.pricing.model}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-white group-hover:text-lime transition">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-400 line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Best for: {tool.bestFor.split(",")[0]}</span>
                    <span className="text-lime group-hover:underline">Dossier →</span>
                  </div>
                </Link>
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

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {categoryPrompts.map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.slug}`}
                  className="surface p-6 transition hover:border-lime block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-lime uppercase">
                      {p.useCase}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {p.variables.length} variables
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-lg font-bold text-white group-hover:text-lime transition">
                    {p.title}
                  </h3>
                  <p className="mt-3 rounded-lg border border-zinc-800 bg-black/40 p-3 font-mono text-xs text-zinc-300 line-clamp-2">
                    {p.promptText}
                  </p>
                </Link>
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

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {categoryWorkflows.map((wf) => (
                <Link
                  key={wf.id}
                  href={`/workflows/${wf.slug}`}
                  className="surface p-6 transition hover:border-lime block group"
                >
                  <span className="text-xs font-semibold text-lime uppercase">
                    Pipeline Blueprint
                  </span>
                  <h3 className="mt-2 text-base font-bold text-white group-hover:text-lime transition">
                    {wf.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400">{wf.summary}</p>
                </Link>
              ))}
              {categoryTutorials.map((tut) => (
                <Link
                  key={tut.id}
                  href={`/tutorials/${tut.slug}`}
                  className="surface p-6 transition hover:border-lime block group"
                >
                  <span className="text-xs font-semibold text-lime uppercase">
                    Editorial Tutorial
                  </span>
                  <h3 className="mt-2 text-base font-bold text-white group-hover:text-lime transition">
                    {tut.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400">{tut.goal}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Masterclasses & Articles */}
        {(relatedVideos.length > 0 || relatedBlogs.length > 0) && (
          <section>
            <SectionHeading
              label="Intelligence & Masterclasses"
              title="Video Production Breakdowns"
              description="Deep dives and video breakdowns on model capabilities."
            />

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedVideos.map((vid) => (
                <Link
                  key={vid.id}
                  href={`/videos/${vid.slug}`}
                  className="surface p-6 transition hover:border-lime block group"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-lime font-mono">▶ Video Masterclass</span>
                    <span>{vid.duration}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-white group-hover:text-lime transition">
                    {vid.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400 line-clamp-2">
                    {vid.description}
                  </p>
                </Link>
              ))}

              {relatedBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="surface p-6 transition hover:border-lime block group"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="text-lime font-mono">Editorial Deep Dive</span>
                    <span>{blog.readingTime}</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-white group-hover:text-lime transition">
                    {blog.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
