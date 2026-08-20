import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { promptsData } from "@/data/platform-data";
import { cameraLexiconData } from "@/data/lexicon-data";
import { PromptCard } from "@/components/ui-cards";
import { PromptFactory } from "@/components/prompt-factory";

export const metadata: Metadata = {
  title: "Prompt Factory & Model Translator — Creator by Amusemac",
  description: "Generate model-specific prompt syntax for Runway, Kling, Veo, Luma, Midjourney, and Flux. Explore the optical camera and lens lexicon.",
};

export default function PromptsPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Hero Banner */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Cinematic Prompt Factory"
            title="Director-Level Prompt Architecture"
            description="Convert creative concepts into model-specific diffusion syntax for Runway, Kling, Veo, Luma, Midjourney, and Flux. Master the professional camera and lens lexicon."
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

      <div className="shell py-12 space-y-16">
        {/* Interactive Model Translator & Camera Lexicon */}
        <PromptFactory prompts={promptsData} lexicon={cameraLexiconData} />

        {/* Tested Prompt Catalog Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                Tested Recipes
              </span>
              <h2 className="text-xl font-semibold text-primary mt-0.5">
                Curated Production Prompt Library
              </h2>
            </div>
            <span className="text-xs text-tertiary font-mono">
              {promptsData.length} Verified Recipes
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {promptsData.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
