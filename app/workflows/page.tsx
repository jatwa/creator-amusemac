import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { workflowsData } from "@/data/platform-data";
import { getToolById } from "@/data/content";

export const metadata: Metadata = {
  title: "Production Workflows — Creator by Amusemac",
  description: "Production-ready pipeline blueprints for commercial filmmaking, sci-fi worldbuilding pre-pro, and music videos.",
};

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Pipeline Blueprints"
            title="Creator AI Production Workflows"
            description="Step-by-step systems showing you exactly how to connect concept art, motion video models, voice acting, and finishing suites into a repeatable pipeline."
          />
        </div>
      </div>

      <div className="shell py-14 space-y-8">
        {workflowsData.map((wf) => {
          const allToolIds = Array.from(
            new Set(wf.steps.flatMap((s) => s.recommendedToolIds))
          );
          const toolsUsed = allToolIds.map((id) => getToolById(id)).filter(Boolean);

          return (
            <article
              key={wf.id}
              className="surface surface-hover p-6 sm:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent font-mono text-[11px]">
                      {wf.category} Pipeline
                    </span>
                    <span className="font-mono text-xs text-secondary">
                      ⏱ {wf.estimatedTime}
                    </span>
                    <span className="rounded-full border border-border bg-surface-elevated px-2.5 py-0.5 font-mono text-[10px] text-tertiary uppercase">
                      {wf.difficulty}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-primary leading-tight">
                    <Link href={`/workflows/${wf.slug}`} className="hover:text-accent transition-colors">
                      {wf.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-secondary leading-relaxed max-w-3xl font-normal">
                    {wf.summary}
                  </p>
                </div>

                <Link
                  href={`/workflows/${wf.slug}`}
                  className="rounded-full bg-foreground px-6 py-2.5 text-xs sm:text-sm font-medium text-background hover:opacity-90 transition shrink-0 self-start md:self-center flex items-center gap-2 shadow-sm"
                >
                  <span>Inspect Blueprint</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Pipeline Steps Preview */}
              <div className="border-t border-border-subtle pt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-3">
                  Production Stages ({wf.steps.length} Phases):
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {wf.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5"
                    >
                      <span className="font-mono text-xs text-accent font-semibold">
                        Phase 0{step.stepNumber}
                      </span>
                      <p className="mt-1 text-xs font-semibold text-primary line-clamp-1">
                        {step.phaseName}
                      </p>
                      <p className="mt-1 text-[11px] text-secondary line-clamp-2">
                        {step.goal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Stack Strip */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-2">
                <span className="text-tertiary font-mono text-[11px]">Pipeline Stack:</span>
                {toolsUsed.map((tool) => (
                  <span
                    key={tool?.id}
                    className="rounded-md border border-border bg-surface-elevated px-2.5 py-0.5 text-secondary font-mono text-[11px]"
                  >
                    {tool?.name}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <Footer />
    </main>
  );
}
