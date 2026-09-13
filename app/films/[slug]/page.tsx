import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import {
  getAllPublicFilms,
  getFilmBySlug,
  canonicalPeople,
} from "@/data/films-canonical";
import { getStandingFestivalById } from "@/data/festivals-canonical";
import { canonicalResearchRecords } from "@/data/research-canonical";
import { storiesData } from "@/data/production-stories";
import { promptsData, toolsData } from "@/data/platform-data";

interface FilmSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const films = getAllPublicFilms();
  return films.map((f) => ({
    slug: f.slug,
  }));
}

export async function generateMetadata({ params }: FilmSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const film = getFilmBySlug(slug);

  if (!film) {
    return {
      title: "Film Not Found | Creator Intel",
    };
  }

  return {
    title: `${film.title} (${film.releaseYear}) — Film Intelligence Dossier | Creator Intel`,
    description: `${film.logline} Technical specs: ${film.technicalSpecs.aspectRatio}, ${film.technicalSpecs.cameraSystems?.join(", ") || "Digital"}, mastered in ${film.technicalSpecs.colorSpace}.`,
  };
}

export default async function FilmDetailPage({ params }: FilmSlugPageProps) {
  const { slug } = await params;
  const film = getFilmBySlug(slug);

  if (!film) {
    notFound();
  }

  // Resolve person slug helper
  const getPerson = (personId: string) => {
    return canonicalPeople.find((p) => p.id === personId);
  };

  // Connected Festival entity
  const premiereFestival = film.premiereFestivalId
    ? getStandingFestivalById(film.premiereFestivalId)
    : undefined;

  // Connected Research records (e.g. DCP mastering, anamorphic optical science, festival premiere rules)
  const connectedResearch = canonicalResearchRecords.filter((r) => {
    if (film.technicalSpecs.aspectRatio.includes("2.39:1") && r.slug.includes("anamorphic")) return true;
    if (film.premiereStatus === "WORLD_PREMIERE" && r.slug.includes("premiere")) return true;
    if (r.slug.includes("dcp") || r.slug.includes("color")) return true;
    return false;
  });

  // Connected Production Story / Case Study
  const connectedStory = storiesData.find((s) => s.slug === film.slug || film.slug.includes(s.slug) || s.slug.includes(film.slug));

  // Related Director Prompts
  const relatedPrompts = promptsData.filter((p) => {
    return film.genres.some((g) => p.category.toLowerCase().includes(g.toLowerCase()) || p.useCase.toLowerCase().includes(g.toLowerCase())) ||
      (film.technicalSpecs.aiGenerativeModels && film.technicalSpecs.aiGenerativeModels.some((m) => p.promptText.toLowerCase().includes(m.toLowerCase())));
  }).slice(0, 3);

  // Related Tools
  const relatedTools = toolsData.filter((t) => {
    return film.technicalSpecs.aiGenerativeModels?.some((m) => m.toLowerCase().includes(t.name.toLowerCase()));
  }).slice(0, 4);

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Hero Dossier Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-12 sm:py-16">
        <div className="shell space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-tertiary">
            <Link href="/films" className="hover:text-primary transition">
              FILMS
            </Link>
            <span>/</span>
            <span className="text-accent uppercase font-semibold">{film.format.replace(/_/g, " ")}</span>
            <span>/</span>
            <span className="text-primary truncate">{film.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent/10 border border-accent/20 px-3 py-0.5 text-xs font-mono font-semibold text-accent">
                  {film.format.replace(/_/g, " ")}
                </span>
                <span className="text-sm font-mono text-tertiary">
                  {film.releaseYear} • {film.runtimeMinutes} MIN • {film.countryOfOrigin.join(" / ")}
                </span>
                <span className="rounded-full bg-surface-elevated border border-border-subtle px-2.5 py-0.5 text-[11px] font-mono text-secondary">
                  LANG: {film.language.join(", ")}
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
                  ✓ VERIFIED CANONICAL
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary font-serif">
                {film.title}
              </h1>

              {film.originalTitle && film.originalTitle !== film.title && (
                <div className="text-sm font-mono text-tertiary">
                  Original Title: <span className="italic text-secondary">{film.originalTitle}</span>
                </div>
              )}

              <p className="text-base sm:text-xl text-secondary leading-relaxed font-sans pt-2">
                {film.logline}
              </p>
            </div>

            {/* Quick Action / Premiere Box */}
            <div className="rounded-3xl border border-border bg-surface p-6 space-y-3 shrink-0 md:w-80 shadow-subtle">
              <div className="text-xs font-mono uppercase tracking-wider text-tertiary">Premiere Accreditation</div>
              <div className="text-base font-bold text-accent font-mono">
                {film.premiereStatus.replace(/_/g, " ")}
              </div>
              {premiereFestival && (
                <div className="text-sm text-secondary">
                  Premiered at{" "}
                  <Link href={`/festivals/${premiereFestival.slug}`} className="text-primary font-semibold hover:underline">
                    {premiereFestival.name}
                  </Link>
                </div>
              )}
              <div className="pt-2 border-t border-border-subtle text-xs text-tertiary font-mono">
                Verified at: {film.verifiedAt}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="shell py-12 space-y-12">
        <AdSlot slotId="film-detail-top-banner" format="horizontal" />

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left / Main Column: Synopsis, Creative Credits, Festival History */}
          <div className="lg:col-span-2 space-y-10">
            {/* Synopsis Section */}
            <section className="surface rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">01. Narrative & Synopsis</span>
              </div>
              <p className="text-sm sm:text-base text-secondary leading-relaxed whitespace-pre-line">
                {film.synopsis}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {film.genres.map((genre) => (
                  <span key={genre} className="rounded-full bg-surface-elevated border border-border-subtle px-3 py-1 text-xs font-mono text-tertiary">
                    #{genre}
                  </span>
                ))}
              </div>
            </section>

            {/* Creative Leadership & Crew Dossier */}
            <section className="surface rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">02. Creative Leadership & Crew</span>
                <span className="text-[11px] font-mono text-tertiary">Relational Canonical Credits</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Directors */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-tertiary">Direction</div>
                  {film.directors.map((d) => {
                    const person = getPerson(d.personId);
                    return (
                      <div key={d.personId} className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
                        <Link
                          href={`/people/${person?.slug || d.personId}`}
                          className="text-sm font-bold text-primary hover:text-accent transition block"
                        >
                          {d.displayName || person?.name || d.personId} →
                        </Link>
                        <div className="text-xs text-secondary mt-0.5">{d.creditRole || "Director"}</div>
                        {person && <div className="text-[10px] font-mono text-tertiary mt-1">{person.country}</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Cinematographers */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-tertiary">Cinematography</div>
                  {film.cinematographers.map((c) => {
                    const person = getPerson(c.personId);
                    return (
                      <div key={c.personId} className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
                        <Link
                          href={`/people/${person?.slug || c.personId}`}
                          className="text-sm font-bold text-primary hover:text-accent transition block"
                        >
                          {c.displayName || person?.name || c.personId} →
                        </Link>
                        <div className="text-xs text-secondary mt-0.5">{c.creditRole || "Director of Photography"}</div>
                        {person && <div className="text-[10px] font-mono text-tertiary mt-1">{person.country}</div>}
                      </div>
                    );
                  })}
                </div>

                {/* Writers */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-tertiary">Writing & Screenplay</div>
                  {film.writers.map((w) => {
                    const person = getPerson(w.personId);
                    return (
                      <div key={w.personId} className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
                        <Link
                          href={`/people/${person?.slug || w.personId}`}
                          className="text-sm font-bold text-primary hover:text-accent transition block"
                        >
                          {w.displayName || person?.name || w.personId} →
                        </Link>
                        <div className="text-xs text-secondary mt-0.5">{w.creditRole || "Screenwriter"}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Producers */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-tertiary">Production</div>
                  {film.producers.map((p) => {
                    const person = getPerson(p.personId);
                    return (
                      <div key={p.personId} className="rounded-xl border border-border-subtle bg-surface-elevated p-3">
                        <Link
                          href={`/people/${person?.slug || p.personId}`}
                          className="text-sm font-bold text-primary hover:text-accent transition block"
                        >
                          {p.displayName || person?.name || p.personId} →
                        </Link>
                        <div className="text-xs text-secondary mt-0.5">{p.creditRole || "Producer"}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cast & Performances */}
              {film.cast.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-tertiary">Cast & Performance Plates</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {film.cast.map((actor, idx) => (
                      <div key={idx} className="rounded-lg bg-surface-elevated p-2.5 text-xs">
                        <span className="font-semibold text-primary">{actor.actorName}</span>
                        {actor.characterName && (
                          <span className="text-secondary block text-[11px]">as {actor.characterName}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI & Generative Engineering Credits */}
              {film.aiAndVfxCredits && film.aiAndVfxCredits.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-border-subtle">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold">AI & Virtual Production Department</div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {film.aiAndVfxCredits.map((vfx, idx) => (
                      <div key={idx} className="rounded-xl border border-accent/20 bg-accent/5 p-3 space-y-1">
                        <div className="text-xs font-bold text-primary">{vfx.name}</div>
                        <div className="text-[11px] text-accent font-mono">{vfx.role}</div>
                        {vfx.toolsUsed && (
                          <div className="text-[10px] text-secondary">
                            Tools: {vfx.toolsUsed.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Festival History & Screening Record */}
            <section className="surface rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">03. Festival History & Screening Record</span>
                <span className="text-[11px] font-mono text-tertiary">Circuit Tracking</span>
              </div>

              <div className="space-y-3">
                {film.festivalHistory.map((fest, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border-subtle bg-surface-elevated p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-primary">{fest.festivalName}</span>
                        <span className="text-xs font-mono text-tertiary">({fest.year})</span>
                      </div>
                      <div className="text-xs text-secondary">
                        Section: <span className="text-primary font-medium">{fest.section || "Official"}</span>
                        {fest.premiereHeld && (
                          <span className="ml-2 font-mono text-accent text-[10px]">
                            • {fest.premiereHeld.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                      {fest.awardWon && (
                        <div className="text-xs font-mono text-amber-300 font-semibold flex items-center gap-1 mt-1">
                          ★ {fest.awardWon}
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/festivals/${fest.festivalId.replace("fest-", "")}`}
                      className="text-xs font-mono text-accent hover:underline shrink-0 font-medium"
                    >
                      Festival Dossier →
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Technical Delivery Dossier, Research, Related Prompts */}
          <div className="space-y-8">
            {/* Technical Specifications Card */}
            <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">Technical Specifications</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-[10px] font-mono uppercase text-tertiary">Aspect Ratio</div>
                  <div className="text-sm font-bold text-primary font-mono mt-0.5">{film.technicalSpecs.aspectRatio}</div>
                </div>

                {film.technicalSpecs.cameraSystems && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-tertiary">Camera Systems</div>
                    <div className="text-secondary mt-0.5">{film.technicalSpecs.cameraSystems.join(", ")}</div>
                  </div>
                )}

                {film.technicalSpecs.lenses && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-tertiary">Lenses & Optical Package</div>
                    <div className="text-secondary mt-0.5">{film.technicalSpecs.lenses.join(", ")}</div>
                  </div>
                )}

                {film.technicalSpecs.captureFormat && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-tertiary">Capture & Master Format</div>
                    <div className="text-secondary font-mono mt-0.5">{film.technicalSpecs.captureFormat}</div>
                  </div>
                )}

                {film.technicalSpecs.colorSpace && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-tertiary">Color Space Management</div>
                    <div className="text-secondary font-mono mt-0.5">{film.technicalSpecs.colorSpace}</div>
                  </div>
                )}

                {film.technicalSpecs.soundFormat && (
                  <div>
                    <div className="text-[10px] font-mono uppercase text-tertiary">Audio Deliverable</div>
                    <div className="text-secondary font-mono mt-0.5">{film.technicalSpecs.soundFormat}</div>
                  </div>
                )}

                {film.technicalSpecs.aiGenerativeModels && film.technicalSpecs.aiGenerativeModels.length > 0 && (
                  <div className="pt-2 border-t border-border-subtle">
                    <div className="text-[10px] font-mono uppercase text-accent font-semibold">Generative AI Models</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {film.technicalSpecs.aiGenerativeModels.map((m) => (
                        <span key={m} className="rounded bg-accent/10 border border-accent/20 px-2 py-0.5 text-[10px] font-mono text-accent">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connected Production Story / Case Study */}
            {connectedStory && (
              <div className="surface rounded-2xl border border-accent/30 bg-accent/5 p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">In The Journal / Production Story</div>
                <h4 className="text-base font-bold text-primary">{connectedStory.title}</h4>
                <p className="text-xs text-secondary line-clamp-2">{connectedStory.summary}</p>
                <Link
                  href={`/stories/${connectedStory.slug}`}
                  className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 font-semibold pt-1"
                >
                  Read Multi-Model Breakdown →
                </Link>
              </div>
            )}

            {/* Connected Research Records */}
            {connectedResearch.length > 0 && (
              <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary font-bold">Connected Research Ledgers</div>
                <div className="space-y-2">
                  {connectedResearch.slice(0, 3).map((res) => (
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

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary font-bold">Software & Tools Used</div>
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

            {/* Related Director Prompts */}
            {relatedPrompts.length > 0 && (
              <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary font-bold">Director Prompt Recipes</div>
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

        <AdSlot slotId="film-detail-bottom-banner" format="horizontal" />
      </div>

      <Footer />
    </main>
  );
}
