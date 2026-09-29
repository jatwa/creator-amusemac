import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { comparisonsData } from "@/data/platform-data";
import { ComparisonCard } from "@/components/ui-cards";

export const metadata: Metadata = {
  title: "AI Model & Tool Comparisons — Which Tool Should I Use? — Creator Intel",
  description:
    "Direct head-to-head filmmaking assessments: Runway vs Kling, Midjourney vs Ideogram, Flux vs Midjourney, Luma vs Runway. Production-tested trade-offs, camera physics, and score transparency.",
  alternates: {
    canonical: "https://creatorintels.com/compare",
  },
  openGraph: {
    title: "AI Model & Tool Comparisons — Which Tool Should I Use? — Creator Intel",
    description:
      "Direct head-to-head filmmaking assessments: Runway vs Kling, Midjourney vs Ideogram, Flux vs Midjourney. Production-tested trade-offs and camera physics.",
    url: "https://creatorintels.com/compare",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Model & Tool Comparisons — Creator Intel",
    description: "Direct head-to-head filmmaking assessments between leading generative cinema engines.",
  },
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Hero Decision Engine Banner */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell max-w-5xl space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-tertiary">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-secondary font-semibold">Compare Engine</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-mono font-semibold text-accent">
            <span>⚖</span>
            <span>DECISION ENGINE — WHICH TOOL SHOULD I USE?</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-primary font-serif leading-tight">
            Head-to-Head AI Model &amp; Tool Comparisons.
          </h1>

          <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-3xl font-normal font-sans">
            Every generative engine has distinct physical biases, optical characteristics, and interface constraints. We pit industry leaders head-to-head so you pick the right tool before burning production budgets.
          </p>

          {/* Core Decision Principles Callout */}
          <div className="grid gap-4 sm:grid-cols-3 pt-4">
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <span className="font-mono text-xs text-accent font-bold block uppercase">01 • Physical Inertia</span>
              <p className="mt-1 text-xs text-secondary leading-relaxed">
                Tested against complex fluid, collision, and human gait kinematics under rapid motion.
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <span className="font-mono text-xs text-accent font-bold block uppercase">02 • Camera Trajectory</span>
              <p className="mt-1 text-xs text-secondary leading-relaxed">
                Evaluated on 3D camera vector precision (Pan, Tilt, Zoom, Roll) and keyframe anchor locks.
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4">
              <span className="font-mono text-xs text-accent font-bold block uppercase">03 • Pipeline Utility</span>
              <p className="mt-1 text-xs text-secondary leading-relaxed">
                Benchmarked for NLE XML roundtripping, 4K ProRes finishing, and commercial licensing safety.
              </p>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-mono text-tertiary mr-1">Direct matchups:</span>
            <Link
              href="/compare"
              className="rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background shadow-sm"
            >
              All Matchups ({comparisonsData.length})
            </Link>
            <Link
              href="/compare/runway-vs-kling"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Runway Gen-3 vs Kling AI
            </Link>
            <Link
              href="/compare/flux-vs-midjourney"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Flux.1 vs Midjourney v6.1
            </Link>
            <Link
              href="/compare/midjourney-vs-ideogram"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Midjourney vs Ideogram
            </Link>
            <Link
              href="/compare/luma-vs-runway"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Luma Dream Machine vs Runway
            </Link>
            <Link
              href="/compare/descript-vs-capcut"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Descript vs CapCut
            </Link>
          </div>
        </div>
      </div>

      {/* Comparisons Grid */}
      <div className="shell py-14 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-primary font-serif">
              Production Matchups &amp; Verdicts
            </h2>
            <p className="text-xs sm:text-sm text-secondary font-sans mt-0.5">
              Select a matchup to inspect scenario winners, capability matrices, score rationales, and prompt recipes.
            </p>
          </div>

          <Link
            href="/methodology"
            className="text-xs font-mono text-accent hover:underline inline-flex items-center gap-1 shrink-0"
          >
            <span>How we score tools → /methodology</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {comparisonsData.map((comp) => (
            <ComparisonCard key={comp.id} comparison={comp} />
          ))}
        </div>

        {/* Methodology & Studio Bridge Banner */}
        <div className="rounded-3xl border border-border bg-surface p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-subtle">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
              DIRECTOR'S STUDIO INTEGRATION
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-primary font-serif">
              Found your tool? Direct your shot in the Director's Studio.
            </h3>
            <p className="text-sm text-secondary leading-relaxed font-sans font-normal">
              Construct camera-locked prompts with our visual optics builder, multi-shot storyboard matrix, and tested cinematic recipes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/methodology"
              className="rounded-full border border-border bg-surface-elevated px-5 py-2.5 text-xs sm:text-sm font-medium text-secondary hover:text-primary transition"
            >
              Read Methodology
            </Link>
            <Link
              href="/prompts/factory"
              className="rounded-full bg-foreground px-5 py-2.5 text-xs sm:text-sm font-semibold text-background hover:opacity-90 transition shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Launch Studio</span>
              <span>⚡</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
