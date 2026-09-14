import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { CINEMATIC_42_PROMPTS } from "@/data/cinematic-prompts";
import { PromptCard } from "@/components/ui-cards";

export const metadata: Metadata = {
  title: "The Vault — Verified Cinematic Recipes & Directorial Intelligence",
  description:
    "Unlock 42+ production-tested Director Recipes calibrated with physical lens physics, lighting ratios, camera rigs, and negative prompt matrices for Runway Gen-3, Kling 1.5, and Flux.1.",
  alternates: {
    canonical: "https://creatorintels.com/vault",
  },
};

export default function VaultLandingPage() {
  const featuredRecipes = CINEMATIC_42_PROMPTS.slice(0, 9);

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Hero Section */}
      <section className="border-b border-border-subtle bg-surface/30 py-20 sm:py-28">
        <div className="shell max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-mono font-semibold text-accent">
            <span>⚡</span>
            <span>PRODUCTION INTELLIGENCE VAULT</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-primary font-serif leading-tight">
            Director Recipes for Modern Cinema.
          </h1>

          <p className="text-base sm:text-xl text-secondary leading-relaxed font-sans max-w-2xl mx-auto">
            Not generic AI prompts. Audited cinematography blueprints calibrated with real optical parameters, sensor calibrations, and negative token matrices.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="rounded-2xl bg-accent px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition flex items-center gap-2"
            >
              <span>Unlock Complete Vault</span>
              <span>→</span>
            </Link>
            <Link
              href="/prompts/factory"
              className="rounded-2xl border border-border bg-surface px-8 py-4 text-sm font-semibold text-secondary hover:text-primary transition"
            >
              Test in Director's Studio
            </Link>
          </div>
        </div>
      </section>

      {/* Recipe Anatomy Breakdown (Idea -> Recipe -> Prompt -> Result) */}
      <section className="shell py-20 border-b border-border-subtle space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
            THE VAULT ADVANTAGE
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-primary font-serif">
            From Directorial Decision to Screen-Ready Prompt.
          </h2>
          <p className="text-sm sm:text-base text-secondary">
            Why random prompt marketplaces fail on film sets and how Vault recipes deliver predictable cinematic shots.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 font-sans text-sm">
          <div className="surface p-6 rounded-2xl border border-border space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated font-mono font-bold text-accent">
              01
            </div>
            <h3 className="font-bold text-primary text-base">Directorial Vision</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Define emotional tone, scene objective, time of day, and environmental atmosphere.
            </p>
          </div>

          <div className="surface p-6 rounded-2xl border border-border space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated font-mono font-bold text-accent">
              02
            </div>
            <h3 className="font-bold text-primary text-base">Optics &amp; Lighting</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Physical lens primes (Cooke, Zeiss, Panavision), focal lengths, aperture, and motivated lighting ratios.
            </p>
          </div>

          <div className="surface p-6 rounded-2xl border border-border space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated font-mono font-bold text-accent">
              03
            </div>
            <h3 className="font-bold text-primary text-base">Engine Translation</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Syntax automatically compiled for Runway Gen-3, Kling 1.5, Luma, or Flux.1 with calibrated negatives.
            </p>
          </div>

          <div className="surface p-6 rounded-2xl border border-border space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-elevated font-mono font-bold text-accent">
              04
            </div>
            <h3 className="font-bold text-primary text-base">Repeatable Output</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Zero plastic sheen. Natural highlight roll-off, film grain, and organic physical momentum.
            </p>
          </div>
        </div>
      </section>

      {/* Vault Recipe Showcase */}
      <section className="shell py-20 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              FEATURED RECIPES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary font-serif mt-1">
              Curated Directorial Recipes
            </h2>
          </div>
          <Link
            href="/prompts"
            className="text-xs font-semibold text-accent hover:underline font-mono"
          >
            Browse all {CINEMATIC_42_PROMPTS.length} recipes →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredRecipes.map((item) => (
            <PromptCard key={item.id} prompt={item} />
          ))}
        </div>
      </section>

      {/* Pricing CTA Banner */}
      <section className="border-t border-border-subtle bg-surface-elevated/40 py-20">
        <div className="shell max-w-4xl text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-bold text-primary font-serif">
            Join the Director's Tier
          </h2>
          <p className="text-secondary max-w-xl mx-auto text-sm sm:text-base">
            Choose Director Basic (₹499/mo with 25 monthly unlocks) or Studio Pro (₹1,499/mo for unlimited access &amp; private Toolkit).
          </p>
          <div className="pt-2">
            <Link
              href="/pricing"
              className="inline-flex rounded-2xl bg-accent px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-accent/90 transition"
            >
              Compare Plans &amp; Pricing →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
