import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Terms of Service — Creator by Amusemac",
  description: "Terms and conditions governing the use of the Creator by Amusemac creative intelligence platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell max-w-4xl">
          <SectionHeading
            as="h1"
            label="Legal &amp; Terms"
            title="Terms of Service"
            description="Last Updated: August 2026. Please read these terms carefully before utilizing our platform and resources."
          />
        </div>
      </div>

      <div className="shell max-w-4xl py-12 space-y-10 text-xs sm:text-sm text-secondary leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Creator by Amusemac (&quot;the Platform&quot;), you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary">2. Intellectual Property &amp; Open Resources</h2>
          <p>
            All original editorial commentary, scorecards, prompt formulas, and architectural analysis on this website are the intellectual property of Creator by Amusemac. Free downloadable kits and open prompt templates are provided under open creative evaluation licenses for personal and commercial production use.
          </p>
          <p>
            Product names, logos, and trademarks referenced on the platform (such as Runway, Kling, Midjourney, Google Veo, Blackmagic Design, etc.) belong to their respective trademark holders. Reference to third-party tools does not imply endorsement or affiliation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary">3. Disclaimer of Warranties</h2>
          <p>
            The content on Creator by Amusemac is provided for informational and educational purposes &quot;as is&quot;. While we strive for absolute accuracy and continuously verify pricing, resolution limits, and API terms, AI models and SaaS tiers change rapidly. Always verify specific commercial terms directly with the tool providers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary">4. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to its conflict of law provisions.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}
