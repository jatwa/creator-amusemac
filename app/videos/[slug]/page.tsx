import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { db } from "@/lib/db/repository";
import { StructuredData } from "@/components/structured-data";

export async function generateStaticParams() {
  const videos = db.getPublishedVideos();
  return videos.map((video) => ({
    slug: video.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = db.getVideoBySlug(slug);
  if (!video) return { title: "Video Not Found | Creator by Amusemac" };

  return {
    title: `${video.title} | Creator Masterclass`,
    description: video.description,
    openGraph: {
      title: video.title,
      description: video.description,
      type: "video.other",
      videos: [{ url: video.videoUrl }],
    },
  };
}

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = db.getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  const relatedTools = db.getRelatedToolsForVideo(video);
  const relatedPrompts = db.getRelatedPromptsForVideo(video);
  const relatedTutorials = db.getRelatedTutorialsForVideo(video);
  const relatedBlogs = db.getRelatedBlogsForVideo(video);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: [video.thumbnailUrl || "https://images.unsplash.com/photo-1536240478700-b869070f9279"],
    uploadDate: video.publishedAt,
    duration: `PT${video.duration.replace(":", "M")}S`,
    embedUrl: video.embedUrl,
    author: {
      "@type": "Person",
      name: video.creator.name,
      url: video.creator.channelUrl,
    },
  };

  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Header */}
      <div className="border-b border-line bg-gradient-to-b from-panel via-ink to-ink py-12 sm:py-16">
        <div className="shell">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-6">
            <Link href="/" className="hover:text-lime transition">Home</Link>
            <span>/</span>
            <Link href="/videos" className="hover:text-lime transition">Videos</Link>
            <span>/</span>
            <span className="text-zinc-300 truncate max-w-xs">{video.slug}</span>
          </nav>

          {/* Video Player Section */}
          <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black shadow-card">
              <iframe
                src={video.embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>

            {/* Video Header & Meta */}
            <div className="space-y-4 border-b border-line pb-8">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-bold uppercase tracking-wider text-lime font-mono text-[11px]">
                  {video.category}
                </span>
                <span className="font-mono text-zinc-400">Duration: {video.duration}</span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-zinc-400">Platform: {video.platform.toUpperCase()}</span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono text-zinc-500">Released {video.publishedAt}</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight">
                {video.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-line/60">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-lime/20 border border-lime/40 flex items-center justify-center font-bold text-lime">
                    {video.creator.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{video.creator.name}</p>
                    <a
                      href={video.creator.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-lime underline hover:text-white font-mono"
                    >
                      Creator Channel ↗
                    </a>
                  </div>
                </div>

                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-5 py-2.5 text-xs font-semibold text-zinc-200 hover:border-lime hover:text-white transition"
                >
                  <span>Watch on {video.platform === "youtube" ? "YouTube" : "Platform"}</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Relationships Grid */}
      <div className="shell py-12">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Description & Key Takeaways */}
          <div className="lg:col-span-3 space-y-8">
            <section className="surface p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                <h2 className="text-lg font-bold text-white tracking-tight">Breakdown Overview &amp; Curriculum</h2>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                {video.description}
              </p>
            </section>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {video.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-line bg-panel px-3 py-1 text-xs text-zinc-400 font-mono">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Source Attribution Notice */}
            <div className="rounded-xl border border-line bg-panel/60 p-4 text-xs text-zinc-400">
              <p className="font-bold text-zinc-300 uppercase tracking-wider text-[11px] mb-1 font-mono">
                Attribution &amp; Fair Use Policy:
              </p>
              <p>
                This video is embedded directly from the creator&apos;s verified channel on {video.platform}. Creator by Amusemac does not mirror or rehost third-party video media. All watch time and engagements directly credit {video.creator.name}.
              </p>
            </div>
          </div>

          {/* Sidebar: Linked Platform Content */}
          <aside className="space-y-8 lg:col-span-1">
            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="surface p-5 space-y-3">
                <h3 className="eyebrow text-xs">
                  Tools Used in Video ({relatedTools.length})
                </h3>
                <div className="space-y-2.5">
                  {relatedTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="block rounded-lg border border-line/60 bg-ink/70 p-3 text-xs transition hover:border-lime group"
                    >
                      <p className="font-bold text-white group-hover:text-lime transition">{tool.name}</p>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{tool.tagline}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Prompts */}
            {relatedPrompts.length > 0 && (
              <div className="surface p-5 space-y-3">
                <h3 className="eyebrow text-xs">
                  Featured Prompt Recipes
                </h3>
                <div className="space-y-2.5">
                  {relatedPrompts.map((prompt) => (
                    <Link
                      key={prompt.id}
                      href={`/prompts/${prompt.slug}`}
                      className="block rounded-lg border border-line/60 bg-ink/70 p-3 text-xs transition hover:border-lime group"
                    >
                      <p className="font-bold text-white group-hover:text-lime transition">{prompt.title}</p>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{prompt.useCase}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Blogs */}
            {relatedBlogs.length > 0 && (
              <div className="surface p-5 space-y-3">
                <h3 className="eyebrow text-xs">
                  Editorial Deep Dives
                </h3>
                <div className="space-y-2.5">
                  {relatedBlogs.map((b) => (
                    <Link
                      key={b.id}
                      href={`/blog/${b.slug}`}
                      className="block rounded-lg border border-line/60 bg-ink/70 p-3 text-xs transition hover:border-lime group"
                    >
                      <p className="font-bold text-white line-clamp-1 group-hover:text-lime transition">{b.title}</p>
                      <p className="text-[11px] text-zinc-500 font-mono">{b.readingTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Tutorials */}
            {relatedTutorials.length > 0 && (
              <div className="surface p-5 space-y-3">
                <h3 className="eyebrow text-xs">
                  Step-by-Step Guides
                </h3>
                <div className="space-y-2.5">
                  {relatedTutorials.map((tut) => (
                    <Link
                      key={tut.id}
                      href={`/tutorials/${tut.slug}`}
                      className="block rounded-lg border border-line/60 bg-ink/70 p-3 text-xs transition hover:border-lime group"
                    >
                      <p className="font-bold text-white line-clamp-1 group-hover:text-lime transition">{tut.title}</p>
                      <p className="text-[11px] text-zinc-500 font-mono">{tut.readTime}</p>
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
