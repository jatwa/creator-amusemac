import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import {
  getAllPublicPeople,
  getPersonBySlug,
  getFilmsByPersonId,
  canonicalFilms,
} from "@/data/films-canonical";
import { storiesData } from "@/data/production-stories";
import { canonicalResearchRecords } from "@/data/research-canonical";

interface PersonSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const people = getAllPublicPeople();
  return people.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PersonSlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const person = getPersonBySlug(slug);

  if (!person) {
    return {
      title: "Filmmaker Not Found | Creator Intel",
    };
  }

  return {
    title: `${person.name} — ${person.primaryRole.replace(/_/g, " ")} Dossier | Creator Intel`,
    description: `${person.name} (${person.country}) — ${person.biography.slice(0, 150)}...`,
  };
}

export default async function PersonDetailPage({ params }: PersonSlugPageProps) {
  const { slug } = await params;
  const person = getPersonBySlug(slug);

  if (!person) {
    notFound();
  }

  // Get full relational films associated with this person
  const associatedFilms = getFilmsByPersonId(person.id);

  // Connected Production Stories / Case Studies
  const connectedStories = storiesData.filter(
    (s) => s.director.toLowerCase().includes(person.name.toLowerCase()) || person.name.toLowerCase().includes(s.director.split(" ")[0].toLowerCase())
  );

  // Connected Research Records (topics related to their primary craft)
  const connectedResearch = canonicalResearchRecords.filter((r) => {
    if (person.primaryRole === "CINEMATOGRAPHER" && r.slug.includes("anamorphic")) return true;
    if ((person.primaryRole === "DIRECTOR" || person.primaryRole === "PRODUCER") && r.slug.includes("premiere")) return true;
    if ((person.primaryRole === "EDITOR" || person.primaryRole === "COLORIST") && r.slug.includes("dcp")) return true;
    return false;
  });

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Hero Dossier Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-12 sm:py-16">
        <div className="shell space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-tertiary">
            <Link href="/people" className="hover:text-primary transition">
              PEOPLE
            </Link>
            <span>/</span>
            <span className="text-accent uppercase font-semibold">{person.primaryRole.replace(/_/g, " ")}</span>
            <span>/</span>
            <span className="text-primary truncate">{person.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-accent/10 border border-accent/20 px-3 py-0.5 text-xs font-mono font-semibold text-accent">
                  {person.primaryRole.replace(/_/g, " ")}
                </span>
                <span className="text-sm font-mono text-tertiary">
                  {person.country}
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-mono text-emerald-400">
                  ✓ VERIFIED CANONICAL
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary font-serif">
                {person.name}
              </h1>

              {person.alternateNames.length > 0 && (
                <div className="text-sm font-mono text-tertiary">
                  Aliases & Canonical Mappings:{" "}
                  <span className="text-secondary">{person.alternateNames.join(", ")}</span>
                </div>
              )}

              {person.secondaryRoles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {person.secondaryRoles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-surface-elevated border border-border-subtle px-3 py-1 text-xs font-mono text-tertiary"
                    >
                      {role.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Summary Card */}
            <div className="rounded-3xl border border-border bg-surface p-6 space-y-3 shrink-0 md:w-80 shadow-subtle">
              <div className="text-xs font-mono uppercase tracking-wider text-tertiary">Registry Details</div>
              <div className="text-sm space-y-1.5 text-secondary">
                <div>
                  <span className="text-tertiary">Canonical ID: </span>
                  <span className="font-mono text-primary">{person.id}</span>
                </div>
                <div>
                  <span className="text-tertiary">Primary Base: </span>
                  <span className="text-primary">{person.country}</span>
                </div>
                <div>
                  <span className="text-tertiary">Catalog Credits: </span>
                  <span className="font-mono text-primary">{person.filmography.length} Works</span>
                </div>
              </div>

              {/* Social / Industry Links */}
              <div className="pt-3 border-t border-border-subtle space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-tertiary">Profiles & Portfolios</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {person.socialLinks.website && (
                    <a
                      href={person.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono text-xs"
                    >
                      Website ↗
                    </a>
                  )}
                  {person.socialLinks.vimeo && (
                    <a
                      href={person.socialLinks.vimeo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono text-[11px]"
                    >
                      Vimeo ↗
                    </a>
                  )}
                  {person.socialLinks.imdb && (
                    <a
                      href={person.socialLinks.imdb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono text-[11px]"
                    >
                      IMDb ↗
                    </a>
                  )}
                  {person.socialLinks.linkedin && (
                    <a
                      href={person.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline font-mono text-[11px]"
                    >
                      LinkedIn ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="shell py-12 space-y-12">
        <AdSlot slotId="person-detail-top-banner" format="horizontal" />

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Left / Main Column: Biography, Filmography, Festival Accolades */}
          <div className="lg:col-span-2 space-y-10">
            {/* Biography Section */}
            <section className="surface rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">01. Biography & Background</span>
              </div>
              <p className="text-sm sm:text-base text-secondary leading-relaxed whitespace-pre-line">
                {person.biography}
              </p>
            </section>

            {/* Filmography Ledger */}
            <section className="surface rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">02. Verified Filmography</span>
                <span className="text-[11px] font-mono text-tertiary">{person.filmography.length} Catalog Entries</span>
              </div>

              <div className="space-y-3">
                {person.filmography.map((item, idx) => {
                  const filmEntity = canonicalFilms.find((f) => f.id === item.filmId || f.slug === item.filmId?.replace("film-", ""));
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-border-subtle bg-surface-elevated p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-accent/40 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-primary group-hover:text-accent transition">
                            {filmEntity ? (
                              <Link href={`/films/${filmEntity.slug}`}>{item.title}</Link>
                            ) : (
                              item.title
                            )}
                          </span>
                          <span className="text-xs font-mono text-tertiary">({item.year})</span>
                        </div>
                        <div className="text-xs text-secondary">
                          Role: <span className="text-primary font-medium">{item.creditTitle || item.role.replace(/_/g, " ")}</span>
                        </div>
                        {filmEntity && (
                          <div className="text-[11px] font-mono text-tertiary mt-1">
                            {filmEntity.format.replace(/_/g, " ")} • {filmEntity.technicalSpecs.aspectRatio} • {filmEntity.technicalSpecs.colorSpace?.split("/")[0]}
                          </div>
                        )}
                      </div>

                      {filmEntity && (
                        <Link
                          href={`/films/${filmEntity.slug}`}
                          className="text-xs font-mono text-accent hover:underline shrink-0 font-semibold"
                        >
                          Film Dossier →
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Festival Accolades */}
            {person.festivalAccolades.length > 0 && (
              <section className="surface rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">03. Festival Circuit Accolades</span>
                  <span className="text-[11px] font-mono text-tertiary">Official Laurels</span>
                </div>

                <div className="space-y-3">
                  {person.festivalAccolades.map((acc, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-amber-300">
                          ★ {acc.awardTitle}
                        </div>
                        <div className="text-xs text-secondary">
                          {acc.festivalName} ({acc.year}) • For <span className="text-primary font-semibold">"{acc.filmTitle}"</span>
                        </div>
                      </div>

                      {acc.festivalId && (
                        <Link
                          href={`/festivals/${acc.festivalId.replace("fest-", "")}`}
                          className="text-xs font-mono text-accent hover:underline shrink-0 font-medium"
                        >
                          Festival Profile →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Case Studies, Research, Connected Data */}
          <div className="space-y-8">
            {/* Connected Production Stories / Case Studies */}
            {connectedStories.length > 0 && (
              <div className="surface rounded-2xl border border-accent/30 bg-accent/5 p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-accent font-bold">Production Case Studies</div>
                {connectedStories.map((story) => (
                  <div key={story.id} className="space-y-2">
                    <h4 className="text-base font-bold text-primary">{story.title}</h4>
                    <p className="text-xs text-secondary line-clamp-2">{story.summary}</p>
                    <Link
                      href={`/stories/${story.slug}`}
                      className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      Read Case Study →
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Connected Research Ledgers */}
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

            {/* Catalog Associated Films Preview */}
            {associatedFilms.length > 0 && (
              <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-wider text-tertiary font-bold">Associated Works</div>
                <div className="space-y-2">
                  {associatedFilms.map((f) => (
                    <Link
                      key={f.id}
                      href={`/films/${f.slug}`}
                      className="block rounded-lg border border-border-subtle bg-surface-elevated p-3 hover:border-accent/40 transition group"
                    >
                      <div className="text-xs font-bold text-primary group-hover:text-accent transition">
                        {f.title} ({f.releaseYear})
                      </div>
                      <div className="text-[11px] text-secondary mt-0.5 line-clamp-1">
                        {f.logline}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <AdSlot slotId="person-detail-bottom-banner" format="horizontal" />
      </div>

      <Footer />
    </main>
  );
}
