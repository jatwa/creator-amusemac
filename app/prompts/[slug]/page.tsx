import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { GatedPromptView } from "@/components/gated-prompt-view";
import { promptsData, tutorialsData } from "@/data/platform-data";
import {
  getToolById,
  getTechniqueById,
  getFilmById,
  getCanonicalWorkflowById,
} from "@/data/content";
import { getDbPublishedPrompts, getDbPromptBySlug } from "@/lib/db/neon";

export async function generateStaticParams() {
  const prompts = await getDbPublishedPrompts();
  return prompts.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await getDbPromptBySlug(slug);
  if (!prompt) return { title: "Prompt Not Found" };

  return {
    title: `${prompt.title} — AI Prompt Recipe — Creator Intel`,
    description: prompt.description,
  };
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prompt = await getDbPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const compatibleTools = (prompt.compatibleToolIds || [])
    .map((id) => getToolById(id))
    .filter(Boolean);

  const linkedTechnique = prompt.techniqueId
    ? getTechniqueById(prompt.techniqueId)
    : undefined;

  const linkedFilms = (prompt.relatedFilmIds || [])
    .map((id) => getFilmById(id))
    .filter(Boolean);

  const linkedWorkflows = (prompt.relatedWorkflowIds || [])
    .map((id) => getCanonicalWorkflowById(id))
    .filter(Boolean);

  const relatedTutorials = tutorialsData.filter((tut) =>
    (prompt.relatedTutorialIds || []).includes(tut.id)
  );

  const relatedPrompts = promptsData.filter((p) =>
    (prompt.relatedPromptIds || []).includes(p.id)
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

          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
                {prompt.useCase}
              </span>
              <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-secondary">
                {prompt.category.toUpperCase()}
              </span>
              {linkedTechnique && (
                <Link
                  href={`/techniques/${linkedTechnique.slug}`}
                  className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-xs text-accent hover:border-accent transition flex items-center gap-1.5"
                >
                  <span className="text-[10px]">TECHNIQUE:</span>
                  <span className="font-semibold">{linkedTechnique.name}</span>
                  <span>→</span>
                </Link>
              )}
              <span className="text-xs text-tertiary font-mono">
                Verified: {prompt.verifiedAt}
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-5xl">
              {prompt.title}
            </h1>

            <p className="text-base sm:text-lg text-secondary leading-relaxed font-normal">
              {prompt.description}
            </p>
          </div>
        </div>
      </div>

      <div className="shell py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left Column: Interactive Customizer */}
          <div className="lg:col-span-2 space-y-10">
            <GatedPromptView prompt={prompt} />

            {/* Prompt Variations */}
            {prompt.variations && prompt.variations.length > 0 && (
              <section className="surface p-8 rounded-2xl border border-border">
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
              <section className="surface p-8 rounded-2xl border border-border">
                <h2 className="text-xl font-semibold text-primary">Related Prompt Recipes</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {relatedPrompts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/prompts/${p.slug}`}
                      className="rounded-xl border border-border-subtle bg-surface-elevated p-4 transition hover:border-border-bright block group"
                    >
                      <p className="text-xs text-accent font-medium uppercase tracking-wider">{p.useCase}</p>
                      <h3 className="mt-1 text-sm font-semibold text-primary group-hover:text-accent transition-colors">{p.title}</h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Settings, Linked Intelligence & Tools */}
          <div className="space-y-6">
            {/* Linked Technique Spotlight */}
            {linkedTechnique && (
              <div className="surface p-6 space-y-3 rounded-2xl border border-border bg-surface-elevated/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">
                    Underlying Technique
                  </span>
                  <span className="text-[10px] font-mono text-tertiary">
                    {linkedTechnique.difficulty}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-primary">
                  <Link href={`/techniques/${linkedTechnique.slug}`} className="hover:text-accent transition-colors">
                    {linkedTechnique.name}
                  </Link>
                </h3>
                <p className="text-xs text-secondary line-clamp-3 leading-relaxed">
                  {linkedTechnique.creativePurpose}
                </p>
                <Link
                  href={`/techniques/${linkedTechnique.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-accent font-mono font-medium hover:underline pt-1"
                >
                  <span>Explore technique dossier</span>
                  <span>→</span>
                </Link>
              </div>
            )}

            {/* Parent Production Workflows */}
            {linkedWorkflows.length > 0 && (
              <div className="surface p-6 space-y-3 rounded-2xl border border-border">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary font-mono">
                  Parent Production Playbooks
                </h3>
                <div className="space-y-2.5">
                  {linkedWorkflows.map((wf) => (
                    <Link
                      key={wf?.id}
                      href={`/workflows/${wf?.slug}`}
                      className="block rounded-xl border border-border-subtle bg-surface-elevated p-3.5 transition hover:border-accent/40 group"
                    >
                      <span className="text-[10px] font-mono text-accent uppercase font-semibold block">
                        {wf?.category.replace(/_/g, " ")}
                      </span>
                      <p className="text-sm font-semibold text-primary group-hover:text-accent transition-colors mt-0.5">
                        {wf?.title}
                      </p>
                      <span className="text-[11px] font-mono text-tertiary mt-1 block">
                        {wf?.steps.length} Production Phases • {wf?.estimatedEffort}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Reference Films */}
            {linkedFilms.length > 0 && (
              <div className="surface p-6 space-y-3 rounded-2xl border border-border">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary font-mono">
                  Demonstration Reference Films
                </h3>
                <div className="space-y-2">
                  {linkedFilms.map((film) => (
                    <Link
                      key={film?.id}
                      href={`/films/${film?.slug}`}
                      className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated p-3 transition hover:border-border-bright"
                    >
                      <div>
                        <p className="text-xs font-semibold text-primary">{film?.title}</p>
                        <p className="text-[10px] font-mono text-tertiary">{film?.releaseYear} • {film?.technicalSpecs.aspectRatio}</p>
                      </div>
                      <span className="text-xs text-accent font-mono">Film →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Director's Technical Recipe Specifications */}
            {(prompt.camera || prompt.lens || prompt.lighting || prompt.composition || prompt.mood) && (
              <div className="surface p-6 space-y-4 text-xs rounded-2xl border border-border">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">
                    Director Recipe Specs
                  </h3>
                  {prompt.difficulty && (
                    <span className="rounded-full bg-accent/10 border border-accent/20 px-2 py-0.5 font-mono text-[10px] text-accent">
                      {prompt.difficulty}
                    </span>
                  )}
                </div>

                {prompt.camera && (
                  <div>
                    <p className="text-tertiary font-mono">Camera Body &amp; Sensor:</p>
                    <p className="mt-0.5 font-medium text-primary">{prompt.camera}</p>
                  </div>
                )}

                {prompt.cameraMovement && (
                  <div>
                    <p className="text-tertiary font-mono">Camera Movement:</p>
                    <p className="mt-0.5 font-medium text-primary">{prompt.cameraMovement}</p>
                  </div>
                )}

                {prompt.lens && (
                  <div>
                    <p className="text-tertiary font-mono">Optics / Focal Length:</p>
                    <p className="mt-0.5 font-medium text-primary">{prompt.lens}</p>
                  </div>
                )}

                {prompt.lighting && (
                  <div>
                    <p className="text-tertiary font-mono">Master Lighting Formula:</p>
                    <p className="mt-0.5 text-secondary leading-relaxed">{prompt.lighting}</p>
                  </div>
                )}

                {prompt.composition && (
                  <div>
                    <p className="text-tertiary font-mono">Framing &amp; Composition:</p>
                    <p className="mt-0.5 text-secondary leading-relaxed">{prompt.composition}</p>
                  </div>
                )}

                {prompt.environment && (
                  <div>
                    <p className="text-tertiary font-mono">Environment &amp; Atmosphere:</p>
                    <p className="mt-0.5 text-secondary leading-relaxed">{prompt.environment}</p>
                  </div>
                )}

                {prompt.mood && (
                  <div>
                    <p className="text-tertiary font-mono">Emotional Mood &amp; Tone:</p>
                    <p className="mt-0.5 font-medium text-primary">{prompt.mood}</p>
                  </div>
                )}

                {prompt.visualStyle && (
                  <div>
                    <p className="text-tertiary font-mono">Visual Aesthetic / Color Science:</p>
                    <p className="mt-0.5 text-secondary leading-relaxed">{prompt.visualStyle}</p>
                  </div>
                )}

                {(prompt.aspectRatio || prompt.recommendedDuration) && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle font-mono text-[11px]">
                    {prompt.aspectRatio && (
                      <div>
                        <span className="text-tertiary block">Format:</span>
                        <span className="text-primary font-semibold">{prompt.aspectRatio}</span>
                      </div>
                    )}
                    {prompt.recommendedDuration && (
                      <div>
                        <span className="text-tertiary block">Duration:</span>
                        <span className="text-primary font-semibold">{prompt.recommendedDuration}</span>
                      </div>
                    )}
                  </div>
                )}

                {prompt.recommendedModels && prompt.recommendedModels.length > 0 && (
                  <div className="pt-2 border-t border-border-subtle">
                    <p className="text-tertiary font-mono mb-1.5">Recommended AI Engines:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {prompt.recommendedModels.map((m, i) => (
                        <span key={i} className="rounded-md border border-border bg-surface-elevated px-2 py-0.5 font-mono text-[10px] text-accent">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Model Settings */}
            {prompt.recommendedSettings && (
              <div className="surface p-6 space-y-4 text-xs rounded-2xl border border-border">
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
            <div className="surface p-6 rounded-2xl border border-border">
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
              <div className="surface p-6 rounded-2xl border border-border">
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
