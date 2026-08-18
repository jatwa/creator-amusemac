import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import {
  categoriesData,
  toolsData,
  promptsData,
  tutorialsData,
  workflowsData,
} from "@/data/platform-data";
import { getCategoryBySlug } from "@/data/content";

export async function generateStaticParams() {
  return categoriesData.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `${cat.name} AI Tools & Workflows | Creator by Amusemac`,
    description: cat.description,
  };
}

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);

  if (!cat) {
    notFound();
  }

  const categoryTools = toolsData.filter(
    (t) => t.category.toLowerCase() === cat.slug.toLowerCase()
  );

  const categoryPrompts = promptsData.filter(
    (p) => p.category.toLowerCase() === cat.slug.toLowerCase()
  );

  const categoryTutorials = tutorialsData.filter(
    (tut) => tut.category.toLowerCase().includes(cat.slug.toLowerCase()) ||
      tut.requiredToolIds.some((id) => categoryTools.some((t) => t.id === id))
  );

  const categoryWorkflows = workflowsData.filter(
    (wf) => wf.category.toLowerCase().includes(cat.slug.toLowerCase()) ||
      wf.steps.some((s) => s.recommendedToolIds.some((id) => categoryTools.some((t) => t.id === id)))
  );

  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      {/* Header */}
      <div className="border-b border-line bg-panel/50 py-12 sm:py-16">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-lime">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-lime">Categories</Link>
            <span>/</span>
            <span className="text-white">{cat.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl text-lime font-mono">{cat.icon}</span>
            <div>
              <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-0.5 text-xs font-semibold text-lime">
                {cat.badge}
              </span>
              <h1 className="mt-2 text-3xl sm:text-5xl font-bold text-white">
                {cat.name}
              </h1>
            </div>
          </div>

          <p className="mt-4 text-base text-zinc-300 max-w-3xl leading-7">
            {cat.description}
          </p>
        </div>
      </div>

      <div className="shell py-12 space-y-16">
        {/* Tools Section */}
        {categoryTools.length > 0 && (
          <section>
            <SectionHeading
              label="Curated Stack"
              title={`Top ${cat.name} Tools`}
              description="Evaluated for real production quality, control, and reliability."
            />

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.slug}`}
                  className="surface p-6 transition hover:border-lime block"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-lime uppercase">
                      {tool.subcategories[0]}
                    </span>
                    <span className="rounded bg-black/40 px-2 py-0.5 text-[11px] text-zinc-400">
                      {tool.pricing.model}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold text-white">{tool.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-zinc-400 line-clamp-2">{tool.description}</p>
                  <p className="mt-4 text-[11px] text-zinc-500">Best for: {tool.bestFor.split(",")[0]}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prompts Section */}
        {categoryPrompts.length > 0 && (
          <section>
            <SectionHeading
              label="Prompt Recipes"
              title={`Tested ${cat.name} Prompts`}
              description="Production-ready prompts with customizable variables and model settings."
            />

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {categoryPrompts.map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.slug}`}
                  className="surface p-6 transition hover:border-lime block"
                >
                  <span className="text-xs font-semibold text-lime uppercase">{p.useCase}</span>
                  <h3 className="mt-1.5 text-lg font-bold text-white">{p.title}</h3>
                  <p className="mt-3 rounded-lg border border-zinc-800 bg-black/40 p-3 font-mono text-xs text-zinc-300 line-clamp-2">
                    {p.promptText}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Workflows & Tutorials */}
        {(categoryWorkflows.length > 0 || categoryTutorials.length > 0) && (
          <section>
            <SectionHeading
              label="Production Systems"
              title="Workflows & Guides"
              description="End-to-end pipelines utilizing this domain."
            />

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {categoryWorkflows.map((wf) => (
                <Link
                  key={wf.id}
                  href={`/workflows/${wf.slug}`}
                  className="surface p-6 transition hover:border-lime block"
                >
                  <span className="text-xs font-semibold text-lime uppercase">Pipeline Blueprint</span>
                  <h3 className="mt-2 text-base font-bold text-white">{wf.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400">{wf.summary}</p>
                </Link>
              ))}
              {categoryTutorials.map((tut) => (
                <Link
                  key={tut.id}
                  href={`/tutorials/${tut.slug}`}
                  className="surface p-6 transition hover:border-lime block"
                >
                  <span className="text-xs font-semibold text-lime uppercase">Editorial Tutorial</span>
                  <h3 className="mt-2 text-base font-bold text-white">{tut.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400">{tut.goal}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
