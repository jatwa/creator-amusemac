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

      <div className="shell py-12 sm:py-20">
        <SectionHeading
          label="Production Assets"
          title="Creator Resources & Kits"
          description="High-value templates, prompt cheat sheets, treatment decks, and color LUTs to accelerate your creative workflow."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {resourcesData.map((res) => (
            <article
              key={res.id}
              className="surface p-8 transition duration-200 hover:border-zinc-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-0.5 text-xs font-semibold text-lime">
                    {res.type}
                  </span>
                  <span className="rounded-md border border-line bg-black/40 px-2.5 py-0.5 text-xs text-zinc-400 font-mono">
                    {res.format}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-white">
                  {res.title}
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {res.description}
                </p>
              </div>

              <div className="mt-8 border-t border-line/60 pt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Updated: {res.updatedAt}</span>
                <Link
                  href="/prompts"
                  className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-black hover:bg-lime transition"
                >
                  Access resource →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Community Submission Box */}
        <div className="mt-16 rounded-2xl border border-line bg-panel p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-glow">
          <span className="text-3xl text-lime font-mono">✦</span>
          <h3 className="mt-4 text-2xl font-bold text-white">
            Have a production kit or prompt recipe to share?
          </h3>
          <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
            Creator by Amusemac is continuously audited by working filmmakers and designers. Submit your tested workflows for inclusion.
          </p>
          <div className="mt-6">
            <a
              href="mailto:hello@amusemac.com?subject=Creator Resource Submission"
              className="inline-block rounded-xl bg-lime px-6 py-3 text-sm font-bold text-black hover:bg-white transition"
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
