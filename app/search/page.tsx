import { Metadata } from "next";
import { Suspense } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { SearchView } from "@/components/search-view";

export const metadata: Metadata = {
  title: "Universal Creator Search | Creator by Amusemac",
  description: "Search across creator AI tools, prompt recipes, production workflows, tutorials, and head-to-head comparisons.",
};

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      <div className="shell py-12 sm:py-20">
        <SectionHeading
          label="Creator Intelligence"
          title="Universal Search & Discovery"
          description="Find the right tool, prompt recipe, tutorial guide, or workflow pipeline for your next visual production."
        />

        <div className="mt-8">
          <Suspense fallback={<div className="text-zinc-500 py-12 text-center">Loading search engine...</div>}>
            <SearchView />
          </Suspense>
        </div>
      </div>

      <Footer />
    </main>
  );
}
