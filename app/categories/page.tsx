import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { categoriesData } from "@/data/platform-data";

export const metadata: Metadata = {
  title: "Creative Stage Categories | Creator by Amusemac",
  description: "Browse AI creative tools and workflows organized by production domains: Video, Image, Audio, Editing, VFX, and Systems.",
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      <div className="shell py-12 sm:py-20">
        <SectionHeading
          label="Production Domains"
          title="Creative Categories"
          description="Explore tools, prompts, and tutorials organized strictly by production phase."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="surface group p-8 transition duration-200 hover:-translate-y-1 hover:border-zinc-500 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-4xl text-lime font-mono">{cat.icon}</span>
                  <span className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs text-zinc-400">
                    {cat.badge}
                  </span>
                </div>

                <h2 className="mt-8 text-2xl font-bold text-white group-hover:text-lime transition">
                  {cat.name}
                </h2>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {cat.description}
                </p>
              </div>

              <div className="mt-8 border-t border-line/60 pt-4 flex items-center justify-between text-xs">
                <span className="text-zinc-500">{cat.toolCount} verified tools</span>
                <span className="font-semibold text-lime group-hover:translate-x-1 transition duration-150 inline-block">
                  View category hub →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
