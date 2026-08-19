import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { EditorialCard } from "@/components/ui-cards";
import { db } from "@/lib/db/repository";

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
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      {/* Editorial Header */}
      <div className="border-b border-line bg-gradient-to-b from-panel/80 via-ink to-ink py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Editorial & Essays"
            title="Creator Journal"
            description="Rigorous studio benchmarks, cinematography analyses, prompt architecture critiques, and hybrid production breakdowns written by active directors and VFX supervisors."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        {/* Featured Article Card */}
        {featured && (
          <section>
            <div className="surface group overflow-hidden border-lime/30 p-6 sm:p-10 transition hover:border-lime bg-gradient-to-r from-panel via-panel-hover to-zinc-950 shadow-card">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full border border-lime/40 bg-lime/20 px-3 py-1 font-bold uppercase tracking-wider text-lime font-mono text-[11px]">
                  Featured Investigation
                </span>
                <span className="font-mono text-zinc-400">{featured.category}</span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-zinc-400">{featured.readingTime}</span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-zinc-500">{featured.publishedAt}</span>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl leading-tight group-hover:text-lime transition">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                {featured.excerpt}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-line/60 pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-lime/20 border border-lime/40 flex items-center justify-center font-bold text-lime text-sm">
                    {featured.author.name[0]}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">{featured.author.name}</p>
                    <p className="text-[11px] text-zinc-400 font-mono">{featured.author.role}</p>
                  </div>
                </div>

                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-2.5 text-xs sm:text-sm font-bold text-black hover:bg-white transition shadow-glow-subtle"
                >
                  <span>Read Complete Analysis</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Latest Articles Grid */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Production Essays</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {rest.map((blog) => (
              <EditorialCard key={blog.id} post={blog} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
