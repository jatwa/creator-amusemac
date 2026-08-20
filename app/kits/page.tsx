import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { getAllProductionKits } from "@/data/content";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = {
  title: "Production Kits & Starter Downloads — Creator by Amusemac",
  description: "Downloadable shot list templates, 35mm LUTs, prompt formula worksheets, and pitch deck templates for filmmakers.",
};

export default function KitsPage() {
  const kits = getAllProductionKits();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Production Kits"
            title="Downloadable AI Production Starter Kits"
            description="Production-tested Notion director templates, DaVinci Resolve LUTs, commercial pitch decks, and optical cheatsheets. 100% free for creative storytellers."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        <div className="grid gap-6 sm:grid-cols-2">
          {kits.map((kit) => (
            <div
              key={kit.id}
              className="surface rounded-3xl border border-border bg-surface p-7 sm:p-8 flex flex-col justify-between space-y-6 shadow-subtle hover:border-accent/40 transition"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                    {kit.category} Bundle
                  </span>
                  <span className="rounded-full bg-accent/15 px-3 py-1 text-[11px] font-mono text-accent">
                    {kit.badge}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-primary tracking-tight">
                  {kit.title}
                </h2>

                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  {kit.description}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-mono uppercase text-tertiary block">
                    Included Production Assets:
                  </span>
                  <ul className="space-y-1.5 text-xs text-secondary">
                    {kit.includedAssets.map((asset, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-accent font-mono text-xs">✓</span>
                        <span>{asset}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                <span className="text-[11px] font-mono text-tertiary">
                  Format: {kit.fileFormat}
                </span>
                <Link
                  href="/resources"
                  className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:opacity-90 transition"
                >
                  Access Kit Downloads ↓
                </Link>
              </div>
            </div>
          ))}
        </div>

        <AdSlot slotId="kits-bottom" label="Production Kit Sponsor" />
      </div>

      <Footer />
    </main>
  );
}
