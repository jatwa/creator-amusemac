import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { AdSlot } from "@/components/ad-slot";
import { getAllPublicResearch } from "@/data/research-canonical";
import { ResearchDiscoveryDesk } from "@/components/research-discovery-desk";

export const metadata: Metadata = {
  title: "Cinema Research Desk — Source-Backed Intelligence | Creator Intel",
  description: "Go beyond the answer. Follow the evidence. Research films, filmmakers, festival governance, optical science, and synthetic media through verified source ledgers.",
  alternates: {
    canonical: "https://creatorintels.com/research",
  },
  openGraph: {
    title: "Cinema Research Desk — Creator Intel",
    description: "Go beyond the answer. Follow the evidence. Research films, filmmakers, festival governance, optical science, and synthetic media through verified source ledgers.",
    url: "https://creatorintels.com/research",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cinema Research Desk",
    description: "Verified source ledgers and research dossiers for cinema and AI production.",
  },
};

export default function ResearchPage() {
  const records = getAllPublicResearch();

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Editorial Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Cinema Research Desk"
            title="Go beyond the answer. Follow the evidence."
            description="Research films, filmmakers, festival circuits, optical science, and generative motion through source-backed intelligence. Every important claim is categorized by empirical directness and anchored to verified primary sources."
          />

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="surface rounded-2xl border border-border p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
                Public Research Records
              </span>
              <span className="text-xl font-bold text-primary mt-0.5 block">
                {records.length} Grounded Studies
              </span>
            </div>
            <div className="surface rounded-2xl border border-border p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
                Statement Trust Layer
              </span>
              <span className="text-xl font-bold text-accent mt-0.5 block">
                Fact vs. Inference
              </span>
            </div>
            <div className="surface rounded-2xl border border-border p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
                Source Authority
              </span>
              <span className="text-xl font-bold text-emerald-400 mt-0.5 block">
                8-Tier Hierarchy
              </span>
            </div>
            <div className="surface rounded-2xl border border-border p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-tertiary block">
                Conflict Handling
              </span>
              <span className="text-xl font-bold text-primary mt-0.5 block">
                Explicit Ledgers
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-12 space-y-16">
        <ResearchDiscoveryDesk initialRecords={records} />

        {/* Methodology Standards Callout */}
        <section className="rounded-3xl border border-border bg-surface-elevated/40 p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-semibold">
                Creator Intel Research Standard
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-primary mt-1">
                The 4-Layer Statement Trust System
              </h2>
              <p className="text-xs sm:text-sm text-secondary mt-1 max-w-2xl">
                We believe that reliable cinema intelligence requires distinguishing direct factual evidence from expert interpretation and speculative inference.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-surface border border-border px-3 py-1 text-[11px] font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Human Verified
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="surface rounded-2xl border border-border p-5 space-y-2 bg-surface">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
                FACT
              </span>
              <h3 className="text-sm font-semibold text-primary">Direct Primary Evidence</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Empirically verified against primary official regulations, technical charters, published patents, or official laboratory measurements.
              </p>
            </div>

            <div className="surface rounded-2xl border border-border p-5 space-y-2 bg-surface">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded inline-block">
                INTERPRETATION
              </span>
              <h3 className="text-sm font-semibold text-primary">Corroborated Analysis</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Expert qualitative synthesis backed by multiple secondary industry accounts, director trade interviews, or peer-reviewed findings.
              </p>
            </div>

            <div className="surface rounded-2xl border border-border p-5 space-y-2 bg-surface">
              <span className="text-[10px] font-mono uppercase text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded inline-block">
                INFERENCE
              </span>
              <h3 className="text-sm font-semibold text-primary">Directional Projection</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Hypotheses and market projections derived from incomplete or evolving datasets. Clearly marked to prevent speculative contamination.
              </p>
            </div>

            <div className="surface rounded-2xl border border-border p-5 space-y-2 bg-surface">
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded inline-block">
                UNVERIFIED
              </span>
              <h3 className="text-sm font-semibold text-primary">Pending Human Audit</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Community reports, unconfirmed rumors, or newly drafted AI claims awaiting formal source ledger verification.
              </p>
            </div>
          </div>
        </section>

        <AdSlot slotId="research-desk-bottom" label="Cinema Research & Archival Partner" />
      </div>

      <Footer />
    </main>
  );
}
