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
            className="group surface surface-hover flex flex-col justify-between overflow-hidden block"
          >
            <div>
              <div className="flex aspect-[16/9] items-end rounded-t-2xl bg-gradient-to-br from-panel to-ink p-6 border-b border-line">
                <span className="text-6xl font-bold tracking-tighter text-lime/80 font-mono">
                  0{index + 1}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="eyebrow text-[10px]">
                    {item.category}
                  </span>
                  <span className="rounded-md border border-line bg-ink px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                    {item.readTime}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold leading-snug text-white group-hover:text-lime transition">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                  {item.goal}
                </p>
              </div>
            </div>

            <div className="border-t border-line/60 p-6 pt-3 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span className="uppercase">{item.difficulty}</span>
              <span className="font-semibold text-lime group-hover:translate-x-1 transition duration-150 inline-flex items-center gap-1">
                Start Tutorial →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-6 py-3 text-xs sm:text-sm font-semibold text-white transition hover:border-lime hover:bg-panel-hover"
        >
          <span>Explore all {tutorialsData.length} workflow tutorials</span>
          <span className="text-lime">→</span>
        </Link>
      </div>
    </div>
  );
}
