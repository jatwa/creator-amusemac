import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { toolsData } from "@/data/platform-data";

export const metadata: Metadata = {
  title: "Creator AI Tools Directory | Curated Creative Stacks",
  description: "Browse verified AI tools for video generation, image direction, voice synthesis, editing, and VFX.",
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />
      
      <div className="shell py-12 sm:py-20">
        <SectionHeading
          label="Tool Intelligence"
          title="Creator AI Tools Directory"
          description="Verified, production-tested generative tools judged through a creator's lens—not a hype cycle."
        />

        {/* Category Quick Filter Strip */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-line pb-8">
          <Link
            href="/tools"
            className="rounded-full bg-lime px-4 py-1.5 text-xs font-semibold text-black"
          >
            All Tools ({toolsData.length})
          </Link>
          <Link
            href="/categories/video"
            className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
          >
            Video Generation
          </Link>
          <Link
            href="/categories/image"
            className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
          >
            Image Direction
          </Link>
          <Link
            href="/categories/editing"
            className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
          >
            Editing & Post
          </Link>
          <Link
            href="/categories/audio"
            className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
          >
            Voice & Audio
          </Link>
          <Link
            href="/categories/vfx"
            className="rounded-full border border-line bg-panel px-4 py-1.5 text-xs font-medium text-zinc-300 hover:border-lime hover:text-white transition"
          >
            Upscaling & VFX
          </Link>
        </div>

        {/* Tools Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {toolsData.map((tool) => (
            <article
              key={tool.id}
              className="surface group flex flex-col justify-between overflow-hidden transition duration-200 hover:border-zinc-500"
            >
              <div>
                <div className={`h-28 bg-gradient-to-br ${tool.accentColor} to-transparent p-6 flex items-start justify-between border-b border-line/40`}>
                  <span className="rounded-full border border-white/20 bg-black/40 px-3 py-0.5 text-xs font-mono text-zinc-300">
                    ★ {tool.rating?.toFixed(1) || "4.8"}
                  </span>
                  <span className="rounded-full border border-lime/30 bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-lime">
                    {tool.pricing.model.toUpperCase()}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-lime">
                      {tool.category}
                    </span>
                    <span className="text-zinc-500">
                      {tool.pricing.startingPrice || "Free"}
                    </span>
                  </div>

                  <h2 className="mt-2 text-2xl font-bold text-white group-hover:text-lime transition">
                    <Link href={`/tools/${tool.slug}`}>
                      {tool.name}
                    </Link>
                  </h2>

                  <p className="mt-2 text-xs font-medium text-zinc-300">
                    {tool.tagline}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-zinc-400">
                    {tool.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tool.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-md border border-line bg-black/40 px-2 py-0.5 text-[11px] text-zinc-400"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-line/60 p-6 pt-4">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                  <span>Best for: {tool.bestFor.split(",")[0]}</span>
                  <span>Platforms: {tool.platforms.join(", ")}</span>
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href={tool.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-white transition"
                  >
                    Official site ↗
                  </a>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="rounded-lg border border-line bg-ink px-3 py-1.5 text-xs font-semibold text-lime hover:border-lime transition"
                  >
                    View dossier →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
