import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { comparisonsData } from "@/data/platform-data";
import { getToolById } from "@/data/content";

export const metadata: Metadata = {
  title: "Head-to-Head Creator Tool Comparisons | Creator by Amusemac",
  description: "Direct side-by-side evaluations of Runway vs Kling, Midjourney vs Ideogram, Descript vs CapCut, and more.",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      <div className="shell py-12 sm:py-20">
        <SectionHeading
          label="Decision Engine"
          title="Creator Tool Comparisons"
          description="Straight answers when two capable tools overlap. Unbiased creator evaluations by scenario, quality, speed, and production suitability."
        />

        <div className="mt-12 space-y-6">
          {comparisonsData.map((item) => {
            const toolA = getToolById(item.toolAId);
            const toolB = getToolById(item.toolBId);
            const nameA = toolA?.name || "Tool A";
            const nameB = toolB?.name || "Tool B";

            return (
              <article
                key={item.id}
                className="surface p-8 transition duration-200 hover:border-zinc-500"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
                      {item.category.toUpperCase()}
                    </span>

                    <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
                      {nameA} <span className="text-zinc-500 font-normal">vs</span> {nameB}
                    </h2>

                    <p className="mt-3 text-base text-zinc-300 leading-7 max-w-3xl">
                      {item.summaryVerdict}
                    </p>
                  </div>

                  <Link
                    href={`/compare/${item.slug}`}
                    className="rounded-xl bg-lime px-6 py-3 text-sm font-bold text-black transition hover:bg-white shrink-0 self-start md:self-center flex items-center gap-2"
                  >
                    <span>Read full comparison</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Score Comparison Bars */}
                <div className="mt-8 grid gap-4 border-t border-line/60 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border border-line bg-black/20 p-4">
                    <p className="text-xs text-zinc-500">Visual Quality</p>
                    <div className="mt-2 flex items-center justify-between text-sm font-mono text-white">
                      <span>{nameA}: {item.scores.quality.toolA}/10</span>
                      <span className="text-zinc-600">|</span>
                      <span>{nameB}: {item.scores.quality.toolB}/10</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-line bg-black/20 p-4">
                    <p className="text-xs text-zinc-500">Generation Speed</p>
                    <div className="mt-2 flex items-center justify-between text-sm font-mono text-white">
                      <span>{nameA}: {item.scores.speed.toolA}/10</span>
                      <span className="text-zinc-600">|</span>
                      <span>{nameB}: {item.scores.speed.toolB}/10</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-line bg-black/20 p-4">
                    <p className="text-xs text-zinc-500">Ease of Use</p>
                    <div className="mt-2 flex items-center justify-between text-sm font-mono text-white">
                      <span>{nameA}: {item.scores.easeOfUse.toolA}/10</span>
                      <span className="text-zinc-600">|</span>
                      <span>{nameB}: {item.scores.easeOfUse.toolB}/10</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-line bg-black/20 p-4">
                    <p className="text-xs text-zinc-500">Production Value</p>
                    <div className="mt-2 flex items-center justify-between text-sm font-mono text-white">
                      <span>{nameA}: {item.scores.creatorValue.toolA}/10</span>
                      <span className="text-zinc-600">|</span>
                      <span>{nameB}: {item.scores.creatorValue.toolB}/10</span>
                    </div>
                  </div>
                </div>

                {/* Scenario Preview */}
                <div className="mt-6 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime">
                    Key Scenario Winners:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.verdictByScenario.map((scenario, i) => {
                      const winner = getToolById(scenario.winnerId);
                      return (
                        <span
                          key={i}
                          className="rounded-md border border-line bg-black/40 px-3 py-1 text-xs text-zinc-300"
                        >
                          <span className="text-zinc-400">{scenario.scenario}: </span>
                          <strong className="text-lime">{winner?.name || scenario.winnerId}</strong>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
