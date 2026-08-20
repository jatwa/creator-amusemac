import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { EditorialCard } from "@/components/ui-cards";
import { SyncedEditorialHub } from "@/components/synced-editorial-view";
import { db } from "@/lib/db/repository";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = {
  title: "Creator Journal — AI Filmmaking & Cinematography Intelligence",
  description:
    "In-depth analysis, cinematography benchmarks, diffusion vs flow-matching deep dives, and production pipeline essays for modern filmmakers and designers.",
};

export default function BlogIndexPage() {
  const blogs = db.getPublishedBlogs();
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Editorial Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Editorial &amp; Essays"
            title="Creator Journal"
            description="Rigorous studio benchmarks, cinematography analyses, prompt architecture critiques, and hybrid production breakdowns written by active directors and VFX supervisors."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-16">
        {/* Featured Article Card */}
        {featured && (
          <section>
            <div className="surface group overflow-hidden border-border p-6 sm:p-10 transition hover:border-border-bright bg-surface shadow-subtle rounded-3xl">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent font-mono text-[11px]">
                  Featured Investigation
                </span>
                <span className="font-mono text-secondary">{featured.category}</span>
                <span className="text-tertiary">•</span>
                <span className="font-mono text-secondary">{featured.readingTime}</span>
                <span className="text-tertiary">•</span>
                <span className="font-mono text-tertiary">{featured.publishedAt}</span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-primary sm:text-3xl lg:text-4xl leading-tight group-hover:text-accent transition-colors">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-secondary sm:text-base font-normal">
                {featured.excerpt}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border-subtle pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center font-semibold text-accent text-xs">
                    {featured.author.name[0]}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-primary">{featured.author.name}</p>
                    <p className="text-[11px] text-tertiary font-mono">{featured.author.role}</p>
                  </div>
                </div>

                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-xs sm:text-sm font-medium text-background hover:opacity-90 transition shadow-sm"
                >
                  <span>Read Complete Analysis</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Synchronized Masterclass & Integrated Asset Hub */}
        <SyncedEditorialHub />

        {/* Latest Articles Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-primary tracking-tight">Recent Production Essays</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((blog) => (
              <EditorialCard key={blog.id} post={blog} />
            ))}
          </div>
        </section>

        <AdSlot slotId="blog-bottom" label="Editorial Journal Sponsor" />
      </div>

      <Footer />
    </main>
  );
}
