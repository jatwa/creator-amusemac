import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { workflowsData } from "@/data/platform-data";
import { getToolById } from "@/data/content";

export const metadata: Metadata = {
  title: "End-to-End Creator AI Workflows | Creator by Amusemac",
  description: "Production-ready pipeline blueprints for commercial filmmaking, sci-fi worldbuilding pre-pro, and music videos.",
};

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      {/* Header */}
      <div className="border-b border-line bg-gradient-to-b from-panel/80 via-ink to-ink py-12 sm:py-16">
        <div className="shell">
          <SectionHeading
            as="h1"
            label="Pipeline Blueprints"
            title="Creator AI Production Workflows"
            description="Step-by-step systems showing you exactly how to connect concept art, motion video models, voice acting, and finishing suites into a repeatable pipeline."
          />
        </div>
      </div>

      <div className="shell py-12 space-y-8">
        {workflowsData.map((wf) => {
          // Collect all unique tools used across steps
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
                    <span className="eyebrow text-xs bg-lime/10 px-3 py-1 rounded-full border border-lime/30">
                      {wf.category} Pipeline
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      ⏱ {wf.estimatedTime}
                    </span>
                    <span className="rounded-full border border-line bg-ink px-2.5 py-0.5 font-mono text-[10px] text-zinc-400 uppercase">
                      {wf.difficulty}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white leading-tight">
                    <Link href={`/workflows/${wf.slug}`} className="hover:text-lime transition">
                      {wf.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
                    {wf.summary}
                  </p>
                </div>

                <Link
                  href={`/workflows/${wf.slug}`}
                  className="rounded-full bg-lime px-6 py-2.5 text-xs sm:text-sm font-bold text-black hover:bg-white transition shrink-0 self-start md:self-center flex items-center gap-2 shadow-glow-subtle"
                >
                  <span>Inspect Blueprint</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Pipeline Steps Preview */}
              <div className="border-t border-line/60 pt-6">
                <p className="eyebrow text-xs mb-3">
                  Production Stages ({wf.steps.length} Phases):
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {wf.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="rounded-xl border border-line bg-ink/70 p-3.5"
                    >
                      <span className="font-mono text-xs text-lime font-bold">
                        Phase 0{step.stepNumber}
                      </span>
                      <p className="mt-1 text-xs font-bold text-white line-clamp-1">
                        {step.phaseName}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2">
                        {step.goal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools Stack Strip */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-2">
                <span className="text-zinc-500 font-mono text-[11px]">Pipeline Stack:</span>
                {toolsUsed.map((tool) => (
                  <span
                    key={tool?.id}
                    className="rounded-md border border-line bg-ink px-2.5 py-0.5 text-zinc-300 font-mono text-[11px]"
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
