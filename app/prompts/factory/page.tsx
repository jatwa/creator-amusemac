import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { promptsData } from "@/data/platform-data";
import { cameraLexiconData } from "@/data/lexicon-data";
import { PromptFactory } from "@/components/prompt-factory";

export const metadata: Metadata = {
  title: "Director's Studio — Cinematography Intelligence & Model Translator — Creator Intel",
  description: "Direct better. Create cinematically. Build professional AI shots by controlling camera rigs, lenses, lighting, and composition translated into 8-model diffusion syntax.",
  alternates: {
    canonical: "https://creatorintels.com/prompts/factory",
  },
  openGraph: {
    title: "Director's Studio — Cinematography Intelligence & Model Translator — Creator Intel",
    description: "Direct better. Create cinematically. Build professional AI shots by controlling camera rigs, lenses, lighting, and composition translated into 8-model diffusion syntax.",
    url: "https://creatorintels.com/prompts/factory",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Director's Studio — Cinematography Intelligence & Model Translator",
    description: "Direct better. Create cinematically with verified camera optics and model syntax.",
  },
};

export default function PromptFactoryPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Director's Studio"
            title="Cinematography Intelligence &amp; Recipe Studio"
            description="Stop prompting. Start directing. Structure cinematic AI shots through camera rigs, lenses, lighting, and composition — generating dual Human Director Recipes and model-specific prompts for Runway, Kling, Veo, Luma, MiniMax, Midjourney, Flux, and Wan."
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
