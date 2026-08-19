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
    title: `${wf.title} — Production Pipeline Blueprint | Creator by Amusemac`,
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
      <div className="border-b border-line bg-gradient-to-b from-panel via-ink to-ink py-12 sm:py-16">
        <div className="shell max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-lime transition">Home</Link>
            <span>/</span>
            <Link href="/workflows" className="hover:text-lime transition">Workflows</Link>
            <span>/</span>
            <span className="text-zinc-300">{wf.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow text-xs bg-lime/10 px-3 py-1 rounded-full border border-lime/30">
              {wf.category} Pipeline
            </span>
            <span className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-xs text-zinc-300">
              ⏱ {wf.estimatedTime}
            </span>
            <span className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-[10px] text-zinc-400 uppercase">
              {wf.difficulty}
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {wf.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed font-medium">
            {wf.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-zinc-400 pt-4 border-t border-line/60">
            <span><strong>Target Audience:</strong> {wf.targetAudience}</span>
            <span>•</span>
            <span><strong>Audited:</strong> {wf.lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="shell max-w-4xl py-12 space-y-12">
        {/* Visual Pipeline Stage Roadmap */}
        <section className="surface p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Pipeline Stage Roadmap</h2>
          </div>
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
              <section key={step.stepNumber} className="surface p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-xs bg-lime/10 px-3 py-1 rounded-full border border-lime/30">
                    PHASE 0{step.stepNumber}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    Stage {step.stepNumber} of {wf.steps.length}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {step.phaseName}
                </h2>

                <div className="rounded-xl border border-lime/30 bg-lime/5 p-4">
                  <p className="eyebrow text-[10px] text-lime">
                    Phase Goal:
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">{step.goal}</p>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
                  {step.explanation}
                </p>

                {/* Recommended Tools Grid for this Step */}
                {recommendedTools.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="eyebrow text-xs">
                      Recommended Tools for This Phase:
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {recommendedTools.map((tool) => (
                        <div
                          key={tool?.id}
                          className="flex items-center justify-between rounded-xl border border-line bg-ink/70 p-4"
                        >
                          <div>
                            <p className="text-sm font-bold text-white">{tool?.name}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">{tool?.subcategories[0]}</p>
                          </div>
                          <Link
                            href={`/tools/${tool?.slug}`}
                            className="rounded-full border border-line bg-panel px-3 py-1.5 text-xs font-semibold text-lime hover:border-lime transition"
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
                    <span className="text-zinc-500 font-mono text-[11px]">Alternative Options:</span>
                    {alternativeTools.map((tool) => (
                      <Link
                        key={tool?.id}
                        href={`/tools/${tool?.slug}`}
                        className="rounded-md border border-line bg-ink px-2.5 py-0.5 text-zinc-300 hover:text-white font-mono text-[11px]"
                      >
                        {tool?.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Recommended Prompt Recipes for this Step */}
                {recommendedPrompts.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <p className="eyebrow text-xs">
                      Linked Prompt Recipes:
                    </p>
                    {recommendedPrompts.map((prompt) => (
                      <div
                        key={prompt?.id}
                        className="rounded-xl border border-line bg-ink/70 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {prompt?.title}
                          </span>
                          <Link
                            href={`/prompts/${prompt?.slug}`}
                            className="text-xs text-lime hover:underline font-mono"
                          >
                            Customize Recipe →
                          </Link>
                        </div>
                        <p className="mt-2 rounded-lg border border-zinc-800 bg-ink p-3 font-mono text-xs text-zinc-300 select-all">
                          {prompt?.promptText}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pro Tips */}
                {step.proTips.length > 0 && (
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/15 p-5">
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Director Pro-Tips:
                    </p>
                    <ul className="mt-2 space-y-2 text-xs sm:text-sm text-zinc-300">
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
          <section className="surface p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Recommended Workflow Guides</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedTutorials.map((tut) => (
                <Link
                  key={tut.id}
                  href={`/tutorials/${tut.slug}`}
                  className="rounded-xl border border-line bg-ink/70 p-5 transition hover:border-lime block group"
                >
                  <p className="eyebrow text-[10px]">Tutorial Guide</p>
                  <h3 className="mt-1.5 text-sm sm:text-base font-bold text-white group-hover:text-lime transition">{tut.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{tut.goal}</p>
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
