import Link from "next/link";
import { promptsData } from "@/data/platform-data";
import { PromptCard } from "@/components/ui-cards";

export function PromptList() {
  const featuredPrompts = promptsData.slice(0, 6);

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredPrompts.map((item) => (
          <PromptCard key={item.id} prompt={item} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/prompts"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-3 text-xs sm:text-sm font-semibold text-white transition hover:border-lime hover:bg-panel-hover"
        >
          <span>Explore all {promptsData.length} production prompts</span>
          <span className="text-lime">→</span>
        </Link>
      </div>
    </div>
  );
}
