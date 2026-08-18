import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";
import {
  comparisonsData,
  tutorialsData,
  promptsData,
} from "@/data/platform-data";
import { getComparisonBySlug, getToolById } from "@/data/content";

export async function generateStaticParams() {
  return comparisonsData.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);
  if (!comp) return { title: "Comparison Not Found" };

  const toolA = getToolById(comp.toolAId);
  const toolB = getToolById(comp.toolBId);
  const nameA = toolA?.name || "Tool A";
  const nameB = toolB?.name || "Tool B";

  return {
    title: `${nameA} vs ${nameB} — Creator Comparison & Verdict | Creator by Amusemac`,
    description: comp.summaryVerdict,
  };
}

export default async function ComparisonDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comp = getComparisonBySlug(slug);

  if (!comp) {
    notFound();
  }

  const toolA = getToolById(comp.toolAId);
  const toolB = getToolById(comp.toolBId);
  const nameA = toolA?.name || "Tool A";
  const nameB = toolB?.name || "Tool B";

  const relatedTutorials = tutorialsData.filter((t) =>
    comp.relatedTutorialIds.includes(t.id)
  );

  const relatedPrompts = promptsData.filter((p) =>
    comp.relatedPromptIds.includes(p.id)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${nameA} vs ${nameB}: Detailed Creator Comparison`,
    description: comp.summaryVerdict,
    datePublished: "2026-08-16",
    dateModified: comp.updatedAt,
    author: {
      "@type": "Organization",
      name: "Creator by Amusemac",
    },
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
            <Link href="/compare" className="hover:text-lime">Compare</Link>
            <span>/</span>
            <span className="text-white">{nameA} vs {nameB}</span>
          </div>

          <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
            {comp.category.toUpperCase()}
          </span>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-6xl">
            {nameA} <span className="text-zinc-500 font-normal">vs</span> {nameB}
          </h1>

          <p className="mt-4 text-lg text-zinc-300 leading-8 max-w-3xl">
            {comp.summaryVerdict}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            {toolA && (
              <Link
                href={`/tools/${toolA.slug}`}
                className="rounded-xl border border-line bg-panel px-5 py-2.5 text-xs font-bold text-white hover:border-lime transition"
              >
                View {nameA} Dossier →
              </Link>
            )}
            {toolB && (
              <Link
                href={`/tools/${toolB.slug}`}
                className="rounded-xl border border-line bg-panel px-5 py-2.5 text-xs font-bold text-white hover:border-lime transition"
              >
                View {nameB} Dossier →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        {/* Scenario-by-Scenario Recommendations */}
        <section className="surface p-8">
          <h2 className="text-2xl font-bold text-white">Scenario-by-Scenario Winner</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Real production decisions depend on your exact deliverable. Here is how we break down the choice.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {comp.verdictByScenario.map((scenario, i) => {
              const winner = getToolById(scenario.winnerId);
              return (
                <div
                  key={i}
                  className="rounded-xl border border-line bg-black/30 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-semibold uppercase text-zinc-500">Scenario</span>
                    <h3 className="mt-1 text-lg font-bold text-white">{scenario.scenario}</h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">{scenario.rationale}</p>
                  </div>

                  <div className="mt-6 border-t border-line/60 pt-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Recommended Tool:</span>
                    <span className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-xs font-bold text-lime">
                      {winner?.name || scenario.winnerId}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Side-by-Side Scoring Matrix */}
        <section className="surface p-8">
          <h2 className="text-2xl font-bold text-white">Comparative Benchmark Scores</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Ratings based on real production testing and studio feedback (Scale of 1-10).
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-line bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase text-zinc-400">Visual Quality</p>
              <div className="mt-3 space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-white">{nameA}:</span>
                  <span className="text-lime font-bold">{comp.scores.quality.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">{nameB}:</span>
                  <span className="text-lime font-bold">{comp.scores.quality.toolB}/10</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase text-zinc-400">Speed</p>
              <div className="mt-3 space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-white">{nameA}:</span>
                  <span className="text-lime font-bold">{comp.scores.speed.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">{nameB}:</span>
                  <span className="text-lime font-bold">{comp.scores.speed.toolB}/10</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase text-zinc-400">Ease of Use</p>
              <div className="mt-3 space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-white">{nameA}:</span>
                  <span className="text-lime font-bold">{comp.scores.easeOfUse.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">{nameB}:</span>
                  <span className="text-lime font-bold">{comp.scores.easeOfUse.toolB}/10</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase text-zinc-400">Creator Value</p>
              <div className="mt-3 space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-white">{nameA}:</span>
                  <span className="text-lime font-bold">{comp.scores.creatorValue.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">{nameB}:</span>
                  <span className="text-lime font-bold">{comp.scores.creatorValue.toolB}/10</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-black/20 p-5">
              <p className="text-xs font-semibold uppercase text-zinc-400">Commercial Safety</p>
              <div className="mt-3 space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-white">{nameA}:</span>
                  <span className="text-lime font-bold">{comp.scores.commercialSafety.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">{nameB}:</span>
                  <span className="text-lime font-bold">{comp.scores.commercialSafety.toolB}/10</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Matrix Table */}
        <section className="surface p-8">
          <h2 className="text-2xl font-bold text-white">Feature-by-Feature Matrix</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-black/40 text-xs font-semibold uppercase text-zinc-400">
                <tr>
                  <th className="py-4 px-4">Feature / Capability</th>
                  <th className="py-4 px-4">{nameA}</th>
                  <th className="py-4 px-4">{nameB}</th>
                  <th className="py-4 px-4">Importance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {comp.featureMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-4 px-4 font-medium text-white">{row.feature}</td>
                    <td className="py-4 px-4 text-zinc-300">
                      {typeof row.toolASupport === "boolean" ? (
                        row.toolASupport ? (
                          <span className="text-lime font-bold">✓ Yes</span>
                        ) : (
                          <span className="text-zinc-600">✗ No</span>
                        )
                      ) : (
                        <span>{row.toolASupport}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-zinc-300">
                      {typeof row.toolBSupport === "boolean" ? (
                        row.toolBSupport ? (
                          <span className="text-lime font-bold">✓ Yes</span>
                        ) : (
                          <span className="text-zinc-600">✗ No</span>
                        )
                      ) : (
                        <span>{row.toolBSupport}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="rounded-full border border-line bg-black/40 px-2.5 py-0.5 text-[11px] text-zinc-400">
                        {row.importance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing Comparison */}
        <section className="grid gap-6 sm:grid-cols-2">
          {toolA && (
            <div className="surface p-6">
              <h3 className="text-lg font-bold text-white">{nameA} Pricing</h3>
              <p className="mt-2 text-2xl font-bold text-lime">{toolA.pricing.startingPrice || "Free"}</p>
              <p className="mt-1 text-xs text-zinc-400">{toolA.pricing.freeTierDetails}</p>
              <p className="mt-3 text-xs text-zinc-300 leading-5">{toolA.pricing.subscriptionInfo}</p>
            </div>
          )}

          {toolB && (
            <div className="surface p-6">
              <h3 className="text-lg font-bold text-white">{nameB} Pricing</h3>
              <p className="mt-2 text-2xl font-bold text-lime">{toolB.pricing.startingPrice || "Free"}</p>
              <p className="mt-1 text-xs text-zinc-400">{toolB.pricing.freeTierDetails}</p>
              <p className="mt-3 text-xs text-zinc-300 leading-5">{toolB.pricing.subscriptionInfo}</p>
            </div>
          )}
        </section>

        {/* Related Tutorials & Prompts */}
        {(relatedTutorials.length > 0 || relatedPrompts.length > 0) && (
          <section className="surface p-8">
            <h2 className="text-2xl font-bold text-white">Recommended Next Steps & Guides</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {relatedTutorials.map((tut) => (
                <Link
                  key={tut.id}
                  href={`/tutorials/${tut.slug}`}
                  className="rounded-xl border border-line bg-black/20 p-5 transition hover:border-lime"
                >
                  <span className="text-xs font-semibold uppercase text-lime">Workflow Tutorial</span>
                  <h3 className="mt-2 text-base font-bold text-white">{tut.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400">{tut.goal}</p>
                </Link>
              ))}
              {relatedPrompts.map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.slug}`}
                  className="rounded-xl border border-line bg-black/20 p-5 transition hover:border-lime"
                >
                  <span className="text-xs font-semibold uppercase text-lime">Prompt Recipe</span>
                  <h3 className="mt-2 text-base font-bold text-white">{p.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400">{p.description}</p>
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
