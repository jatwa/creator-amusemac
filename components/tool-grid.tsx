import Link from "next/link";
import { toolsData } from "@/data/platform-data";
import { ToolCard } from "@/components/ui-cards";

export function ToolGrid() {
  const featuredTools = toolsData.slice(0, 3);

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredTools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-3 text-xs sm:text-sm font-semibold text-white transition hover:border-lime hover:bg-panel-hover"
        >
          <span>View all {toolsData.length} curated AI tools</span>
          <span className="text-lime">→</span>
        </Link>
      </div>
    </div>
  );
}
