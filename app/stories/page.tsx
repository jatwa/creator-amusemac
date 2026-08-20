import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { getAllStories } from "@/data/content";

export const metadata: Metadata = {
  title: "Production Stories & Case Studies — Creator by Amusemac",
  description: "In-depth case studies and multi-model breakdowns of real AI-assisted films, commercials, and narrative projects.",
};

export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Production Case Studies"
            title="Real AI Productions: Shot by Shot"
            description="Deconstructed multi-model pipelines for automotive commercials, narrative sci-fi previsualization, and cinematic music videos. Zero theoretical hype."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        <div className="grid gap-8 md:grid-cols-2">
          {stories.map((story) => (
            <article
              key={story.id}
              className="surface rounded-3xl border border-border bg-surface p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-subtle hover:border-accent/40 transition group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                    {story.genre}
                  </span>
                  <span className="rounded-full border border-border bg-surface-elevated px-3 py-1 text-[11px] font-mono text-tertiary">
                    {story.runtime}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight group-hover:text-accent transition">
                  <Link href={`/stories/${story.slug}`}>
                    {story.title}
                  </Link>
                </h2>

                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  {story.summary}
                </p>

                {/* Tools Pills */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono uppercase text-tertiary block">
                    Production Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {story.toolsUsed.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-md border border-border-subtle bg-surface-elevated px-2 py-0.5 text-[11px] font-mono text-secondary"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                <span className="text-xs text-tertiary font-mono">
                  Directed by {story.director}
                </span>
                <Link
                  href={`/stories/${story.slug}`}
                  className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:opacity-90 transition"
                >
                  Read Shot Breakdown →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
