import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import {
  getAllPublicTechniques,
  getTechniqueBySlug,
} from "@/data/techniques-canonical";
import { canonicalFilms, canonicalPeople } from "@/data/films-canonical";
import { canonicalResearchRecords } from "@/data/research-canonical";
import { toolsData, promptsData } from "@/data/platform-data";

interface TechniqueSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const techniques = getAllPublicTechniques();
  return techniques.map((t) => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: TechniqueSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const technique = getTechniqueBySlug(slug);

  if (!technique) {
    return {
      title: "Technique Not Found | Creator Intel",
    };
  }

  return {
    title: `${technique.name} — Cinema Technique Dossier | Creator Intel`,
    description: `${technique.creativePurpose} ${technique.visualCharacteristics.slice(0, 140)}...`,
  };
}

export default async function TechniqueDetailPage({ params }: TechniqueSlugPageProps) {
  const { slug } = await params;
  const technique = getTechniqueBySlug(slug);

  if (!technique) {
    notFound();
  }

  // Resolve related Films
  const relatedFilms = canonicalFilms.filter(
    (f) =>
      technique.relatedFilms.includes(f.id) ||
      technique.relatedFilms.includes(f.slug) ||
      f.technicalSpecs.lenses?.some((l) => technique.name.toLowerCase().includes(l.toLowerCase())) ||
      f.technicalSpecs.cameraSystems?.some((c) => technique.name.toLowerCase().includes(c.toLowerCase()))
  );

  // Resolve related People
  const relatedPeople = canonicalPeople.filter(
    (p) =>
      technique.relatedPeople.includes(p.id) ||
      technique.relatedPeople.includes(p.slug)
  );

  // Resolve related Research records
  const relatedResearch = canonicalResearchRecords.filter(
    (r) =>
      technique.relatedResearch.includes(r.id) ||
      technique.relatedResearch.includes(r.slug) ||
      technique.sourceIds.some((s) => r.sources.some((src) => src.id === s))
  );

  // Resolve related Tools
  const relatedTools = toolsData.filter(
    (t) =>
      technique.relatedTools.includes(t.id) ||
      technique.relatedTools.includes(t.slug)
  );

  // Resolve related Prompts
  const relatedPrompts = promptsData.filter(
    (p) =>
      technique.relatedPrompts.includes(p.id) ||
      technique.relatedPrompts.includes(p.slug) ||
      p.promptText.toLowerCase().includes(technique.name.toLowerCase().split(" ")[0])
  ).slice(0, 3);

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Hero Dossier Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-12 sm:py-16">
        <div className="shell space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-tertiary">
            <Link href="/techniques" className="hover:text-primary transition">
              TECHNIQUES
            </Link>
            <span>/</span>
            <span className="text-accent uppercase font-semibold">{technique.category.replace(/_/g, " ")}</span>
            <span>/</span>
            <span className="text-primary truncate">{technique.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent/10 border border-accent/20 px-3 py-0.5 text-xs font-mono font-semibold text-accent">
                  {technique.category.replace(/_/g, " ")}
                </span>
                <span className="text-sm font-mono text-tertiary">
                  STAGE: {technique.productionStage.replace(/_/g, " ")}
                </span>
                <span className="rounded-full bg-surface-elevated border border-border-subtle px-2.5 py-0.5 text-[11px] font-mono text-secondary">
                  LEVEL: {technique.difficulty}
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
                  ✓ VERIFIED TECHNIQUE
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary font-serif">
                {technique.name}
              </h1>

              {technique.alternateNames.length > 0 && (
                <div className="text-sm font-mono text-tertiary">
                  Alternate Industry Terminology:{" "}
                  <span className="text-secondary">{technique.alternateNames.join(", ")}</span>
                </div>
              )}

              <p className="text-base sm:text-xl text-secondary leading-relaxed font-sans pt-2">
                {technique.creativePurpose}
              </p>
            </div>

            {/* Quick Action / Technical Card */}
            <div className="rounded-3xl border border-border bg-surface p-6 space-y-3 shrink-0 md:w-80 shadow-subtle">
              <div className="text-xs font-mono uppercase tracking-wider text-tertiary">Director Decision Grade</div>
              <div className="text-base font-bold text-accent font-mono">
                {technique.difficulty} MASTERY
              </div>
              <div className="text-sm text-secondary">
                Production Stage: <span className="font-semibold text-primary">{technique.productionStage.replace(/_/g, " ")}</span>
              </div>
              <div className="pt-2 border-t border-border-subtle text-xs text-tertiary font-mono">
                Confidence: {technique.confidence} • Verified: {technique.verifiedAt}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="shell py-12 space-y-12">
        <AdSlot slotId="technique-detail-top-banner" format="horizontal" />

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left / Main Column: Anatomy, Decision Framework, Execution, Common Mistakes */}
          <div className="lg:col-span-2 space-y-10">
            {/* Anatomy & Description */}
            <section className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">01. What Is It? (Anatomy & Optics)</span>
              </div>
              <p className="text-base sm:text-lg text-secondary leading-relaxed font-sans">
                {technique.description}
              </p>
            </section>

            {/* Visual Characteristics & Sensory Impact */}
            <section className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">02. Visual Signature & Image Impact</span>
              </div>
              <p className="text-base sm:text-lg text-secondary leading-relaxed font-sans">
                {technique.visualCharacteristics}
              </p>
            </section>

            {/* Director's Decision Framework */}
            <section className="surface rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">03. Director's Decision Framework</span>
                <span className="text-[11px] font-mono text-tertiary">When To Deploy</span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {/* When to Use */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    ✓ When To Use
                  </div>
                  <ul className="space-y-2 text-xs text-secondary leading-relaxed">
                    {technique.whenToUse.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 shrink-0">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* When NOT to Use */}
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-3">
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                    ✕ When To Avoid
                  </div>
                  <ul className="space-y-2 text-xs text-secondary leading-relaxed">
                    {technique.whenNotToUse.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-400 shrink-0">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Technical Considerations */}
            <section className="surface rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">04. Technical Execution & Camera Physics</span>
                <span className="text-[11px] font-mono text-tertiary">Engineering Notes</span>
              </div>

              <div className="space-y-3">
                {technique.technicalConsiderations.map((note, idx) => (
                  <div key={idx} className="rounded-xl border border-border-subtle bg-surface-elevated p-4 text-xs text-secondary leading-relaxed flex items-start gap-3">
                    <span className="font-mono text-accent font-bold">0{idx + 1}.</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Common Mistakes & Corrections */}
            <section className="surface rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">05. Common Mistakes & Technical Fixes</span>
                <span className="text-[11px] font-mono text-tertiary">Avoid Pitfalls</span>
              </div>

              <div className="space-y-4">
                {technique.commonMistakes.map((m, idx) => (
                  <div key={idx} className="rounded-xl border border-border-subtle bg-surface-elevated p-5 space-y-2">
                    <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <span>✕ Mistake:</span>
                      <span className="text-primary font-semibold">{m.mistake}</span>
                    </div>
                    <div className="text-xs text-secondary">
                      <span className="text-tertiary font-mono">Consequence: </span>
                      {m.consequence}
                    </div>
                    <div className="text-xs text-emerald-400 font-medium pt-1 border-t border-border-subtle">
                      <span className="font-mono">✓ Correction: </span>
                      <span className="text-secondary">{m.correction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Related Films, Filmmakers, Tools, Research, Prompts */}
          <div className="space-y-8">
            {/* Exemplary Demonstration Films */}
            {relatedFilms.length > 0 && (
              <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">Exemplary Films</div>
                <div className="space-y-2">
                  {relatedFilms.map((film) => (
                    <Link
                      key={film.id}
                      href={`/films/${film.slug}`}
                      className="block rounded-lg border border-border-subtle bg-surface-elevated p-3 hover:border-accent/40 transition group"
                    >
                      <div className="text-xs font-bold text-primary group-hover:text-accent transition">
                        {film.title} ({film.releaseYear})
                      </div>
                      <div className="text-[11px] text-secondary mt-0.5 line-clamp-1">
                        {film.technicalSpecs.aspectRatio} • {film.format.replace(/_/g, " ")}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Associated Filmmakers & Cinematographers */}
            {relatedPeople.length > 0 && (
              <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary font-bold">Filmmakers & Practitioners</div>
                <div className="flex flex-wrap gap-2">
                  {relatedPeople.map((p) => (
                    <Link
                      key={p.id}
                      href={`/people/${p.slug}`}
                      className="rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs text-primary hover:border-accent/40 hover:text-accent transition font-medium"
                    >
                      {p.name} ({p.primaryRole.replace(/_/g, " ")})
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Software & Production Tools */}
            {relatedTools.length > 0 && (
              <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary font-bold">Software & Execution Tools</div>
                <div className="flex flex-wrap gap-2">
                  {relatedTools.map((t) => (
                    <Link
                      key={t.id}
                      href={`/tools/${t.slug}`}
                      className="rounded-lg border border-border-subtle bg-surface-elevated px-3 py-1.5 text-xs text-primary hover:border-accent/40 hover:text-accent transition font-medium"
                    >
                      {t.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Research Ledgers */}
            {relatedResearch.length > 0 && (
              <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary font-bold">Connected Research Ledgers</div>
                <div className="space-y-2">
                  {relatedResearch.map((res) => (
                    <Link
                      key={res.id}
                      href={`/research/${res.slug}`}
                      className="block rounded-lg border border-border-subtle bg-surface-elevated p-3 hover:border-accent/40 transition group"
                    >
                      <div className="text-[10px] font-mono text-accent font-medium">{res.topic}</div>
                      <div className="text-xs font-semibold text-primary group-hover:text-accent transition mt-0.5">
                        {res.researchQuestion}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Director Prompts */}
            {relatedPrompts.length > 0 && (
              <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary font-bold">Related Director Prompts</div>
                <div className="space-y-2">
                  {relatedPrompts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/prompts/${p.slug}`}
                      className="block rounded-lg border border-border-subtle bg-surface-elevated p-3 hover:border-accent/40 transition group"
                    >
                      <div className="text-xs font-semibold text-primary group-hover:text-accent transition">
                        {p.title}
                      </div>
                      <div className="text-[11px] font-mono text-tertiary mt-1 truncate">
                        {p.promptText}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <AdSlot slotId="technique-detail-bottom-banner" format="horizontal" />
      </div>

      <Footer />
    </main>
  );
}
