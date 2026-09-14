import { Metadata } from "next";
import { getAllAIEntities, getAllAIContent } from "@/data/content";
import { AIHubDiscovery } from "@/components/ai/ai-hub-discovery";

export const metadata: Metadata = {
  title: "AI Cinema Intelligence Hub | Creator Intel",
  description:
    "Curated intelligence, official models, verified DoP camera controls, benchmarks, tutorials, and connected cinema knowledge graph for AI filmmaking systems.",
  keywords: [
    "AI Cinema",
    "Higgsfield AI",
    "Runway Gen-3",
    "Kling AI",
    "Luma Dream Machine",
    "Google Veo",
    "OpenAI Sora",
    "Midjourney v6",
    "FLUX.1",
    "AI filmmaking",
    "generative cinema",
    "cinematography prompt engineering",
  ],
  openGraph: {
    title: "AI Cinema Intelligence Hub | Creator Intel",
    description:
      "Curated intelligence, official models, verified camera controls, and connected cinema knowledge graph for generative filmmaking.",
    type: "website",
    url: "https://creatorintels.com/ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Cinema Intelligence Hub | Creator Intel",
    description:
      "Curated intelligence, official models, verified camera controls, and connected cinema knowledge graph for generative filmmaking.",
  },
  alternates: {
    canonical: "https://creatorintels.com/ai",
  },
};

export default function AIHubPage() {
  const publicEntities = getAllAIEntities().filter((e) => e.visibility === "PUBLIC");
  const publicContent = getAllAIContent().filter((c) => c.visibility === "PUBLIC");

  // JSON-LD structured data for AI Cinema Catalog
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AI Cinema Intelligence Hub",
    description:
      "Curated intelligence, verified models, and source library for generative AI in filmmaking.",
    url: "https://creatorintels.com/ai",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: publicEntities.map((entity, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: entity.name,
          applicationCategory: entity.category,
          operatingSystem: "Cloud / Web / API",
          creator: {
            "@type": "Organization",
            name: entity.developerOrganization,
          },
          description: entity.tagline,
          url: `https://creatorintels.com/ai/${entity.slug}`,
        },
      })),
    },
  };

  return (
    <div className="shell py-10 sm:py-16 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-accent/15 border border-accent/30 px-3 py-1 text-[11px] font-mono text-accent font-semibold">
            PHASE 3I // AI CINEMA INTELLIGENCE
          </span>
          <span className="text-xs font-mono text-tertiary">
            {publicEntities.length} Verified AI Entities • {publicContent.length} Curated Sources
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-primary">
          AI Cinema Intelligence Hub
        </h1>

        <p className="text-base sm:text-lg text-secondary leading-relaxed">
          Explore curated intelligence dossiers for leading generative cinema engines.
          Every entity includes verified models, DoP camera parameters, benchmark video links,
          tutorials, and verified relationships across the Creator Intel cinema graph.
        </p>
      </div>

      {/* Interactive Hub Discovery */}
      <AIHubDiscovery
        initialEntities={publicEntities}
        initialContent={publicContent}
      />
    </div>
  );
}
