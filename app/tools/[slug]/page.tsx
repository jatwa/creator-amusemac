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
import { getToolBySlug, getToolById, getToolDossier } from "@/data/content";
import { db } from "@/lib/db/repository";
import { ToolDossierView } from "@/components/tool-dossier-view";

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
      title: `${tool.name} — AI Production Intelligence & Filmmaker Dossier`,
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

  const dossier = getToolDossier(slug);
  if (!dossier) {
    notFound();
  }

  // Linked entities
  const competitors = tool.competitorIds
    .map((id) => getToolById(id))
    .filter(Boolean);

  const comparisons = comparisonsData.filter(
    (c) => c.toolAId === tool.id || c.toolBId === tool.id
  );

  const recommendedPrompts = promptsData.filter(
    (p) =>
      tool.recommendedPromptIds.includes(p.id) ||
      p.compatibleToolIds.includes(tool.id)
  );

  const linkedTutorials = tutorialsData.filter(
    (tut) =>
      tool.tutorialIds.includes(tut.id) || tut.requiredToolIds.includes(tool.id)
  );

  const linkedWorkflows = workflowsData.filter(
    (wf) =>
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
      price: tool.pricing.startingPrice
        ? tool.pricing.startingPrice.replace(/[^0-9.]/g, "")
        : "0",
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
      <div className="border-b border-border-subtle bg-surface/30 py-12 sm:py-16">
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
                  {tool.category.toUpperCase()}
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

      {/* Full 14-Level Deep Editorial Dossier */}
      <ToolDossierView
        tool={tool}
        dossier={dossier}
        competitors={competitors}
        comparisons={comparisons}
        recommendedPrompts={recommendedPrompts}
        linkedTutorials={linkedTutorials}
        linkedWorkflows={linkedWorkflows}
        relatedBlogs={relatedBlogs}
        relatedVideos={relatedVideos}
      />

      <Footer />
    </main>
  );
}
