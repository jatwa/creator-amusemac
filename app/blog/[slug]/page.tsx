import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
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
  if (!blog) return { title: "Article Not Found | Creator by Amusemac" };

  return {
    title: `${blog.title} | Creator by Amusemac`,
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

  // Article structured data
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
    <article className="space-y-12">
      <StructuredData data={jsonLd} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-white transition">Blog</Link>
        <span>/</span>
        <span className="text-zinc-300 truncate max-w-xs">{blog.slug}</span>
      </nav>

      {/* Article Header */}
      <header className="space-y-4 border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-md border border-lime/30 bg-lime/10 px-2.5 py-0.5 font-bold uppercase tracking-wider text-lime">
            {blog.category}
          </span>
          <span className="font-mono text-zinc-400">{blog.readingTime}</span>
          <span className="text-zinc-600">•</span>
          <span className="font-mono text-zinc-400">Published {blog.publishedAt}</span>
          <span className="text-zinc-600">•</span>
          <span className="font-mono text-zinc-500">Updated {blog.updatedAt}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
          {blog.title}
        </h1>

        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-4xl">
          {blog.excerpt}
        </p>

        {/* Author Card */}
        <div className="flex items-center gap-3 pt-4">
          <div className="h-11 w-11 rounded-full bg-lime/20 border border-lime/40 flex items-center justify-center font-bold text-lime">
            {blog.author.name[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{blog.author.name}</p>
            <p className="text-xs text-zinc-400">{blog.author.role}</p>
          </div>
        </div>
      </header>

      {/* Article Content Layout */}
      <div className="grid gap-12 lg:grid-cols-4">
        {/* Main Editorial Text */}
        <div className="lg:col-span-3 space-y-8">
          <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-sm sm:text-base space-y-6">
            {blog.contentMarkdown.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-bold text-white pt-4 pb-2 border-b border-line/60">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-lg font-bold text-lime pt-3 pb-1">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("```")) {
                const code = paragraph.replace(/```[a-z]*\n?/g, "").trim();
                return (
                  <pre key={index} className="rounded-xl border border-line bg-black/60 p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                );
              }
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").map((item) => item.replace("- ", ""));
                return (
                  <ul key={index} className="space-y-2 list-disc list-inside text-zinc-300">
                    {items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-line">
            {blog.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-line bg-panel px-3 py-1 text-xs text-zinc-400 font-mono">
                #{tag}
              </span>
            ))}
          </div>

          {/* Sources and Attributions */}
          {blog.sourceUrls && blog.sourceUrls.length > 0 && (
            <div className="rounded-xl border border-line bg-black/40 p-4 text-xs">
              <p className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] mb-2 font-mono">
                Verified External Sources &amp; Primary Benchmarks:
              </p>
              <ul className="space-y-1">
                {blog.sourceUrls.map((url) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-lime underline hover:text-white">
                      {url} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar: Interconnected Platform Content */}
        <aside className="space-y-8 lg:col-span-1">
          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="surface p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-lime font-mono">
                Referenced Tools ({relatedTools.length})
              </h3>
              <div className="space-y-2.5">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="block rounded-lg border border-line/60 bg-black/30 p-3 text-xs transition hover:border-lime"
                  >
                    <p className="font-bold text-white">{tool.name}</p>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{tool.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Prompts */}
          {relatedPrompts.length > 0 && (
            <div className="surface p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-lime font-mono">
                Linked Prompt Recipes
              </h3>
              <div className="space-y-2.5">
                {relatedPrompts.map((prompt) => (
                  <Link
                    key={prompt.id}
                    href={`/prompts/${prompt.slug}`}
                    className="block rounded-lg border border-line/60 bg-black/30 p-3 text-xs transition hover:border-lime"
                  >
                    <p className="font-bold text-white">{prompt.title}</p>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{prompt.useCase}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Videos */}
          {relatedVideos.length > 0 && (
            <div className="surface p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-lime font-mono">
                Video Breakdowns
              </h3>
              <div className="space-y-2.5">
                {relatedVideos.map((vid) => (
                  <Link
                    key={vid.id}
                    href={`/videos/${vid.slug}`}
                    className="block rounded-lg border border-line/60 bg-black/30 p-3 text-xs transition hover:border-lime"
                  >
                    <p className="font-bold text-white line-clamp-1">{vid.title}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">▶ {vid.duration}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Tutorials */}
          {relatedTutorials.length > 0 && (
            <div className="surface p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-lime font-mono">
                Practical Tutorials
              </h3>
              <div className="space-y-2.5">
                {relatedTutorials.map((tut) => (
                  <Link
                    key={tut.id}
                    href={`/tutorials/${tut.slug}`}
                    className="block rounded-lg border border-line/60 bg-black/30 p-3 text-xs transition hover:border-lime"
                  >
                    <p className="font-bold text-white line-clamp-1">{tut.title}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">{tut.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}
