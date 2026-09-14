import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { AdSlot } from "@/components/ad-slot";
import { getAllPublicFilms } from "@/data/films-canonical";
import { FilmDiscoveryDesk } from "@/components/film-discovery-desk";

export const metadata: Metadata = {
  title: "Film Intelligence Registry — Verified Cinematic Works & Technical Dossiers | Creator Intel",
  description:
    "The canonical cinema database for filmmakers. Explore verified cinematic works, camera systems, optical specs, ACES color pipelines, generative AI models, and festival premiere histories.",
  alternates: {
    canonical: "https://creatorintels.com/films",
  },
  openGraph: {
    title: "Film Intelligence Registry — Creator Intel",
    description:
      "The canonical cinema database for filmmakers. Explore verified cinematic works, camera systems, optical specs, ACES color pipelines, generative AI models, and festival premiere histories.",
    url: "https://creatorintels.com/films",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Film Intelligence Registry",
    description: "The canonical cinema database for filmmakers and virtual production creators.",
  },
};

export default function FilmsPage() {
  const films = getAllPublicFilms();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Editorial Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Film Intelligence Registry"
            title="The Canonical Film Database for Modern Filmmakers"
            description="Explore verified cinema and virtual production records — examining optical capture systems, anamorphic lenses, ACES color management, generative AI models, premiere statuses, and festival circuit selections."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        <AdSlot slotId="films-top-banner" format="horizontal" />

        {/* Discovery Desk Component */}
        <FilmDiscoveryDesk initialFilms={films} />

        <AdSlot slotId="films-bottom-banner" format="horizontal" />
      </div>

      <Footer />
    </main>
  );
}
