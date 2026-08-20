import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { VideoCard } from "@/components/ui-cards";
import { SyncedEditorialHub } from "@/components/synced-editorial-view";
import { db } from "@/lib/db/repository";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = {
  title: "Masterclasses & Synchronized Video Intelligence — Creator by Amusemac",
  description:
    "Curated video masterclasses, timeline breakdowns, and camera control tutorials directly synced with prompt recipes and tool dossiers.",
};

export default function VideosIndexPage() {
  const videos = db.getPublishedVideos();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Video Intelligence Library"
            title="Visual Production Masterclasses"
            description="Verified camera syntax tutorials, prompt benchmarks, and full commercial timeline walkthroughs tightly coupled with prompt recipes and tool dossiers."
          />

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/videos"
              className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background shadow-sm"
            >
              All Masterclasses ({videos.length})
            </Link>
            <Link
              href="/search?q=camera"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Camera &amp; Motion Syntax
            </Link>
            <Link
              href="/search?q=commercial"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Commercial Breakdowns
            </Link>
            <Link
              href="/search?q=workflow"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Timeline Workflows
            </Link>
          </div>
        </div>
      </div>

      <div className="shell py-12 space-y-16">
        {/* Synchronized Masterclass & Integrated Asset Hub */}
        <SyncedEditorialHub />

        {/* Video Catalog Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                Archival Masterclasses
              </span>
              <h2 className="text-xl font-semibold text-primary mt-0.5">
                Director &amp; DP Production Walkthroughs
              </h2>
            </div>
            <span className="text-xs text-tertiary font-mono">
              {videos.length} Verified Masterclasses
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>

        <AdSlot slotId="videos-bottom" label="Video Production Intelligence Sponsor" />
      </div>

      <Footer />
    </main>
  );
}
