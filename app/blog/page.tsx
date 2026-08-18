import Link from "next/link";
import { Metadata } from "next";
import { db } from "@/lib/db/repository";

export const metadata: Metadata = {
  title: "Creator Insights & Industry Analysis | Creator by Amusemac",
  description:
    "In-depth analysis, cinematography benchmarks, flow matching deep dives, and production pipeline essays for modern filmmakers and designers.",
};

export default function BlogIndexPage() {
  const blogs = db.getPublishedBlogs();
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-xs text-lime">
          <span>●</span>
          <span>CREATOR ESSAYS &amp; BENCHMARKS</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Editorial Insights for Visual Storytellers
        </h1>
        <p className="max-w-3xl text-base text-zinc-400 sm:text-lg">
          Rigorous studio benchmarks, cinematography analyses, prompt architecture critiques, and hybrid production breakdowns written by active directors and VFX supervisors.
        </p>
      </section>

      {/* Featured Article Card */}
      {featured && (
        <section>
          <div className="surface group overflow-hidden border-lime/30 p-8 sm:p-10 transition hover:border-lime">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-md border border-lime/40 bg-lime/20 px-2.5 py-0.5 font-bold uppercase tracking-wider text-lime">
                Featured Insight
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
                <div className="h-9 w-9 rounded-full bg-lime/20 border border-lime/40 flex items-center justify-center font-bold text-lime text-xs">
                  {featured.author.name[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{featured.author.name}</p>
                  <p className="text-[11px] text-zinc-400">{featured.author.role}</p>
                </div>
              </div>

              <Link
                href={`/blog/${featured.slug}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-lime px-5 py-2.5 text-xs font-bold text-black hover:bg-white transition"
              >
                Read complete analysis →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Grid */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight">Recent Editorial Benchmarks</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((blog) => (
            <article
              key={blog.id}
              className="surface group flex flex-col justify-between p-6 sm:p-8 transition hover:border-zinc-500"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="rounded-md border border-line bg-black/40 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                    {blog.category}
                  </span>
                  <span className="font-mono text-zinc-500 text-[11px]">{blog.readingTime}</span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-white group-hover:text-lime transition">
                  <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-zinc-400 line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 text-xs">
                <span className="text-zinc-400">{blog.author.name}</span>
                <Link
                  href={`/blog/${blog.slug}`}
                  className="font-semibold text-lime hover:underline"
                >
                  Read essay →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
