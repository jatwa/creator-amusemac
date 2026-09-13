"use client";

import Link from "next/link";
import type {
  AIEntity,
  AIContentItem,
  Film,
  Person,
  Technique,
  ResearchRecord,
} from "@/data/film-intelligence-types";
import type { Tool, Prompt, Workflow, BlogPost } from "@/data/types";

interface AIDossierViewProps {
  entity: AIEntity;
  contentItems: AIContentItem[];
  relatedTools: Tool[];
  relatedTechniques: Technique[];
  relatedWorkflows: Workflow[];
  relatedPrompts: Prompt[];
  relatedFilms: Film[];
  relatedPeople: Person[];
  relatedResearch: ResearchRecord[];
  relatedJournal: BlogPost[];
}

export function AIDossierView({
  entity,
  contentItems,
  relatedTools,
  relatedTechniques,
  relatedWorkflows,
  relatedPrompts,
  relatedFilms,
  relatedPeople,
  relatedResearch,
  relatedJournal,
}: AIDossierViewProps) {
  const videos = contentItems.filter(
    (c) => c.contentType === "YOUTUBE_VIDEO" || c.contentType === "VIDEO"
  );
  const tutorials = contentItems.filter((c) => c.contentType === "TUTORIAL");
  const articles = contentItems.filter(
    (c) =>
      c.contentType === "ARTICLE" ||
      c.contentType === "CASE_STUDY" ||
      c.contentType === "RESEARCH" ||
      c.contentType === "ANNOUNCEMENT" ||
      c.contentType === "INTERVIEW" ||
      c.contentType === "DEMO" ||
      c.contentType === "REVIEW"
  );

  const devOrg = entity.developerOrganization || entity.vendor || "AI Engine";
  const overviewText = entity.overview || entity.description || "";
  const models = entity.modelsAndProducts || [];
  const strengths = entity.cinemaStrengths || [];
  const limitations = entity.knownLimitations || [];
  const capabilities = entity.keyCapabilities || entity.capabilities || [];
  const officialLinks = entity.officialLinks || entity.officialSocialLinks || {};
  const websiteUrl = officialLinks.website || entity.officialWebsite;
  const docsUrl = officialLinks.documentation || entity.officialDocumentation;

  return (
    <div className="space-y-12">
      {/* 1. Header Banner & Identity */}
      <div className="rounded-3xl border border-border bg-surface-elevated/70 p-6 sm:p-8 md:p-10 shadow-subtle backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none font-mono text-8xl font-black">
          AI
        </div>

        <div className="relative z-10 space-y-6">
          {/* Breadcrumb & Verification Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-tertiary">
              <Link href="/ai" className="hover:text-primary transition">
                AI CINEMA HUB
              </Link>
              <span>/</span>
              <span className="text-accent uppercase font-medium">{entity.category.replace(/_/g, " ")}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-mono text-emerald-400">
                ● {entity.verificationStatus}
              </span>
              <span className="rounded-full bg-surface border border-border px-3 py-1 text-xs font-mono text-secondary">
                {entity.entityType.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-primary">
                {entity.name}
              </h1>
              <span className="text-base sm:text-lg font-sans text-tertiary">
                by {devOrg}
              </span>
            </div>
            <p className="text-base sm:text-lg text-secondary max-w-3xl leading-relaxed font-sans font-normal">
              {entity.tagline}
            </p>
          </div>

          {/* Metadata Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border-subtle text-xs sm:text-sm font-sans">
            <div>
              <span className="text-tertiary block text-xs">Introduced:</span>
              <span className="text-primary font-semibold">{entity.foundedOrIntroducedYear || "N/A"}</span>
            </div>
            <div>
              <span className="text-tertiary block text-xs">Headquarters:</span>
              <span className="text-primary font-semibold">{entity.headquarters || "Global / Distributed"}</span>
            </div>
            <div>
              <span className="text-tertiary block text-xs">Licensing:</span>
              <span className="text-primary font-semibold">{(entity.licensingModel || "Commercial").replace(/_/g, " ")}</span>
            </div>
            <div>
              <span className="text-tertiary block text-xs">Sources Verified:</span>
              <span className="text-accent font-semibold">{entity.sources?.length || 0} Verified Citations</span>
            </div>
          </div>

          {/* Quick Access Action Bar */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-foreground text-background px-4 py-2 text-xs sm:text-sm font-semibold hover:opacity-90 transition shadow-sm font-sans"
              >
                <span>Official Website</span>
                <span className="text-xs">↗</span>
              </a>
            )}
            {officialLinks.webApp && (
              <a
                href={officialLinks.webApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-semibold text-primary hover:border-accent/40 transition font-sans"
              >
                <span>Launch App</span>
                <span className="text-xs">↗</span>
              </a>
            )}
            {docsUrl && (
              <a
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-semibold text-primary hover:border-accent/40 transition font-sans"
              >
                <span>Documentation</span>
                <span className="text-xs">↗</span>
              </a>
            )}
            {officialLinks.apiPortal && (
              <a
                href={officialLinks.apiPortal}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-semibold text-primary hover:border-accent/40 transition font-sans"
              >
                <span>API Portal</span>
                <span className="text-xs">↗</span>
              </a>
            )}
            {officialLinks.modelWeights && (
              <a
                href={officialLinks.modelWeights}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-semibold text-primary hover:border-accent/40 transition font-sans"
              >
                <span>HuggingFace / Weights</span>
                <span className="text-xs">↗</span>
              </a>
            )}
            {officialLinks.github && (
              <a
                href={officialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-semibold text-primary hover:border-accent/40 transition font-sans"
              >
                <span>GitHub</span>
                <span className="text-xs">↗</span>
              </a>
            )}
            {officialLinks.communityDiscord && (
              <a
                href={officialLinks.communityDiscord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-4 py-2 text-xs sm:text-sm font-semibold text-primary hover:border-accent/40 transition font-sans"
              >
                <span>Discord</span>
                <span className="text-xs">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. Architectural Overview & Modalities */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary flex items-center gap-2">
              <span className="text-accent font-sans text-xl">01 //</span> Overview & Cinematic Architecture
            </h2>
            <p className="text-base sm:text-[17px] text-secondary leading-relaxed whitespace-pre-line font-sans">
              {overviewText}
            </p>

            {entity.architectureOverview && (
              <div className="pt-4 border-t border-border-subtle space-y-2">
                <span className="text-xs font-sans uppercase tracking-wider text-accent font-bold block">
                  Technical Architecture
                </span>
                <p className="text-sm text-secondary leading-relaxed font-sans">
                  {entity.architectureOverview}
                </p>
              </div>
            )}
          </div>

          {/* Camera & Cinematic Controls */}
          {entity.cameraAndCinematographyFeatures && entity.cameraAndCinematographyFeatures.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary flex items-center gap-2">
                <span className="text-accent font-sans text-xl">02 //</span> Camera & Cinematography Controls
              </h2>
              <div className="grid gap-3.5 sm:grid-cols-2">
                {entity.cameraAndCinematographyFeatures.map((feat, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-4 sm:p-5 space-y-1.5"
                  >
                    <div className="text-xs font-sans text-accent font-bold flex items-center gap-2">
                      <span>🎥</span>
                      <span>Feature #{i + 1}</span>
                    </div>
                    <p className="text-sm text-secondary leading-relaxed font-sans">{feat}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Modalities & Capabilities */}
        <div className="space-y-6">
          {/* Modalities & Supported Output */}
          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-4">
            <h3 className="text-xs font-sans uppercase tracking-wider text-tertiary font-bold">
              Modalities & Output
            </h3>
            
            <div className="space-y-3.5 font-sans">
              <div>
                <span className="text-xs text-tertiary block mb-1">
                  Primary Category:
                </span>
                <span className="rounded-md border border-border-subtle bg-surface-elevated px-2.5 py-1 text-xs font-sans text-secondary inline-block font-medium">
                  {entity.category.replace(/_/g, " ")}
                </span>
              </div>

              {capabilities.length > 0 && (
                <div>
                  <span className="text-xs text-tertiary block mb-1">
                    Primary Cinema Capabilities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {capabilities.map((cap, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-accent/10 text-accent px-2.5 py-1 text-xs font-medium font-sans"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cinema Strengths vs Limitations */}
          {(strengths.length > 0 || limitations.length > 0) && (
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-7 space-y-4 font-sans">
              <h3 className="text-xs font-sans uppercase tracking-wider text-tertiary font-bold">
                Cinema Evaluation
              </h3>

              <div className="space-y-4">
                {strengths.length > 0 && (
                  <div>
                    <span className="text-sm font-bold text-emerald-400 block mb-2">
                      ✓ Proven Strengths
                    </span>
                    <ul className="space-y-1.5 text-sm text-secondary list-disc list-inside">
                      {strengths.map((st: string, i: number) => (
                        <li key={i} className="leading-relaxed">
                          {st}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {limitations.length > 0 && (
                  <div className="pt-3 border-t border-border-subtle">
                    <span className="text-sm font-bold text-amber-400 block mb-2">
                      ⚠ Known Limitations
                    </span>
                    <ul className="space-y-1.5 text-sm text-secondary list-disc list-inside">
                      {limitations.map((lim: string, i: number) => (
                        <li key={i} className="leading-relaxed">
                          {lim}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Verified Models & Products Ledger */}
      {models.length > 0 && (
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary flex items-center gap-2">
                <span className="text-accent font-sans text-xl">03 //</span> Verified Models & Products Ledger
              </h2>
              <p className="text-sm text-secondary mt-1 font-sans">
                Official model variants, context limits, and target filmmaking workflows
              </p>
            </div>
            <span className="text-xs font-sans text-accent font-semibold">
              {models.length} Models Cataloged
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-border bg-surface-elevated/40 p-5 sm:p-6 space-y-3.5 hover:border-accent/40 transition font-sans"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-accent">
                    {prod.version ? `v${prod.version}` : prod.commercialStatus}
                  </span>
                  <span className="rounded-full bg-surface border border-border px-2.5 py-0.5 text-xs font-sans text-secondary font-medium">
                    {(prod.licenseType || prod.commercialStatus || "Commercial").replace(/_/g, " ")}
                  </span>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-primary font-sans">{prod.name}</h4>
                  <p className="text-sm text-secondary mt-1 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-border-subtle space-y-1.5 text-xs text-tertiary">
                  {(prod.maxResolution || prod.resolutionOrOutput) && (
                    <div className="flex justify-between">
                      <span>Max Resolution:</span>
                      <span className="text-primary font-semibold">{prod.maxResolution || prod.resolutionOrOutput}</span>
                    </div>
                  )}
                  {prod.contextWindowOrDuration && (
                    <div className="flex justify-between">
                      <span>Duration / Context:</span>
                      <span className="text-primary font-semibold">{prod.contextWindowOrDuration}</span>
                    </div>
                  )}
                  {prod.primaryUseCase && (
                    <div className="pt-1 text-xs font-sans text-secondary">
                      <span className="text-tertiary block font-medium">Best For:</span>
                      {prod.primaryUseCase}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Verified Video Intelligence & Tutorials */}
      {(videos.length > 0 || tutorials.length > 0) && (
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary flex items-center gap-2">
                <span className="text-accent font-sans text-xl">04 //</span> Verified Video Benchmarks & Tutorials
              </h2>
              <p className="text-sm text-secondary mt-1 font-sans">
                Embedded official demonstrations and filmmaker masterclasses
              </p>
            </div>
            <span className="text-xs font-sans text-accent font-semibold">
              {videos.length + tutorials.length} Items
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[...videos, ...tutorials].map((item) => {
              const summaryText = item.summary || item.description || "";
              const pub = item.sourcePublisher || item.publisher || "Source";
              const dateText = item.publishedDate || item.publishedAt || "Recently Verified";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-surface-elevated/40 p-5 sm:p-6 space-y-3.5 flex flex-col justify-between font-sans"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold">
                        {pub} • {dateText}
                      </span>
                      <span className="rounded-full bg-surface border border-border px-2.5 py-0.5 text-xs font-sans text-secondary font-medium">
                        {item.contentType.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-primary leading-snug font-sans">
                      {item.title}
                    </h4>

                    {/* YouTube Embed if available */}
                    {item.embedUrl && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black/50">
                        <iframe
                          src={item.embedUrl}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="h-full w-full border-0"
                        />
                      </div>
                    )}

                    <p className="text-sm text-secondary leading-relaxed font-sans">
                      {summaryText}
                    </p>

                    {item.editorialTakeaways && (
                      <div className="rounded-xl border border-border-subtle bg-surface/80 p-3.5 text-xs sm:text-sm text-secondary font-sans leading-relaxed">
                        <span className="font-semibold text-primary block mb-1">
                          Filmmaking Insight:
                        </span>
                        {item.editorialTakeaways}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs sm:text-sm font-sans">
                    <span className="text-tertiary">{item.sourcePlatform || "Web"}</span>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Watch Original</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Editorial Articles & Case Studies */}
      {articles.length > 0 && (
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary flex items-center gap-2">
                <span className="text-accent font-sans text-xl">05 //</span> Editorial Deep Dives & Industry Coverage
              </h2>
              <p className="text-sm text-secondary mt-1 font-sans">
                Verified analysis and production case studies
              </p>
            </div>
            <span className="text-xs font-sans text-accent font-semibold">{articles.length} Articles</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {articles.map((item) => {
              const summaryText = item.summary || item.description || "";
              const pub = item.sourcePublisher || item.publisher || "Source";
              const dateText = item.publishedDate || item.publishedAt || "Recently Verified";

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-surface-elevated/40 p-5 sm:p-6 space-y-3 flex flex-col justify-between font-sans"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-sans">
                      <span className="text-accent uppercase font-semibold">
                        {pub}
                      </span>
                      <span className="text-tertiary">{dateText}</span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-primary leading-snug font-sans">
                      {item.title}
                    </h4>

                    <p className="text-sm text-secondary line-clamp-3 leading-relaxed font-sans">
                      {summaryText}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs sm:text-sm font-sans">
                    <span className="text-tertiary">{item.contentType.replace(/_/g, " ")}</span>
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>Read Original</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Connected Cinema Knowledge Graph */}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary flex items-center gap-2">
            <span className="text-accent font-sans text-xl">06 //</span> Connected Cinema Knowledge Graph
          </h2>
          <p className="text-sm text-secondary mt-1 font-sans">
            Relationships mapped to canonical tools, techniques, prompts, workflows, films, and research
          </p>
        </div>

        {/* Graph Sections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface-elevated/30 p-5 space-y-3 font-sans">
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold block">
                Canonical Tools ({relatedTools.length})
              </span>
              <div className="space-y-2">
                {relatedTools.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tools/${t.slug}`}
                    className="block rounded-xl border border-border bg-surface p-3.5 hover:border-accent/40 transition group"
                  >
                    <h5 className="text-sm font-bold text-primary group-hover:text-accent transition font-sans">
                      {t.name}
                    </h5>
                    <p className="text-xs text-tertiary line-clamp-1 mt-0.5">{t.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Techniques */}
          {relatedTechniques.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface-elevated/30 p-5 space-y-3 font-sans">
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold block">
                Cinema Techniques ({relatedTechniques.length})
              </span>
              <div className="space-y-2">
                {relatedTechniques.map((tech) => (
                  <Link
                    key={tech.id}
                    href={`/techniques/${tech.slug}`}
                    className="block rounded-xl border border-border bg-surface p-3.5 hover:border-accent/40 transition group"
                  >
                    <h5 className="text-sm font-bold text-primary group-hover:text-accent transition font-sans">
                      {tech.name}
                    </h5>
                    <p className="text-xs text-tertiary line-clamp-1 mt-0.5">{tech.creativePurpose}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Workflows */}
          {relatedWorkflows.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface-elevated/30 p-5 space-y-3 font-sans">
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold block">
                Filmmaking Workflows ({relatedWorkflows.length})
              </span>
              <div className="space-y-2">
                {relatedWorkflows.map((wf) => (
                  <Link
                    key={wf.id}
                    href={`/workflows/${wf.slug}`}
                    className="block rounded-xl border border-border bg-surface p-3.5 hover:border-accent/40 transition group"
                  >
                    <h5 className="text-sm font-bold text-primary group-hover:text-accent transition font-sans">
                      {wf.title}
                    </h5>
                    <p className="text-xs text-tertiary line-clamp-1 mt-0.5">{wf.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Prompts */}
          {relatedPrompts.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface-elevated/30 p-5 space-y-3 font-sans">
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold block">
                Cinematic Prompts ({relatedPrompts.length})
              </span>
              <div className="space-y-2">
                {relatedPrompts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/prompts/${p.slug}`}
                    className="block rounded-xl border border-border bg-surface p-3.5 hover:border-accent/40 transition group"
                  >
                    <h5 className="text-sm font-bold text-primary group-hover:text-accent transition font-sans">
                      {p.title}
                    </h5>
                    <p className="text-xs text-tertiary line-clamp-1 mt-0.5">{p.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Films */}
          {relatedFilms.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface-elevated/30 p-5 space-y-3 font-sans">
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold block">
                Films & Benchmark Projects ({relatedFilms.length})
              </span>
              <div className="space-y-2">
                {relatedFilms.map((f) => (
                  <Link
                    key={f.id}
                    href={`/films/${f.slug}`}
                    className="block rounded-xl border border-border bg-surface p-3.5 hover:border-accent/40 transition group"
                  >
                    <h5 className="text-sm font-bold text-primary group-hover:text-accent transition font-sans">
                      {f.title} ({f.releaseYear})
                    </h5>
                    <p className="text-xs text-tertiary line-clamp-1 mt-0.5">{f.logline}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related People */}
          {relatedPeople.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface-elevated/30 p-5 space-y-3 font-sans">
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold block">
                Filmmakers & Innovators ({relatedPeople.length})
              </span>
              <div className="space-y-2">
                {relatedPeople.map((person) => (
                  <Link
                    key={person.id}
                    href={`/people/${person.slug}`}
                    className="block rounded-xl border border-border bg-surface p-3.5 hover:border-accent/40 transition group"
                  >
                    <h5 className="text-sm font-bold text-primary group-hover:text-accent transition font-sans">
                      {person.name}
                    </h5>
                    <p className="text-xs text-tertiary line-clamp-1 mt-0.5">{person.primaryRole}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Research */}
          {relatedResearch.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface-elevated/30 p-5 space-y-3 font-sans">
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold block">
                Research Records ({relatedResearch.length})
              </span>
              <div className="space-y-2">
                {relatedResearch.map((r) => (
                  <Link
                    key={r.id}
                    href={`/research/${r.slug}`}
                    className="block rounded-xl border border-border bg-surface p-3.5 hover:border-accent/40 transition group"
                  >
                    <h5 className="text-sm font-bold text-primary group-hover:text-accent transition font-sans">
                      {r.researchQuestion}
                    </h5>
                    <p className="text-xs text-tertiary line-clamp-1 mt-0.5">{r.topic}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Journal Articles */}
          {relatedJournal.length > 0 && (
            <div className="rounded-2xl border border-border-subtle bg-surface-elevated/30 p-5 space-y-3 font-sans">
              <span className="text-xs font-sans uppercase tracking-wider text-accent font-semibold block">
                Journal Intelligence ({relatedJournal.length})
              </span>
              <div className="space-y-2">
                {relatedJournal.map((j) => (
                  <Link
                    key={j.id}
                    href={`/journal/${j.slug}`}
                    className="block rounded-xl border border-border bg-surface p-3.5 hover:border-accent/40 transition group"
                  >
                    <h5 className="text-sm font-bold text-primary group-hover:text-accent transition font-sans">
                      {j.title}
                    </h5>
                    <p className="text-xs text-tertiary line-clamp-1 mt-0.5">{j.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7. 8-Tier Source Ledger */}
      {entity.sources && entity.sources.length > 0 && (
        <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary flex items-center gap-2">
                <span className="text-accent font-sans text-xl">07 //</span> 8-Tier Source & Citation Ledger
              </h2>
              <p className="text-sm text-secondary mt-1 font-sans">
                Every factual capability, benchmark, and parameter is backed by a verifiable primary source
              </p>
            </div>
            <span className="text-xs font-sans text-emerald-400 font-semibold">
              {entity.sources.length} Audited Sources
            </span>
          </div>

          <div className="space-y-3">
            {entity.sources.map((src) => (
              <div
                key={src.id}
                className="rounded-2xl border border-border bg-surface-elevated/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-accent/15 border border-accent/30 px-2.5 py-0.5 text-xs font-mono text-accent font-semibold">
                      {src.sourceType.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs font-sans text-tertiary">
                      Verified: {src.lastVerifiedAt || src.dateDiscovered}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-primary font-sans">{src.title || src.publisher}</h5>
                  <p className="text-xs text-secondary font-sans">{src.publisher}</p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-xs font-sans text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded font-medium">
                    {src.verificationStatus}
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-accent hover:border-accent/50 transition inline-flex items-center gap-1 font-sans"
                  >
                    <span>Source</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
