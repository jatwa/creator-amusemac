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
    title: `${tut.title} | Creator by Amusemac`,
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
    <main className="min-h-screen bg-ink text-zinc-100">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Header */}
      <div className="border-b border-line bg-panel/50 py-12 sm:py-16">
        <div className="shell max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-6">
            <Link href="/" className="hover:text-lime">Home</Link>
            <span>/</span>
            <Link href="/tutorials" className="hover:text-lime">Tutorials</Link>
            <span>/</span>
            <span className="text-white">{tut.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
              {tut.category}
            </span>
            <span className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs text-zinc-300">
              {tut.readTime}
            </span>
            <span className="rounded-full border border-line bg-black/40 px-3 py-1 text-xs text-zinc-400 uppercase">
              {tut.difficulty}
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {tut.title}
          </h1>

          <div className="mt-6 rounded-xl border border-line bg-black/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-lime">Goal of this Tutorial:</p>
            <p className="mt-1 text-base text-zinc-200 leading-7">{tut.goal}</p>
          </div>
        </div>
      </div>

      <div className="shell max-w-4xl py-12 space-y-12">
        {/* Required Tools & Prerequisites */}
        <section className="grid gap-6 sm:grid-cols-2">
          <div className="surface p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-lime">
              Prerequisites
            </h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-300">
              {tut.prerequisites.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-lime">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-lime">
              Required Tool Stack
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {requiredTools.map((tool) => (
                <Link
                  key={tool?.id}
                  href={`/tools/${tool?.slug}`}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-black/40 px-3 py-1 text-xs font-medium text-white hover:border-lime transition"
                >
                  <span>{tool?.name}</span>
                  <span className="text-lime">→</span>
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
              <section key={idx} className="surface p-8">
                <h2 className="text-2xl font-bold text-white">
                  {section.heading}
                </h2>

                <p className="mt-4 text-base leading-8 text-zinc-300">
                  {section.contentMarkdown}
                </p>

                {section.tipBox && (
                  <div className="mt-6 rounded-xl border border-lime/30 bg-lime/5 p-4 text-sm text-zinc-200">
                    <span className="font-bold text-lime">Director Tip: </span>
                    <span>{section.tipBox}</span>
                  </div>
                )}

                {linkedPrompt && (
                  <div className="mt-6 rounded-xl border border-line bg-black/40 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-lime uppercase">
                        Recipe: {linkedPrompt.title}
                      </span>
                      <Link
                        href={`/prompts/${linkedPrompt.slug}`}
                        className="text-xs text-lime underline"
                      >
                        Customize Prompt →
                      </Link>
                    </div>
                    <p className="mt-2 rounded-lg border border-zinc-800 bg-black/60 p-3 font-mono text-xs text-zinc-300">
                      {linkedPrompt.promptText}
                    </p>
                  </div>
                )}

                {linkedTool && (
                  <div className="mt-6 flex items-center justify-between rounded-xl border border-line bg-black/20 p-4">
                    <div>
                      <span className="text-xs text-zinc-500 uppercase">Tool Mentioned</span>
                      <p className="text-sm font-bold text-white">{linkedTool.name}</p>
                    </div>
                    <Link
                      href={`/tools/${linkedTool.slug}`}
                      className="rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-semibold text-lime hover:border-lime transition"
                    >
                      View Tool Dossier →
                    </Link>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Common Mistakes & Creator Pitfalls */}
        {tut.commonMistakes.length > 0 && (
          <section className="surface p-8 border-red-500/20">
            <h2 className="text-xl font-bold text-red-400">
              Common Production Mistakes to Avoid
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              {tut.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">✗</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Linked Workflows */}
        {relatedWorkflows.length > 0 && (
          <section className="surface p-8">
            <h2 className="text-xl font-bold text-white">Full Production Workflows</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {relatedWorkflows.map((wf) => (
                <Link
                  key={wf.id}
                  href={`/workflows/${wf.slug}`}
                  className="rounded-xl border border-line bg-black/30 p-5 transition hover:border-lime"
                >
                  <p className="text-xs text-lime font-semibold uppercase">Production Pipeline</p>
                  <h3 className="mt-1.5 text-base font-bold text-white">{wf.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400">{wf.summary}</p>
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
