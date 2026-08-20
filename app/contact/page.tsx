import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Contact & Editorial Corrections — Creator by Amusemac",
  description: "Contact the Creator by Amusemac editorial team to submit model benchmark data, report outdated pricing, or propose a production case study.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell max-w-3xl">
          <SectionHeading
            as="h1"
            label="Editorial Desk"
            title="Contact &amp; Corrections"
            description="Submit technical corrections, suggest a newly released AI video engine for benchmarking, or submit your film for a production case study breakdown."
          />
        </div>
      </div>

      <div className="shell max-w-3xl py-12 space-y-12">
        <div className="surface rounded-3xl border border-border bg-surface p-7 sm:p-10 space-y-6 shadow-subtle">
          <form className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-secondary block">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Director / DP / Studio"
                  className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-xs sm:text-sm text-primary placeholder:text-tertiary focus:border-accent/40 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-secondary block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@studio.com"
                  className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-xs sm:text-sm text-primary placeholder:text-tertiary focus:border-accent/40 outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-secondary block">
                Inquiry Category
              </label>
              <select className="w-full rounded-xl border border-border bg-surface-elevated px-4 py-2.5 text-xs sm:text-sm text-primary outline-none focus:border-accent/40 transition font-medium">
                <option value="correction">Editorial Correction / Drift Report</option>
                <option value="benchmark">Submit New Model Benchmark Data</option>
                <option value="story">Submit Film / Commercial Case Study</option>
                <option value="festival">List AI Film Festival</option>
                <option value="partnership">Sponsorship / Advertising Inquiry</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-secondary block">
                Message / Details
              </label>
              <textarea
                rows={5}
                placeholder="Include official documentation URLs, benchmark evidence, or case study details..."
                className="w-full rounded-xl border border-border bg-surface-elevated p-4 text-xs sm:text-sm text-primary placeholder:text-tertiary focus:border-accent/40 outline-none transition leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                className="rounded-full bg-foreground px-6 py-2.5 text-xs font-medium text-background hover:opacity-90 transition shadow-sm"
              >
                Submit to Editorial Desk →
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-6 space-y-2 text-xs text-secondary">
          <span className="font-semibold text-primary block">🔒 Security &amp; Fast Response</span>
          <p className="leading-relaxed">
            Our research team reviews editorial corrections daily. For critical security disclosures or urgent updates, please reference the official documentation source URL directly.
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}
