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
import { canonicalTechniques } from "@/data/techniques-canonical";
import { canonicalFilms } from "@/data/films-canonical";
import { canonicalResearchRecords } from "@/data/research-canonical";
import { getDbTools, getDbToolBySlug } from "@/lib/db/neon";
import { db } from "@/lib/db/repository";
import { ToolDossierView } from "@/components/tool-dossier-view";
import { getUnifiedToolIntelligence } from "@/lib/adapters/tool-intelligence-adapter";
import { UnifiedToolDossier } from "@/components/tools/unified-tool-dossier";

export async function generateStaticParams() {
  const tools = await getDbTools();
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = (await getDbToolBySlug(slug)) || getToolBySlug(slug);
  if (!tool) return { title: "Tool Not Found" };

  const pageTitle = `${tool.name} Dossier — Creator Intel`;
  const pageDesc = tool.overview?.slice(0, 160) || tool.description;
  const pageUrl = `https://creatorintels.com/tools/${tool.slug}`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${tool.name} — AI Production Intelligence & Filmmaker Dossier`,
      description: tool.description,
      url: pageUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} — Creator Intel Dossier`,
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
  const tool = (await getDbToolBySlug(slug)) || getToolBySlug(slug);

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

  // Canonical Relational Knowledge Graph Connections
  const supportedTechniques = canonicalTechniques.filter(
    (t) =>
      t.relatedTools.includes(tool.id) ||
      t.relatedTools.includes(tool.slug) ||
      t.relatedTools.some((rt) => tool.name.toLowerCase().includes(rt.toLowerCase()))
  );

  const relatedFilms = canonicalFilms.filter(
    (f) =>
      f.technicalSpecs.aiGenerativeModels?.some((m) => m.toLowerCase().includes(tool.name.toLowerCase())) ||
      f.aiAndVfxCredits?.some((a) => a.toolsUsed?.some((tu) => tu.toLowerCase().includes(tool.name.toLowerCase())))
  );

  const relatedResearch = canonicalResearchRecords.filter(
    (r) =>
      r.statements.some((s) => s.statement.toLowerCase().includes(tool.name.toLowerCase())) ||
      r.findingsSummary.toLowerCase().includes(tool.name.toLowerCase()) ||
      r.sources.some((src) => src.sourceTitle.toLowerCase().includes(tool.name.toLowerCase()) || src.sourcePublisher.toLowerCase().includes(tool.name.toLowerCase()))
  );

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

  const unifiedTool = getUnifiedToolIntelligence(slug);
  if (!unifiedTool) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <StructuredData data={jsonLd} />
      <Navigation />

      <div className="pt-8 sm:pt-12">
        <UnifiedToolDossier tool={unifiedTool} />
      </div>

      <Footer />
    </main>
  );
}
