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

      <div className="shell py-12 sm:py-20">
        <SectionHeading
          label="Pipeline Blueprints"
          title="Creator AI Production Workflows"
          description="Step-by-step systems showing you exactly how to connect concept art, motion video models, voice acting, and finishing suites into a repeatable pipeline."
        />

        <div className="mt-12 space-y-8">
          {workflowsData.map((wf) => {
            // Collect all unique tools used across steps
            const allToolIds = Array.from(
              new Set(wf.steps.flatMap((s) => s.recommendedToolIds))
            );
            const toolsUsed = allToolIds.map((id) => getToolById(id)).filter(Boolean);

            return (
              <article
                key={wf.id}
                className="surface p-8 transition duration-200 hover:border-zinc-500"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold text-lime">
                        {wf.category.toUpperCase()}
                      </span>
                      <span className="text-xs text-zinc-400">
                        Estimated timeline: {wf.estimatedTime}
                      </span>
                      <span className="rounded-full border border-line bg-black/40 px-2.5 py-0.5 text-xs text-zinc-400 uppercase">
                        {wf.difficulty}
                      </span>
                    </div>

                    <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
                      <Link href={`/workflows/${wf.slug}`} className="hover:text-lime transition">
                        {wf.title}
                      </Link>
                    </h2>

                    <p className="mt-3 text-base text-zinc-300 leading-7 max-w-3xl">
                      {wf.summary}
                    </p>
                  </div>

                  <Link
                    href={`/workflows/${wf.slug}`}
                    className="rounded-xl bg-lime px-6 py-3 text-sm font-bold text-black transition hover:bg-white shrink-0 self-start md:self-center flex items-center gap-2"
                  >
                    <span>View blueprint</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Pipeline Steps Preview */}
                <div className="mt-8 border-t border-line/60 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-lime">
                    Production Stages ({wf.steps.length} Phases):
                  </p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {wf.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="rounded-lg border border-line bg-black/30 p-3.5"
                      >
                        <span className="text-xs font-mono text-lime font-bold">
                          Step 0{step.stepNumber}
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
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-zinc-500">Pipeline Stack:</span>
                  {toolsUsed.map((tool) => (
                    <span
                      key={tool?.id}
                      className="rounded-md border border-line bg-black/50 px-2.5 py-0.5 text-zinc-300"
                    >
                      {tool?.name}
                    </span>
                  ))}
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
