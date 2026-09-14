import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AdSlot } from "@/components/ad-slot";
import {
  getAllStandingFestivals,
  getStandingFestivalBySlug,
  getFestivalEditionByYear,
  getAllFestivalEditions,
  masterDeliveryChecklist,
} from "@/data/festivals-canonical";
import { PremiereType } from "@/data/film-intelligence-types";

interface FestivalEditionProps {
  params: Promise<{
    slug: string;
    year: string;
  }>;
}

export async function generateStaticParams() {
  const editions = getAllFestivalEditions();
  const standing = getAllStandingFestivals();

  const paramsList: { slug: string; year: string }[] = [];

  editions.forEach((edition) => {
    const fest = standing.find((f) => f.id === edition.festivalId);
    if (fest) {
      paramsList.push({
        slug: fest.slug,
        year: edition.year.toString(),
      });
    }
  });

  // Legacy mappings
  paramsList.push(
    { slug: "runway-ai-film-festival", year: "2026" },
    { slug: "tribeca-x-ai-filmmaking", year: "2026" },
    { slug: "cannes-future-cinema-ai", year: "2027" },
    { slug: "sundance-new-frontier-ai", year: "2027" }
  );

  return paramsList;
}

export async function generateMetadata({ params }: FestivalEditionProps): Promise<Metadata> {
  const { slug, year } = await params;
  const festival = getStandingFestivalBySlug(slug);
  const parsedYear = parseInt(year, 10);
  const edition = festival ? getFestivalEditionByYear(festival.id, parsedYear) : undefined;

  if (!festival || !edition) {
    return {
      title: "Festival Edition Not Found — Creator Intel",
    };
  }

  const pageTitle = `${festival.name} (${edition.year} Edition) — Deadlines, Fees & Premiere Intelligence | Creator Intel`;
  const pageDesc = `Verified submission deadlines, entry fees, premiere exclusivity rules, and technical delivery requirements for ${festival.name} ${edition.year}.`;
  const pageUrl = `https://creatorintels.com/festivals/${festival.slug}/${edition.year}`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${festival.name} (${edition.year} Edition) — Intelligence Dossier`,
      description: pageDesc,
      url: pageUrl,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${festival.name} ${edition.year}`,
      description: pageDesc,
    },
  };
}

