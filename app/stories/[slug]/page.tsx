import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { getAllStories, getStoryBySlug } from "@/data/content";
import { AdSlot } from "@/components/ad-slot";

interface StoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const stories = getAllStories();
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: StoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: "Story Not Found — Creator by Amusemac" };

  return {
    title: `${story.title} — Case Study Breakdown | Creator by Amusemac`,
    description: story.summary,
  };
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) notFound();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-12 sm:py-16">
        <div className="shell max-w-4xl">
          <div className="flex items-center gap-2 text-xs text-tertiary mb-4">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <span>/</span>
            <Link href="/stories" className="hover:text-primary transition">Stories</Link>
            <span>/</span>
            <span className="text-secondary">{story.genre}</span>
          </div>

          <div className="space-y-4">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-mono text-accent">
              {story.status} • {story.runtime}
            </span>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-primary">
              {story.title}
            </h1>
            <p className="text-sm sm:text-base text-secondary leading-relaxed font-normal">
              {story.subtitle}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4 text-xs text-tertiary">
            <div>
              <span className="font-semibold text-secondary">{story.director}</span>
              <span className="mx-2">•</span>
              <span>Published {story.publishedAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px]">Tools:</span>
              <div className="flex flex-wrap gap-1">
                {story.toolsUsed.map((tool) => (
                  <span key={tool} className="rounded border border-border-subtle bg-surface-elevated px-2 py-0.5 font-mono text-[11px] text-secondary">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="shell max-w-4xl py-12 space-y-12">
        {/* Creative Brief */}
        <section className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            01 / Creative Brief &amp; Constraints
          </span>
          <h2 className="text-xl font-semibold text-primary">The Production Brief</h2>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed">
            {story.creativeBrief}
          </p>
        </section>

        {/* Shot by Shot Deconstruction */}
        <section className="space-y-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
              02 / Shot Breakdown
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mt-1">
              Step-by-Step Shot Deconstruction
            </h2>
          </div>

          <div className="space-y-6">
            {story.shotList.map((shot) => (
              <div
                key={shot.shotNumber}
                className="surface rounded-2xl border border-border bg-surface p-6 space-y-4 shadow-subtle"
              >
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="font-mono text-xs text-accent font-semibold">
                    Shot #{shot.shotNumber}: {shot.shotName}
                  </span>
                  <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-[10px] font-mono text-secondary">
                    {shot.modelUsed}
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-mono uppercase text-tertiary block">
                    Concept Prompt:
                  </span>
                  <p className="font-mono text-xs text-primary bg-surface-elevated p-3 rounded-xl border border-border-subtle leading-relaxed">
                    &quot;{shot.conceptPrompt}&quot;
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-1">
                    <span className="text-rose-400 font-semibold block">⚠️ Creative Challenge:</span>
                    <p className="text-secondary leading-relaxed">{shot.creativeChallenge}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-emerald-400 font-semibold block">✓ Technical Solution:</span>
                    <p className="text-secondary leading-relaxed">{shot.solution}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle flex justify-end">
                  <span className="text-[11px] font-mono text-tertiary">
                    Artifact: {shot.outputArtifact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            03 / Key Production Takeaways
          </span>
          <h3 className="text-lg font-semibold text-primary">Director&apos;s Field Notes</h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-secondary">
            {story.keyPromptTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-accent font-mono">✦</span>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* AdSense Slot */}
        <AdSlot slotId="story-detail-bottom" label="Production Intelligence Sponsor" />

        {/* Back Link */}
        <div className="pt-6 border-t border-border-subtle flex items-center justify-between">
          <Link
            href="/stories"
            className="text-xs text-accent font-mono hover:underline"
          >
            ← Back to All Case Studies
          </Link>
          <Link
            href="/prompts"
            className="text-xs text-primary font-medium hover:underline"
          >
            Explore Prompt Factory →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
