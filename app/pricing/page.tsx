import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { PricingTable } from "@/components/pricing-table";
import { STRINGS } from "@/lib/i18n/strings";

export const metadata: Metadata = {
  title: "Pricing Plans — Creator Intel Prompt Vault & Subscriptions",
  description:
    "Choose the right plan for your AI filmmaking and creative workflow. Unlock cinematic prompt recipes, negative constraint formulas, and optical lens tokens.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      {/* Razorpay Checkout Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <Navigation />

      {/* Hero Banner */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tertiary mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-secondary">Pricing</span>
          </div>

          <SectionHeading
            as="h1"
            label="Transparent Subscription Plans"
            title="Calibrated for Independent Creators & Commercial Studios"
            description="Start for free with standard recipes, or upgrade to Director Basic and Studio Pro for unlimited access to tested prompt formulas and director-grade tokens."
          />

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="rounded-full bg-accent/10 px-3.5 py-1.5 font-medium text-accent">
              ⚡ Instant Google Sign-in
            </span>
            <span className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-secondary">
              🔒 Cancel anytime in one click
            </span>
            <span className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-secondary">
              🌍 Local currency checkout (INR, USD, GBP, EUR, AED)
            </span>
          </div>
        </div>
      </div>

      <div className="shell py-14 space-y-20">
        {/* Pricing Cards Grid */}
        <section id="plans" className="space-y-8">
          <PricingTable />
        </section>

        {/* Feature Comparison Table */}
        <section className="space-y-8 border-t border-border-subtle pt-16">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
              Plan Breakdown
            </span>
            <h2 className="text-2xl font-semibold text-primary mt-1">
              Compare Plan Capabilities
            </h2>
            <p className="text-sm text-secondary mt-2 leading-relaxed">
              Every tier provides access to tested camera, lighting, and optical tokens with transparent limits.
            </p>
          </div>

          <div className="surface rounded-3xl overflow-hidden border border-border-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated font-mono uppercase text-tertiary">
                    <th className="p-4 sm:p-5 font-medium">Feature</th>
                    <th className="p-4 sm:p-5 font-medium text-center">Starter Studio (Free)</th>
                    <th className="p-4 sm:p-5 font-medium text-center">Director Basic</th>
                    <th className="p-4 sm:p-5 font-medium text-center text-accent">Studio Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle font-mono text-secondary">
                  <tr>
                    <td className="p-4 sm:p-5 font-sans font-medium text-primary">Standard Prompt Catalog</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-400">Included</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-400">Included</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-400">Included</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-sans font-medium text-primary">Monthly Pro Vault Unlocks</td>
                    <td className="p-4 sm:p-5 text-center text-tertiary">0 (Preview only)</td>
                    <td className="p-4 sm:p-5 text-center text-primary font-bold">25 Unlocks / mo</td>
                    <td className="p-4 sm:p-5 text-center text-accent font-bold">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-sans font-medium text-primary">Negative Constraint Formulas</td>
                    <td className="p-4 sm:p-5 text-center text-tertiary">—</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-400">Included</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-400">Included</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-sans font-medium text-primary">Optical Lens &amp; Sensor Tokens</td>
                    <td className="p-4 sm:p-5 text-center text-tertiary">Basic</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-400">Full Matrix</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-400">Full Matrix + Updates</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-sans font-medium text-primary">Commercial Production Rights</td>
                    <td className="p-4 sm:p-5 text-center text-tertiary">Personal only</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-400">Claimed Prompts</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-400">All Prompts &amp; Deliverables</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-sans font-medium text-primary">Weekly New Model Drops</td>
                    <td className="p-4 sm:p-5 text-center text-tertiary">—</td>
                    <td className="p-4 sm:p-5 text-center text-tertiary">—</td>
                    <td className="p-4 sm:p-5 text-center text-accent font-bold">Priority Access</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8 border-t border-border-subtle pt-16">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-secondary mt-2">
              Common questions about subscription tiers, monthly unlock resets, and payment methods.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="surface p-6 rounded-3xl space-y-2">
              <h3 className="text-sm font-semibold text-primary">
                How do the 25 monthly unlocks work for Director Basic?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                When you are on Director Basic, you can unlock up to 25 Pro recipes each month. Once unlocked, you have permanent access to that recipe even across visits. Your available count automatically resets back to 25 at the start of every billing period.
              </p>
            </div>

            <div className="surface p-6 rounded-3xl space-y-2">
              <h3 className="text-sm font-semibold text-primary">
                Can I upgrade from Basic to Studio Pro later?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Yes! You can upgrade anytime directly from your Account dashboard or Pricing page. Razorpay will adjust your subscription seamlessly.
              </p>
            </div>

            <div className="surface p-6 rounded-3xl space-y-2">
              <h3 className="text-sm font-semibold text-primary">
                How do I cancel my subscription?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                You can cancel anytime with one click in your <Link href="/account" className="text-accent underline">Account settings</Link>. You will continue to have access to your tier until the end of your paid billing period.
              </p>
            </div>

            <div className="surface p-6 rounded-3xl space-y-2">
              <h3 className="text-sm font-semibold text-primary">
                Which payment methods are accepted?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                We accept credit/debit cards (Visa, MasterCard, Amex), UPI, Apple Pay, Google Pay, and localized bank transfers via Razorpay in INR (₹), USD ($), GBP (£), EUR (€), and AED.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
