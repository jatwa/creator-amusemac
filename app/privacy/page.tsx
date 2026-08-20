import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Privacy Policy & Cookie Disclosure — Creator by Amusemac",
  description: "Learn how Creator by Amusemac collects, uses, and safeguards user data, cookies, and analytics.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      <div className="border-b border-border-subtle bg-surface/30 py-14 sm:py-18">
        <div className="shell max-w-4xl">
          <SectionHeading
            as="h1"
            label="Legal &amp; Privacy"
            title="Privacy Policy"
            description="Last Updated: August 2026. Creator by Amusemac is committed to protecting your privacy and transparent data practices."
          />
        </div>
      </div>

      <div className="shell max-w-4xl py-12 space-y-10 text-xs sm:text-sm text-secondary leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary">1. Information We Collect</h2>
          <p>
            Creator by Amusemac operates primarily as an open editorial intelligence platform. We collect minimal personal data:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Usage &amp; Analytics Data:</strong> Anonymous telemetry, page views, referral sources, and interaction events via privacy-preserving analytics.</li>
            <li><strong>Theme &amp; User Preferences:</strong> Local browser storage preferences (such as light/dark/system theme selection) stored locally on your device.</li>
            <li><strong>Voluntary Inquiries:</strong> Name and email address when you contact our editorial desk or submit feedback.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary">2. Cookies and Advertising (Google AdSense)</h2>
          <p>
            We may partner with third-party advertising networks, including Google AdSense, to display relevant advertisements to our visitors. Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
          </p>
          <p>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to Creator by Amusemac and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Google&apos;s Ads Settings (www.google.com/settings/ads).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary">3. Data Security &amp; Retention</h2>
          <p>
            We implement industry-standard SSL encryption and fail-closed security protocols. We do not sell, rent, or trade your personal data with third-party data brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-primary">4. Contact Information</h2>
          <p>
            For questions regarding this privacy policy or to request data deletion, contact us at privacy@creator-amusemac.com or through our contact page.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}
