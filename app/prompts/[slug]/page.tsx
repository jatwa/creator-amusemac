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
    title: `${prompt.title} — AI Prompt Recipe — Creator by Amusemac`,
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
    <main className="min-h-screen bg-background text-primary transition-colors">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tertiary mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/prompts" className="hover:text-primary transition-colors">Prompts</Link>
            <span>/</span>
            <span className="text-secondary">{prompt.title}</span>
          </div>

          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
                {prompt.useCase}
              </span>
              <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-secondary">
                {prompt.category.toUpperCase()}
              </span>
              <span className="text-xs text-tertiary font-mono">
                Verified: {prompt.verifiedAt}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary sm:text-5xl">
              {prompt.title}
            </h1>

            <p className="mt-3 text-base sm:text-lg text-secondary leading-relaxed font-normal">
              {prompt.description}
            </p>
          </div>
        </div>
      </div>

      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left Column: Interactive Customizer */}
          <div className="lg:col-span-2 space-y-10">
            <PromptCustomizer prompt={prompt} />

            {/* Prompt Variations */}
            {prompt.variations && prompt.variations.length > 0 && (
              <section className="surface p-8">
                <h2 className="text-xl font-semibold text-primary">Recipe Variations</h2>
                <div className="mt-6 space-y-4">
                  {prompt.variations.map((v, i) => (
                    <div key={i} className="rounded-xl border border-border-subtle bg-surface-elevated p-5">
                      <h3 className="text-sm font-semibold text-accent">{v.name}</h3>
                      <p className="mt-2 rounded-lg border border-border bg-surface p-3 font-mono text-xs text-secondary leading-relaxed">
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
                <h2 className="text-xl font-semibold text-primary">Related Prompt Recipes</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {relatedPrompts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/prompts/${p.slug}`}
                      className="rounded-xl border border-border-subtle bg-surface-elevated p-4 transition hover:border-border-bright"
                    >
                      <p className="text-xs text-accent font-medium uppercase tracking-wider">{p.useCase}</p>
                      <h3 className="mt-1 text-sm font-semibold text-primary">{p.title}</h3>
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
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Recommended Model Settings
                </h3>

                {prompt.recommendedSettings.aspectRatio && (
                  <div>
                    <p className="text-tertiary font-mono">Aspect Ratio:</p>
                    <p className="mt-0.5 font-mono text-primary font-medium">
                      {prompt.recommendedSettings.aspectRatio}
                    </p>
                  </div>
                )}

                {prompt.recommendedSettings.model && (
                  <div>
                    <p className="text-tertiary font-mono">Optimized For:</p>
                    <p className="mt-0.5 font-medium text-primary">
                      {prompt.recommendedSettings.model}
                    </p>
                  </div>
                )}

                {prompt.recommendedSettings.guidanceScale && (
                  <div>
                    <p className="text-tertiary font-mono">Guidance / CFG Scale:</p>
                    <p className="mt-0.5 font-mono text-primary">
                      {prompt.recommendedSettings.guidanceScale}
                    </p>
                  </div>
                )}

                {prompt.recommendedSettings.additionalNotes && (
                  <div className="rounded-lg border border-border-subtle bg-surface-elevated p-3 text-secondary">
                    <p className="font-medium text-accent">Director Note:</p>
                    <p className="mt-1 leading-relaxed font-normal">{prompt.recommendedSettings.additionalNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Compatible Tools */}
            <div className="surface p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                Compatible AI Tools
              </h3>
              <div className="mt-4 space-y-3">
                {compatibleTools.map((tool) => (
                  <Link
                    key={tool?.id}
                    href={`/tools/${tool?.slug}`}
                    className="flex items-center justify-between rounded-lg border border-border-subtle bg-surface-elevated p-3 transition hover:border-border-bright"
                  >
                    <div>
                      <p className="text-sm font-semibold text-primary">{tool?.name}</p>
                      <p className="text-[11px] text-tertiary">{tool?.category}</p>
                    </div>
                    <span className="text-xs text-accent font-medium">View tool →</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Tutorials */}
            {relatedTutorials.length > 0 && (
              <div className="surface p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
                  Workflow Guides Using This Prompt
                </h3>
                <div className="mt-4 space-y-3">
                  {relatedTutorials.map((tut) => (
                    <Link
                      key={tut.id}
                      href={`/tutorials/${tut.slug}`}
                      className="block rounded-lg border border-border-subtle bg-surface-elevated p-3 transition hover:border-border-bright"
                    >
                      <p className="text-xs font-semibold text-primary">{tut.title}</p>
                      <p className="mt-1 text-[11px] text-tertiary">{tut.readTime} • {tut.difficulty}</p>
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
