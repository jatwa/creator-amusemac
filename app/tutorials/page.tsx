import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { tutorialsData } from "@/data/platform-data";
import { getToolById } from "@/data/content";

export const metadata: Metadata = {
  title: "Workflow Tutorials for Visual Storytellers | Creator by Amusemac",
  description: "Step-by-step production guides on AI pre-production, commercial filmmaking, dialogue editing, and look development.",
};

export default function TutorialsPage() {
  return (
    <main className="min-h-screen bg-ink text-zinc-100">
      <Navigation />

      <div className="shell py-12 sm:py-20">
        <SectionHeading
          label="Knowledge Base"
          title="Tutorials That Ship Work"
          description="Practical, fluff-free guides for building a faster, repeatable creative practice across video, audio, and visual design."
        />

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {tutorialsData.map((tut, index) => {
            const requiredTools = tut.requiredToolIds
              .map((id) => getToolById(id))
              .filter(Boolean);

            return (
              <article
                key={tut.id}
                className="surface group flex flex-col justify-between overflow-hidden p-8 transition duration-200 hover:border-zinc-500"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold font-mono text-lime/80">
                      0{index + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-lime/30 bg-lime/10 px-3 py-0.5 text-xs font-semibold text-lime">
                        {tut.category}
                      </span>
                      <span className="rounded-full border border-line bg-black/40 px-2.5 py-0.5 text-xs text-zinc-400">
                        {tut.readTime}
                      </span>
                    </div>
                  </div>

                  <h2 className="mt-6 text-2xl font-bold text-white group-hover:text-lime transition">
                    <Link href={`/tutorials/${tut.slug}`}>
                      {tut.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    {tut.goal}
                  </p>

                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Required Tool Stack:
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {requiredTools.map((tool) => (
                        <span
                          key={tool?.id}
                          className="rounded-md border border-line bg-black/40 px-2.5 py-1 text-xs text-zinc-300"
                        >
                          {tool?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-line/60 pt-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 uppercase">{tut.difficulty} level</span>
                  <Link
                    href={`/tutorials/${tut.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-lime hover:text-white transition"
                  >
                    <span>Read full guide</span>
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
