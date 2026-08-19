import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import { tutorialsData, workflowsData } from "@/data/platform-data";
import { getTutorialBySlug, getToolById, getPromptById } from "@/data/content";

export async function generateStaticParams() {
  return tutorialsData.map((tut) => ({
    slug: tut.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tut = getTutorialBySlug(slug);
  if (!tut) return { title: "Tutorial Not Found" };

  return {
    title: `${tut.title} — Creator by Amusemac`,
    description: tut.goal,
  };
}

export default async function TutorialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tut = getTutorialBySlug(slug);

  if (!tut) {
    notFound();
  }

  const requiredTools = tut.requiredToolIds
    .map((id) => getToolById(id))
    .filter(Boolean);

  const relatedWorkflows = workflowsData.filter((wf) =>
    tut.relatedWorkflowIds.includes(wf.id)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tut.title,
    description: tut.goal,
    totalTime: `PT${parseInt(tut.readTime) || 10}M`,
    step: tut.sections.map((sec, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: sec.heading,
      text: sec.contentMarkdown,
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
            <Link href="/tutorials" className="hover:text-primary transition-colors">Tutorials</Link>
            <span>/</span>
            <span className="text-secondary">{tut.title}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent font-mono text-xs">
              {tut.category}
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-secondary">
              {tut.readTime}
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] text-tertiary uppercase">
              {tut.difficulty}
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-primary leading-tight">
            {tut.title}
          </h1>

          <div className="mt-6 rounded-2xl border border-border-subtle bg-surface-elevated p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">Goal of this Tutorial:</p>
            <p className="text-base text-secondary leading-relaxed font-normal">{tut.goal}</p>
          </div>
        </div>
      </div>

      <div className="shell max-w-4xl py-14 space-y-16">
        {/* Required Tools & Prerequisites */}
        <section className="grid gap-6 sm:grid-cols-2">
          <div className="surface p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Prerequisites
            </h3>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-secondary">
              {tut.prerequisites.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Required Tool Stack
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {requiredTools.map((tool) => (
                <Link
                  key={tool?.id}
                  href={`/tools/${tool?.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-3.5 py-1.5 text-xs font-medium text-primary hover:border-border-bright transition"
                >
                  <span>{tool?.name}</span>
                  <span className="text-accent">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Step-by-Step Content Sections */}
        <div className="space-y-10">
          {tut.sections.map((section, idx) => {
            const linkedPrompt = section.promptId ? getPromptById(section.promptId) : null;
            const linkedTool = section.toolId ? getToolById(section.toolId) : null;

            return (
              <section key={idx} className="surface p-6 sm:p-8 space-y-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-primary">
                  {section.heading}
                </h2>

                <p className="text-sm sm:text-base leading-relaxed text-secondary font-normal">
                  {section.contentMarkdown}
                </p>

                {section.tipBox && (
                  <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs sm:text-sm text-secondary">
                    <span className="font-semibold text-accent font-mono uppercase text-[11px]">Director Tip: </span>
                    <span className="font-normal">{section.tipBox}</span>
                  </div>
                )}

                {linkedPrompt && (
                  <div className="rounded-xl border border-border-subtle bg-surface-elevated p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">
                        Recipe: {linkedPrompt.title}
                      </span>
                      <Link
                        href={`/prompts/${linkedPrompt.slug}`}
                        className="text-xs text-accent hover:underline font-mono"
                      >
                        Customize Prompt →
                      </Link>
                    </div>
                    <p className="mt-2 rounded-lg border border-border bg-surface p-3 font-mono text-xs text-secondary select-all">
                      {linkedPrompt.promptText}
                    </p>
                  </div>
                )}

                {linkedTool && (
                  <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface-elevated p-4">
                    <div>
                      <span className="text-tertiary font-mono uppercase text-[10px]">Tool Mentioned</span>
                      <p className="text-sm font-semibold text-primary mt-0.5">{linkedTool.name}</p>
                    </div>
                    <Link
                      href={`/tools/${linkedTool.slug}`}
                      className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-secondary hover:text-primary transition font-mono"
                    >
                      View Dossier →
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Common Mistakes & Creator Pitfalls */}
        {tut.commonMistakes.length > 0 && (
          <section className="surface p-6 sm:p-8 bg-surface-elevated">
            <h2 className="text-xs font-semibold text-tertiary font-mono uppercase">
              Common Production Mistakes to Avoid
            </h2>
            <ul className="mt-4 space-y-3 text-xs sm:text-sm text-secondary">
              {tut.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-tertiary font-bold">✗</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Linked Workflows */}
        {relatedWorkflows.length > 0 && (
          <section className="surface p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-semibold text-primary tracking-tight mb-6">Full Production Workflows</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedWorkflows.map((wf) => (
                <Link
                  key={wf.id}
                  href={`/workflows/${wf.slug}`}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 transition hover:border-border-bright block group"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-secondary">Production Pipeline</p>
                  <h3 className="mt-1.5 text-sm sm:text-base font-semibold text-primary group-hover:text-accent transition-colors">{wf.title}</h3>
                  <p className="mt-2 text-xs text-secondary line-clamp-2">{wf.summary}</p>
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
