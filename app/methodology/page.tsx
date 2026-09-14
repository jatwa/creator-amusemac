import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Auditing & Scoring Methodology — Creator Intel",
  description:
    "How Creator Intel evaluates, benchmarks, and scores AI video models, concept tools, and directorial workflows. 100% independent evaluation with zero sponsored rankings.",
  alternates: {
    canonical: "https://creatorintels.com/methodology",
  },
};

export default function MethodologyPage() {
  const criteria = [
    {
      num: "01",
      title: "Cinematic Quality & Texture",
      weight: "25%",
      description:
        "Evaluation of native 1080p/4K resolution clarity, highlight roll-off, skin tone naturalism, shadow detail, absence of digital plastic sheen, and compatibility with organic 35mm film grain emulation.",
    },
    {
      num: "02",
      title: "Camera & Motion Control",
      weight: "20%",
      description:
        "Granularity of directional camera directives (Pan, Tilt, Zoom, Roll, Crane, Tracking), 3D trajectory predictability, motion brush precision, and support for physical rig kinematics.",
    },
    {
      num: "03",
      title: "Physical Realism & Momentum Dynamics",
      weight: "20%",
      description:
        "Simulation of real-world gravitational physics, fluid dynamics (splashes, pouring, steam), cloth drape, weight transfer during athletic locomotion, and structural vehicle inertia.",
    },
    {
      num: "04",
      title: "Temporal Consistency & Subject Lock",
      weight: "15%",
      description:
        "Frame-to-frame identity persistence, background stability during extended 5-10 second takes, absence of unintended morphing, and face/wardrobe coherence across sequential shots.",
    },
    {
      num: "05",
      title: "Production Pipeline Integration",
      weight: "10%",
      description:
        "Compatibility with industry NLEs (DaVinci Resolve, Premiere Pro), ACES color spaces, DCI-compliant framerates (24.000 fps), and export flexibility (ProRes 422, uncompressed PNG).",
    },
    {
      num: "06",
      title: "Commercial Safety & Pricing Transparency",
      weight: "10%",
      description:
        "Transparency of per-generation credit consumption, enterprise licensing terms, commercial copyright clearance guarantees, and absence of hidden queue throttling.",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <section className="border-b border-border-subtle bg-surface/30 py-16 sm:py-24">
        <div className="shell max-w-4xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-tertiary">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-secondary">Methodology</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-mono font-semibold text-accent">
            <span>⚖</span>
            <span>INDEPENDENT EVALUATION PROTOCOL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary font-serif leading-tight">
            How Creator Intel Scores AI Production Tools.
          </h1>

          <p className="text-base sm:text-lg text-secondary leading-relaxed font-sans max-w-2xl">
            We do not accept paid placements, affiliate ranking overrides, or sponsored ratings. Every score and verdict reflects unvarnished testing by working commercial and narrative filmmakers.
          </p>
        </div>
      </section>

      {/* 6 Core Scoring Dimensions */}
      <section className="shell py-20 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
            SCORING DIMENSIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary font-serif">
            The 6 Director Evaluation Pillars
          </h2>
          <p className="text-sm text-secondary">
            Each AI model is audited against 6 weighted criteria to calculate its overall Creator Intel Score (1.0 – 5.0).
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 font-sans">
          {criteria.map((c) => (
            <div key={c.num} className="surface p-7 rounded-2xl border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-accent">{c.num}</span>
                <span className="rounded-full bg-surface-elevated border border-border px-2.5 py-0.5 font-mono text-[11px] text-tertiary">
                  Weight: {c.weight}
                </span>
              </div>
              <h3 className="font-bold text-primary text-lg">{c.title}</h3>
              <p className="text-xs text-secondary leading-relaxed font-normal">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Zero Sponsored Policy */}
      <section className="border-t border-border-subtle bg-surface-elevated/30 py-16">
        <div className="shell max-w-3xl text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary font-serif">
            Zero Sponsored Rankings Guarantee
          </h2>
          <p className="text-xs sm:text-sm text-secondary leading-relaxed">
            When a tool has severe artifacts, morphing failures, or unpredictable credit pricing, our dossiers explicitly document them under <strong>Known Artifacts &amp; When to Avoid</strong>. We believe honest intelligence saves filmmakers hundreds of production hours.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
