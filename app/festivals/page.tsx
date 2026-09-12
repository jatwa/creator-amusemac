import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { AdSlot } from "@/components/ad-slot";
import { getAllFestivalsWithCurrentEdition, masterDeliveryChecklist } from "@/data/festivals-canonical";
import { FestivalDiscoveryDesk } from "@/components/festival-discovery-desk";

export const metadata: Metadata = {
  title: "Festival Intelligence — Find Where Your Film Belongs | Creator Intel",
  description: "Verified festival intelligence for filmmakers. Evaluate A-list, industry, and AI film festivals by premiere rules, submission deadlines, fees, and technical delivery requirements.",
};

export default function FestivalsPage() {
  const festivalsWithEditions = getAllFestivalsWithCurrentEdition();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Editorial Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Festival Intelligence"
            title="Find where your film belongs."
            description="Evaluate festival circuits with verified decision intelligence — analyzing official premiere exclusivity rules, upcoming deadline windows, category fee structures, technical delivery specifications, and synthetic media policies."
          />

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="surface rounded-2xl border border-border p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
                Tracked Festivals
              </span>
              <span className="text-xl font-bold text-primary mt-0.5 block">
                {festivalsWithEditions.length} Verified
              </span>
            </div>
            <div className="surface rounded-2xl border border-border p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
                Academy / FIAPF Qualified
              </span>
              <span className="text-xl font-bold text-accent mt-0.5 block">
                {festivalsWithEditions.filter(f => f.festival.academyAwardQualifying || f.festival.fiapfAccredited).length} Circuits
              </span>
            </div>
            <div className="surface rounded-2xl border border-border p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
                AI / Synthetic Tracks
              </span>
              <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
                100% Documented
              </span>
            </div>
            <div className="surface rounded-2xl border border-border p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
                Verification Standard
              </span>
              <span className="text-xl font-bold text-primary mt-0.5 block">
                Tier-1 Official Regs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Discovery & Filter Desk */}
      <div className="shell py-12 space-y-16">
        <FestivalDiscoveryDesk initialFestivals={festivalsWithEditions} />

        {/* Master Preparation Guide Callout (Strictly separated from festival requirements) */}
        <section className="rounded-3xl border border-border bg-surface-elevated/40 p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
                Creator Intel Standard • General Best Practice
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mt-1">
                Universal Festival Delivery Preparation Guide
              </h2>
              <p className="text-xs sm:text-sm text-secondary mt-1 max-w-2xl">
                These specifications represent Creator Intel&apos;s universal recommendations for festival circuit readiness. Individual festival editions may enforce distinct technical specifications documented on their edition profiles.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-surface border border-border px-3 py-1 text-[11px] font-mono text-tertiary">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              General Practice (Non-Mandatory)
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {masterDeliveryChecklist.map((item, idx) => (
              <div
                key={idx}
                className="surface rounded-2xl border border-border p-5 space-y-2 bg-surface hover:border-accent/30 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-accent font-medium">
                    {item.category.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] font-mono text-tertiary">#0{idx + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-primary">{item.item}</h3>
                <p className="text-xs text-secondary">{item.description}</p>
                <p className="text-[11px] font-mono text-tertiary pt-2 border-t border-border-subtle leading-relaxed">
                  {item.technicalDetails}
                </p>
              </div>
            ))}
          </div>
        </section>

        <AdSlot slotId="festivals-bottom" label="Production & Distribution Partner" />
      </div>

      <Footer />
    </main>
  );
}
