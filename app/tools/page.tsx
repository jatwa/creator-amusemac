import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/ui-cards";
import { toolsData } from "@/data/platform-data";

export const metadata: Metadata = {
  title: "AI Tools Directory — Creator by Amusemac",
  description: "Browse verified AI tools for video generation, image direction, voice synthesis, editing, and VFX.",
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Directory Hero Banner */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
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
              className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background shadow-sm"
            >
              All Tools ({toolsData.length})
            </Link>
            <Link
              href="/categories/video"
              className="rounded-full bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent hover:opacity-80 transition"
            >
              Video Generation Hub
            </Link>
            <Link
              href="/categories/image"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Image Generation
            </Link>
            <Link
              href="/categories/editing"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Editing &amp; Post
            </Link>
            <Link
              href="/categories/audio"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Voice &amp; Audio
            </Link>
            <Link
              href="/categories/vfx"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Upscaling &amp; VFX
            </Link>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="shell py-14">
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
