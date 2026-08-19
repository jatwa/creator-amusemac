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
    title: `${nameA} vs ${nameB} — Creator Verdict & Technical Comparison | Creator by Amusemac`,
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

      {/* Editorial Header */}
      <div className="border-b border-line bg-gradient-to-b from-panel via-ink to-ink py-12 sm:py-16">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-lime transition">Home</Link>
            <span>/</span>
            <Link href="/compare" className="hover:text-lime transition">Compare</Link>
            <span>/</span>
            <span className="text-zinc-300">{nameA} vs {nameB}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow text-xs bg-lime/10 px-3 py-1 rounded-full border border-lime/30">
              {comp.category}
            </span>
            <span className="rounded-full border border-line bg-panel px-3 py-1 font-mono text-xs text-zinc-400">
              Audited: {comp.updatedAt}
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            {nameA} <span className="text-zinc-500 font-normal">vs</span> {nameB}
          </h1>

          {/* VERDICT FIRST CALLOUT BOX */}
          <div className="mt-8 rounded-xl border border-lime/30 bg-lime/5 p-6 sm:p-8 max-w-4xl shadow-card">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-lime">
                The Editorial Verdict
              </span>
            </div>
            <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
              {comp.summaryVerdict}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {toolA && (
              <Link
                href={`/tools/${toolA.slug}`}
                className="rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-black hover:bg-lime transition"
              >
                Inspect {nameA} Dossier →
              </Link>
            )}
            {toolB && (
              <Link
                href={`/tools/${toolB.slug}`}
                className="rounded-full border border-line bg-panel px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-200 hover:border-lime hover:text-white transition"
              >
                Inspect {nameB} Dossier →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        {/* Scenario-by-Scenario Winner */}
        <section className="surface p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Scenario-by-Scenario Recommendations</h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Real production decisions depend on your exact deliverable. Here is how we break down the choice.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {comp.verdictByScenario.map((scenario, i) => {
              const winner = getToolById(scenario.winnerId);
              return (
                <div
                  key={i}
                  className="rounded-xl border border-line bg-ink/70 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="eyebrow text-[10px]">Production Scenario</span>
                    <h3 className="mt-1 text-base sm:text-lg font-bold text-white">{scenario.scenario}</h3>
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-300">{scenario.rationale}</p>
                  </div>

                  <div className="mt-6 border-t border-line/60 pt-4 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 font-mono">Recommended:</span>
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
        <section className="surface p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Comparative Editorial Scores</h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400">
            Qualitative assessments based on studio timeline testing (Scale of 1-10).
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-line bg-ink/70 p-4">
              <p className="font-mono text-[10px] uppercase text-zinc-400">Visual Quality</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
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

            <div className="rounded-xl border border-line bg-ink/70 p-4">
              <p className="font-mono text-[10px] uppercase text-zinc-400">Render Speed</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
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

            <div className="rounded-xl border border-line bg-ink/70 p-4">
              <p className="font-mono text-[10px] uppercase text-zinc-400">Ease of Use</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
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

            <div className="rounded-xl border border-line bg-ink/70 p-4">
              <p className="font-mono text-[10px] uppercase text-zinc-400">Creator Value</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
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

            <div className="rounded-xl border border-line bg-ink/70 p-4">
              <p className="font-mono text-[10px] uppercase text-zinc-400">Commercial Safety</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
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
        <section className="surface p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Technical Feature Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-line bg-black/40 font-mono text-[11px] font-semibold uppercase text-zinc-400">
                <tr>
                  <th className="py-3 px-4">Feature / Capability</th>
                  <th className="py-3 px-4">{nameA}</th>
                  <th className="py-3 px-4">{nameB}</th>
                  <th className="py-3 px-4">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {comp.featureMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-medium text-white">{row.feature}</td>
                    <td className="py-3.5 px-4 text-zinc-300">
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
                    <td className="py-3.5 px-4 text-zinc-300">
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
                    <td className="py-3.5 px-4">
                      <span className="rounded-full border border-line bg-black/40 px-2.5 py-0.5 font-mono text-[10px] text-zinc-400">
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
              <h3 className="text-base sm:text-lg font-bold text-white">{nameA} Pricing Structure</h3>
              <p className="mt-2 text-2xl font-bold text-lime">{toolA.pricing.startingPrice || "Free"}</p>
              <p className="mt-1 text-xs text-zinc-400">{toolA.pricing.freeTierDetails}</p>
              <p className="mt-3 text-xs text-zinc-300 leading-relaxed">{toolA.pricing.subscriptionInfo}</p>
            </div>
          )}

          {toolB && (
            <div className="surface p-6">
              <h3 className="text-base sm:text-lg font-bold text-white">{nameB} Pricing Structure</h3>
              <p className="mt-2 text-2xl font-bold text-lime">{toolB.pricing.startingPrice || "Free"}</p>
              <p className="mt-1 text-xs text-zinc-400">{toolB.pricing.freeTierDetails}</p>
              <p className="mt-3 text-xs text-zinc-300 leading-relaxed">{toolB.pricing.subscriptionInfo}</p>
            </div>
          )}
        </section>

        {/* Recommended Next Steps */}
        {(relatedTutorials.length > 0 || relatedPrompts.length > 0) && (
          <section className="surface p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Recommended Production Workflows</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedTutorials.map((tut) => (
                <Link
                  key={tut.id}
                  href={`/tutorials/${tut.slug}`}
                  className="rounded-xl border border-line bg-ink/70 p-5 transition hover:border-lime block group"
                >
                  <span className="eyebrow text-[10px]">Tutorial</span>
                  <h3 className="mt-2 text-sm sm:text-base font-bold text-white group-hover:text-lime transition">{tut.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{tut.goal}</p>
                </Link>
              ))}
              {relatedPrompts.map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.slug}`}
                  className="rounded-xl border border-line bg-ink/70 p-5 transition hover:border-lime block group"
                >
                  <span className="eyebrow text-[10px]">Prompt Recipe</span>
                  <h3 className="mt-2 text-sm sm:text-base font-bold text-white group-hover:text-lime transition">{p.title}</h3>
                  <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{p.description}</p>
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
