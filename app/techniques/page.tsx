import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { AdSlot } from "@/components/ad-slot";
import { getAllPublicTechniques } from "@/data/techniques-canonical";
import { TechniqueDiscoveryDesk } from "@/components/technique-discovery-desk";

export const metadata: Metadata = {
  title: "Cinema Techniques Registry — Optical, Lighting, Color & AI Workflows | Creator Intel",
  description:
    "The canonical director's notebook for cinema techniques. Explore camera movement, anamorphic optics, Rembrandt lighting, ACES color management, Flux LoRA consistency, and DCI theatrical mastering.",
  alternates: {
    canonical: "https://creatorintels.com/techniques",
  },
  openGraph: {
    title: "Cinema Techniques Registry — Creator Intel",
    description:
      "The canonical director's notebook for cinema techniques. Explore camera movement, anamorphic optics, Rembrandt lighting, ACES color management, Flux LoRA consistency, and DCI theatrical mastering.",
    url: "https://creatorintels.com/techniques",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinema Techniques Registry",
    description: "The canonical director's notebook for optical, lighting, color, and AI workflows.",
  },
};

export default function TechniquesPage() {
  const techniques = getAllPublicTechniques();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Editorial Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Cinema Techniques Registry"
            title="The Director's Notebook for Modern Filmmakers"
            description="Master verified filmmaking techniques — analyzing optical physics, camera kinematics, Rembrandt lighting, ACES color workflows, character consistency pipelines, and DCI theatrical mastering standards."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        <AdSlot slotId="techniques-top-banner" format="horizontal" />

        {/* Discovery Desk Component */}
        <TechniqueDiscoveryDesk initialTechniques={techniques} />

        <AdSlot slotId="techniques-bottom-banner" format="horizontal" />
      </div>

      <Footer />
    </main>
  );
}
