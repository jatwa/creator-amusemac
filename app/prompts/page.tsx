import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { promptsData } from "@/data/platform-data";
import { PromptList } from "@/components/prompt-list";

export const metadata: Metadata = {
  title: "Production AI Prompts Library | Creator by Amusemac",
  description: "Tested prompt templates for cinematic video direction, luxury product photography, 35mm film stills, and fast video editing.",
};

export default function PromptsPage() {
  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      <div className="shell py-12 sm:py-20">
        <SectionHeading
          label="Prompt Architecture"
          title="Production Prompt Library"
          description="Modular prompt recipes designed to give you predictable, cinematic results across Midjourney, Flux.1, Runway, and Kling AI."
        />

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-8">
          <Link
            href="/prompts"
            className="rounded-full bg-lime px-4 py-1.5 text-xs font-semibold text-black"
          >
            All Prompts ({promptsData.length})
          </Link>
          <Link
            href="/search?q=video"
            className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
          >
            Video Camera Prompts
          </Link>
          <Link
            href="/search?q=product"
            className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
          >
            Product Commercials
          </Link>
          <Link
            href="/search?q=film"
            className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
          >
            35mm Narrative Stills
          </Link>
          <Link
            href="/search?q=fashion"
            className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
          >
            Fashion & Editorial
          </Link>
        </div>

        {/* All Prompts Grid */}
        <div className="mt-12">
          <PromptList />
        </div>
      </div>

      <Footer />
    </main>
  );
}
