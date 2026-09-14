import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { ToolCard } from "@/components/ui-cards";
import { getDbTools } from "@/lib/db/neon";
import { DirectoryAtAGlance } from "@/components/directory-at-a-glance";
import { ToolDecisionFinder } from "@/components/tools/tool-decision-finder";

export const metadata: Metadata = {
  title: "AI Tools Directory — Creator Intel",
  description: "Browse verified AI tools for video generation, image direction, voice synthesis, editing, and VFX.",
  alternates: {
    canonical: "https://creatorintels.com/tools",
  },
  openGraph: {
    title: "AI Tools Directory — Creator Intel",
    description: "Browse verified AI tools for video generation, image direction, voice synthesis, editing, and VFX.",
    url: "https://creatorintels.com/tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Tools Directory — Creator Intel",
    description: "Browse verified generative AI tools for video, image, and visual effects.",
  },
};

export default async function ToolsPage() {
  const tools = await getDbTools();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Directory Hero Banner */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Editorial Intelligence Desk"
            title="Curated AI Production Stack"
            description="Deeply tested models and creative software for filmmakers, cinematographers, production designers, and editors. Verified capabilities and transparent pricing."
          />

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/tools"
              className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background shadow-sm"
            >
              All Tools ({tools.length})
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

      <div className="shell py-12 space-y-14">
        {/* Flagship Filmmaker Decision Engine */}
        <ToolDecisionFinder />

        {/* At A Glance Comparison Matrix */}
        <DirectoryAtAGlance tools={tools} />

        {/* Detailed Tool Cards Section */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                Dossier Archives
              </span>
              <h2 className="text-xl font-semibold text-primary mt-0.5">
                Full Production Intelligence Dossiers
              </h2>
            </div>
            <span className="text-xs text-tertiary font-mono">
              {tools.length} Audited Engines
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
