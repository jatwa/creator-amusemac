import Link from "next/link";
import { tutorialsData } from "@/data/platform-data";

export function TutorialList() {
  const featuredTutorials = tutorialsData.slice(0, 3);

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        {featuredTutorials.map((item, index) => (
          <Link
            href={`/tutorials/${item.slug}`}
            key={item.id}
            className="group surface flex flex-col justify-between overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-zinc-500"
          >
            <div>
              <div className="flex aspect-[16/9] items-end rounded-t-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 border-b border-line">
                <span className="text-6xl font-bold tracking-tighter text-lime/80 font-mono">
                  0{index + 1}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-lime">
                    {item.category}
                  </span>
                  <span className="rounded-md border border-line bg-black/40 px-2 py-0.5 text-[11px] text-zinc-400">
                    {item.readTime}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-6 text-white group-hover:text-lime transition">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-xs leading-5 text-zinc-400">
                  {item.goal}
                </p>
              </div>
            </div>

            <div className="border-t border-line/60 p-6 pt-3 flex items-center justify-between text-xs text-zinc-500">
              <span>{item.difficulty.toUpperCase()}</span>
              <span className="font-semibold text-lime group-hover:translate-x-1 transition duration-150 inline-block">
                Start tutorial →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-3 text-sm font-semibold text-white transition hover:border-lime hover:bg-white/5"
        >
          <span>Explore all {tutorialsData.length} workflow tutorials</span>
          <span className="text-lime">→</span>
        </Link>
      </div>
    </div>
  );
}
