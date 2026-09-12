import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import {
  getAllStandingFestivals,
  getStandingFestivalBySlug,
  getFestivalEditions,
  getLatestEdition,
} from "@/data/festivals-canonical";
import { FestivalPrestigeTier } from "@/data/film-intelligence-types";

interface FestivalProfileProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const festivals = getAllStandingFestivals();
  // Include canonical slugs and legacy slugs for static pre-rendering
  const legacySlugs = [
    { slug: "runway-ai-film-festival" },
    { slug: "tribeca-x-ai-filmmaking" },
    { slug: "cannes-future-cinema-ai" },
    { slug: "sundance-new-frontier-ai" },
  ];
  const canonicalSlugs = festivals.map((f) => ({ slug: f.slug }));
  return [...canonicalSlugs, ...legacySlugs];
}

export async function generateMetadata({ params }: FestivalProfileProps): Promise<Metadata> {
  const { slug } = await params;
  const festival = getStandingFestivalBySlug(slug);

  if (!festival) {
    return {
      title: "Festival Not Found — Creator Intel",
    };
  }

  return {
    title: `${festival.name} — Festival Intelligence & Standing Profile | Creator Intel`,
    description: festival.description,
  };
}

export default async function FestivalProfilePage({ params }: FestivalProfileProps) {
  const { slug } = await params;
  const festival = getStandingFestivalBySlug(slug);

  if (!festival) {
    notFound();
  }

  const editions = getFestivalEditions(festival.id).sort((a, b) => b.year - a.year);
  const latestEdition = getLatestEdition(festival.id);

  const getTierLabel = (tier: FestivalPrestigeTier) => {
    switch (tier) {
      case "TIER_1_A_LIST":
        return "Tier 1 • A-List World Festival";
      case "TIER_2_MAJOR_INDUSTRY":
        return "Tier 2 • Major Industry Circuit";
      case "TIER_3_GENRE_REGIONAL":
        return "Tier 3 • Genre & Regional Landmark";
      case "TIER_4_SPECIALIZED_DISCOVERY":
        return "Tier 4 • Specialized AI & Emerging Tech";
      case "TIER_5_ACADEMIC_STUDENT":
        return "Tier 5 • Academic & Discovery Circuit";
      default:
        return tier;
    }
  };

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Profile Header (Standing Persistent Metadata Only) */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-20">
        <div className="shell space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/festivals"
              className="text-xs font-mono text-tertiary hover:text-accent transition flex items-center gap-1"
            >
              <span>←</span>
              <span>All Festival Circuits</span>
            </Link>
            <span className="text-tertiary font-mono text-xs">•</span>
            <span className="text-xs font-mono uppercase text-accent font-semibold">
              {festival.hostCity}, {festival.hostCountry}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-surface-elevated border border-border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider font-semibold text-accent">
                  {getTierLabel(festival.prestigeTier)}
                </span>
                {festival.academyAwardQualifying && (
                  <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-mono uppercase text-amber-300 font-semibold">
                    ACADEMY AWARD® QUALIFYING
                  </span>
                )}
                {festival.fiapfAccredited && (
                  <span className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-mono uppercase text-blue-300 font-semibold">
                    FIAPF ACCREDITED
                  </span>
                )}
                {festival.baftaQualifying && (
                  <span className="rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-mono uppercase text-purple-300 font-semibold">
                    BAFTA QUALIFYING
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary">
                {festival.name}
              </h1>

              <p className="text-sm sm:text-base text-secondary leading-relaxed">
                {festival.description}
              </p>
            </div>

            {/* Quick Standing CTA */}
            {latestEdition && (
              <div className="surface rounded-2xl border border-accent/30 bg-surface-elevated p-5 space-y-3 lg:w-72">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                    Active Edition
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {latestEdition.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-base font-bold text-primary">
                  {latestEdition.year} Festival Edition
                </p>
                <Link
                  href={`/festivals/${festival.slug}/${latestEdition.year}`}
                  className="w-full block text-center rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-black hover:opacity-90 transition"
                >
                  View {latestEdition.year} Intelligence →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        {/* Standing Architecture Matrix */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Standing Institutional Details */}
          <div className="space-y-6 lg:col-span-1">
            <div className="surface rounded-3xl border border-border bg-surface p-6 space-y-5">
              <h2 className="text-sm font-mono uppercase tracking-wider text-primary font-semibold border-b border-border-subtle pb-3">
                Standing Identity
              </h2>

              <dl className="space-y-4 text-xs">
                <div>
                  <dt className="text-tertiary font-mono uppercase text-[10px]">Founded</dt>
                  <dd className="font-semibold text-primary mt-0.5">{festival.foundedYear}</dd>
                </div>
                <div>
                  <dt className="text-tertiary font-mono uppercase text-[10px]">Host City &amp; Region</dt>
                  <dd className="font-semibold text-primary mt-0.5">
                    {festival.hostCity}, {festival.hostCountry} ({festival.region.replace(/_/g, " ")})
                  </dd>
                </div>
                <div>
                  <dt className="text-tertiary font-mono uppercase text-[10px]">Submission Portals</dt>
                  <dd className="font-semibold text-primary mt-0.5">
                    {festival.submissionPortals.map((p) => p.replace(/_/g, " ")).join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="text-tertiary font-mono uppercase text-[10px]">Official Website</dt>
                  <dd className="mt-0.5">
                    <a
                      href={festival.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent font-mono hover:underline inline-flex items-center gap-1"
                    >
                      <span>{festival.officialWebsite.replace(/^https?:\/\//, "")}</span>
                      <span>↗</span>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-tertiary font-mono uppercase text-[10px]">Data Trust &amp; Ledger</dt>
                  <dd className="font-mono text-emerald-400 mt-0.5 flex items-center gap-1">
                    <span>✓</span>
                    <span>Verified: {festival.verifiedAt}</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Editorial Circuit Notes */}
            {festival.editorialNotes && (
              <div className="surface rounded-3xl border border-border bg-surface-elevated/40 p-6 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                  Editorial Circuit Briefing
                </span>
                <p className="text-xs text-secondary leading-relaxed">
                  {festival.editorialNotes}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Tracked Editions & Program Focus */}
          <div className="space-y-8 lg:col-span-2">
            {/* Program Focus Categories */}
            <div className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-primary">
                Program Focus &amp; Competition Sections
              </h2>
              <div className="flex flex-wrap gap-2">
                {festival.focusCategories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-surface-elevated border border-border px-3 py-1 text-xs text-primary font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Tracked Editions Index */}
            <div className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-primary">
                    Festival Editions Intelligence
                  </h2>
                  <p className="text-xs text-secondary mt-0.5">
                    Select an edition to view time-sensitive deadlines, fees, premiere exclusivity clauses, and technical delivery specs.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {editions.map((edition) => (
                  <div
                    key={edition.id}
                    className="rounded-2xl border border-border bg-surface-elevated/60 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent/40 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          {edition.year} Edition
                        </span>
                        <span className="text-[10px] font-mono uppercase text-accent font-semibold px-2 py-0.5 rounded bg-accent/10">
                          {edition.season} Season
                        </span>
                        <span className="text-[10px] font-mono text-tertiary">
                          {edition.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="text-xs text-secondary font-mono">
                        Event Dates: {edition.eventStartDate} — {edition.eventEndDate}
                      </p>
                    </div>

                    <Link
                      href={`/festivals/${festival.slug}/${edition.year}`}
                      className="self-start sm:self-auto rounded-full bg-primary px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition"
                    >
                      Inspect {edition.year} Edition →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <AdSlot slotId="festival-profile-bottom" label="Festival Network Partner" />
      </div>

      <Footer />
    </main>
  );
}
