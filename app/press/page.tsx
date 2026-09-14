import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Press & Creator Relations — Creator Intel",
  description:
    "Press kit, brand assets, mission statement, and editorial contact information for Creator Intel — The Intelligence Layer for Modern Filmmakers.",
  alternates: {
    canonical: "https://creatorintels.com/press",
  },
};

export default function PressPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border-subtle bg-surface/30 py-16 sm:py-24">
        <div className="shell max-w-4xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-tertiary">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-secondary">Press &amp; Media</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-mono font-semibold text-accent">
            <span>📰</span>
            <span>MEDIA KIT &amp; EDITORIAL RELATIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary font-serif leading-tight">
            Press, Media &amp; Creator Relations.
          </h1>

          <p className="text-base sm:text-lg text-secondary leading-relaxed font-sans max-w-2xl">
            Creator Intel provides cinematography intelligence, verified prompt recipes, and unvarnished tool benchmarking for working directors, DoPs, and visual creators.
          </p>
        </div>
      </section>

      {/* Press Inquiries & Mission */}
      <section className="shell py-20 space-y-12">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Mission */}
          <div className="surface p-8 rounded-2xl border border-border space-y-4">
            <span className="text-xs font-mono uppercase text-accent font-semibold">OUR MISSION</span>
            <h2 className="text-2xl font-bold text-primary font-serif">
              "Too Many AI Tools. Not Enough Clarity."
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              As generative AI evolves at breakneck speed, filmmakers are flooded with synthetic demos and marketing noise. Creator Intel bridges the gap between traditional physical cinematography (optics, lenses, lighting ratios, sensor physics) and modern generative synthesis.
            </p>
          </div>

          {/* Media Contact */}
          <div className="surface p-8 rounded-2xl border border-border space-y-4">
            <span className="text-xs font-mono uppercase text-accent font-semibold">MEDIA CONTACT</span>
            <h2 className="text-2xl font-bold text-primary font-serif">
              Editorial &amp; Review Access
            </h2>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              Journalists, festival programmers, and tech reviewers can request complimentary Studio Pro Vault evaluation access or interview editorial researchers:
            </p>
            <div className="pt-2">
              <a
                href="mailto:press@creatorintels.com"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-xs font-semibold text-white hover:bg-accent/90 transition"
              >
                <span>Email Press Desk (press@creatorintels.com)</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
