import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { db } from "@/lib/db/repository";
import { StructuredData } from "@/components/structured-data";

export async function generateStaticParams() {
  const blogs = db.getPublishedBlogs();
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
  const blog = db.getBlogBySlug(slug);
  if (!blog) return { title: "Article Not Found — Creator by Amusemac" };

  return {
    title: `${blog.title} — Creator Journal`,
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
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = db.getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const relatedTools = db.getRelatedToolsForBlog(blog);
  const relatedPrompts = db.getRelatedPromptsForBlog(blog);
  const relatedTutorials = db.getRelatedTutorialsForBlog(blog);
  const relatedVideos = db.getRelatedVideosForBlog(blog);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
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
      name: "Creator by Amusemac",
      url: "https://creator.amusemac.com",
    },
  };

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Editorial Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-tertiary font-mono mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Journal</Link>
            <span>/</span>
            <span className="text-secondary truncate max-w-xs">{blog.slug}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent font-mono text-[11px]">
              {blog.category}
            </span>
            <span className="font-mono text-secondary">{blog.readingTime}</span>
            <span className="text-tertiary">•</span>
            <span className="font-mono text-secondary">Published {blog.publishedAt}</span>
            <span className="text-tertiary">•</span>
            <span className="font-mono text-tertiary">Updated {blog.updatedAt}</span>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-5xl leading-tight max-w-4xl">
            {blog.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-secondary leading-relaxed max-w-3xl font-normal">
            {blog.excerpt}
          </p>

          {/* Author Card */}
          <div className="flex items-center gap-3 pt-6 border-t border-border-subtle mt-8">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center font-semibold text-accent text-sm">
              {blog.author.name[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">{blog.author.name}</p>
              <p className="text-xs text-tertiary font-mono">{blog.author.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content Layout */}
      <div className="shell py-14">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Main Editorial Text */}
          <article className="lg:col-span-3 space-y-8">
            <div className="prose max-w-none text-secondary leading-relaxed text-base space-y-6">
              {blog.contentMarkdown.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl font-semibold text-primary pt-6 pb-2 border-b border-border-subtle">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-lg font-semibold text-primary pt-4 pb-1">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("```")) {
                  const code = paragraph.replace(/```[a-z]*\n?/g, "").trim();
                  return (
                    <pre key={index} className="rounded-xl border border-border-subtle bg-surface-elevated p-4 font-mono text-xs text-primary overflow-x-auto">
                      <code>{code}</code>
                    </pre>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  const items = paragraph.split("\n").map((item) => item.replace("- ", ""));
                  return (
                    <ul key={index} className="space-y-2 list-disc list-inside text-secondary">
                      {items.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={index} className="leading-7 sm:leading-8 font-normal">{paragraph}</p>;
              })}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-6 border-t border-border-subtle">
              {blog.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-secondary font-mono">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Sources and Attributions */}
            {blog.sourceUrls && blog.sourceUrls.length > 0 && (
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs">
                <p className="font-semibold text-primary uppercase tracking-wider text-[11px] mb-2 font-mono">
                  Verified External Sources &amp; Primary Benchmarks:
                </p>
                <ul className="space-y-1">
                  {blog.sourceUrls.map((url) => (
                    <li key={url}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:opacity-80 font-mono">
                        {url} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          {/* Sidebar: Interconnected Platform Content */}
          <aside className="space-y-8 lg:col-span-1">
            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="surface p-5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Referenced Tools ({relatedTools.length})
                </h3>
                <div className="space-y-2.5">
                  {relatedTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="block rounded-lg border border-border-subtle bg-surface-elevated p-3 text-xs transition hover:border-border-bright group"
                    >
                      <p className="font-semibold text-primary group-hover:text-accent transition-colors">{tool.name}</p>
                      <p className="text-[11px] text-tertiary line-clamp-1">{tool.tagline}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Prompts */}
            {relatedPrompts.length > 0 && (
              <div className="surface p-5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Linked Prompt Recipes
                </h3>
                <div className="space-y-2.5">
                  {relatedPrompts.map((prompt) => (
                    <Link
                      key={prompt.id}
                      href={`/prompts/${prompt.slug}`}
                      className="block rounded-lg border border-border-subtle bg-surface-elevated p-3 text-xs transition hover:border-border-bright group"
                    >
                      <p className="font-semibold text-primary group-hover:text-accent transition-colors">{prompt.title}</p>
                      <p className="text-[11px] text-tertiary line-clamp-1">{prompt.useCase}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Videos */}
            {relatedVideos.length > 0 && (
              <div className="surface p-5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Video Masterclasses
                </h3>
                <div className="space-y-2.5">
                  {relatedVideos.map((vid) => (
                    <Link
                      key={vid.id}
                      href={`/videos/${vid.slug}`}
                      className="block rounded-lg border border-border-subtle bg-surface-elevated p-3 text-xs transition hover:border-border-bright group"
                    >
                      <p className="font-semibold text-primary line-clamp-1 group-hover:text-accent transition-colors">{vid.title}</p>
                      <p className="text-[11px] text-tertiary font-mono">▶ {vid.duration}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Tutorials */}
            {relatedTutorials.length > 0 && (
              <div className="surface p-5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Practical Tutorials
                </h3>
                <div className="space-y-2.5">
                  {relatedTutorials.map((tut) => (
                    <Link
                      key={tut.id}
                      href={`/tutorials/${tut.slug}`}
                      className="block rounded-lg border border-border-subtle bg-surface-elevated p-3 text-xs transition hover:border-border-bright group"
                    >
                      <p className="font-semibold text-primary line-clamp-1 group-hover:text-accent transition-colors">{tut.title}</p>
                      <p className="text-[11px] text-tertiary font-mono">{tut.readTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