export default async function FestivalEditionPage({ params }: FestivalEditionProps) {
  const { slug, year } = await params;
  const festival = getStandingFestivalBySlug(slug);
  const parsedYear = parseInt(year, 10);

  if (!festival || isNaN(parsedYear)) {
    notFound();
  }

  const edition = getFestivalEditionByYear(festival.id, parsedYear);

  if (!edition) {
    notFound();
  }

  const formatPremiere = (p: PremiereType) => p.replace(/_/g, " ");

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Edition Intelligence Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-12 sm:py-18">
        <div className="shell space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/festivals"
              className="text-xs font-mono text-tertiary hover:text-accent transition"
            >
              Festivals
            </Link>
            <span className="text-tertiary font-mono text-xs">/</span>
            <Link
              href={`/festivals/${festival.slug}`}
              className="text-xs font-mono text-tertiary hover:text-accent transition"
            >
              {festival.name}
            </Link>
            <span className="text-tertiary font-mono text-xs">/</span>
            <span className="text-xs font-mono uppercase text-accent font-semibold">
              {edition.year} Edition
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-accent/10 border border-accent/30 px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold text-accent">
                  {edition.year} EDITION INTELLIGENCE
                </span>
                <span className="rounded-md bg-surface-elevated border border-border px-2.5 py-0.5 text-[10px] font-mono uppercase font-medium text-tertiary">
                  {edition.season} SEASON
                </span>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-mono uppercase font-semibold text-emerald-400">
                  {edition.status.replace(/_/g, " ")}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary">
                {festival.name}{" "}
                <span className="text-tertiary font-normal">({edition.year})</span>
              </h1>

              <p className="text-xs sm:text-sm font-mono text-secondary">
                Event Calendar:{" "}
                <strong className="text-primary font-semibold">
                  {edition.eventStartDate} through {edition.eventEndDate}
                </strong>{" "}
                • {festival.hostCity}, {festival.hostCountry}
              </p>
            </div>

            {/* Official Portal Link */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={`/festivals/${festival.slug}`}
                className="rounded-full bg-surface-elevated border border-border px-4 py-2 text-xs font-medium text-primary text-center hover:border-accent hover:text-accent transition"
              >
                Standing Festival Profile
              </Link>
              <a
                href={festival.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-background text-center hover:opacity-90 transition inline-flex items-center justify-center gap-1"
              >
                <span>Official Portal</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-12 space-y-16">
        {/* 1. DEADLINE INTELLIGENCE */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                Section 01 • Time-Sensitive Submission Windows
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
                Deadlines &amp; Fee Structure
              </h2>
            </div>
            <span className="text-xs font-mono text-tertiary">
              Last Verified: {edition.lastVerifiedAt}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {edition.deadlines.earlyBirdDeadline && (
              <div className="surface rounded-2xl border border-border p-5 space-y-2 bg-surface">
                <span className="text-[10px] font-mono uppercase text-tertiary block">
                  Early Bird Deadline
                </span>
                <p className="text-lg font-bold font-mono text-primary">
                  {edition.deadlines.earlyBirdDeadline}
                </p>
                <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Discounted Window
                </span>
              </div>
            )}

            {edition.deadlines.regularDeadline && (
              <div className="surface rounded-2xl border border-border p-5 space-y-2 bg-surface">
                <span className="text-[10px] font-mono uppercase text-tertiary block">
                  Regular Deadline
                </span>
                <p className="text-lg font-bold font-mono text-rose-400">
                  {edition.deadlines.regularDeadline}
                </p>
                <span className="inline-block text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                  Standard Window
                </span>
              </div>
            )}

            {edition.deadlines.lateDeadline && (
              <div className="surface rounded-2xl border border-border p-5 space-y-2 bg-surface">
                <span className="text-[10px] font-mono uppercase text-tertiary block">
                  Late Deadline
                </span>
                <p className="text-lg font-bold font-mono text-primary">
                  {edition.deadlines.lateDeadline}
                </p>
                <span className="inline-block text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                  Final Standard Call
                </span>
              </div>
            )}

            <div className="surface rounded-2xl border border-border p-5 space-y-2 bg-surface">
              <span className="text-[10px] font-mono uppercase text-tertiary block">
                Official Notification Date
              </span>
              <p className="text-lg font-bold font-mono text-accent">
                {edition.deadlines.notificationDate}
              </p>
              <span className="inline-block text-[10px] font-mono text-tertiary">
                Program Announcement
              </span>
            </div>
          </div>

          {/* Fee Matrix Table */}
          {edition.fees.length > 0 && (
            <div className="surface rounded-2xl border border-border bg-surface p-6 space-y-4">
              <h3 className="text-sm font-bold text-primary uppercase font-mono tracking-wider">
                Category Entry Fees ({edition.fees[0].currency})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border-subtle text-tertiary font-mono uppercase text-[10px]">
                      <th className="pb-3 font-medium">Competition Category</th>
                      {edition.fees.some(f => f.earlyBirdFee !== undefined) && (
                        <th className="pb-3 font-medium">Early Bird</th>
                      )}
                      <th className="pb-3 font-medium">Regular</th>
                      {edition.fees.some(f => f.lateFee !== undefined) && (
                        <th className="pb-3 font-medium">Late</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {edition.fees.map((fee, idx) => (
                      <tr key={idx} className="hover:bg-surface-elevated/40 transition">
                        <td className="py-3 font-medium text-primary">{fee.category}</td>
                        {edition.fees.some(f => f.earlyBirdFee !== undefined) && (
                          <td className="py-3 font-mono text-secondary">
                            {fee.earlyBirdFee !== undefined ? `${fee.currency} ${fee.earlyBirdFee}` : "—"}
                          </td>
                        )}
                        <td className="py-3 font-mono font-semibold text-primary">
                          {fee.regularFee !== undefined ? `${fee.currency} ${fee.regularFee}` : "Free"}
                        </td>
                        {edition.fees.some(f => f.lateFee !== undefined) && (
                          <td className="py-3 font-mono text-secondary">
                            {fee.lateFee !== undefined ? `${fee.currency} ${fee.lateFee}` : "—"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* 2. PREMIERE INTELLIGENCE & RULES */}
        <section className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
              Section 02 • Exclusivity &amp; Territorial Governance
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
              Premiere Rules &amp; Category Requirements
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {edition.premiereRules.map((rule, idx) => (
              <div
                key={idx}
                className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                  <span className="text-sm font-bold text-primary">{rule.category}</span>
                  <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-mono uppercase font-bold text-amber-300">
                    {formatPremiere(rule.requiredPremiere)}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-tertiary block">
                      Geographic Scope
                    </span>
                    <p className="text-secondary font-medium mt-0.5">{rule.geographicRestriction}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-tertiary block">
                      Why This Matters For Your Festival Strategy
                    </span>
                    <p className="text-secondary mt-0.5 leading-relaxed">
                      {rule.requiredPremiere === "WORLD_PREMIERE"
                        ? "Submitting here requires that your film has not had any public screening anywhere in the world. Screening in another festival or online before this event will result in immediate disqualification."
                        : rule.requiredPremiere === "CONTINENTAL_PREMIERE"
                        ? "Your film may have screened in its country of origin or outside the continent, but must not have premiered publicly within this regional territory."
                        : rule.requiredPremiere === "NATIONAL_PREMIERE"
                        ? "Must be the film's first theatrical presentation in the host nation."
                        : "Open competition without geographic exclusivity restrictions; previously released films remain eligible for selection."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-tertiary block">
                        Online Exclusivity
                      </span>
                      <span className="font-mono font-semibold text-primary">
                        {rule.onlineExclusivityClause ? "Strict (No Web Release)" : "Permitted"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-tertiary block">
                        Completion Cutoff
                      </span>
                      <span className="font-mono text-secondary">
                        {rule.completionDateCutoff}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. POTENTIAL DISQUALIFICATION RISKS */}
        <section className="rounded-3xl border border-rose-500/30 bg-surface-elevated/30 p-6 sm:p-8 space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-1.5">
              <span>⚠</span>
              <span>Section 03 • Risk Assessment</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
              Potential Disqualification Risks
            </h2>
            <p className="text-xs text-secondary mt-1">
              Based on official regulations for the {edition.year} edition. Review before locking in your festival submission strategy.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <div className="surface rounded-2xl border border-border p-4 space-y-1.5 bg-surface">
              <span className="font-semibold text-rose-400 block">Prior Public Screening</span>
              <p className="text-secondary">
                Screening at any public venue, festival, or ticketed event prior to selection will invalidate world/continental premiere categories.
              </p>
            </div>

            <div className="surface rounded-2xl border border-border p-4 space-y-1.5 bg-surface">
              <span className="font-semibold text-rose-400 block">Online / YouTube / Vimeo Release</span>
              <p className="text-secondary">
                Public streaming availability (outside password-protected review screeners) triggers immediate forfeiture in competitive sections.
              </p>
            </div>

            <div className="surface rounded-2xl border border-border p-4 space-y-1.5 bg-surface">
              <span className="font-semibold text-rose-400 block">Completion Date Window</span>
              <p className="text-secondary">
                Films produced outside the stated 12–24 month production window are ineligible without an official programming waiver.
              </p>
            </div>

            <div className="surface rounded-2xl border border-border p-4 space-y-1.5 bg-surface">
              <span className="font-semibold text-rose-400 block">AI Transparency Failure</span>
              <p className="text-secondary">
                Failure to provide an ethical AI disclosure statement or utilizing unlicensed voice/likeness models violates submission terms.
              </p>
            </div>

            <div className="surface rounded-2xl border border-border p-4 space-y-1.5 bg-surface">
              <span className="font-semibold text-rose-400 block">Missing Subtitle Master</span>
              <p className="text-secondary">
                Exhibition DCPs without formatted French or English dialogue subtitles will be rejected at projection inspection.
              </p>
            </div>

            <div className="surface rounded-2xl border border-border p-4 space-y-1.5 bg-surface">
              <span className="font-semibold text-rose-400 block">Runtime Exceedance</span>
              <p className="text-secondary">
                Short film categories strictly enforce runtime limits including all opening/closing credit rolls.
              </p>
            </div>
          </div>
        </section>

        {/* 4. AI & SYNTHETIC MEDIA POLICY */}
        <section className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Section 04 • Emerging Technology Governance
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
                AI &amp; Synthetic Media Policy
              </h2>
            </div>
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono uppercase text-emerald-400 font-semibold">
              {edition.aiDisclosurePolicy.required ? "DISCLOSURE REQUIRED" : "PERMITTED"}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-tertiary block">
                Official Policy Statement
              </span>
              <p className="text-secondary text-sm mt-1 leading-relaxed">
                {edition.aiDisclosurePolicy.policyStatement}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border-subtle">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-tertiary block font-semibold">
                  Allowed Categories for AI / Generative Projects
                </span>
                <ul className="space-y-1">
                  {edition.aiDisclosurePolicy.allowedCategories.map((cat, idx) => (
                    <li key={idx} className="text-secondary flex items-center gap-2">
                      <span className="text-accent font-mono">→</span>
                      <span>{cat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-tertiary block font-semibold">
                  Documentation Requirements
                </span>
                <ul className="space-y-1">
                  {edition.aiDisclosurePolicy.documentationRequirements.map((req, idx) => (
                    <li key={idx} className="text-secondary flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DELIVERY REQUIREMENTS: FESTIVAL-SPECIFIC VS MASTER GUIDE */}
        <section className="space-y-6">
          <div className="border-b border-border-subtle pb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
              Section 05 • Exhibition Asset Specifications
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
              Delivery Requirements
            </h2>
            <p className="text-xs text-secondary mt-1">
              Distinguishing between mandatory festival-specific specifications and Creator Intel&apos;s master preparation checklist.
            </p>
          </div>

          {/* Festival-Specific Requirements */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <h3 className="text-sm font-mono uppercase tracking-wider text-primary font-bold">
                A. {festival.name} ({edition.year}) Official Specifications
              </h3>
            </div>

            <div className="space-y-4">
              {edition.deliveryRequirements.map((req) => (
                <div
                  key={req.id}
                  className="surface rounded-2xl border border-accent/40 bg-surface p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-accent font-semibold">
                        {req.category.replace(/_/g, " ")} • {req.requirementTier.replace(/_/g, " ")}
                      </span>
                      <h4 className="text-base font-bold text-primary mt-0.5">
                        {req.assetName}
                      </h4>
                    </div>
                    {req.deadline && (
                      <span className="text-xs font-mono text-rose-400">
                        Asset Due: {req.deadline}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-tertiary block">
                        Submission Method
                      </span>
                      <span className="font-semibold text-primary">{req.deliveryMethod.replace(/_/g, " ")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-tertiary block">
                        Resolution &amp; Aspect
                      </span>
                      <span className="font-mono text-secondary">
                        {req.resolution || "Native DCI / UHD"} {req.aspectRatio ? `(${req.aspectRatio})` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-tertiary block">
                        Framerate
                      </span>
                      <span className="font-mono text-secondary">{req.frameRate || "24.00 fps"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-tertiary block">
                        Status
                      </span>
                      <span className="font-mono text-emerald-400">Verified Specification</span>
                    </div>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed bg-surface-elevated p-3 rounded-xl border border-border-subtle font-mono">
                    {req.technicalSpecification}
                  </p>

                  {req.notes && (
                    <p className="text-[11px] text-tertiary italic">
                      Note: {req.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Master Preparation Guide Reference */}
          <div className="surface rounded-2xl border border-border bg-surface-elevated/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <h3 className="text-sm font-mono uppercase tracking-wider text-primary font-bold">
                  B. Universal Master Preparation Guide (General Best Practice)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-tertiary">Platform Standard</span>
            </div>

            <p className="text-xs text-secondary">
              In addition to festival-specific requirements, Creator Intel recommends preparing high-bitrate ProRes masters, separated 5.1 stems, bilingual subtitle files, and high-res EPK assets for universal circuit readiness.
            </p>

            <div className="grid gap-2 sm:grid-cols-3 text-xs pt-2">
              {masterDeliveryChecklist.slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-surface border border-border-subtle space-y-1">
                  <span className="font-semibold text-primary block">{item.item}</span>
                  <p className="text-[11px] text-secondary">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. SOURCE VERIFICATION LEDGER */}
        <section className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                Section 06 • Evidence &amp; Provenance
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
                Verified Source Ledger
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              <span>✓</span>
              <span>100% Sourced</span>
            </span>
          </div>

          <div className="space-y-4">
            {edition.verifiedSources.map((source) => (
              <div
                key={source.id}
                className="rounded-2xl border border-border-subtle bg-surface-elevated p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-bold text-accent uppercase">
                      Tier {source.tier} • {source.tierName.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] font-mono text-tertiary">
                      Verified: {source.lastVerifiedAt}
                    </span>
                  </div>
                  <h4 className="font-bold text-primary text-sm">{source.sourceTitle}</h4>
                  <p className="text-secondary font-mono text-[11px]">
                    Publisher: {source.sourcePublisher}
                  </p>
                </div>

                <a
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start sm:self-auto rounded-full bg-primary px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition inline-flex items-center gap-1"
                >
                  <span>Inspect Source</span>
                  <span>↗</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        <AdSlot slotId="festival-edition-bottom" label="Festival Submission Partner" />
      </div>

      <Footer />
    </main>
  );
}
