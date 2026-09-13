import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { db } from "@/lib/db/repository";
import { StructuredData } from "@/components/structured-data";
import { getDbPublishedBlogs, getDbBlogBySlug } from "@/lib/db/neon";
import { AdSlot } from "@/components/ad-slot";

export async function generateStaticParams() {
  const blogs = await getDbPublishedBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getDbBlogBySlug(slug);
  if (!blog) return { title: "Article Not Found — Creator Intel" };

  return {
    title: `${blog.title} — Creator Intel Journal`,
    description: blog.excerpt,
    authors: [{ name: blog.author.name }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      tags: blog.tags,
    },
    alternates: {
      canonical: `https://creatorintels.com/journal/${blog.slug}`,
    },
  };
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getDbBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Cross-entity relational resolution
  const relatedTools = (blog.relatedToolIds || [])
    .map((id) => db.getToolById(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
    
  const relatedPrompts = (blog.relatedPromptIds || [])
    .map((id) => db.getAllPrompts().find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
    
  const relatedTutorials = (blog.relatedTutorialIds || [])
    .map((id) => db.getAllTutorials().find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
    
  const relatedVideos = (blog.relatedVideoIds || [])
    .map((id) => db.getVideoById(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Person",
      name: blog.author.name,
      jobTitle: blog.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Creator Intel",
      url: "https://creatorintels.com",
    },
  };

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Editorial Header */}
      <section className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-tertiary font-mono mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-primary transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-secondary truncate max-w-xs">{blog.slug}</span>
          </nav>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-sans">
            <span className="rounded-full bg-accent/10 px-3.5 py-1 font-semibold text-accent uppercase">
              {blog.category}
            </span>
            <span className="text-secondary font-medium">{blog.readingTime}</span>
            <span className="text-tertiary">•</span>
            <span className="text-secondary">Published {blog.publishedAt}</span>
            <span className="text-tertiary">•</span>
            <span className="text-tertiary">Verified {blog.updatedAt}</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-primary leading-tight max-w-4xl">
            {blog.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-secondary leading-relaxed max-w-3xl font-normal font-sans">
            {blog.excerpt}
          </p>

          {/* Author Card */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6 font-sans">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent font-mono">
                {blog.author.name[0]}
              </div>
              <div>
                <p className="text-base font-bold text-primary">{blog.author.name}</p>
                <p className="text-xs text-tertiary">{blog.author.role}</p>
              </div>
            </div>

            {/* Editorial Status & Provenance */}
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400 font-semibold">
                ✓ Fact Checked &amp; Benchmarked
              </span>
              <span className="hidden sm:inline-block rounded-full border border-border bg-surface px-3 py-1 text-tertiary font-medium">
                Human Authored
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body + Relational Intelligence Sidebar */}
      <div className="shell py-12">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Long-Form Editorial Content */}
          <article className="lg:col-span-8 space-y-8">
            {/* Hero Cover Image if present */}
            {blog.coverImageUrl && (
              <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle">
                <img
                  src={blog.coverImageUrl}
                  alt={blog.title}
                  className="w-full h-auto max-h-[420px] object-cover"
                />
              </div>
            )}

            {/* Article Markdown Content Body */}
            <div className="prose-cinema max-w-none space-y-6">
              {blog.contentMarkdown.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl sm:text-3xl font-serif font-bold text-primary tracking-tight mt-10 mb-4 border-b border-border-subtle pb-2">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-xl sm:text-2xl font-serif font-semibold text-primary tracking-tight mt-8 mb-3">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("```")) {
                  const cleanCode = paragraph.replace(/```[a-z]*\n?/g, "").trim();
                  return (
                    <pre key={index} className="rounded-xl border border-border bg-surface p-4 font-mono text-xs overflow-x-auto text-primary">
                      <code>{cleanCode}</code>
                    </pre>
                  );
                }
                if (paragraph.startsWith("|")) {
                  // Table rendering
                  const rows = paragraph.split("\n").map((r) => r.split("|").filter((c) => c.trim() !== ""));
                  if (rows.length >= 2) {
                    const header = rows[0];
                    const dataRows = rows.slice(2);
                    return (
                      <div key={index} className="overflow-x-auto my-6 border border-border rounded-xl">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-surface-elevated border-b border-border text-primary font-semibold">
                            <tr>
                              {header.map((cell, i) => (
                                <th key={i} className="py-2.5 px-3.5">{cell.trim()}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-subtle">
                            {dataRows.map((row, rIndex) => (
                              <tr key={rIndex} className="hover:bg-surface/50">
                                {row.map((cell, cIndex) => (
                                  <td key={cIndex} className="py-2.5 px-3.5 text-secondary">{cell.trim()}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                }
                return (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Citations & Source Ledger */}
            {blog.sourceUrls && blog.sourceUrls.length > 0 && (
              <section className="rounded-2xl border border-border bg-surface p-6 space-y-3 mt-12">
                <p className="font-mono text-xs uppercase tracking-widest text-tertiary">
                  Verified Source Ledger &amp; References
                </p>
                <div className="space-y-2 text-xs font-mono">
                  {blog.sourceUrls.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 text-secondary">
                      <span className="text-tertiary font-bold">[{i + 1}]</span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-accent hover:underline truncate max-w-lg"
                      >
                        {url}
                      </a>
                      <span className="text-tertiary text-[10px]">↗ Primary Spec</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Biography Footer Box */}
            <div className="rounded-2xl border border-border bg-surface/60 p-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-lg font-bold text-accent font-mono">
                {blog.author.name[0]}
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-semibold text-primary text-sm">{blog.author.name}</p>
                <p className="text-xs text-secondary font-normal">
                  {blog.author.role}. Contributing research essays, lens tests, and generative production benchmarks for Creator Intel.
                </p>
              </div>
            </div>
          </article>

          {/* Right Column: Connected Intelligence Layer */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-tertiary">
                  Referenced Production Tools
                </p>
                <div className="space-y-2.5">
                  {relatedTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="group flex items-center justify-between rounded-xl border border-border-subtle bg-background/50 p-3 transition hover:border-border-bright"
                    >
                      <div>
                        <p className="text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                          {tool.name}
                        </p>
                        <p className="text-[10px] text-tertiary font-mono">{tool.company || tool.category}</p>
                      </div>
                      <span className="text-xs text-tertiary group-hover:text-primary transition-colors">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Prompts */}
            {relatedPrompts.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-tertiary">
                  Referenced Prompt Recipes
                </p>
                <div className="space-y-2.5">
                  {relatedPrompts.map((prompt) => (
                    <Link
                      key={prompt.id}
                      href={`/prompts/${prompt.slug}`}
                      className="group block rounded-xl border border-border-subtle bg-background/50 p-3 transition hover:border-border-bright"
                    >
                      <p className="text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                        {prompt.title}
                      </p>
                      <p className="text-[10px] text-secondary line-clamp-1 mt-0.5">
                        {prompt.useCase}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Masterclasses */}
            {relatedVideos.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-tertiary">
                  Related Masterclasses
                </p>
                <div className="space-y-2.5">
                  {relatedVideos.map((video) => (
                    <Link
                      key={video.id}
                      href={`/videos/${video.slug}`}
                      className="group block rounded-xl border border-border-subtle bg-background/50 p-3 transition hover:border-border-bright"
                    >
                      <p className="text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                        {video.title}
                      </p>
                      <p className="text-[10px] font-mono text-tertiary mt-1">
                        {video.duration} • {video.creator.name}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Journal Navigation CTA */}
            <div className="rounded-2xl border border-border-subtle bg-surface/50 p-5 space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-tertiary">
                Creator Intel Journal
              </p>
              <p className="text-xs text-secondary leading-relaxed">
                Explore more camera benchmarks, diffusion physics, and director case studies.
              </p>
              <Link
                href="/journal"
                className="inline-flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-2 text-xs font-medium text-background hover:opacity-90 transition shadow-sm"
              >
                Back to All Dispatches
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
