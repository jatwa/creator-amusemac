import { Metadata } from "next";
import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { SearchView } from "@/components/search-view";

export const metadata: Metadata = {
  title: "Universal Search — Creator by Amusemac",
  description: "Search across creator AI tools, prompt recipes, production workflows, tutorials, and head-to-head comparisons.",
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="shell py-16 sm:py-20">
        <SectionHeading
          as="h1"
          label="Creator Intelligence"
          title="Universal Search & Discovery"
          description="Find the right tool, prompt recipe, tutorial guide, or workflow pipeline for your next visual production."
        />

        <div className="mt-8">
          <Suspense fallback={<div className="text-secondary py-12 text-center font-mono text-xs">Loading search engine...</div>}>
            <SearchView />
          </Suspense>
        </div>
      </div>

      <Footer />
    </main>
  );
}
