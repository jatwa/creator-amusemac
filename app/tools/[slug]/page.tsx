import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import {
  toolsData,
  promptsData,
  comparisonsData,
  tutorialsData,
  workflowsData,
} from "@/data/platform-data";
import { getToolBySlug, getToolById } from "@/data/content";
import { db } from "@/lib/db/repository";

export async function generateStaticParams() {
  return toolsData.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };

  return {
    title: `${tool.name} Creator Dossier | Creator by Amusemac`,
    description: tool.overview.slice(0, 160),
    openGraph: {
      title: `${tool.name} — AI Tool Review & Workflows for Creators`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Linked entities
  const competitors = tool.competitorIds
    .map((id) => getToolById(id))
    .filter(Boolean);

  const comparisons = comparisonsData.filter(
    (c) => c.toolAId === tool.id || c.toolBId === tool.id
  );

  const recommendedPrompts = promptsData.filter((p) =>
    tool.recommendedPromptIds.includes(p.id) || p.compatibleToolIds.includes(tool.id)
  );

  const linkedTutorials = tutorialsData.filter((tut) =>
    tool.tutorialIds.includes(tut.id) || tut.requiredToolIds.includes(tool.id)
  );

  const linkedWorkflows = workflowsData.filter((wf) =>
    tool.workflowIds.includes(wf.id) ||
    wf.steps.some((s) => s.recommendedToolIds.includes(tool.id))
  );

  const relatedBlogs = db.getRelatedBlogsForTool(tool.id);
  const relatedVideos = db.getRelatedVideosForTool(tool.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    applicationCategory: tool.category,
    operatingSystem: tool.platforms.join(", "),
    offers: {
      "@type": "Offer",
      price: tool.pricing.startingPrice ? tool.pricing.startingPrice.replace(/[^0-9.]/g, "") : "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tool.rating || 4.8,
      ratingCount: 42,
    },
  };

  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Hero Header */}
      <div className="border-b border-line bg-panel/50 py-12 sm:py-16">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-lime">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-lime">Tools</Link>
            <span>/</span>
            <span className="text-white">{tool.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
                  {tool.category.toUpperCase()}
                </span>
                <span className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs text-zinc-300">
                  {tool.pricing.model.toUpperCase()}
                </span>
                <span className="text-xs text-zinc-400">
                  Verified: {tool.verifiedAt}
                </span>
              </div>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {tool.name}
              </h1>

              <p className="mt-2 text-lg text-zinc-300">
                {tool.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={tool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-lime px-6 py-3 text-sm font-semibold text-black transition hover:bg-white flex items-center gap-2"
              >
                <span>Visit official site</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main 2-Column Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section className="surface p-8">
              <h2 className="text-xl font-bold text-white">Creator Overview</h2>
              <p className="mt-4 text-base leading-7 text-zinc-300">
                {tool.overview}
              </p>

              <div className="mt-6 rounded-xl border border-line bg-black/30 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-lime">Best For</p>
                <p className="mt-1 text-sm font-medium text-white">{tool.bestFor}</p>
              </div>
            </section>

            {/* Key Features */}
            <section className="surface p-8">
              <h2 className="text-xl font-bold text-white">Key Capabilities & Features</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {tool.keyFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-lg border border-line bg-black/20 p-3.5 text-sm text-zinc-300">
                    <span className="text-lime font-bold">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Pros & Cons */}
            <section className="grid gap-6 sm:grid-cols-2">
              <div className="surface p-6 border-emerald-500/20">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  Production Strengths
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
                  {tool.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">+</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface p-6 border-amber-500/20">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
                  Production Trade-offs
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-zinc-300">
                  {tool.weaknesses.map((weak, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">-</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Recommended Prompts for this Tool */}
            {recommendedPrompts.length > 0 && (
              <section className="surface p-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">
                    Recommended Prompt Recipes for {tool.name}
                  </h2>
                  <Link href="/prompts" className="text-xs text-lime hover:underline">
                    View all prompts →
                  </Link>
                </div>

                <div className="mt-6 space-y-4">
                  {recommendedPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="rounded-xl border border-line bg-black/30 p-5 transition hover:border-zinc-500"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-lime uppercase">
                          {prompt.useCase}
                        </span>
                        <Link
                          href={`/prompts/${prompt.slug}`}
                          className="text-xs font-medium text-lime hover:underline"
                        >
                          Customize recipe →
                        </Link>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-white">
                        {prompt.title}
                      </h3>
                      <p className="mt-3 rounded-lg border border-zinc-800 bg-black/60 p-3 text-xs font-mono text-zinc-300">
                        {prompt.promptText}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Head-to-Head Comparisons */}
            {comparisons.length > 0 && (
              <section className="surface p-8">
                <h2 className="text-xl font-bold text-white">Head-to-Head Comparisons</h2>
                <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-black/20 overflow-hidden">
                  {comparisons.map((c) => {
                    const opponentId = c.toolAId === tool.id ? c.toolBId : c.toolAId;
                    const opponent = getToolById(opponentId);
                    return (
                      <div key={c.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-xs text-lime font-semibold uppercase">{c.category}</p>
                          <h3 className="text-base font-bold text-white mt-1">
                            {tool.name} vs {opponent?.name || "Competitor"}
                          </h3>
                          <p className="mt-1 text-xs text-zinc-400">{c.summaryVerdict}</p>
                        </div>
                        <Link
                          href={`/compare/${c.slug}`}
                          className="rounded-lg border border-line bg-ink px-4 py-2 text-xs font-semibold text-lime hover:border-lime transition shrink-0"
                        >
                          Read breakdown →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Linked Workflows & Tutorials */}
            {(linkedWorkflows.length > 0 || linkedTutorials.length > 0) && (
              <section className="surface p-8">
                <h2 className="text-xl font-bold text-white">Production Workflows & Guides</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {linkedWorkflows.map((wf) => (
                    <Link
                      key={wf.id}
                      href={`/workflows/${wf.slug}`}
                      className="rounded-xl border border-line bg-black/20 p-5 transition hover:border-lime"
                    >
                      <span className="text-xs font-semibold uppercase text-lime">Workflow Pipeline</span>
                      <h3 className="mt-2 text-sm font-bold text-white">{wf.title}</h3>
                      <p className="mt-2 text-xs text-zinc-400">{wf.summary.slice(0, 100)}...</p>
                    </Link>
                  ))}
                  {linkedTutorials.map((tut) => (
                    <Link
                      key={tut.id}
                      href={`/tutorials/${tut.slug}`}
                      className="rounded-xl border border-line bg-black/20 p-5 transition hover:border-lime"
                    >
                      <span className="text-xs font-semibold uppercase text-lime">Editorial Tutorial</span>
                      <h3 className="mt-2 text-sm font-bold text-white">{tut.title}</h3>
                      <p className="mt-2 text-xs text-zinc-400">{tut.goal.slice(0, 100)}...</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Editorial Articles & Video Breakdowns */}
            {(relatedBlogs.length > 0 || relatedVideos.length > 0) && (
              <section className="space-y-6">
                <h2 className="text-xl font-bold text-white">Editorial Insights &amp; Video Masterclasses</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedBlogs.map((b) => (
                    <Link
                      key={b.id}
                      href={`/blog/${b.slug}`}
                      className="surface p-5 transition hover:border-lime block"
                    >
                      <span className="text-[11px] font-mono font-bold uppercase text-lime">Analysis</span>
                      <h3 className="mt-2 text-sm font-bold text-white leading-snug">{b.title}</h3>
                      <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{b.excerpt}</p>
                      <p className="mt-3 text-[11px] text-zinc-500 font-mono">By {b.author.name} • {b.readingTime}</p>
                    </Link>
                  ))}
                  {relatedVideos.map((v) => (
                    <Link
                      key={v.id}
                      href={`/videos/${v.slug}`}
                      className="surface p-5 transition hover:border-lime block"
                    >
                      <span className="text-[11px] font-mono font-bold uppercase text-lime">▶ Video Breakdown</span>
                      <h3 className="mt-2 text-sm font-bold text-white leading-snug">{v.title}</h3>
                      <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{v.description}</p>
                      <p className="mt-3 text-[11px] text-zinc-500 font-mono">By {v.creator.name} • {v.duration}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Specs & Pricing */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-lime">
                Pricing & Licensing
              </h3>
              <div className="mt-4">
                <p className="text-3xl font-bold text-white">
                  {tool.pricing.startingPrice || "Free"}
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  Pricing model: {tool.pricing.model}
                </p>
              </div>

              {tool.pricing.freeTierDetails && (
                <div className="mt-4 rounded-lg border border-line bg-black/30 p-3 text-xs">
                  <p className="font-semibold text-zinc-300">Free Tier:</p>
                  <p className="text-zinc-400 mt-0.5">{tool.pricing.freeTierDetails}</p>
                </div>
              )}

              {tool.pricing.subscriptionInfo && (
                <div className="mt-3 text-xs text-zinc-400 leading-5">
                  <p className="font-semibold text-zinc-300">Subscription Plans:</p>
                  <p>{tool.pricing.subscriptionInfo}</p>
                </div>
              )}

              <div className="mt-4 border-t border-line/60 pt-3 text-xs">
                <span className="text-zinc-500">Commercial Rights: </span>
                <span className="text-white font-medium">{String(tool.pricing.commercialUse)}</span>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="surface p-6 space-y-4 text-xs">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-lime">
                Technical Specifications
              </h3>

              <div>
                <p className="text-zinc-500">Supported AI Models / Engines:</p>
                <p className="mt-1 font-medium text-white">
                  {tool.supportedModels?.join(", ") || "Proprietary Cloud Model"}
                </p>
              </div>

              <div>
                <p className="text-zinc-500">Supported Platforms:</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {tool.platforms.map((plat) => (
                    <span
                      key={plat}
                      className="rounded border border-line bg-black/40 px-2 py-0.5 text-zinc-300"
                    >
                      {plat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-zinc-500">Subcategories:</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {tool.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="rounded border border-line bg-black/40 px-2 py-0.5 text-zinc-400"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-line/60 pt-3">
                <p className="text-zinc-500">Last Verified Date:</p>
                <p className="font-medium text-white">{tool.verifiedAt}</p>
              </div>
            </div>

            {/* Direct Competitors */}
            {competitors.length > 0 && (
              <div className="surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-lime">
                  Direct Alternatives
                </h3>
                <div className="mt-4 space-y-3">
                  {competitors.map((comp) => (
                    <Link
                      key={comp?.id}
                      href={`/tools/${comp?.slug}`}
                      className="flex items-center justify-between rounded-lg border border-line bg-black/20 p-3 transition hover:border-lime"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{comp?.name}</p>
                        <p className="text-[11px] text-zinc-500">{comp?.bestFor.split(",")[0]}</p>
                      </div>
                      <span className="text-xs text-lime">View →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
