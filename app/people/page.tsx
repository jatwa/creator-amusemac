import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { AdSlot } from "@/components/ad-slot";
import { getAllPublicPeople } from "@/data/films-canonical";
import { PeopleDiscoveryDesk } from "@/components/people-discovery-desk";

export const metadata: Metadata = {
  title: "Filmmaker Registry — Cinema Directors, Cinematographers & AI Artists | Creator Intel",
  description:
    "The canonical creative registry for cinema and virtual production. Discover auteur directors, AFC cinematographers, VFX supervisors, and prompt architects behind groundbreaking festival works.",
};

export default function PeoplePage() {
  const people = getAllPublicPeople();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Editorial Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Filmmaker & Talent Registry"
            title="The Creators Behind Modern Cinema & Virtual Production"
            description="Explore verified filmmaker profiles — tracking auteur directors, cinematographers, VFX pipeline architects, and AI motion artists across the global festival circuit."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        <AdSlot slotId="people-top-banner" format="horizontal" />

        {/* Discovery Desk Component */}
        <PeopleDiscoveryDesk initialPeople={people} />

        <AdSlot slotId="people-bottom-banner" format="horizontal" />
      </div>

      <Footer />
    </main>
  );
}
