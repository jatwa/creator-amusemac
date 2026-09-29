import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { AiPromptCustomizer } from "@/components/ai-prompt-customizer";

export const metadata: Metadata = {
  title: "AI Prompt Customizer — Turn Your Idea into a Director-Ready Prompt — Creator Intel",
  description:
    "Describe your cinematic shot idea. Deterministically match against verified production recipes and compile camera-locked prompt syntax for Runway, Kling, Veo, Luma, MiniMax, Midjourney, Flux, and Wan.",
  alternates: {
    canonical: "https://creatorintels.com/prompts/ai",
  },
  openGraph: {
    title: "AI Prompt Customizer — Turn Your Idea into a Director-Ready Prompt — Creator Intel",
    description:
      "Describe your cinematic shot idea. Deterministically match against verified production recipes and compile camera-locked prompt syntax.",
    url: "https://creatorintels.com/prompts/ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Customizer — Director-Ready AI Prompts",
    description: "Turn your natural language shot idea into verified director recipes and diffusion syntax.",
  },
};

export default function AiPromptCustomizerPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Hero Banner */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell max-w-4xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-tertiary">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/prompts" className="hover:text-primary transition-colors">Prompts</Link>
            <span>/</span>
            <span className="text-secondary">AI Customizer</span>
          </div>

          <SectionHeading
            as="h1"
            label="AI Intelligence Layer"
            title="Turn Your Idea into a Director-Ready Prompt."
            description="Describe your scene in plain English. Creator Intel deterministically matches your concept against verified canonical recipe blueprints, fills optical parameters, and compiles model-specific diffusion syntax."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        <AiPromptCustomizer />

        {/* Bottom Navigation Links */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <Link
            href="/prompts/factory"
            className="text-secondary hover:text-accent font-medium inline-flex items-center gap-1"
          >
            <span>🎥 Direct manually in Director's Studio →</span>
          </Link>
          <Link
            href="/vault"
            className="text-secondary hover:text-accent font-medium inline-flex items-center gap-1"
          >
            <span>🔒 Browse 49 Verified Vault Recipes →</span>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
