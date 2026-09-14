import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { getDbPublishedBlogs } from "@/lib/db/neon";
import { storiesData } from "@/data/production-stories";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = {
  title: "Journal — Cinema Intelligence, Craft & Technology",
  description:
    "Rigorous studio benchmarks, cinematography analyses, prompt architecture critiques, and hybrid production breakdowns written by active directors and VFX supervisors.",
  alternates: {
    canonical: "https://creatorintels.com/journal",
  },
  openGraph: {
    title: "Journal — Cinema Intelligence, Craft & Technology",
    description:
      "Rigorous studio benchmarks, cinematography analyses, prompt architecture critiques, and hybrid production breakdowns written by active directors and VFX supervisors.",
    url: "https://creatorintels.com/journal",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal — Cinema Intelligence",
    description: "Rigorous studio benchmarks, cinematography analyses, and hybrid production breakdowns.",
  },
};

const JOURNAL_CATEGORIES = [
  { id: "case-studies", name: "Case Studies", slug: "case_studies", count: "3 Investigations" },
  { id: "film-breakdowns", name: "Film Breakdowns", slug: "film_breakdown", count: "2 Analyses" },
  { id: "festival-dispatches", name: "Festival Dispatches", slug: "festival_dispatches", count: "Circuit Intelligence" },
  { id: "industry-research", name: "Industry Research", slug: "industry_research", count: "Market Reports" },
  { id: "technical-deep-dives", name: "Technical Deep Dives", slug: "technical_deep_dives", count: "Engine Benchmarks" },
  { id: "director-interviews", name: "Director Interviews", slug: "director_interviews", count: "Craft Dialogues" },
];

