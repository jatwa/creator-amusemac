import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { comparisonsData } from "@/data/platform-data";
import { ComparisonCard } from "@/components/ui-cards";

export const metadata: Metadata = {
  title: "AI Model & Tool Comparisons — Creator by Amusemac",
  description: "Direct head-to-head assessments between Runway vs Kling, Midjourney vs Ideogram, and leading generative production engines.",
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Hero Banner */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Editorial Decisions"
            title="Head-to-Head Model Comparisons"
            description="Clear, production-tested verdict breakdowns between competing AI models. Detailed trade-offs, pricing, and visual fidelity scores."
          />

          {/* Quick Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/compare"
              className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background shadow-sm"
            >
              All Comparisons ({comparisonsData.length})
            </Link>
            <Link
              href="/compare/runway-vs-kling"
              className="rounded-full bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent hover:opacity-80 transition"
            >
              Runway Gen-3 vs Kling AI
            </Link>
            <Link
              href="/compare/midjourney-vs-ideogram"
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-secondary hover:text-primary hover:border-border-bright transition"
            >
              Midjourney vs Ideogram
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
      <div className="shell py-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {comparisonsData.map((comp) => (
            <ComparisonCard key={comp.id} comparison={comp} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
