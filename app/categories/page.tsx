import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { categoriesData } from "@/data/platform-data";

export const metadata: Metadata = {
  title: "Creative Disciplines — Creator by Amusemac",
  description: "Browse AI creative tools and workflows organized by production domains: Video, Image, Audio, Editing, VFX, and Systems.",
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Production Domains"
            title="Creative Categories"
            description="Explore tools, prompts, and tutorials organized strictly by production phase and artistic discipline."
          />
        </div>
      </div>

      <div className="shell py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categoriesData.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="surface surface-hover group p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl text-primary font-mono group-hover:scale-105 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="rounded-full border border-border bg-surface-elevated px-3 py-1 font-mono text-[10px] uppercase text-tertiary">
                    {cat.badge}
                  </span>
                </div>

                <h2 className="mt-8 text-2xl font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
                  {cat.name}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-secondary font-normal">
                  {cat.description}
                </p>
              </div>

              <div className="mt-8 border-t border-border-subtle pt-4 flex items-center justify-between text-xs font-mono">
                <span className="text-tertiary">{cat.toolCount} verified stacks</span>
                <span className="font-medium text-accent group-hover:translate-x-1 transition duration-150 inline-flex items-center gap-1">
                  Explore domain →
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
