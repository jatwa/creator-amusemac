import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import { getAllPublicResearch, getResearchBySlug } from "@/data/research-canonical";
import { db } from "@/lib/db/repository";
import { getAllStandingFestivals } from "@/data/festivals-canonical";
import { StatementNature, VerificationStatus } from "@/data/film-intelligence-types";

interface ResearchRecordProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const records = getAllPublicResearch();
  return records.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: ResearchRecordProps): Promise<Metadata> {
  const { slug } = await params;
  const record = getResearchBySlug(slug);

  if (!record) {
    return {
      title: "Research Record Not Found — Creator Intel",
    };
  }

  const pageTitle = `${record.researchQuestion} — Cinema Research Desk | Creator Intel`;
  const pageUrl = `https://creatorintels.com/research/${record.slug}`;

  return {
    title: pageTitle,
    description: record.findingsSummary,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${record.researchQuestion} — Cinema Research Desk`,
      description: record.findingsSummary,
      url: pageUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${record.researchQuestion}`,
      description: record.findingsSummary,
    },
  };
}

export default async function ResearchRecordPage({ params }: ResearchRecordProps) {
  const { slug } = await params;
  const record = getResearchBySlug(slug);

  if (!record) {
    notFound();
  }

  // Cross-entity resolution
  const allBlogs = db.getPublishedBlogs();
  const relatedJournal = allBlogs.filter(
    (b) =>
      b.title.toLowerCase().includes(record.entityType.toLowerCase()) ||
      b.tags.some((t: string) => record.topic.toLowerCase().includes(t.toLowerCase())) ||
      (record.slug.includes("flow-matching") && b.slug.includes("flux-flow-matching"))
  );

  const allFestivals = getAllStandingFestivals();
  const relatedFestivals = allFestivals.filter(
    (f) =>
      record.slug.includes("premiere") ||
      f.focusCategories.some((c) => record.topic.toLowerCase().includes(c.toLowerCase()))
  );

  const formatNatureBadge = (nature: StatementNature) => {
    switch (nature) {
      case "FACT":
        return {
          label: "FACT",
          className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          desc: "Direct primary empirical evidence",
        };
      case "INTERPRETATION":
        return {
          label: "INTERPRETATION",
          className: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          desc: "Expert synthesis from secondary accounts",
        };
      case "INFERENCE":
        return {
          label: "INFERENCE",
          className: "text-amber-300 bg-amber-500/10 border-amber-500/20",
          desc: "Directional hypothesis from incomplete data",
        };
      case "UNVERIFIED":
        return {
          label: "UNVERIFIED",
          className: "text-rose-400 bg-rose-500/10 border-rose-500/20",
          desc: "Pending human source verification",
        };
    }
  };

  const conflictingStatements = record.statements.filter(
    (s) => s.conflictingSourceIds.length > 0 || s.counterEvidence
  );

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-12 sm:py-18">
        <div className="shell space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/research"
              className="text-xs font-mono text-tertiary hover:text-accent transition flex items-center gap-1"
            >
              <span>←</span>
              <span>Cinema Research Desk</span>
            </Link>
            <span className="text-tertiary font-mono text-xs">•</span>
            <span className="text-xs font-mono uppercase text-accent font-semibold">
              {record.topic}
            </span>
          </div>

          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-accent/10 border border-accent/30 px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold text-accent">
                RESEARCH DOSSIER
              </span>
              <span className="rounded-md bg-surface-elevated border border-border px-2.5 py-0.5 text-[10px] font-mono uppercase font-medium text-tertiary">
                ENTITY: {record.entityType.replace(/_/g, " ")}
              </span>
              <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-mono uppercase font-semibold text-emerald-400">
                {record.verificationStatus}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary leading-tight font-serif">
              {record.researchQuestion}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-tertiary pt-2 border-t border-border-subtle">
              <span>Audited By: <strong className="text-primary">{record.verifiedBy}</strong></span>
              <span>•</span>
              <span>Last Verified: <strong className="text-primary">{record.verifiedDate}</strong></span>
              <span>•</span>
              <span>Next Review: <strong className="text-secondary">{record.nextReviewDate}</strong></span>
              <span>•</span>
              <span className="text-emerald-400">Confidence: {record.confidenceLevel}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-12 space-y-16">
        {/* SECTION 01: FINDINGS SUMMARY */}
        <section className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              Section 01 • Empirical Summary
            </span>
            <span className="text-xs font-mono text-tertiary">Verified Synthesis</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-primary">Key Research Findings</h2>
          <p className="text-base sm:text-lg text-secondary leading-relaxed font-sans">
            {record.findingsSummary}
          </p>
        </section>

        {/* SECTION 02: STATEMENT-LEVEL TRUST LEDGER */}
        <section className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              Section 02 • Statement-Level Trust Ledger
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-primary mt-1">
              Claims &amp; Evidentiary Classification
            </h2>
            <p className="text-sm text-secondary mt-1.5 leading-relaxed">
              Every statement in this dossier is audited and assigned a specific trust layer — distinguishing primary facts from analytical interpretations and forward-looking inferences.
            </p>
          </div>

          <div className="space-y-4">
            {record.statements.map((stmt) => {
              const badge = formatNatureBadge(stmt.nature);
              const supportingSources = record.sources.filter((s) =>
                stmt.supportingSourceIds.includes(s.id)
              );

              return (
                <div
                  key={stmt.id}
                  className="surface rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-4 hover:border-accent/40 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md border px-2.5 py-0.5 text-xs font-mono uppercase font-bold ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-xs font-sans text-tertiary">
                        {badge.desc}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-tertiary">
                        {stmt.directness.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {stmt.verificationStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-base sm:text-lg font-medium text-primary leading-relaxed font-sans">
                    &ldquo;{stmt.statement}&rdquo;
                  </p>

                  {stmt.notes && (
                    <p className="text-sm text-tertiary italic font-sans">
                      Note: {stmt.notes}
                    </p>
                  )}

                  {/* Supporting Sources Pills */}
                  {supportingSources.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-xs font-mono uppercase text-tertiary">
                        Anchored To:
                      </span>
                      {supportingSources.map((src) => (
                        <a
                          key={src.id}
                          href={src.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-surface-elevated border border-border px-3 py-1 text-xs font-sans text-accent hover:border-accent transition inline-flex items-center gap-1"
                        >
                          <span>{src.sourceTitle.slice(0, 45)}...</span>
                          <span>↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 03: EVIDENCE & METHODOLOGY */}
        <section className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4">
          <div className="border-b border-border-subtle pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              Section 03 • Investigation Rigor
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-primary mt-1">
              Research Methodology &amp; Datasets
            </h2>
          </div>
          <p className="text-sm sm:text-base text-secondary leading-relaxed font-sans">
            {record.methodology}
          </p>
        </section>

        {/* SECTION 04: VERIFIED SOURCE LEDGER */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                Section 04 • 8-Tier Authority Ledger
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-primary mt-1">
                Verified Research Sources ({record.sources.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              ✓ Primary Source Traceable
            </span>
          </div>

          <div className="space-y-4">
            {record.sources.map((src) => (
              <div
                key={src.id}
                className="surface rounded-2xl border border-border bg-surface p-5 sm:p-6 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-bold text-accent uppercase">
                      Tier {src.tier} • {src.tierName.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] font-mono uppercase text-tertiary">
                      Category: {src.sourceCategory.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-tertiary">
                    <span>Retrieved: {src.retrievedDate}</span>
                    <span className="text-emerald-400">Reliability: {(src.reliabilityScore * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <h3 className="text-base font-bold text-primary">{src.sourceTitle}</h3>
                    <p className="text-xs text-secondary font-mono">
                      Publisher: {src.sourcePublisher} {src.author ? `• Author: ${src.author}` : ""}
                    </p>
                    {src.quotedPassage && (
                      <p className="text-xs text-tertiary italic bg-surface-elevated/80 p-3 rounded-xl border border-border-subtle mt-2 leading-relaxed">
                        &ldquo;{src.quotedPassage}&rdquo;
                      </p>
                    )}
                  </div>

                  <a
                    href={src.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start sm:self-auto rounded-full bg-primary px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Inspect Primary Source</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 05: CONFLICT HANDLING & RESOLUTION (IF ANY) */}
        {conflictingStatements.length > 0 && (
          <section className="rounded-3xl border border-amber-500/30 bg-surface-elevated/30 p-6 sm:p-8 space-y-4">
            <div className="border-b border-border-subtle pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                <span>⚠</span>
                <span>Section 05 • Evidence Conflict &amp; Resolution</span>
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-primary mt-0.5">
                Contradictory Source Arbitration
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              {conflictingStatements.map((stmt) => (
                <div key={stmt.id} className="surface rounded-2xl border border-border p-4 space-y-2 bg-surface">
                  <p className="font-semibold text-primary">&ldquo;{stmt.statement}&rdquo;</p>
                  {stmt.counterEvidence && (
                    <div className="bg-surface-elevated p-3 rounded-xl border border-border-subtle space-y-1">
                      <span className="font-mono text-[10px] uppercase text-amber-300 font-semibold block">
                        Conflicting Evidence / Counter-Argument:
                      </span>
                      <p className="text-secondary">{stmt.counterEvidence}</p>
                    </div>
                  )}
                  <p className="text-[11px] font-mono text-tertiary">
                    Resolution Status: High-authority primary regulations supersede secondary surveys.
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 06: CONNECTED CINEMA (BIDIRECTIONAL RELATIONS) */}
        <section className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
              Section 06 • Connected Knowledge Graph
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
              Related Cinema &amp; Publications
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Related Journal Dispatches */}
            {relatedJournal.length > 0 && (
              <div className="surface rounded-3xl border border-border bg-surface p-6 space-y-4">
                <span className="text-[10px] font-mono uppercase text-accent font-semibold block">
                  Journal Articles Utilizing This Research
                </span>
                <div className="space-y-3">
                  {relatedJournal.slice(0, 2).map((b) => (
                    <Link
                      key={b.id}
                      href={`/journal/${b.slug}`}
                      className="block p-3 rounded-2xl bg-surface-elevated hover:border-accent/40 border border-border-subtle transition space-y-1 group"
                    >
                      <span className="text-[10px] font-mono uppercase text-tertiary">
                        {b.category} • {b.readingTime}
                      </span>
                      <h4 className="text-sm font-bold text-primary group-hover:text-accent transition">
                        {b.title}
                      </h4>
                      <p className="text-xs text-secondary line-clamp-1">{b.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Festivals */}
            {relatedFestivals.length > 0 && (
              <div className="surface rounded-3xl border border-border bg-surface p-6 space-y-4">
                <span className="text-[10px] font-mono uppercase text-accent font-semibold block">
                  Connected Festival Circuits
                </span>
                <div className="space-y-3">
                  {relatedFestivals.slice(0, 2).map((f) => (
                    <Link
                      key={f.id}
                      href={`/festivals/${f.slug}`}
                      className="block p-3 rounded-2xl bg-surface-elevated hover:border-accent/40 border border-border-subtle transition space-y-1 group"
                    >
                      <span className="text-[10px] font-mono uppercase text-tertiary">
                        {f.hostCity}, {f.hostCountry} • {f.prestigeTier.replace(/_/g, " ")}
                      </span>
                      <h4 className="text-sm font-bold text-primary group-hover:text-accent transition">
                        {f.name}
                      </h4>
                      <p className="text-xs text-secondary line-clamp-1">{f.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 07: AUDIT HISTORY & PROVENANCE */}
        <section className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                Section 07 • Provenance &amp; Verification Chain
              </span>
              <h2 className="text-lg font-bold text-primary mt-0.5">Audit Ledger &amp; Provenance</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              {record.provenance}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface-elevated p-4 rounded-2xl border border-border-subtle">
              <div>
                <span className="text-[10px] font-mono uppercase text-tertiary block">Provenance</span>
                <span className="font-semibold text-primary font-mono">{record.provenance}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-tertiary block">Audited By</span>
                <span className="font-semibold text-primary">{record.verifiedBy}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-tertiary block">Verified Date</span>
                <span className="font-mono text-secondary">{record.verifiedDate}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-tertiary block">Review Due</span>
                <span className="font-mono text-secondary">{record.nextReviewDate}</span>
              </div>
            </div>

            {record.changeLog && record.changeLog.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono uppercase text-tertiary block font-semibold">
                  Change History:
                </span>
                {record.changeLog.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-tertiary font-mono text-[11px]">
                    <span className="text-secondary">{log.date}</span>
                    <span>•</span>
                    <span className="text-primary">{log.changedBy}</span>
                    <span>—</span>
                    <span>{log.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <AdSlot slotId="research-record-bottom" label="Cinema Research Partner" />
      </div>

      <Footer />
    </main>
  );
}
