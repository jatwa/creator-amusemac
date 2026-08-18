import Link from "next/link";
import { CategoryGrid } from "@/components/category-grid";
import { ComparisonList } from "@/components/comparison-list";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Navigation } from "@/components/navigation";
import { PromptList } from "@/components/prompt-list";
import { SectionHeading } from "@/components/section-heading";
import { ToolGrid } from "@/components/tool-grid";
import { TutorialList } from "@/components/tutorial-list";
import { db } from "@/lib/db/repository";

export default function Home() {
  const latestBlogs = db.getPublishedBlogs().slice(0, 2);
  const latestVideos = db.getPublishedVideos().slice(0, 2);

  return (
    <main>
      <Navigation />
      <Hero />
      <section id="categories" className="shell py-20 sm:py-28">
        <SectionHeading
          label="Explore"
          title="Find the right creative edge."
          description="Curated starting points for every stage of your next visual project."
        />
        <CategoryGrid />
      </section>

      <section id="tools" className="shell py-20 sm:py-28">
        <SectionHeading
          label="Creator stack"
          title="Featured AI tools"
          description="Useful tools, judged through a creator’s lens—not a hype cycle."
        />
        <ToolGrid />
      </section>

      {/* Latest from Creator Section */}
      <section id="latest" className="shell py-20 sm:py-28 border-t border-line/40">
        <SectionHeading
          label="Editorial &amp; Media"
          title="Latest from Creator"
          description="In-depth cinematography analyses and video timeline breakdowns from working visual directors."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Latest Editorial Essays */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-lime font-mono">
                Editorial Benchmarks
              </span>
              <Link href="/blog" className="text-xs text-zinc-400 hover:text-white transition">
                View all essays →
              </Link>
            </div>

            <div className="space-y-4">
              {latestBlogs.map((b) => (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="surface p-6 block group transition hover:border-lime"
                >
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span className="text-lime">{b.category}</span>
                    <span>•</span>
                    <span>{b.readingTime}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white group-hover:text-lime transition leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {b.excerpt}
                  </p>
                  <p className="mt-4 text-[11px] text-zinc-500 font-mono">
                    By {b.author.name} • {b.publishedAt}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Latest Video Breakdowns */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-lime font-mono">
                Video Masterclasses
              </span>
              <Link href="/videos" className="text-xs text-zinc-400 hover:text-white transition">
                View all videos →
              </Link>
            </div>

            <div className="space-y-4">
              {latestVideos.map((v) => (
                <Link
                  key={v.id}
                  href={`/videos/${v.slug}`}
                  className="surface p-6 block group transition hover:border-lime"
                >
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span className="text-lime">▶ {v.platform.toUpperCase()}</span>
                    <span>•</span>
                    <span>{v.duration}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white group-hover:text-lime transition leading-snug">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {v.description}
                  </p>
                  <p className="mt-4 text-[11px] text-zinc-500 font-mono">
                    By {v.creator.name} • {v.publishedAt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="prompts" className="shell py-20 sm:py-28">
        <SectionHeading
          label="Make better"
          title="Popular prompts"
          description="Starting points you can adapt to your own voice, format, and audience."
        />
        <PromptList />
      </section>

      <section id="compare" className="shell py-20 sm:py-28">
        <SectionHeading
          label="Decide with confidence"
          title="Creator comparisons"
          description="Straight answers when two capable tools overlap."
        />
        <ComparisonList />
      </section>

      <section id="tutorials" className="shell py-20 sm:py-28">
        <SectionHeading
          label="Learn the workflow"
          title="Tutorials that ship work"
          description="Short, practical guides for building a faster creative practice."
        />
        <TutorialList />
      </section>

      <Footer />
    </main>
  );
}
