import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { VideoCard } from "@/components/ui-cards";
import { db } from "@/lib/db/repository";

export const metadata: Metadata = {
  title: "Masterclasses & Video Timeline Breakdowns | Creator by Amusemac",
  description:
    "Curated video masterclasses, timeline breakdowns, camera control tutorials, and tool comparisons from top visual creators.",
};

export default function VideosIndexPage() {
  const videos = db.getPublishedVideos();

  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      {/* Header */}
      <div className="border-b border-line bg-gradient-to-b from-panel/80 via-ink to-ink py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Video Library"
            title="Visual Production Masterclasses"
            description="Curated video essays, camera syntax tutorials, prompt benchmarks, and full commercial timeline walkthroughs from verified creator channels."
          />

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/videos"
              className="rounded-full bg-lime px-4 py-1.5 text-xs font-semibold text-black shadow-glow-subtle"
            >
              All Masterclasses ({videos.length})
            </Link>
            <Link
              href="/search?q=camera"
              className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
            >
              Camera &amp; Motion Syntax
            </Link>
            <Link
              href="/search?q=commercial"
              className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
            >
              Commercial Breakdowns
            </Link>
            <Link
              href="/search?q=workflow"
              className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
            >
              Timeline Workflows
            </Link>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="shell py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
