import Link from "next/link";
import { Metadata } from "next";
import { db } from "@/lib/db/repository";

export const metadata: Metadata = {
  title: "Curated Video Breakdowns & Masterclasses | Creator by Amusemac",
  description:
    "Curated video masterclasses, timeline breakdowns, camera control tutorials, and tool comparisons from top visual creators.",
};

export default function VideosIndexPage() {
  const videos = db.getPublishedVideos();

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-xs text-lime">
          <span>●</span>
          <span>VIDEO MASTERCLASSES &amp; BREAKDOWNS</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Visual Production Masterclasses
        </h1>
        <p className="max-w-3xl text-base text-zinc-400 sm:text-lg">
          Curated video essays, camera syntax tutorials, prompt benchmarks, and full commercial timeline walkthroughs from verified creator channels.
        </p>
      </section>

      {/* Video Grid */}
      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <article
            key={video.id}
            className="surface group flex flex-col justify-between overflow-hidden transition hover:border-lime"
          >
            <div>
              {/* Thumbnail / Player Banner Area */}
              <div className="relative aspect-video w-full bg-black/80 border-b border-line flex items-center justify-center overflow-hidden">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="text-zinc-600 font-mono text-xs">VIDEO PREVIEW</div>
                )}
                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 rounded bg-black/80 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] font-bold text-white border border-white/10">
                  {video.duration}
                </span>
                {/* Platform Badge */}
                <span className="absolute top-2.5 left-2.5 rounded bg-black/80 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] font-bold text-lime uppercase border border-lime/20">
                  {video.platform}
                </span>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{video.category}</span>
                  <span className="text-zinc-500">{video.publishedAt}</span>
                </div>

                <h2 className="mt-3 text-lg font-bold text-white group-hover:text-lime transition leading-snug">
                  <Link href={`/videos/${video.slug}`}>{video.title}</Link>
                </h2>

                <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-zinc-400 truncate max-w-[150px]">
                by {video.creator.name}
              </span>
              <Link
                href={`/videos/${video.slug}`}
                className="font-bold text-lime hover:underline"
              >
                Watch breakdown →
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
