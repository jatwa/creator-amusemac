import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllAIEntities,
  getAIEntityBySlug,
  getAIContentByEntityId,
  getToolBySlug,
  getTechniqueBySlug,
  getWorkflowBySlug,
  getPromptBySlug,
  getFilmBySlug,
  getPersonBySlug,
  getResearchBySlug,
  getBlogBySlug,
} from "@/data/content";
import { AIDossierView } from "@/components/ai/ai-dossier-view";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entities = getAllAIEntities();
  return entities.map((entity) => ({
    slug: entity.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entity = getAIEntityBySlug(slug);

  if (!entity || entity.visibility !== "PUBLIC") {
    return {
      title: "Entity Not Found | Creator Intel AI Hub",
    };
  }

  const devOrg = entity.developerOrganization || entity.vendor || "AI Engine";

  return {
    title: `${entity.name} — AI Cinema Intelligence Dossier | Creator Intel`,
    description: `${entity.name} by ${devOrg}: ${entity.tagline}. Verified models, DoP camera controls, benchmarks, and cinema graph links.`,
    keywords: [
      entity.name,
      devOrg,
      "AI Cinema",
      "Generative Video",
      ...(entity.keyCapabilities || entity.capabilities || []),
      ...(entity.cinemaStrengths || []),
    ],
    openGraph: {
      title: `${entity.name} — AI Cinema Intelligence Dossier`,
      description: entity.tagline,
      type: "article",
      url: `https://creatorintels.com/ai/${entity.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${entity.name} — AI Cinema Intelligence Dossier`,
      description: entity.tagline,
    },
    alternates: {
      canonical: `https://creatorintels.com/ai/${entity.slug}`,
    },
  };
}

export default async function AIEntityDossierPage({ params }: PageProps) {
  const { slug } = await params;
  const entity = getAIEntityBySlug(slug);

  if (!entity || entity.visibility !== "PUBLIC") {
    notFound();
  }

  // Fetch verified content items for this entity
  const contentItems = getAIContentByEntityId(entity.id).filter(
    (c) => c.visibility === "PUBLIC"
  );

  // Resolve connected knowledge graph entities
  const relatedTools = (entity.relatedToolSlugs || [])
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => t !== undefined && t !== null);

  const relatedTechniques = (entity.relatedTechniqueSlugs || [])
    .map((s) => getTechniqueBySlug(s))
    .filter((t): t is NonNullable<typeof t> => t !== undefined && t !== null && t.visibility === "PUBLIC");

  const relatedWorkflows = (entity.relatedWorkflowSlugs || [])
    .map((s) => getWorkflowBySlug(s))
    .filter((w): w is NonNullable<typeof w> => w !== undefined && w !== null);

  const relatedPrompts = (entity.relatedPromptSlugs || [])
    .map((s) => getPromptBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined && p !== null);

  const relatedFilms = (entity.relatedFilmSlugs || [])
    .map((s) => getFilmBySlug(s))
    .filter((f): f is NonNullable<typeof f> => f !== undefined && f !== null && f.visibility === "PUBLIC");

  const relatedPeople = (entity.relatedPeopleSlugs || [])
    .map((s) => getPersonBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined && p !== null && p.visibility === "PUBLIC");

  const relatedResearch = (entity.relatedResearchSlugs || [])
    .map((s) => getResearchBySlug(s))
    .filter((r): r is NonNullable<typeof r> => r !== undefined && r !== null && r.visibility === "PUBLIC");

  const relatedJournal = (entity.relatedJournalSlugs || [])
    .map((s) => getBlogBySlug(s))
    .filter((j): j is NonNullable<typeof j> => j !== undefined && j !== null);

  const devOrg = entity.developerOrganization || entity.vendor || "AI Engine";
  const overviewText = entity.overview || entity.description || "";
  const websiteUrl = entity.officialLinks?.website || entity.officialWebsite;
  const capabilitiesList = entity.keyCapabilities || entity.capabilities || [];

  // JSON-LD Structured Data for Software Application / AI Engine
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: entity.name,
    applicationCategory: entity.category,
    operatingSystem: "Cloud / Web / API / Local",
    creator: {
      "@type": "Organization",
      name: devOrg,
      url: websiteUrl,
    },
    description: overviewText,
    featureList: capabilitiesList.join(", "),
    url: `https://creatorintels.com/ai/${entity.slug}`,
    citation: (entity.sources || []).map((s) => ({
      "@type": "CreativeWork",
      name: s.title,
      url: s.url,
      publisher: s.publisher,
    })),
  };

  return (
    <div className="shell py-10 sm:py-16 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <AIDossierView
        entity={entity}
        contentItems={contentItems}
        relatedTools={relatedTools}
        relatedTechniques={relatedTechniques}
        relatedWorkflows={relatedWorkflows}
        relatedPrompts={relatedPrompts}
        relatedFilms={relatedFilms}
        relatedPeople={relatedPeople}
        relatedResearch={relatedResearch}
        relatedJournal={relatedJournal}
      />
    </div>
  );
}
