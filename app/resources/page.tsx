import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { resourcesData } from "@/data/platform-data";

export const metadata: Metadata = {
  title: "Creator Resources, Templates & LUTs — Creator by Amusemac",
  description: "Free storyboard kits, cinematic camera cheat sheets, commercial treatment decks, and LUT packs.",
};

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Production Assets"
            title="Director Toolkits &amp; Resources"
            description="High-value templates, prompt cheat sheets, treatment decks, and color LUTs to accelerate your creative workflow."
          />
        </div>
      </div>

      <div className="shell py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {resourcesData.map((res) => (
            <article
              key={res.id}
              className="surface surface-hover p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {res.type}
                  </span>
                  <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 text-xs text-secondary font-mono">
                    {res.format}
                  </span>
                </div>

                <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-primary leading-snug">
                  {res.title}
                </h2>

                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-secondary font-normal">
                  {res.description}
                </p>
              </div>

              <div className="mt-8 border-t border-border-subtle pt-4 flex items-center justify-between font-mono text-xs">
                <span className="text-tertiary text-[11px]">Updated: {res.updatedAt}</span>
                <Link
                  href="/prompts"
                  className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:opacity-90 transition shadow-sm"
                >
                  Access Resource →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Community Submission Box */}
        <div className="mt-16 rounded-2xl border border-border bg-surface p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-subtle">
          <span className="text-3xl text-secondary font-mono">✦</span>
          <h3 className="mt-4 text-2xl font-semibold text-primary tracking-tight">
            Have a production kit or prompt recipe to share?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-secondary max-w-xl mx-auto leading-relaxed font-normal">
            Creator by Amusemac is continuously audited by working filmmakers and designers. Submit your tested workflows for inclusion in our knowledge base.
          </p>
          <div className="mt-6">
            <a
              href="mailto:hello@amusemac.com?subject=Creator Resource Submission"
              className="inline-block rounded-full bg-foreground px-6 py-2.5 text-xs sm:text-sm font-medium text-background hover:opacity-90 transition shadow-sm"
            >
              Submit a Workflow or Resource
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
