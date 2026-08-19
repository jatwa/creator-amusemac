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
  index = 0,
}: {
  tool: Tool;
  index?: number;
}) {
  const isVideo = tool.category === "video";

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition duration-200"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="eyebrow text-[10px]">
              {tool.category}
            </span>
            {isVideo && (
              <span className="rounded bg-lime/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-lime uppercase">
                Video AI
              </span>
            )}
          </div>
          <span className="rounded-full border border-line bg-ink px-2.5 py-0.5 font-mono text-[10px] text-zinc-400">
            {tool.pricing.model}
          </span>
        </div>

        <div className="mt-4 flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-ink-elevated font-mono text-base font-bold text-lime shadow-inner">
            {tool.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-lime transition leading-snug">
              {tool.name}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-1">{tool.tagline}</p>
          </div>
        </div>

        <p className="mt-3.5 text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-2">
          {tool.description}
        </p>

        {tool.keyFeatures && tool.keyFeatures.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tool.keyFeatures.slice(0, 3).map((feat, i) => (
              <span
                key={i}
                className="rounded-md border border-line bg-ink/50 px-2 py-0.5 text-[10px] text-zinc-400 font-mono"
              >
                {feat}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-line/60 pt-3.5 flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-500 text-[11px]">
          {tool.pricing.startingPrice || "Free tier"}
        </span>
        <span className="font-semibold text-lime group-hover:translate-x-1 transition duration-150 inline-flex items-center gap-1">
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
      className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition duration-200"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow text-[10px]">
            {prompt.useCase}
          </span>
          <span className="rounded-full border border-line bg-ink px-2.5 py-0.5 font-mono text-[10px] text-zinc-400">
            {prompt.category}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-white group-hover:text-lime transition leading-snug">
          {prompt.title}
        </h3>

        <p className="mt-2 text-xs text-zinc-400 line-clamp-2">
          {prompt.description}
        </p>

        {/* Syntax Window */}
        <div className="mt-4 rounded-xl border border-zinc-800 bg-ink/90 p-3.5 font-mono text-xs text-zinc-300 line-clamp-3 leading-relaxed shadow-inner">
          {prompt.promptText}
        </div>

        {/* Variables pill list */}
        {prompt.variables && prompt.variables.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-zinc-500 font-mono">Variables:</span>
            {prompt.variables.map((v, i) => (
              <span
                key={i}
                className="rounded bg-lime/10 px-1.5 py-0.5 text-[10px] font-mono text-lime border border-lime/20"
              >
                [{v.key || v.label}]
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-line/60 pt-3.5 flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-500 text-[11px]">
          {prompt.variables.length} parameters
        </span>
        <span className="font-semibold text-lime group-hover:translate-x-1 transition duration-150 inline-flex items-center gap-1">
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
    <article className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition duration-200">
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="eyebrow text-[10px]">{post.category}</span>
          <span className="text-zinc-500 text-[11px]">{post.readingTime}</span>
        </div>

        <h3 className="mt-4 text-xl font-bold text-white group-hover:text-lime transition leading-snug">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-3">
          {post.excerpt}
        </p>
      </div>

      <div className="mt-6 border-t border-line/60 pt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-lime/20 border border-lime/40 flex items-center justify-center font-mono text-[10px] font-bold text-lime">
            {post.author.name[0]}
          </div>
          <span className="text-zinc-400 text-xs font-medium">{post.author.name}</span>
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="font-mono text-xs font-semibold text-lime group-hover:underline inline-flex items-center gap-1"
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
    <article className="group surface surface-hover flex flex-col justify-between overflow-hidden block transition duration-200">
      <div>
        {/* 16:9 Thumbnail Area */}
        <div className="relative aspect-video w-full bg-ink border-b border-line flex items-center justify-center overflow-hidden">
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="text-zinc-600 font-mono text-xs">VIDEO PREVIEW</div>
          )}
          {/* Duration Badge */}
          <span className="absolute bottom-2.5 right-2.5 rounded bg-black/80 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] font-bold text-white border border-white/10">
            {video.duration}
          </span>
          {/* Platform Badge */}
          <span className="absolute top-2.5 left-2.5 rounded bg-black/80 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] font-bold text-lime uppercase border border-lime/20">
            {video.platform}
          </span>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="eyebrow text-[10px]">{video.category}</span>
            <span className="text-zinc-500 text-[11px]">{video.publishedAt}</span>
          </div>

          <h3 className="mt-3 text-lg font-bold text-white group-hover:text-lime transition leading-snug">
            <Link href={`/videos/${video.slug}`}>{video.title}</Link>
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
            {video.description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-line/60 flex items-center justify-between text-xs">
        <span className="text-zinc-400 truncate max-w-[140px] text-xs">
          by {video.creator.name}
        </span>
        <Link
          href={`/videos/${video.slug}`}
          className="font-mono text-xs font-bold text-lime hover:underline"
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
      className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition duration-200"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="eyebrow text-[10px] bg-lime/10 px-2 py-0.5 rounded border border-lime/30">
            {comparison.category}
          </span>
          <span className="font-mono text-[10px] text-zinc-500">
            Audited {comparison.updatedAt}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="rounded-xl border border-line bg-ink p-3 flex-1 text-center font-bold text-white text-sm">
            {nameA}
          </div>
          <span className="font-mono text-xs text-lime font-bold">VS</span>
          <div className="rounded-xl border border-line bg-ink p-3 flex-1 text-center font-bold text-white text-sm">
            {nameB}
          </div>
        </div>

        {/* Verdict snippet */}
        <div className="mt-4 rounded-xl border border-line/80 bg-ink/70 p-3.5">
          <p className="eyebrow text-[9px] text-zinc-400 mb-1">
            Editorial Verdict
          </p>
          <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed">
            {comparison.summaryVerdict}
          </p>
        </div>

        {/* Quick Scores preview */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-mono">
          <div className="rounded-lg border border-line bg-ink/50 py-1.5 px-2">
            <span className="text-[10px] text-zinc-500 block">Quality</span>
            <span className="text-lime font-bold text-xs">{comparison.scores.quality.toolA} vs {comparison.scores.quality.toolB}</span>
          </div>
          <div className="rounded-lg border border-line bg-ink/50 py-1.5 px-2">
            <span className="text-[10px] text-zinc-500 block">Speed</span>
            <span className="text-lime font-bold text-xs">{comparison.scores.speed.toolA} vs {comparison.scores.speed.toolB}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-line/60 pt-3.5 flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-500 text-[11px]">
          {comparison.featureMatrix.length} spec checkpoints
        </span>
        <span className="font-semibold text-lime group-hover:translate-x-1 transition duration-150 inline-flex items-center gap-1">
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
      className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block transition duration-200"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="eyebrow text-[10px] bg-lime/10 px-2 py-0.5 rounded border border-lime/30">
            {workflow.category} Pipeline
          </span>
          <span className="rounded-full border border-line bg-ink px-2.5 py-0.5 font-mono text-[10px] text-zinc-400">
            ⏱ {workflow.estimatedTime}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold text-white group-hover:text-lime transition leading-snug">
          {workflow.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {workflow.summary}
        </p>

        {/* Phase timeline preview */}
        <div className="mt-4 grid grid-cols-4 gap-1.5 pt-2">
          {workflow.steps.slice(0, 4).map((step) => (
            <div
              key={step.stepNumber}
              className="rounded-lg border border-line bg-ink/70 p-2 text-center"
            >
              <span className="font-mono text-[10px] text-lime font-bold block">
                0{step.stepNumber}
              </span>
              <span className="text-[10px] text-zinc-300 line-clamp-1 block">
                {step.phaseName}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-line/60 pt-3.5 flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-500 uppercase text-[11px]">
          {workflow.difficulty}
        </span>
        <span className="font-semibold text-lime group-hover:translate-x-1 transition duration-150 inline-flex items-center gap-1">
          Inspect Pipeline →
        </span>
      </div>
    </Link>
  );
}
