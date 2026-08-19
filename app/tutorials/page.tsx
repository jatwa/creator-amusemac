import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { tutorialsData } from "@/data/platform-data";
import { getToolById } from "@/data/content";

export const metadata: Metadata = {
  title: "Workflow Tutorials for Visual Storytellers — Creator by Amusemac",
  description: "Step-by-step production guides on AI pre-production, commercial filmmaking, dialogue editing, and look development.",
};

export default function TutorialsPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Knowledge Base"
            title="Production Tutorials"
            description="Practical, fluff-free guides for building a faster, repeatable creative practice across video, audio, and visual design."
          />
        </div>
      </div>

      <div className="shell py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {tutorialsData.map((tut, index) => {
            const requiredTools = tut.requiredToolIds
              .map((id) => getToolById(id))
              .filter(Boolean);

            return (
              <article
                key={tut.id}
                className="surface surface-hover group flex flex-col justify-between overflow-hidden p-6 sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-semibold font-mono text-tertiary">
                      0{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-accent/10 px-3 py-0.5 font-mono text-xs font-medium text-accent">
                        {tut.category}
                      </span>
                      <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 font-mono text-[10px] text-tertiary">
                        {tut.readTime}
                      </span>
                    </div>
                  </div>

                  <h2 className="mt-6 text-xl sm:text-2xl font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
                    <Link href={`/tutorials/${tut.slug}`}>
                      {tut.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-secondary font-normal">
                    {tut.goal}
                  </p>

                  <div className="mt-6">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary mb-2">
                      Required Tool Stack:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {requiredTools.map((tool) => (
                        <span
                          key={tool?.id}
                          className="rounded-md border border-border bg-surface-elevated px-2.5 py-1 font-mono text-[11px] text-secondary"
                        >
                          {tool?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-border-subtle pt-4 flex items-center justify-between font-mono text-xs">
                  <span className="text-tertiary uppercase">{tut.difficulty} level</span>
                  <Link
                    href={`/tutorials/${tut.slug}`}
                    className="inline-flex items-center gap-1.5 font-medium text-accent hover:opacity-80 transition"
                  >
                    <span>Read Guide</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
