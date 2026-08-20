import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About & Editorial Philosophy — Creator by Amusemac",
  description: "Creator by Amusemac is an independent creative intelligence platform for filmmakers, directors, visual effects artists, and storytellers navigating generative media.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell max-w-4xl">
          <SectionHeading
            as="h1"
            label="Editorial Philosophy"
            title="The Creative Intelligence Standard"
            description="Creator by Amusemac is dedicated to demystifying generative AI for working filmmakers, commercial directors, visual effects supervisors, and independent creators."
          />
        </div>
      </div>

      <div className="shell max-w-4xl py-12 space-y-12">
        <section className="surface rounded-3xl border border-border bg-surface p-7 sm:p-10 space-y-6 shadow-subtle">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            01 / Our Core Mission
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary">
            Built by Filmmakers, for Filmmakers
          </h2>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed font-normal">
            Generative media is transforming visual storytelling faster than any tool since the advent of non-linear digital editing. However, most information online is shallow marketing copy or hyper-technical academic papers.
          </p>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed font-normal">
            Creator by Amusemac bridges this gap with rigorous, hands-on production testing. We evaluate every model—from Runway Gen-3 and Kling AI to open-weights architectures like Wan 2.1 and Flux.1—through the lens of real film production constraints: temporal coherence, camera language, optical realism, ACES color workflows, and commercial copyright safety.
          </p>
        </section>

        <section className="surface rounded-3xl border border-border bg-surface p-7 sm:p-10 space-y-6 shadow-subtle">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            02 / Editorial Independence &amp; Verification
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary">
            Zero Sponsored Reviews. Complete Transparency.
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-secondary leading-relaxed">
            <p>
              Our verdicts, scorecards, and comparisons are strictly independent. We do not accept paid reviews or sponsored rankings from AI model providers.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-4 space-y-1">
                <span className="font-semibold text-primary block">✓ Primary Documentation</span>
                <p className="text-[11px] text-tertiary">All model capabilities and pricing tiers are directly verified against official provider documentation.</p>
              </div>
              <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-4 space-y-1">
                <span className="font-semibold text-primary block">✓ Continuous Drift Tracking</span>
                <p className="text-[11px] text-tertiary">Automated daily change detection continuously audits model updates, credit changes, and API deprecations.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="surface rounded-3xl border border-border bg-surface p-7 sm:p-10 space-y-6 shadow-subtle">
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            03 / Editorial Contact &amp; Corrections
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-primary">
            Contact the Editorial Desk
          </h2>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed">
            Have a correction, benchmark data to share, or a production case study you would like featured? Reach our editorial research team directly at <Link href="/contact" className="text-accent underline">our contact desk</Link>.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}
