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
    title: `${nameA} vs ${nameB} — Creator Comparison — Creator by Amusemac`,
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
    <main className="min-h-screen bg-background text-primary transition-colors">
      <StructuredData data={jsonLd} />
      <Navigation />

      {/* Editorial Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tertiary mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/compare" className="hover:text-primary transition-colors">Compare</Link>
            <span>/</span>
            <span className="text-secondary">{nameA} vs {nameB}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs font-medium text-accent">
              {comp.category}
            </span>
            <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-secondary">
              Audited: {comp.updatedAt}
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tight text-primary leading-tight">
            {nameA} <span className="text-tertiary font-normal">vs</span> {nameB}
          </h1>

          {/* VERDICT FIRST CALLOUT BOX */}
          <div className="mt-8 rounded-2xl border border-border-subtle bg-surface-elevated p-6 sm:p-8 max-w-4xl shadow-subtle">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                The Editorial Verdict
              </span>
            </div>
            <p className="text-base sm:text-lg font-normal text-primary leading-relaxed">
              {comp.summaryVerdict}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {toolA && (
              <Link
                href={`/tools/${toolA.slug}`}
                className="rounded-full bg-foreground px-5 py-2.5 text-xs sm:text-sm font-medium text-background hover:opacity-90 transition shadow-sm"
              >
                Inspect {nameA} Dossier →
              </Link>
            )}
            {toolB && (
              <Link
                href={`/tools/${toolB.slug}`}
                className="rounded-full border border-border bg-surface px-5 py-2.5 text-xs sm:text-sm font-medium text-secondary hover:text-primary hover:border-border-bright transition"
              >
                Inspect {nameB} Dossier →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="shell py-14 space-y-16">
        {/* Scenario-by-Scenario Winner */}
        <section className="surface p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-1">Scenario-by-Scenario Recommendations</h2>
          <p className="text-xs sm:text-sm text-secondary font-normal">
            Real production decisions depend on your exact deliverable. Here is how we break down the choice.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {comp.verdictByScenario.map((scenario, i) => {
              const winner = getToolById(scenario.winnerId);
              return (
                <div
                  key={i}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-secondary">Production Scenario</span>
                    <h3 className="mt-1 text-base sm:text-lg font-semibold text-primary">{scenario.scenario}</h3>
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-secondary font-normal">{scenario.rationale}</p>
                  </div>

                  <div className="mt-6 border-t border-border-subtle pt-4 flex items-center justify-between">
                    <span className="text-xs text-tertiary font-mono">Recommended:</span>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
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
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-1">Comparative Editorial Scores</h2>
          <p className="text-xs sm:text-sm text-secondary font-normal">
            Qualitative assessments based on studio timeline testing (Scale of 1-10).
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <p className="font-mono text-[10px] uppercase text-tertiary">Visual Quality</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-primary">{nameA}:</span>
                  <span className="text-accent font-semibold">{comp.scores.quality.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary">{nameB}:</span>
                  <span className="text-accent font-semibold">{comp.scores.quality.toolB}/10</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <p className="font-mono text-[10px] uppercase text-tertiary">Render Speed</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-primary">{nameA}:</span>
                  <span className="text-accent font-semibold">{comp.scores.speed.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary">{nameB}:</span>
                  <span className="text-accent font-semibold">{comp.scores.speed.toolB}/10</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <p className="font-mono text-[10px] uppercase text-tertiary">Ease of Use</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-primary">{nameA}:</span>
                  <span className="text-accent font-semibold">{comp.scores.easeOfUse.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary">{nameB}:</span>
                  <span className="text-accent font-semibold">{comp.scores.easeOfUse.toolB}/10</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <p className="font-mono text-[10px] uppercase text-tertiary">Creator Value</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-primary">{nameA}:</span>
                  <span className="text-accent font-semibold">{comp.scores.creatorValue.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary">{nameB}:</span>
                  <span className="text-accent font-semibold">{comp.scores.creatorValue.toolB}/10</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <p className="font-mono text-[10px] uppercase text-tertiary">Commercial Safety</p>
              <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-primary">{nameA}:</span>
                  <span className="text-accent font-semibold">{comp.scores.commercialSafety.toolA}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary">{nameB}:</span>
                  <span className="text-accent font-semibold">{comp.scores.commercialSafety.toolB}/10</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Matrix Table */}
        <section className="surface p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">Technical Feature Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border-subtle bg-surface-elevated font-mono text-[11px] uppercase text-tertiary">
                <tr>
                  <th className="py-3 px-4">Feature / Capability</th>
                  <th className="py-3 px-4">{nameA}</th>
                  <th className="py-3 px-4">{nameB}</th>
                  <th className="py-3 px-4">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {comp.featureMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3.5 px-4 font-medium text-primary">{row.feature}</td>
                    <td className="py-3.5 px-4 text-secondary">
                      {typeof row.toolASupport === "boolean" ? (
                        row.toolASupport ? (
                          <span className="text-accent font-semibold">✓ Yes</span>
                        ) : (
                          <span className="text-tertiary">✗ No</span>
                        )
                      ) : (
                        <span>{row.toolASupport}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-secondary">
                      {typeof row.toolBSupport === "boolean" ? (
                        row.toolBSupport ? (
                          <span className="text-accent font-semibold">✓ Yes</span>
                        ) : (
                          <span className="text-tertiary">✗ No</span>
                        )
                      ) : (
                        <span>{row.toolBSupport}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[10px] text-tertiary">
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
              <h3 className="text-base sm:text-lg font-semibold text-primary">{nameA} Pricing Structure</h3>
              <p className="mt-2 text-2xl font-semibold text-accent">{toolA.pricing.startingPrice || "Free"}</p>
              <p className="mt-1 text-xs text-secondary">{toolA.pricing.freeTierDetails}</p>
              <p className="mt-3 text-xs text-secondary leading-relaxed font-normal">{toolA.pricing.subscriptionInfo}</p>
            </div>
          )}

          {toolB && (
            <div className="surface p-6">
              <h3 className="text-base sm:text-lg font-semibold text-primary">{nameB} Pricing Structure</h3>
              <p className="mt-2 text-2xl font-semibold text-accent">{toolB.pricing.startingPrice || "Free"}</p>
              <p className="mt-1 text-xs text-secondary">{toolB.pricing.freeTierDetails}</p>
              <p className="mt-3 text-xs text-secondary leading-relaxed font-normal">{toolB.pricing.subscriptionInfo}</p>
            </div>
          )}
        </section>

        {/* Recommended Next Steps */}
        {(relatedTutorials.length > 0 || relatedPrompts.length > 0) && (
          <section className="surface p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-6">Recommended Production Workflows</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedTutorials.map((tut) => (
                <Link
                  key={tut.id}
                  href={`/tutorials/${tut.slug}`}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 transition hover:border-border-bright block group"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-secondary">Tutorial</span>
                  <h3 className="mt-2 text-sm sm:text-base font-semibold text-primary group-hover:text-accent transition-colors">{tut.title}</h3>
                  <p className="mt-2 text-xs text-secondary line-clamp-2">{tut.goal}</p>
                </Link>
              ))}
              {relatedPrompts.map((p) => (
                <Link
                  key={p.id}
                  href={`/prompts/${p.slug}`}
                  className="rounded-xl border border-border-subtle bg-surface-elevated p-5 transition hover:border-border-bright block group"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-secondary">Prompt Recipe</span>
                  <h3 className="mt-2 text-sm sm:text-base font-semibold text-primary group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="mt-2 text-xs text-secondary line-clamp-2">{p.description}</p>
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
