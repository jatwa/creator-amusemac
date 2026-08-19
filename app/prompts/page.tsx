import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { promptsData } from "@/data/platform-data";
import { PromptCard } from "@/components/ui-cards";

export const metadata: Metadata = {
  title: "Production AI Prompts Library — Creator by Amusemac",
  description: "Tested prompt templates for cinematic video direction, luxury product photography, 35mm film stills, and fast video editing.",
};

export default function PromptsPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Hero Banner */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Prompt Architecture"
            title="Production Prompt Library"
            description="Modular prompt recipes designed to give you predictable, cinematic results across Midjourney, Flux.1, Runway, and Kling AI."
          />

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/prompts"
              className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background shadow-sm"
            >
              All Prompts ({promptsData.length})
            </Link>
            <Link
              href="/search?q=video"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Camera &amp; Motion Syntax
            </Link>
            <Link
              href="/search?q=product"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Commercials &amp; Product
            </Link>
            <Link
              href="/search?q=film"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              35mm Narrative Stills
            </Link>
            <Link
              href="/search?q=fashion"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Fashion &amp; Editorial
            </Link>
          </div>
        </div>
      </div>

      {/* Prompts Grid */}
      <div className="shell py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promptsData.map((item) => (
            <PromptCard key={item.id} prompt={item} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
