import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import {
  canonicalWorkflows,
  getWorkflowBySlug as getCanonicalWorkflowBySlug,
} from "@/data/workflows-canonical";
import { workflowsData, tutorialsData } from "@/data/platform-data";
import {
  getToolById,
  getPromptById,
  getPromptBySlug,
  getTechniqueById,
  getFilmById,
  getResearchById,
  getBlogBySlug,
} from "@/data/content";

export async function generateStaticParams() {
  const canonicalParams = canonicalWorkflows.map((wf) => ({
    slug: wf.slug,
  }));
  const legacyParams = workflowsData.map((wf) => ({
    slug: wf.slug,
  }));
  return [...canonicalParams, ...legacyParams];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonicalWf = getCanonicalWorkflowBySlug(slug);
  if (canonicalWf) {
    return {
      title: `${canonicalWf.title} — Production Playbook — Creator Intel`,
      description: canonicalWf.summary,
    };
  }

  const legacyWf = workflowsData.find((w) => w.slug === slug);
  if (legacyWf) {
    return {
      title: `${legacyWf.title} — Production Pipeline Blueprint — Creator Intel`,
      description: legacyWf.summary,
    };
  }

  return { title: "Workflow Playbook Not Found" };
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const canonicalWf = getCanonicalWorkflowBySlug(slug);

  // If found in canonical workflows, render the full cinema playbook dossier
  if (canonicalWf) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: canonicalWf.title,
      description: canonicalWf.summary,
      estimatedCost: canonicalWf.estimatedEffort,
      step: canonicalWf.steps.map((step) => ({
        "@type": "HowToStep",
        position: step.stepNumber,
        name: step.name,
        text: step.action,
      })),
    };

    const relatedFilms = canonicalWf.relatedFilmIds
      .map((id) => getFilmById(id))
      .filter(Boolean);

    const relatedTechniques = canonicalWf.relatedTechniqueIds
      .map((id) => getTechniqueById(id))
      .filter(Boolean);

    const relatedResearch = canonicalWf.relatedResearchIds
      .map((id) => getResearchById(id))
      .filter(Boolean);

    const relatedJournal = (canonicalWf.relatedJournalSlugs || [])
      .map((jSlug) => getBlogBySlug(jSlug))
      .filter(Boolean);

    return (
      <main className="min-h-screen bg-background text-primary transition-colors">
        <StructuredData data={jsonLd} />
        <Navigation />

        {/* Hero Header */}
        <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
          <div className="shell max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tertiary mb-6">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/workflows" className="hover:text-primary transition-colors">Workflows</Link>
              <span>/</span>
              <span className="text-secondary">{canonicalWf.title}</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-semibold text-accent uppercase">
                {canonicalWf.category.replace(/_/g, " ")}
              </span>
              <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-secondary">
                ⏱ {canonicalWf.estimatedEffort}
              </span>
              <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] text-tertiary uppercase">
                {canonicalWf.difficulty}
              </span>
              <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 font-mono text-[11px]">
                ✓ VERIFIED PROTOCOL
              </span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-primary leading-tight">
              {canonicalWf.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-secondary leading-relaxed font-normal">
              {canonicalWf.summary}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-tertiary pt-4 border-t border-border-subtle">
              <span><strong className="text-secondary">Protocol ID:</strong> {canonicalWf.id}</span>
              <span>•</span>
              <span><strong className="text-secondary">Last Verified:</strong> {canonicalWf.verifiedAt}</span>
            </div>
          </div>
        </div>

        <div className="shell max-w-4xl py-14 space-y-16">
          {/* Executive Purpose & Context */}
          <section className="surface p-6 sm:p-8 space-y-4 rounded-2xl border border-border">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">
              Strategic Value &amp; Purpose
            </h2>
            <p className="text-sm sm:text-base text-primary leading-relaxed">
              {canonicalWf.purpose}
            </p>
          </section>

          {/* When to Use vs When Not to Use */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="surface p-6 rounded-2xl border border-border space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold text-sm">✓</span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary font-mono">
                  When to Use This Playbook
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-secondary">
                {canonicalWf.whenToUse.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface p-6 rounded-2xl border border-border space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-semibold text-sm">✕</span>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-primary font-mono">
                  When Not to Use
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-secondary">
                {canonicalWf.whenNotToUse.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Required Inputs & Master Outputs */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="surface p-6 rounded-2xl border border-border space-y-3 bg-surface-elevated/40">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-tertiary font-mono">
                Required Production Inputs
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-primary">
                {canonicalWf.inputsRequired.map((input, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-accent font-mono font-bold">0{i + 1}.</span>
                    <span>{input}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface p-6 rounded-2xl border border-border space-y-3 bg-surface-elevated/40">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-tertiary font-mono">
                Produced Master Deliverables
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-primary">
                {canonicalWf.outputsProduced.map((output, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-mono font-bold">✓</span>
                    <span>{output}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Production Stage Roadmap */}
          <section className="surface p-6 sm:p-8 rounded-2xl border border-border">
            <h2 className="text-lg sm:text-xl font-semibold text-primary tracking-tight mb-6">
              Production Stage Roadmap ({canonicalWf.steps.length} Sequential Phases)
            </h2>
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 overflow-x-auto pb-2">
              {canonicalWf.steps.map((step, idx) => (
                <div key={step.stepNumber} className="flex md:flex-col items-center gap-3 flex-1">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-sm font-semibold text-accent">
                    0{step.stepNumber}
                  </div>
                  <div className="text-left md:text-center">
                    <p className="text-xs font-semibold text-primary">{step.name}</p>
                  </div>
                  {idx < canonicalWf.steps.length - 1 && (
                    <span className="hidden md:block text-tertiary font-mono text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Step-by-Step Playbook Dossier */}
          <div className="space-y-12">
            {canonicalWf.steps.map((step) => {
              const recommendedTools = step.recommendedToolIds
                .map((id) => getToolById(id))
                .filter(Boolean);
              const recommendedTechniques = step.recommendedTechniqueIds
                .map((id) => getTechniqueById(id))
                .filter(Boolean);
              const linkedPrompts = step.optionalPromptIds
                .map((idOrSlug) => getPromptById(idOrSlug) || getPromptBySlug(idOrSlug))
                .filter(Boolean);

              return (
                <section
                  key={step.stepNumber}
                  className="surface p-6 sm:p-8 space-y-6 rounded-2xl border border-border relative overflow-hidden"
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-bold text-accent">
                        PHASE 0{step.stepNumber}
                      </span>
                      <span className="font-mono text-xs text-tertiary">
                        Stage {step.stepNumber} of {canonicalWf.steps.length}
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-semibold text-primary">
                    {step.name}
                  </h2>

                  {/* Objective */}
                  <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1 font-mono">
                      Phase Objective:
                    </p>
                    <p className="text-sm font-normal text-primary">{step.objective}</p>
                  </div>

                  {/* Execution Action */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-secondary font-mono">
                      Actionable Execution Protocol:
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-secondary font-normal">
                      {step.action}
                    </p>
                  </div>

                  {/* Input / Output Bridge */}
                  <div className="grid gap-3 sm:grid-cols-2 pt-2">
                    <div className="rounded-lg border border-border bg-surface-elevated/60 p-3">
                      <span className="text-[10px] font-mono uppercase text-tertiary block">
                        Step Input:
                      </span>
                      <span className="text-xs text-primary font-medium mt-0.5 block">
                        {step.input}
                      </span>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-elevated/60 p-3">
                      <span className="text-[10px] font-mono uppercase text-emerald-400 block">
                        Step Output:
                      </span>
                      <span className="text-xs text-primary font-medium mt-0.5 block">
                        {step.output}
                      </span>
                    </div>
                  </div>

                  {/* Recommended Techniques Strip */}
                  {recommendedTechniques.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary font-mono">
                        Recommended Cinema Techniques:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recommendedTechniques.map((tech) => (
                          <Link
                            key={tech?.id}
                            href={`/techniques/${tech?.slug}`}
                            className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-3 py-2 text-xs font-medium text-primary hover:border-accent hover:text-accent transition"
                          >
                            <span className="text-accent font-mono text-[10px]">TECH</span>
                            <span>{tech?.name}</span>
                            <span className="text-tertiary">→</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Tools Grid */}
                  {recommendedTools.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary font-mono">
                        Software &amp; Engine Stack for This Phase:
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {recommendedTools.map((tool) => (
                          <div
                            key={tool?.id}
                            className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated p-4"
                          >
                            <div>
                              <p className="text-sm font-semibold text-primary">{tool?.name}</p>
                              <p className="text-[11px] text-tertiary font-mono">{tool?.subcategories[0] || tool?.category}</p>
                            </div>
                            <Link
                              href={`/tools/${tool?.slug}`}
                              className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
                            >
                              Tool Dossier →
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Linked Prompts Recipes */}
                  {linkedPrompts.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-secondary font-mono">
                        Linked Director Prompt Recipes:
                      </p>
                      {linkedPrompts.map((prompt) => (
                        <div
                          key={prompt?.id}
                          className="rounded-xl border border-border-subtle bg-surface-elevated p-4 space-y-2"
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
                          <p className="rounded-lg border border-border bg-surface p-3 font-mono text-xs text-secondary leading-relaxed select-all">
                            {prompt?.promptText}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quality Check & Common Failure Callout */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-2">
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 font-mono">
                        ⚠ Common Failure Mode:
                      </p>
                      <p className="text-xs text-secondary leading-relaxed">
                        {step.commonFailure}
                      </p>
                    </div>
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 font-mono">
                        ✓ Quality Control Check:
                      </p>
                      <p className="text-xs text-secondary leading-relaxed">
                        {step.qualityCheck}
                      </p>
                    </div>
                  </div>

                  {/* Pro Tips */}
                  {step.proTips && step.proTips.length > 0 && (
                    <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-2">
                      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                        Director Pro-Tips:
                      </p>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-secondary">
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

          {/* Connected Cinema Knowledge Graph */}
          <div className="space-y-8 pt-8 border-t border-border-subtle">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
              Connected Cinema Intelligence Graph
            </h2>

            {/* Demonstration Films */}
            {relatedFilms.length > 0 && (
              <section className="surface p-6 sm:p-8 rounded-2xl border border-border space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent font-mono">
                  Demonstration Reference Films
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {relatedFilms.map((film) => (
                    <Link
                      key={film?.id}
                      href={`/films/${film?.slug}`}
                      className="rounded-xl border border-border-subtle bg-surface-elevated p-4 transition hover:border-border-bright block group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-tertiary">
                        <span>{film?.releaseYear}</span>
                        <span>{film?.technicalSpecs.aspectRatio}</span>
                      </div>
                      <h4 className="mt-1 text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                        {film?.title}
                      </h4>
                      <p className="mt-1 text-xs text-secondary line-clamp-2">
                        {film?.logline}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Related Research & Journal */}
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedResearch.length > 0 && (
                <section className="surface p-6 rounded-2xl border border-border space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary font-mono">
                    Related Research Dossiers
                  </h3>
                  <div className="space-y-2">
                    {relatedResearch.map((res) => (
                      <Link
                        key={res?.id}
                        href={`/research/${res?.slug}`}
                        className="block rounded-lg border border-border bg-surface-elevated p-3 transition hover:border-border-bright"
                      >
                        <p className="text-xs font-semibold text-primary">{res?.topic}</p>
                        <p className="mt-1 text-[11px] text-secondary line-clamp-2">{res?.findingsSummary}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {relatedJournal.length > 0 && (
                <section className="surface p-6 rounded-2xl border border-border space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary font-mono">
                    Related Cinema Journal Deep Dives
                  </h3>
                  <div className="space-y-2">
                    {relatedJournal.map((art) => (
                      <Link
                        key={art?.id}
                        href={`/journal/${art?.slug}`}
                        className="block rounded-lg border border-border bg-surface-elevated p-3 transition hover:border-border-bright"
                      >
                        <p className="text-xs font-semibold text-primary">{art?.title}</p>
                        <p className="mt-1 text-[11px] text-secondary line-clamp-2">{art?.excerpt}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  // Fallback for legacy workflow data
  const legacyWf = workflowsData.find((w) => w.slug === slug);
  if (!legacyWf) {
    notFound();
  }

  const relatedTutorials = tutorialsData.filter((tut) =>
    legacyWf.relatedTutorialIds.includes(tut.id)
  );

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tertiary mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/workflows" className="hover:text-primary transition-colors">Workflows</Link>
            <span>/</span>
            <span className="text-secondary">{legacyWf.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent font-mono text-xs">
              {legacyWf.category} Pipeline
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-secondary">
              ⏱ {legacyWf.estimatedTime}
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] text-tertiary uppercase">
              {legacyWf.difficulty}
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-primary leading-tight">
            {legacyWf.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-secondary leading-relaxed font-normal">
            {legacyWf.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-tertiary pt-4 border-t border-border-subtle">
            <span><strong className="text-secondary">Target Audience:</strong> {legacyWf.targetAudience}</span>
            <span>•</span>
            <span><strong className="text-secondary">Audited:</strong> {legacyWf.lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="shell max-w-4xl py-14 space-y-16">
        {/* Visual Pipeline Stage Roadmap */}
        <section className="surface p-6 sm:p-8 rounded-2xl border border-border">
          <h2 className="text-lg sm:text-xl font-semibold text-primary tracking-tight mb-6">Pipeline Stage Roadmap</h2>
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 overflow-x-auto pb-2">
            {legacyWf.steps.map((step, idx) => (
              <div key={step.stepNumber} className="flex md:flex-col items-center gap-3 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-sm font-semibold text-accent">
                  0{step.stepNumber}
                </div>
                <div className="text-left md:text-center">
                  <p className="text-xs font-semibold text-primary">{step.phaseName}</p>
                </div>
                {idx < legacyWf.steps.length - 1 && (
                  <span className="hidden md:block text-tertiary font-mono text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Step-by-Step Production Phases */}
        <div className="space-y-10">
          {legacyWf.steps.map((step) => {
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
              <section key={step.stepNumber} className="surface p-6 sm:p-8 space-y-6 rounded-2xl border border-border">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
                    PHASE 0{step.stepNumber}
                  </span>
                  <span className="font-mono text-xs text-tertiary">
                    Stage {step.stepNumber} of {legacyWf.steps.length}
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
          <section className="surface p-6 sm:p-8 rounded-2xl border border-border">
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
