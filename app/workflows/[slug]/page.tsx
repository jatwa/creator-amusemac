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
    title: `${wf.title} — Creator Production Pipeline | Creator by Amusemac`,
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
    <main className="min-h-screen bg-ink text-zinc-100">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Header */}
      <div className="border-b border-line bg-panel/50 py-12 sm:py-16">
        <div className="shell max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-lime">Home</Link>
            <span>/</span>
            <Link href="/workflows" className="hover:text-lime">Workflows</Link>
            <span>/</span>
            <span className="text-white">{wf.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
              {wf.category.toUpperCase()} PIPELINE
            </span>
            <span className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs text-zinc-300">
              ⏱ {wf.estimatedTime}
            </span>
            <span className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs text-zinc-400 uppercase">
              {wf.difficulty}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {wf.title}
          </h1>

          <p className="mt-4 text-base text-zinc-300 leading-7">
            {wf.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-400">
            <span><strong>Target Audience:</strong> {wf.targetAudience}</span>
            <span>•</span>
            <span><strong>Updated:</strong> {wf.lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="shell max-w-4xl py-12 space-y-12">
        {/* Visual Pipeline Stage Roadmap */}
        <section className="surface p-8">
          <h2 className="text-xl font-bold text-white mb-6">Pipeline Roadmap</h2>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 overflow-x-auto pb-2">
            {wf.steps.map((step, idx) => (
              <div key={step.stepNumber} className="flex md:flex-col items-center gap-3 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lime/40 bg-lime/10 font-mono text-sm font-bold text-lime">
                  0{step.stepNumber}
                </div>
                <div className="text-left md:text-center">
                  <p className="text-xs font-bold text-white">{step.phaseName}</p>
                </div>
                {idx < wf.steps.length - 1 && (
                  <span className="hidden md:block text-zinc-600 font-mono text-xs">→</span>
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
              <section key={step.stepNumber} className="surface p-8">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-xs font-bold text-lime">
                    PHASE 0{step.stepNumber}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400">
                    Stage {step.stepNumber} of {wf.steps.length}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-bold text-white">
                  {step.phaseName}
                </h2>

                <div className="mt-4 rounded-xl border border-line bg-black/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime">
                    Phase Goal:
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">{step.goal}</p>
                </div>

                <p className="mt-6 text-base leading-8 text-zinc-300">
                  {step.explanation}
                </p>

                {/* Recommended Tools Grid for this Step */}
                {recommendedTools.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-lime">
                      Recommended Tools for This Phase:
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {recommendedTools.map((tool) => (
                        <div
                          key={tool?.id}
                          className="flex items-center justify-between rounded-xl border border-line bg-black/30 p-4"
                        >
                          <div>
                            <p className="text-sm font-bold text-white">{tool?.name}</p>
                            <p className="text-[11px] text-zinc-400">{tool?.subcategories[0]}</p>
                          </div>
                          <Link
                            href={`/tools/${tool?.slug}`}
                            className="rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-semibold text-lime hover:border-lime transition"
                          >
                            View Dossier →
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Alternative Tools */}
                {alternativeTools.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-zinc-500">Alternative Options:</span>
                    {alternativeTools.map((tool) => (
                      <Link
                        key={tool?.id}
                        href={`/tools/${tool?.slug}`}
                        className="rounded border border-line bg-black/20 px-2 py-0.5 text-zinc-300 hover:text-white"
                      >
                        {tool?.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Recommended Prompt Recipes for this Step */}
                {recommendedPrompts.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-lime">
                      Linked Prompt Recipes:
                    </p>
                    {recommendedPrompts.map((prompt) => (
                      <div
                        key={prompt?.id}
                        className="rounded-xl border border-line bg-black/40 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {prompt?.title}
                          </span>
                          <Link
                            href={`/prompts/${prompt?.slug}`}
                            className="text-xs text-lime underline"
                          >
                            Customize recipe →
                          </Link>
                        </div>
                        <p className="mt-2 rounded-lg border border-zinc-800 bg-black/60 p-3 font-mono text-xs text-zinc-300">
                          {prompt?.promptText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro Tips */}
                {step.proTips.length > 0 && (
                  <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Director Pro-Tips:
                    </p>
                    <ul className="mt-2 space-y-2 text-xs text-zinc-300">
                      {step.proTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">★</span>
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
          <section className="surface p-8">
            <h2 className="text-xl font-bold text-white">Recommended Workflow Guides</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedTutorials.map((tut) => (
                <Link
                  key={tut.id}
                  href={`/tutorials/${tut.slug}`}
                  className="rounded-xl border border-line bg-black/30 p-5 transition hover:border-lime"
                >
                  <p className="text-xs text-lime font-semibold uppercase">Tutorial Guide</p>
                  <h3 className="mt-1.5 text-base font-bold text-white">{tut.title}</h3>
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
