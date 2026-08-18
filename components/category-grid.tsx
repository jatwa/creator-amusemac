import Link from "next/link";
import { categoriesData } from "@/data/platform-data";

export function CategoryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categoriesData.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="surface group p-6 transition duration-200 hover:-translate-y-1 hover:border-zinc-500"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl text-lime font-mono">{category.icon}</span>
            <span className="rounded-full border border-line bg-black/40 px-2.5 py-0.5 text-xs text-zinc-400">
              {category.badge}
            </span>
          </div>
          <h3 className="mt-7 text-lg font-semibold text-white group-hover:text-lime transition">
            {category.name}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {category.description}
          </p>
          <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
            <span>{category.toolCount} curated stacks</span>
            <span className="text-lime group-hover:translate-x-1 transition duration-150 inline-block">
              Explore domain →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
