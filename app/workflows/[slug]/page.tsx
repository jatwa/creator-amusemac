import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { workflowsData, tutorialsData } from "@/data/platform-data";
import { getWorkflowBySlug, getToolById, getPromptById } from "@/data/content";

export async function generateStaticParams() {
  return workflowsData.map((wf) => ({
    slug: wf.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const wf = getWorkflowBySlug(slug);
  if (!wf) return { title: "Workflow Not Found" };

  return {
    title: `${wf.title} — Production Pipeline Blueprint — Creator by Amusemac`,
    description: wf.summary,
  };
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const wf = getWorkflowBySlug(slug);

  if (!wf) {
    notFound();
  }

  const relatedTutorials = tutorialsData.filter((tut) =>
    wf.relatedTutorialIds.includes(tut.id)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: wf.title,
    description: wf.summary,
    step: wf.steps.map((step) => ({
      "@type": "HowToStep",
      position: step.stepNumber,
      name: step.phaseName,
      text: step.explanation,
    })),
  };

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tertiary mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/workflows" className="hover:text-primary transition-colors">Workflows</Link>
            <span>/</span>
            <span className="text-secondary">{wf.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent font-mono text-xs">
              {wf.category} Pipeline
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-secondary">
              ⏱ {wf.estimatedTime}
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] text-tertiary uppercase">
              {wf.difficulty}
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-primary leading-tight">
            {wf.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-secondary leading-relaxed font-normal">
            {wf.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-tertiary pt-4 border-t border-border-subtle">
            <span><strong className="text-secondary">Target Audience:</strong> {wf.targetAudience}</span>
            <span>•</span>
            <span><strong className="text-secondary">Audited:</strong> {wf.lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="shell max-w-4xl py-14 space-y-16">
        {/* Visual Pipeline Stage Roadmap */}
        <section className="surface p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-semibold text-primary tracking-tight mb-6">Pipeline Stage Roadmap</h2>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 overflow-x-auto pb-2">
            {wf.steps.map((step, idx) => (
              <div key={step.stepNumber} className="flex md:flex-col items-center gap-3 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-sm font-semibold text-accent">
                  0{step.stepNumber}
                </div>
                <div className="text-left md:text-center">
                  <p className="text-xs font-semibold text-primary">{step.phaseName}</p>
                </div>
                {idx < wf.steps.length - 1 && (
                  <span className="hidden md:block text-tertiary font-mono text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Step-by-Step Production Phases */}
        <div className="space-y-10">
          {wf.steps.map((step) => {
            const recommendedTools = step.recommendedToolIds
              .map((id) => getToolById(id))
              .filter(Boolean);
            const alternativeTools = step.alternativeToolIds
              .map((id) => getToolById(id))
              .filter(Boolean);
            const recommendedPrompts = step.recommendedPromptIds
              .map((id) => getPromptById(id))
              .filter(Boolean);

            return (
              <section key={step.stepNumber} className="surface p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
                    PHASE 0{step.stepNumber}
                  </span>
                  <span className="font-mono text-xs text-tertiary">
                    Stage {step.stepNumber} of {wf.steps.length}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-primary">
                  {step.phaseName}
                </h2>

                <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">
                    Phase Goal:
                  </p>
                  <p className="text-sm font-normal text-primary">{step.goal}</p>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-secondary font-normal">
                  {step.explanation}
                </p>

                {/* Recommended Tools Grid for this Step */}
                {recommendedTools.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Recommended Tools for This Phase:
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {recommendedTools.map((tool) => (
                        <div
                          key={tool?.id}
                          className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated p-4"
                        >
                          <div>
                            <p className="text-sm font-semibold text-primary">{tool?.name}</p>
                            <p className="text-[11px] text-tertiary font-mono">{tool?.subcategories[0]}</p>
                          </div>
                          <Link
                            href={`/tools/${tool?.slug}`}
                            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
                          >
                            Dossier →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternative Tools */}
                {alternativeTools.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-tertiary font-mono text-[11px]">Alternative Options:</span>
                    {alternativeTools.map((tool) => (
                      <Link
                        key={tool?.id}
                        href={`/tools/${tool?.slug}`}
                        className="rounded-md border border-border bg-surface-elevated px-2.5 py-0.5 text-secondary hover:text-primary font-mono text-[11px]"
                      >
                        {tool?.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Recommended Prompt Recipes for this Step */}
                {recommendedPrompts.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
                      Linked Prompt Recipes:
                    </p>
                    {recommendedPrompts.map((prompt) => (
                      <div
                        key={prompt?.id}
                        className="rounded-xl border border-border-subtle bg-surface-elevated p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary">
                            {prompt?.title}
                          </span>
                          <Link
                            href={`/prompts/${prompt?.slug}`}
                            className="text-xs text-accent hover:underline font-mono"
                          >
                            Customize Recipe →
                          </Link>
                        </div>
                        <p className="mt-2 rounded-lg border border-border bg-surface p-3 font-mono text-xs text-secondary select-all">
                          {prompt?.promptText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro Tips */}
                {step.proTips.length > 0 && (
                  <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5">
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                      Director Pro-Tips:
                    </p>
                    <ul className="mt-2 space-y-2 text-xs sm:text-sm text-secondary">
                      {step.proTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-accent font-semibold">★</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Related Tutorials */}
        {relatedTutorials.length > 0 && (
          <section className="surface p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-primary tracking-tight mb-6">Recommended Workflow Guides</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedTutorials.map((tut) => (
                <Link
                  key={tut.id}
                  href={`/tutorials/${tut.slug}`}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 transition hover:border-border-bright block group"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-secondary">Tutorial Guide</p>
                  <h3 className="mt-1.5 text-sm sm:text-base font-semibold text-primary group-hover:text-accent transition-colors">{tut.title}</h3>
                  <p className="mt-2 text-xs text-secondary line-clamp-2">{tut.goal}</p>
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