export default async function JournalIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const blogs = await getDbPublishedBlogs();
  const resolvedParams = searchParams ? await searchParams : {};
  const activeCategory = resolvedParams?.category;

  const filteredBlogs = activeCategory
    ? blogs.filter(
        (b) =>
          b.category.toLowerCase().replace(/[^a-z0-9]+/g, "_") === activeCategory ||
          b.tags?.some((t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "_") === activeCategory)
      )
    : blogs;

  const featured = blogs[0];
  const rest = activeCategory ? filteredBlogs : blogs.slice(1);

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Editorial Journal Header */}
      <section className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <div className="max-w-3xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Creator Intel Journal
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl leading-tight">
              Cinema, craft, technology, and the intelligence behind filmmaking.
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-secondary font-normal">
              In-depth production case studies, studio benchmarks, optical analyses, and research-backed dispatches for working directors, cinematographers, and visual storytellers.
            </p>
          </div>
        </div>
      </section>

      <div className="shell py-12 space-y-16">
        {/* Category Filter Pills */}
        <section aria-label="Journal Categories" className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-wider text-tertiary">
              Editorial Categories
            </p>
            {activeCategory && (
              <Link
                href="/journal"
                className="text-xs font-mono text-accent hover:underline"
              >
                Clear filter ✕
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/journal"
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                !activeCategory
                  ? "bg-foreground text-background font-semibold"
                  : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright"
              }`}
            >
              All Dispatches
            </Link>
            {JOURNAL_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/journal?category=${cat.slug}`}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition ${
                    isSelected
                      ? "bg-foreground text-background font-semibold"
                      : "border border-border bg-surface text-secondary hover:text-primary hover:border-border-bright font-normal"
                  }`}
                >
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Story (When no category filter is active) */}
        {!activeCategory && featured && (
          <section aria-label="Featured Story">
            <div className="group overflow-hidden rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-subtle transition hover:border-border-bright">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-[11px] font-medium text-accent">
                  Featured Investigation
                </span>
                <span className="font-mono text-secondary">{featured.category}</span>
                <span className="text-tertiary">•</span>
                <span className="font-mono text-secondary">{featured.readingTime}</span>
                <span className="text-tertiary">•</span>
                <span className="font-mono text-tertiary">{featured.publishedAt}</span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-primary sm:text-3xl lg:text-4xl leading-tight group-hover:text-accent transition-colors">
                <Link href={`/journal/${featured.slug}`}>{featured.title}</Link>
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-secondary sm:text-base font-normal">
                {featured.excerpt}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border-subtle pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent font-mono">
                    {featured.author.name[0]}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-primary">{featured.author.name}</p>
                    <p className="text-[11px] text-tertiary font-mono">{featured.author.role}</p>
                  </div>
                </div>

                <Link
                  href={`/journal/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs sm:text-sm font-medium text-background hover:opacity-90 transition shadow-sm"
                >
                  <span>Read Complete Dispatch</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Latest Intelligence Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-lg font-semibold tracking-tight text-primary">
              {activeCategory ? `Dispatches in ${activeCategory.replace(/_/g, " ")}` : "Recent Cinema Dispatches"}
            </h2>
            <span className="font-mono text-xs text-tertiary">
              {rest.length} {rest.length === 1 ? "article" : "articles"}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((blog) => (
              <article
                key={blog.id}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition hover:border-border-bright hover:shadow-subtle"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-surface-elevated px-2.5 py-0.5 font-mono text-[10px] text-secondary">
                      {blog.category}
                    </span>
                    <span className="text-tertiary">•</span>
                    <span className="font-mono text-[11px] text-tertiary">{blog.readingTime}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
                    <Link href={`/journal/${blog.slug}`}>{blog.title}</Link>
                  </h3>

                  <p className="text-xs sm:text-sm leading-relaxed text-secondary font-normal line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4 text-xs text-tertiary">
                  <div className="flex items-center gap-2 font-mono">
                    <span>By {blog.author.name}</span>
                  </div>
                  <Link
                    href={`/journal/${blog.slug}`}
                    className="font-mono text-[11px] text-accent font-medium hover:underline"
                  >
                    Read article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Case Studies Spotlight (Integration with Stories) */}
        <section className="space-y-6 rounded-3xl border border-border bg-surface/50 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                Production Case Studies
              </p>
              <h3 className="text-xl font-semibold text-primary tracking-tight">
                Shot-by-Shot Director Breakdowns
              </h3>
            </div>
            <Link
              href="/stories"
              className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1"
            >
              <span>View all production stories</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {storiesData.map((story) => (
              <div
                key={story.id}
                className="rounded-xl border border-border bg-surface p-5 transition hover:border-border-bright"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-tertiary mb-2">
                  <span>{story.genre}</span>
                  <span className="rounded bg-accent/10 px-1.5 py-0.2 text-accent font-medium">
                    {story.shotList.length} Shots
                  </span>
                </div>
                <h4 className="font-semibold text-primary text-base hover:text-accent transition-colors">
                  <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                </h4>
                <p className="mt-2 text-xs text-secondary line-clamp-2 leading-relaxed">
                  {story.summary}
                </p>
                <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-tertiary border-t border-border-subtle pt-3">
                  <span>Director: {story.director}</span>
                  <Link href={`/stories/${story.slug}`} className="text-accent hover:underline">
                    View Breakdown →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Research & Source Integrity Callout */}
        <section className="rounded-2xl border border-border-subtle bg-surface/40 p-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
                Evidence-Based Journalism
              </p>
              <h3 className="text-lg sm:text-xl font-semibold text-primary">
                Every claim should have a trail.
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed font-normal">
                Creator Intel dispatches distinguish between verified empirical benchmarks, director interpretations, and technical inferences. All factual findings are tied to traceable primary documentation.
              </p>
            </div>
            <Link
              href="/about"
              className="shrink-0 rounded-full border border-border bg-surface px-5 py-2 text-xs font-mono text-primary hover:border-border-bright transition"
            >
              Editorial Standards
            </Link>
          </div>
        </section>

        <AdSlot slotId="journal-bottom" label="Cinema Intelligence Sponsor" />
      </div>

      <Footer />
    </main>
  );
}
