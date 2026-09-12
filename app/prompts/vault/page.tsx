import { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { PricingTable } from "@/components/pricing-table";
import { AuthButton } from "@/components/auth-button";
import { STRINGS } from "@/lib/i18n/strings";

export const metadata: Metadata = {
  title: "The Pro Prompts Vault — Director Recipes & Negative Blueprints — Creator Intel",
  description:
    "Unlock 65+ tested cinematic prompt recipes, negative constraint formulas, and optical lens tokens for Runway, Kling, Veo, Luma, Midjourney, and Flux.",
};

export default function PromptsVaultPage() {
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
            <Link href="/prompts" className="hover:text-primary transition-colors">Prompts</Link>
            <span>/</span>
            <span className="text-secondary">Pro Vault</span>
          </div>

          <SectionHeading
            as="h1"
            label={STRINGS.vault.heroBadge}
            title={STRINGS.vault.heroTitle}
            description={STRINGS.vault.heroSubtitle}
          />

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <AuthButton />
            <Link
              href="#pricing"
              className="rounded-2xl border border-border bg-surface px-5 py-2.5 text-xs font-semibold text-secondary hover:text-primary transition"
            >
              View Subscription Plans ↓
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="rounded-full bg-accent/10 px-3.5 py-1.5 font-medium text-accent">
              ⚡ 65+ Audited Prompt Recipes
            </span>
            <span className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-secondary">
              🎬 Tested on Runway, Kling, Veo, Flux &amp; Midjourney
            </span>
            <span className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-secondary">
              🌍 International Multi-Currency Recurring Billing
            </span>
          </div>
        </div>
      </div>

      <div className="shell py-14 space-y-20">
        {/* Main Pricing & Localized Checkout Section */}
        <section id="pricing" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
              Choose Your Vault Access Plan
            </h2>
            <p className="mt-3 text-sm text-secondary leading-relaxed">
              Unlock prompt formulas, negative blueprints, and director lens tokens with flexible monthly unlocks or unlimited Studio Pro access.
            </p>
          </div>

          <PricingTable />
        </section>

        {/* Vault Content Preview Grid */}
        <section className="space-y-8 border-t border-border-subtle pt-16">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
              Inside The Vault
            </span>
            <h2 className="text-2xl font-semibold text-primary mt-1">
              Production-Grade Blueprint Architecture
            </h2>
            <p className="text-sm text-secondary mt-2 leading-relaxed">
              Every recipe in the Vault is structured for deterministic camera control, lighting accuracy, and visual continuity across video diffusion models.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="surface p-6 rounded-3xl space-y-3">
              <div className="text-2xl">🎥</div>
              <h3 className="text-base font-semibold text-primary">Optics &amp; Camera Rigs</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Exact diffusion token syntaxes for ARRI Alexa 65, Panavision C-Series Anamorphic, Cooke S4 Primes, macro probe lenses, and techno-crane camera moves.
              </p>
            </div>

            <div className="surface p-6 rounded-3xl space-y-3">
              <div className="text-2xl">💡</div>
              <h3 className="text-base font-semibold text-primary">Master Lighting Formulas</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Volumetric fog, chiaroscuro rim lighting, golden hour diffusion, and commercial studio softbox setups calibrated to prevent plastic skin artifacts.
              </p>
            </div>

            <div className="surface p-6 rounded-3xl space-y-3">
              <div className="text-2xl">🛡️</div>
              <h3 className="text-base font-semibold text-primary">Negative Constraint Sets</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Pre-tested negative prompt blocks that eliminate AI morphing, warped anatomy, plastic CGI sheen, floating artifacts, and unstable background motion.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="space-y-8 border-t border-border-subtle pt-16">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-primary">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-secondary mt-2">
              Everything you need to know about international currency checkout and Vault access.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="surface p-6 rounded-3xl space-y-2">
              <h3 className="text-sm font-semibold text-primary">
                Which payment methods and currencies are supported?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                We support international cards (Visa, MasterCard, Amex), UPI, Apple Pay, Google Pay, and localized bank transfers via Razorpay in INR (₹), USD ($), GBP (£), EUR (€), and AED.
              </p>
            </div>

            <div className="surface p-6 rounded-3xl space-y-2">
              <h3 className="text-sm font-semibold text-primary">
                Can I use these prompts for commercial client projects?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Yes. All Vault passes include full commercial production rights. You are free to use the prompt recipes, tokens, and outputs for commercials, music videos, narrative films, and client deliverables.
              </p>
            </div>

            <div className="surface p-6 rounded-3xl space-y-2">
              <h3 className="text-sm font-semibold text-primary">
                How often is the Vault updated for new models?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                Whenever a major model version is released (such as Runway Gen-4, Kling 2.0, Veo 2, or Flux 2), our team audits and adds new tested recipes. Basic and Pro subscribers receive all updates automatically.
              </p>
            </div>

            <div className="surface p-6 rounded-3xl space-y-2">
              <h3 className="text-sm font-semibold text-primary">
                What is the cancellation and refund policy?
              </h3>
              <p className="text-xs text-secondary leading-relaxed">
                You can cancel your subscription at any time with one click from your Account dashboard without penalties. You retain access until the end of your billing cycle.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
