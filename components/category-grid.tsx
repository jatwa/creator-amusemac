import Link from "next/link";
import { categoriesData } from "@/data/platform-data";

export function CategoryGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categoriesData.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="surface surface-hover group p-6 sm:p-7 block transition duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl text-lime font-mono group-hover:scale-110 transition-transform">
              {category.icon}
            </span>
            <span className="rounded-full border border-line bg-ink px-2.5 py-0.5 font-mono text-[10px] uppercase text-zinc-400">
              {category.badge}
            </span>
          </div>

          <h3 className="mt-6 text-lg sm:text-xl font-bold text-white group-hover:text-lime transition leading-snug">
            {category.name}
          </h3>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-2">
            {category.description}
          </p>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-line/60 text-xs font-mono">
            <span className="text-zinc-500">{category.toolCount} curated tools</span>
            <span className="text-lime group-hover:translate-x-1 transition duration-150 inline-flex items-center gap-1 font-bold">
              Explore →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
