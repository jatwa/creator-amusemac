import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { PromptCustomizer } from "@/components/prompt-customizer";
import { promptsData, tutorialsData } from "@/data/platform-data";
import { getPromptBySlug, getToolById } from "@/data/content";

export async function generateStaticParams() {
  return promptsData.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) return { title: "Prompt Not Found" };

  return {
    title: `${prompt.title} — AI Prompt Recipe | Creator by Amusemac`,
    description: prompt.description,
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const compatibleTools = prompt.compatibleToolIds
    .map((id) => getToolById(id))
    .filter(Boolean);

  const relatedTutorials = tutorialsData.filter((tut) =>
    prompt.relatedTutorialIds.includes(tut.id)
  );

  const relatedPrompts = promptsData.filter((p) =>
    prompt.relatedPromptIds.includes(p.id)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: prompt.title,
    description: prompt.description,
    genre: prompt.category,
    text: prompt.promptText,
  };

  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Header */}
      <div className="border-b border-line bg-panel/50 py-12 sm:py-16">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-lime">Home</Link>
            <span>/</span>
            <Link href="/prompts" className="hover:text-lime">Prompts</Link>
            <span>/</span>
            <span className="text-white">{prompt.title}</span>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
                {prompt.useCase}
              </span>
              <span className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs text-zinc-300">
                {prompt.category.toUpperCase()}
              </span>
              <span className="text-xs text-zinc-400">
                Verified: {prompt.verifiedAt}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {prompt.title}
            </h1>

            <p className="mt-3 text-base text-zinc-300 leading-7">
              {prompt.description}
            </p>
          </div>
        </div>
      </div>

      <div className="shell py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left Column: Interactive Customizer */}
          <div className="lg:col-span-2 space-y-10">
            <PromptCustomizer prompt={prompt} />

            {/* Prompt Variations */}
            {prompt.variations && prompt.variations.length > 0 && (
              <section className="surface p-8">
                <h2 className="text-xl font-bold text-white">Recipe Variations</h2>
                <div className="mt-6 space-y-4">
                  {prompt.variations.map((v, i) => (
                    <div key={i} className="rounded-xl border border-line bg-black/30 p-5">
                      <h3 className="text-sm font-bold text-lime">{v.name}</h3>
                      <p className="mt-2 rounded-lg border border-zinc-800 bg-black/60 p-3 font-mono text-xs text-zinc-200">
                        {v.promptText}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Prompts */}
            {relatedPrompts.length > 0 && (
              <section className="surface p-8">
                <h2 className="text-xl font-bold text-white">Related Prompt Recipes</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {relatedPrompts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/prompts/${p.slug}`}
                      className="rounded-xl border border-line bg-black/20 p-4 transition hover:border-lime"
                    >
                      <p className="text-xs text-lime font-semibold uppercase">{p.useCase}</p>
                      <h3 className="mt-1 text-sm font-bold text-white">{p.title}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Settings & Compatible Tools */}
          <div className="space-y-6">
            {/* Recommended Model Settings */}
            {prompt.recommendedSettings && (
              <div className="surface p-6 space-y-4 text-xs">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-lime">
                  Recommended Model Settings
                </h3>

                {prompt.recommendedSettings.aspectRatio && (
                  <div>
                    <p className="text-zinc-500">Aspect Ratio:</p>
                    <p className="mt-0.5 font-mono text-white font-medium">
                      {prompt.recommendedSettings.aspectRatio}
                    </p>
                  </div>
                )}

                {prompt.recommendedSettings.model && (
                  <div>
                    <p className="text-zinc-500">Optimized For:</p>
                    <p className="mt-0.5 font-medium text-white">
                      {prompt.recommendedSettings.model}
                    </p>
                  </div>
                )}

                {prompt.recommendedSettings.guidanceScale && (
                  <div>
                    <p className="text-zinc-500">Guidance / CFG Scale:</p>
                    <p className="mt-0.5 font-mono text-white">
                      {prompt.recommendedSettings.guidanceScale}
                    </p>
                  </div>
                )}

                {prompt.recommendedSettings.additionalNotes && (
                  <div className="rounded-lg border border-line bg-black/30 p-3 text-zinc-300">
                    <p className="font-semibold text-lime">Director Note:</p>
                    <p className="mt-1 leading-5">{prompt.recommendedSettings.additionalNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Compatible Tools */}
            <div className="surface p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-lime">
                Compatible AI Tools
              </h3>
              <div className="mt-4 space-y-3">
                {compatibleTools.map((tool) => (
                  <Link
                    key={tool?.id}
                    href={`/tools/${tool?.slug}`}
                    className="flex items-center justify-between rounded-lg border border-line bg-black/20 p-3 transition hover:border-lime"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{tool?.name}</p>
                      <p className="text-[11px] text-zinc-400">{tool?.category}</p>
                    </div>
                    <span className="text-xs text-lime">View tool →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Tutorials */}
            {relatedTutorials.length > 0 && (
              <div className="surface p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-lime">
                  Workflow Guides Using This Prompt
                </h3>
                <div className="mt-4 space-y-3">
                  {relatedTutorials.map((tut) => (
                    <Link
                      key={tut.id}
                      href={`/tutorials/${tut.slug}`}
                      className="block rounded-lg border border-line bg-black/20 p-3 transition hover:border-lime"
                    >
                      <p className="text-xs font-bold text-white">{tut.title}</p>
                      <p className="mt-1 text-[11px] text-zinc-500">{tut.readTime} • {tut.difficulty}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
