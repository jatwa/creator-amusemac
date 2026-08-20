import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { promptsData } from "@/data/platform-data";
import { cameraLexiconData } from "@/data/lexicon-data";
import { PromptFactory } from "@/components/prompt-factory";

export const metadata: Metadata = {
  title: "AI Prompt Factory & Model Syntax Translator — Creator by Amusemac",
  description: "Interactive director prompt translation studio. Convert plain creative concepts into 8-model diffusion syntax with the optical camera lexicon.",
};

export default function PromptFactoryPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Prompt Architecture Studio"
            title="Interactive Prompt Factory &amp; Translator"
            description="Translate natural language scene descriptions into verified model-specific syntax for Runway Gen-3, Kling AI, Google Veo, Luma, MiniMax, Midjourney, Flux.1, and Wan 2.1."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        <PromptFactory prompts={promptsData} lexicon={cameraLexiconData} />

        <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
          <Link
            href="/prompts"
            className="text-xs text-accent font-mono hover:underline"
          >
            ← View All Curated Prompt Recipes
          </Link>
          <Link
            href="/categories/video"
            className="text-xs text-primary font-medium hover:underline"
          >
            Launch Flagship Video Hub →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
