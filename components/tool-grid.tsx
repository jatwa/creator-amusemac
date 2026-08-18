import Link from "next/link";
import { toolsData } from "@/data/platform-data";

export function ToolGrid() {
  const featuredTools = toolsData.slice(0, 3);

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-3">
        {featuredTools.map((tool, index) => (
          <article
            key={tool.id}
            className="surface group flex flex-col justify-between overflow-hidden transition duration-200 hover:border-zinc-500"
          >
            <div>
              <div className={`h-32 bg-gradient-to-br ${tool.accentColor} to-transparent p-6 flex items-start justify-between`}>
                <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-mono text-zinc-300">
                  0{index + 1}
                </span>
                <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-xs text-lime border border-lime/20">
                  {tool.pricing.model.toUpperCase()}
                </span>
              </div>

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-lime">
                  {tool.subcategories[0] || tool.category}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white group-hover:text-lime transition">
                  {tool.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {tool.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tool.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub}
                      className="rounded-md border border-line bg-black/30 px-2 py-0.5 text-[11px] text-zinc-400"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-line/60 p-6 pt-4 flex items-center justify-between">
              <span className="text-xs text-zinc-500">{tool.bestFor.split(",")[0]}</span>
              <Link
                href={`/tools/${tool.slug}`}
                className="text-sm font-semibold text-lime hover:text-white transition flex items-center gap-1"
              >
                View tool dossier →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-3 text-sm font-semibold text-white transition hover:border-lime hover:bg-white/5"
        >
          <span>View all {toolsData.length} curated AI tools</span>
          <span className="text-lime">→</span>
        </Link>
      </div>
    </div>
  );
}
