import React from "react";
import Link from "next/link";
import {
  Tool,
  Prompt,
  ToolComparison,
  VideoItem,
  BlogPost,
  Workflow,
} from "@/data/types";
import { getToolById } from "@/data/content";

/**
 * 1. ToolCard - For Discover / Tools Catalog
 */
export function ToolCard({
  tool,
}: {
  tool: Tool;
  index?: number;
}) {
  const isVideo = tool.category === "video";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium tracking-wider uppercase text-secondary">
              {tool.category}
            </span>
            {isVideo && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[9px] font-medium text-accent">
                Video Hub
              </span>
            )}
          </div>
          <span className="text-[11px] text-tertiary font-mono">
            {tool.pricing.model}
          </span>
        </div>

        <div className="mt-4 flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-elevated font-mono text-sm font-semibold text-primary">
            {tool.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
              {tool.name}
            </h3>
            <p className="text-xs text-secondary line-clamp-1 mt-0.5">{tool.tagline}</p>
          </div>
        </div>

        <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-secondary line-clamp-2 font-normal">
          {tool.description}
        </p>

        {tool.keyFeatures && tool.keyFeatures.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tool.keyFeatures.slice(0, 3).map((feat, i) => (
              <span
                key={i}
                className="rounded-md border border-border-subtle bg-surface-elevated px-2 py-0.5 text-[10px] text-secondary font-mono"
              >
                {feat}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs">
        <span className="text-tertiary text-[11px]">
          {tool.pricing.startingPrice || "Free tier"}
        </span>
        <span className="font-medium text-accent group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1">
          Dossier →
        </span>
      </div>
    </Link>
  );
}

/**
 * 2. PromptCard - Visual Studio Recipe Card
 */
export function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <Link
      href={`/prompts/${prompt.slug}`}
      className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium tracking-wider uppercase text-secondary">
            {prompt.useCase}
          </span>
          <span className="text-[11px] text-tertiary font-mono">
            {prompt.category}
          </span>
        </div>

        <h3 className="mt-3.5 text-base font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
          {prompt.title}
        </h3>

        <p className="mt-1.5 text-xs text-secondary line-clamp-2">
          {prompt.description}
        </p>

        {/* Syntax Window */}
        <div className="mt-4 rounded-xl border border-border-subtle bg-surface-elevated p-3 font-mono text-xs text-secondary line-clamp-3 leading-relaxed">
          {prompt.promptText}
        </div>

        {/* Variables list */}
        {prompt.variables && prompt.variables.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-tertiary font-mono">Params:</span>
            {prompt.variables.map((v, i) => (
              <span
                key={i}
                className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-mono text-accent"
              >
                [{v.key || v.label}]
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs">
        <span className="text-tertiary text-[11px]">
          {prompt.variables.length} parameters
        </span>
        <span className="font-medium text-accent group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1">
          Customize Recipe →
        </span>
      </div>
    </Link>
  );
}

/**
 * 3. EditorialCard - For Creator Journal & Articles
 */
export function EditorialCard({ post }: { post: BlogPost }) {
  return (
    <article className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition-all duration-200">
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-secondary">
          <span className="text-[11px] font-medium tracking-wider uppercase text-secondary">{post.category}</span>
          <span className="text-tertiary text-[11px]">{post.readingTime}</span>
        </div>

        <h3 className="mt-3.5 text-lg font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-secondary line-clamp-3 font-normal">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center font-mono text-[9px] font-semibold text-accent">
            {post.author.name[0]}
          </div>
          <span className="text-secondary text-xs">{post.author.name}</span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="font-medium text-accent group-hover:opacity-80 inline-flex items-center gap-1"
        >
          Read essay →
        </Link>
      </div>
    </article>
  );
}

/**
 * 4. VideoCard - Masterclass 16:9 Thumbnail Card
 */
export function VideoCard({ video }: { video: VideoItem }) {
  return (
    <article className="group surface surface-hover flex flex-col justify-between overflow-hidden block transition-all duration-200">
      <div>
        {/* 16:9 Thumbnail Area */}
        <div className="relative aspect-video w-full bg-surface-elevated border-b border-border-subtle flex items-center justify-center overflow-hidden">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="text-tertiary font-mono text-xs">VIDEO PREVIEW</div>
          )}
          {/* Duration Badge */}
          <span className="absolute bottom-2.5 right-2.5 rounded bg-black/75 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] font-medium text-white">
            {video.duration}
          </span>
          {/* Platform Badge */}
          <span className="absolute top-2.5 left-2.5 rounded bg-black/75 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] font-medium text-white uppercase">
            {video.platform}
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-xs font-mono text-secondary">
            <span className="text-[11px] font-medium tracking-wider uppercase text-secondary">{video.category}</span>
            <span className="text-tertiary text-[11px]">{video.publishedAt}</span>
          </div>

          <h3 className="mt-3 text-base font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
            <Link href={`/videos/${video.slug}`}>{video.title}</Link>
          </h3>

          <p className="mt-1.5 text-xs leading-relaxed text-secondary line-clamp-2 font-normal">
            {video.description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-border-subtle flex items-center justify-between text-xs">
        <span className="text-secondary truncate max-w-[140px] text-xs">
          by {video.creator.name}
        </span>
        <Link
          href={`/videos/${video.slug}`}
          className="font-medium text-accent hover:opacity-80"
        >
          Watch breakdown →
        </Link>
      </div>
    </article>
  );
}

/**
 * 5. ComparisonCard - Head-to-Head Comparison Card
 */
export function ComparisonCard({ comparison }: { comparison: ToolComparison }) {
  const toolA = getToolById(comparison.toolAId);
  const toolB = getToolById(comparison.toolBId);
  const nameA = toolA?.name || "Tool A";
  const nameB = toolB?.name || "Tool B";

  return (
    <Link
      href={`/compare/${comparison.slug}`}
      className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
            {comparison.category}
          </span>
          <span className="font-mono text-[10px] text-tertiary">
            Audited {comparison.updatedAt}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="rounded-xl border border-border bg-surface-elevated p-3 flex-1 text-center font-semibold text-primary text-sm">
            {nameA}
          </div>
          <span className="text-xs text-tertiary font-medium">VS</span>
          <div className="rounded-xl border border-border bg-surface-elevated p-3 flex-1 text-center font-semibold text-primary text-sm">
            {nameB}
          </div>
        </div>

        {/* Verdict snippet */}
        <div className="mt-4 rounded-xl border border-border-subtle bg-surface-elevated p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-tertiary mb-1">
            Editorial Verdict
          </p>
          <p className="text-xs text-secondary line-clamp-3 leading-relaxed">
            {comparison.summaryVerdict}
          </p>
        </div>

        {/* Quick Scores preview */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-mono">
          <div className="rounded-lg border border-border-subtle bg-surface-elevated py-1.5 px-2">
            <span className="text-[10px] text-tertiary block">Quality</span>
            <span className="text-primary font-semibold text-xs">{comparison.scores.quality.toolA} vs {comparison.scores.quality.toolB}</span>
          </div>
          <div className="rounded-lg border border-border-subtle bg-surface-elevated py-1.5 px-2">
            <span className="text-[10px] text-tertiary block">Speed</span>
            <span className="text-primary font-semibold text-xs">{comparison.scores.speed.toolA} vs {comparison.scores.speed.toolB}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs">
        <span className="text-tertiary text-[11px]">
          {comparison.featureMatrix.length} checkpoints
        </span>
        <span className="font-medium text-accent group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1">
          Full Verdict →
        </span>
      </div>
    </Link>
  );
}

/**
 * 6. WorkflowCard - Pipeline Blueprint Card
 */
export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <Link
      href={`/workflows/${workflow.slug}`}
      className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
            {workflow.category} Pipeline
          </span>
          <span className="text-[11px] text-tertiary font-mono">
            ⏱ {workflow.estimatedTime}
          </span>
        </div>

        <h3 className="mt-3.5 text-lg font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
          {workflow.title}
        </h3>

        <p className="mt-1.5 text-xs sm:text-sm text-secondary line-clamp-2 leading-relaxed">
          {workflow.summary}
        </p>

        {/* Phase timeline preview */}
        <div className="mt-4 grid grid-cols-4 gap-1.5 pt-1">
          {workflow.steps.slice(0, 4).map((step) => (
            <div
              key={step.stepNumber}
              className="rounded-lg border border-border-subtle bg-surface-elevated p-2 text-center"
            >
              <span className="font-mono text-[10px] text-accent font-semibold block">
                0{step.stepNumber}
              </span>
              <span className="text-[10px] text-secondary line-clamp-1 block">
                {step.phaseName}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs">
        <span className="text-tertiary uppercase text-[11px]">
          {workflow.difficulty}
        </span>
        <span className="font-medium text-accent group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1">
          Inspect Pipeline →
        </span>
      </div>
    </Link>
  );
}
