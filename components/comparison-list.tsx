import Link from "next/link";
import { comparisonsData } from "@/data/platform-data";
import { getToolById } from "@/data/content";

export function ComparisonList() {
  return (
    <div>
      <div className="divide-y divide-line rounded-2xl border border-line bg-panel overflow-hidden">
        {comparisonsData.map((item) => {
          const toolA = getToolById(item.toolAId);
          const toolB = getToolById(item.toolBId);
          const titleLeft = toolA ? toolA.name : "Tool A";
          const titleRight = toolB ? toolB.name : "Tool B";

          return (
            <article
              key={item.id}
              className="grid gap-5 p-6 sm:grid-cols-[220px_1fr_auto] sm:items-center transition hover:bg-white/[0.02]"
            >
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-lime">
                  {item.category}
                </p>
                <h3 className="mt-1.5 font-bold text-lg text-white">
                  {titleLeft} <span className="text-zinc-500 font-normal">vs</span> {titleRight}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                  <span>Score: {item.scores.quality.toolA}/10 vs {item.scores.quality.toolB}/10</span>
                </div>
              </div>

              <div>
                <p className="text-sm leading-6 text-zinc-300">
                  {item.summaryVerdict}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                  <span>Scenarios: {item.verdictByScenario.length} evaluated</span>
                  <span>•</span>
                  <span>{item.featureMatrix.length} feature matrix points</span>
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2">
                <Link
                  href={`/compare/${item.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-ink px-4 py-2 text-xs font-semibold text-lime transition hover:border-lime hover:bg-lime hover:text-black"
                >
                  <span>Read verdict</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-3 text-sm font-semibold text-white transition hover:border-lime hover:bg-white/5"
        >
          <span>View all {comparisonsData.length} head-to-head comparisons</span>
          <span className="text-lime">→</span>
        </Link>
      </div>
    </div>
  );
}
