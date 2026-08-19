import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { resourcesData } from "@/data/platform-data";

export const metadata: Metadata = {
  title: "Creator AI Resources, Templates & LUTs | Creator by Amusemac",
  description: "Free storyboard kits, cinematic camera cheat sheets, commercial treatment decks, and LUT packs.",
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      {/* Header */}
      <div className="border-b border-line bg-gradient-to-b from-panel/80 via-ink to-ink py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Production Assets"
            title="Director Toolkits & Resources"
            description="High-value templates, prompt cheat sheets, treatment decks, and color LUTs to accelerate your creative workflow."
          />
        </div>
      </div>

      <div className="shell py-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {resourcesData.map((res) => (
            <article
              key={res.id}
              className="surface surface-hover p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-xs bg-lime/10 px-3 py-0.5 rounded-full border border-lime/30">
                    {res.type}
                  </span>
                  <span className="rounded-md border border-line bg-ink px-2.5 py-0.5 text-xs text-zinc-400 font-mono">
                    {res.format}
                  </span>
                </div>

                <h2 className="mt-4 text-xl sm:text-2xl font-bold text-white leading-snug">
                  {res.title}
                </h2>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-300">
                  {res.description}
                </p>
              </div>

              <div className="mt-8 border-t border-line/60 pt-4 flex items-center justify-between font-mono text-xs">
                <span className="text-zinc-500 text-[11px]">Updated: {res.updatedAt}</span>
                <Link
                  href="/prompts"
                  className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-lime transition shadow-glow-subtle"
                >
                  Access Resource →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Community Submission Box */}
        <div className="mt-16 rounded-2xl border border-line bg-panel p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-card">
          <span className="text-3xl text-lime font-mono">✦</span>
          <h3 className="mt-4 text-2xl font-bold text-white tracking-tight">
            Have a production kit or prompt recipe to share?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Creator by Amusemac is continuously audited by working filmmakers and designers. Submit your tested workflows for inclusion in our knowledge base.
          </p>
          <div className="mt-6">
            <a
              href="mailto:hello@amusemac.com?subject=Creator Resource Submission"
              className="inline-block rounded-full bg-lime px-6 py-2.5 text-xs sm:text-sm font-bold text-black hover:bg-white transition shadow-glow-subtle"
            >
              Submit a Workflow or Resource
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
