import Link from "next/link";
import { comparisonsData } from "@/data/platform-data";
import { ComparisonCard } from "@/components/ui-cards";

export function ComparisonList() {
  const featured = comparisonsData.slice(0, 3);

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((comp) => (
          <ComparisonCard key={comp.id} comparison={comp} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/compare"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-3 text-xs sm:text-sm font-semibold text-white transition hover:border-lime hover:bg-panel-hover"
        >
          <span>View all {comparisonsData.length} head-to-head comparisons</span>
          <span className="text-lime">→</span>
        </Link>
      </div>
    </div>
  );
}
