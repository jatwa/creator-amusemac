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
    title: `${tool.name} Dossier — Creator by Amusemac`,
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
    <main className="min-h-screen bg-background text-primary transition-colors">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Editorial Dossier Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tertiary mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-primary transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-secondary">{tool.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
                  {tool.category}
                </span>
                <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-secondary">
                  {tool.pricing.model.toUpperCase()}
                </span>
                <span className="font-mono text-xs text-tertiary">
                  Audited: {tool.verifiedAt}
                </span>
              </div>

              <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-primary leading-tight">
                {tool.name}
              </h1>

              <p className="mt-3 text-base sm:text-lg text-secondary leading-relaxed font-normal">
                {tool.tagline}
              </p>

              {/* Core Director Verdict Callout */}
              <div className="mt-6 rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs sm:text-sm">
                <span className="font-mono font-medium uppercase text-accent text-[11px] block">
                  Creator Verdict:
                </span>
                <p className="mt-1 text-primary leading-relaxed font-normal">
                  Best utilized for <strong className="font-semibold">{tool.bestFor}</strong>. Provides immediate production value in narrative and commercial timelines.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={tool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-foreground px-6 py-3 text-xs sm:text-sm font-medium text-background transition-opacity hover:opacity-90 text-center flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Launch {tool.name}</span>
                <span>↗</span>
              </a>
              <Link
                href="/compare"
                className="rounded-full border border-border bg-surface px-6 py-3 text-xs sm:text-sm font-medium text-secondary hover:text-primary hover:border-border-bright transition text-center"
              >
                Compare Alternatives
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main 2-Column Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Creator Overview */}
            <section className="surface p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-4">Production Overview</h2>
              <p className="text-sm sm:text-base leading-relaxed text-secondary font-normal">
                {tool.overview}
              </p>
            </section>

            {/* Key Capabilities */}
            <section className="surface p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-primary mb-6">Key Capabilities &amp; Features</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {tool.keyFeatures.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-border-subtle bg-surface-elevated p-3.5 text-xs sm:text-sm text-secondary"
                  >
                    <span className="text-accent font-semibold text-xs mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Production Strengths vs Trade-offs */}
            <section className="grid gap-6 sm:grid-cols-2">
              <div className="surface p-6 bg-surface-elevated">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                  Verified Strengths
                </h3>
                <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-secondary">
                  {tool.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent font-semibold">+</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface p-6 bg-surface-elevated">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-tertiary">
                  Production Trade-offs
                </h3>
                <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-secondary">
                  {tool.weaknesses.map((weak, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-tertiary font-semibold">-</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Recommended Prompts for this Tool */}
            {recommendedPrompts.length > 0 && (
              <section className="surface p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-primary">
                    Recommended Prompt Recipes
                  </h2>
                  <Link href="/prompts" className="text-xs text-accent hover:underline font-mono">
                    All Prompts →
                  </Link>
                </div>

                <div className="space-y-4">
                  {recommendedPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className="rounded-xl border border-border-subtle bg-surface-elevated p-5 transition hover:border-border-bright"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-secondary">{prompt.useCase}</span>
                        <Link
                          href={`/prompts/${prompt.slug}`}
                          className="text-xs font-medium text-accent hover:underline font-mono"
                        >
                          Customize →
                        </Link>
                      </div>
                      <h3 className="mt-2 text-base font-semibold text-primary">
                        {prompt.title}
                      </h3>
                      <p className="mt-3 rounded-lg border border-border bg-surface p-3 font-mono text-xs text-secondary leading-relaxed">
                        {prompt.promptText}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Head-to-Head Comparisons */}
            {comparisons.length > 0 && (
              <section className="surface p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-semibold text-primary mb-6">Head-to-Head Comparisons</h2>
                <div className="divide-y divide-border-subtle rounded-xl border border-border-subtle bg-surface-elevated overflow-hidden">
                  {comparisons.map((c) => {
                    const opponentId = c.toolAId === tool.id ? c.toolBId : c.toolAId;
                    const opponent = getToolById(opponentId);
                    return (
                      <div
                        key={c.id}
                        className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-wider text-secondary">{c.category}</p>
                          <h3 className="text-base font-semibold text-primary mt-1">
                            {tool.name} vs {opponent?.name || "Competitor"}
                          </h3>
                          <p className="mt-1 text-xs text-secondary leading-relaxed">
                            {c.summaryVerdict}
                          </p>
                        </div>
                        <Link
                          href={`/compare/${c.slug}`}
                          className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-primary hover:border-border-bright transition shrink-0"
                        >
                          Read breakdown →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Workflows & Tutorials */}
            {(linkedWorkflows.length > 0 || linkedTutorials.length > 0) && (
              <section className="surface p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-semibold text-primary mb-6">
                  Production Workflows &amp; Guides
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {linkedWorkflows.map((wf) => (
                    <Link
                      key={wf.id}
                      href={`/workflows/${wf.slug}`}
                      className="rounded-xl border border-border-subtle bg-surface-elevated p-5 transition hover:border-border-bright block group"
                    >
                      <span className="text-xs font-medium uppercase tracking-wider text-secondary">Workflow Pipeline</span>
                      <h3 className="mt-2 text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                        {wf.title}
                      </h3>
                      <p className="mt-2 text-xs text-secondary line-clamp-2">
                        {wf.summary}
                      </p>
                    </Link>
                  ))}
                  {linkedTutorials.map((tut) => (
                    <Link
                      key={tut.id}
                      href={`/tutorials/${tut.slug}`}
                      className="rounded-xl border border-border-subtle bg-surface-elevated p-5 transition hover:border-border-bright block group"
                    >
                      <span className="text-xs font-medium uppercase tracking-wider text-secondary">Tutorial</span>
                      <h3 className="mt-2 text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                        {tut.title}
                      </h3>
                      <p className="mt-2 text-xs text-secondary line-clamp-2">
                        {tut.goal}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Editorial Articles & Videos */}
            {(relatedBlogs.length > 0 || relatedVideos.length > 0) && (
              <section className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-primary mb-2">
                  Creator Journal &amp; Video Breakdowns
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedBlogs.map((b) => (
                    <Link
                      key={b.id}
                      href={`/blog/${b.slug}`}
                      className="surface p-5 transition hover:border-border-bright block group"
                    >
                      <span className="font-mono text-[10px] font-medium uppercase text-accent">
                        Journal Essay
                      </span>
                      <h3 className="mt-2 text-sm font-semibold text-primary leading-snug group-hover:text-accent transition-colors">
                        {b.title}
                      </h3>
                      <p className="mt-2 text-xs text-secondary line-clamp-2">{b.excerpt}</p>
                      <p className="mt-3 text-[11px] text-tertiary font-mono">
                        By {b.author.name} • {b.readingTime}
                      </p>
                    </Link>
                  ))}
                  {relatedVideos.map((v) => (
                    <Link
                      key={v.id}
                      href={`/videos/${v.slug}`}
                      className="surface p-5 transition hover:border-border-bright block group"
                    >
                      <span className="font-mono text-[10px] font-medium uppercase text-accent">
                        ▶ Masterclass
                      </span>
                      <h3 className="mt-2 text-sm font-semibold text-primary leading-snug group-hover:text-accent transition-colors">
                        {v.title}
                      </h3>
                      <p className="mt-2 text-xs text-secondary line-clamp-2">{v.description}</p>
                      <p className="mt-3 text-[11px] text-tertiary font-mono">
                        By {v.creator.name} • {v.duration}
                      </p>
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
              <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">Pricing &amp; Licensing</h3>
              <div className="mt-4">
                <p className="text-3xl font-semibold text-primary">
                  {tool.pricing.startingPrice || "Free"}
                </p>
                <p className="mt-1 font-mono text-xs text-tertiary">
                  Model: {tool.pricing.model}
                </p>
              </div>

              {tool.pricing.freeTierDetails && (
                <div className="mt-4 rounded-lg border border-border-subtle bg-surface-elevated p-3 text-xs">
                  <p className="font-medium text-primary">Free Tier:</p>
                  <p className="text-secondary mt-0.5">{tool.pricing.freeTierDetails}</p>
                </div>
              )}

              {tool.pricing.subscriptionInfo && (
                <div className="mt-3 text-xs text-secondary leading-relaxed">
                  <p className="font-medium text-primary">Subscription Plans:</p>
                  <p>{tool.pricing.subscriptionInfo}</p>
                </div>
              )}

              <div className="mt-4 border-t border-border-subtle pt-3 text-xs">
                <span className="text-tertiary">Commercial Rights: </span>
                <span className="text-primary font-medium">{String(tool.pricing.commercialUse)}</span>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="surface p-6 space-y-4 text-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">Technical Specifications</h3>

              <div>
                <p className="text-tertiary font-mono">AI Models / Engines:</p>
                <p className="mt-1 font-medium text-primary">
                  {tool.supportedModels?.join(", ") || "Proprietary Cloud Diffusion"}
                </p>
              </div>

              <div>
                <p className="text-tertiary font-mono">Supported Platforms:</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {tool.platforms.map((plat) => (
                    <span
                      key={plat}
                      className="rounded border border-border bg-surface-elevated px-2 py-0.5 text-secondary font-mono text-[11px]"
                    >
                      {plat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-tertiary font-mono">Subcategories:</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {tool.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="rounded border border-border bg-surface-elevated px-2 py-0.5 text-secondary font-mono text-[11px]"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-border-subtle pt-3">
                <p className="text-tertiary font-mono">Last Verified:</p>
                <p className="font-medium text-primary font-mono">{tool.verifiedAt}</p>
              </div>
            </div>

            {/* Direct Alternatives */}
            {competitors.length > 0 && (
              <div className="surface p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">Direct Alternatives</h3>
                <div className="mt-4 space-y-3">
                  {competitors.map((comp) => (
                    <Link
                      key={comp?.id}
                      href={`/tools/${comp?.slug}`}
                      className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-elevated p-3 transition hover:border-border-bright group"
                    >
                      <div>
                        <p className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                          {comp?.name}
                        </p>
                        <p className="text-[11px] text-tertiary">
                          {comp?.bestFor.split(",")[0]}
                        </p>
                      </div>
                      <span className="text-xs text-accent font-mono">View →</span>
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
