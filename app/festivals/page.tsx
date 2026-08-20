import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { getAllFestivals } from "@/data/content";
import { AdSlot } from "@/components/ad-slot";

export const metadata: Metadata = {
  title: "AI Film Festival Directory & Submission Hub 2026 — Creator by Amusemac",
  description: "Verified submission deadlines, eligibility rules, and ethical AI disclosure guidelines for international AI film festivals.",
};

export default function FestivalsPage() {
  const festivals = getAllFestivals();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Festival Intelligence"
            title="AI Film Festival Directory &amp; Submission Hub"
            description="Verified international deadlines, competition rules, prize grants, and AI disclosure requirements for narrative, commercial, and experimental films."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-12">
        <div className="space-y-8">
          {festivals.map((fest) => (
            <article
              key={fest.id}
              className="surface rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-subtle hover:border-accent/40 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-5">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
                    {fest.hostCity}, {fest.country} • Season {fest.seasonYear}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary mt-1">
                    {fest.name}
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono uppercase text-tertiary block">
                    Submission Deadline
                  </span>
                  <span className="text-sm font-semibold text-rose-400 font-mono">
                    {fest.deadline}
                  </span>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-tertiary block">
                    Grants &amp; Awards
                  </span>
                  <p className="text-secondary font-medium">{fest.prizes}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-tertiary block">
                    Eligibility
                  </span>
                  <p className="text-secondary">{fest.eligibility}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-tertiary block">
                    AI Disclosure Policy
                  </span>
                  <p className="text-secondary">{fest.aiDisclosureRule}</p>
                </div>

                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase text-tertiary block">
                    Submission Master
                  </span>
                  <p className="text-secondary font-mono">{fest.submissionFormat}</p>
                </div>
              </div>

              {/* Readiness Checklist */}
              <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-4 sm:p-5 space-y-3">
                <span className="text-[11px] font-mono uppercase text-primary font-semibold block">
                  Submission Readiness Checklist:
                </span>
                <div className="grid gap-2 sm:grid-cols-2 text-xs">
                  {fest.readinessChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-mono">✓</span>
                      <div>
                        <span className="font-semibold text-primary">{item.item}</span>
                        <p className="text-[11px] text-tertiary">{item.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] font-mono text-tertiary">
                  Verified: {fest.lastVerified}
                </span>
                <a
                  href={fest.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:opacity-90 transition inline-flex items-center gap-1"
                >
                  <span>Official Submission Portal</span>
                  <span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <AdSlot slotId="festivals-bottom" label="Production Community Partner" />
      </div>

      <Footer />
    </main>
  );
}
