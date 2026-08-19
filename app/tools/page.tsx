import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/ui-cards";
import { toolsData } from "@/data/platform-data";

export const metadata: Metadata = {
  title: "Creator AI Tools Directory | Curated Creative Stacks",
  description: "Browse verified AI tools for video generation, image direction, voice synthesis, editing, and VFX.",
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      {/* Directory Hero Banner */}
      <div className="border-b border-line bg-gradient-to-b from-panel/80 via-ink to-ink py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Verified Directory"
            title="Curated AI Tool Stack"
            description="Tested models and creative software for filmmakers, editors, 3D artists, and visual storytellers. Filtered by production discipline."
          />

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/tools"
              className="rounded-full bg-lime px-4 py-1.5 text-xs font-semibold text-black shadow-glow-subtle"
            >
              All Tools ({toolsData.length})
            </Link>
            <Link
              href="/categories/video"
              className="rounded-full border border-lime/30 bg-lime/10 px-4 py-1.5 text-xs font-medium text-lime hover:bg-lime/20 transition"
            >
              ★ Video Generation Hub
            </Link>
            <Link
              href="/categories/image"
              className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
            >
              Image Direction
            </Link>
            <Link
              href="/categories/editing"
              className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
            >
              Editing &amp; Post
            </Link>
            <Link
              href="/categories/audio"
              className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
            >
              Voice &amp; Audio
            </Link>
            <Link
              href="/categories/vfx"
              className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
            >
              Upscaling &amp; VFX
            </Link>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="shell py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {toolsData.map((tool, index) => (
            <ToolCard key={tool.id} tool={tool} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
