"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Tool,
  Prompt,
  ToolComparison,
  VideoItem,
  BlogPost,
  Workflow,
} from "@/data/types";
import { getToolById } from "@/data/content";

const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

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
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={springTransition}
      className="h-full"
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block h-full transition-colors"
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase text-secondary font-sans">
                {tool.category}
              </span>
              {isVideo && (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 font-sans text-xs font-semibold text-accent">
                  Video Hub
                </span>
              )}
            </div>
            <span className="text-xs text-tertiary font-sans">
              {tool.pricing.model}
            </span>
          </div>

          <div className="mt-4 flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-elevated font-mono text-sm font-bold text-primary">
              {tool.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug font-sans">
                {tool.name}
              </h3>
              <p className="text-xs sm:text-[13px] text-tertiary line-clamp-1 mt-0.5 font-sans">{tool.tagline}</p>
            </div>
          </div>

          <p className="mt-3.5 text-sm sm:text-[15px] leading-relaxed text-secondary line-clamp-2 font-normal font-sans">
            {tool.description}
          </p>

          {tool.keyFeatures && tool.keyFeatures.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tool.keyFeatures.slice(0, 3).map((feat, i) => (
                <span
                  key={i}
                  className="rounded-md border border-border-subtle bg-surface-elevated px-2.5 py-1 text-xs text-secondary font-sans font-medium"
                >
                  {feat}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-tertiary text-xs font-medium font-sans">
            {tool.pricing.startingPrice || "Free tier"}
          </span>
          <span className="font-semibold text-accent group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1 font-sans">
            Dossier →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * 2. PromptCard - Visual Studio Recipe Card with Paywall Protection
 */
export function PromptCard({ prompt }: { prompt: Prompt }) {
  // Truncated preview text (first line / 15-20 words)
  const previewText = prompt.promptText.split("\n")[0] || prompt.promptText;
  const truncatedPreview = previewText.length > 90 ? previewText.slice(0, 90) + "..." : previewText;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={springTransition}
      className="h-full"
    >
      <Link
        href={`/prompts/${prompt.slug}`}
        className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block h-full transition-colors"
      >
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-accent font-sans">
              {prompt.subcategory || prompt.categoryGroup || prompt.useCase}
            </span>
            <span className="rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-xs text-accent font-sans font-medium flex items-center gap-1">
              <span>🔒</span>
              <span>Vault Recipe</span>
            </span>
          </div>

          <h3 className="mt-3.5 text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug font-sans">
            {prompt.title}
          </h3>

          <p className="mt-1.5 text-sm leading-relaxed text-secondary line-clamp-2 font-sans">
            {prompt.whatItCreates || prompt.description}
          </p>

          {/* Director Quick Specs */}
          {(prompt.lens || prompt.camera || prompt.aspectRatio) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-sans text-secondary">
              {prompt.lens && (
                <span className="rounded-md border border-border bg-surface-elevated px-2 py-0.5 font-mono text-[11px]">
                  🔍 {prompt.lens.split(" ")[0]} {prompt.lens.split(" ")[1] || ""}
                </span>
              )}
              {prompt.aspectRatio && (
                <span className="rounded-md border border-border bg-surface-elevated px-2 py-0.5 font-mono text-[11px]">
                  📐 {prompt.aspectRatio.split(" ")[0]}
                </span>
              )}
              {prompt.recommendedDuration && (
                <span className="rounded-md border border-border bg-surface-elevated px-2 py-0.5 font-mono text-[11px]">
                  ⏱ {prompt.recommendedDuration}
                </span>
              )}
            </div>
          )}

          {/* Protected Syntax Window */}
          <div className="relative mt-3.5 rounded-xl border border-border-subtle bg-surface-elevated p-3 font-mono text-xs text-secondary overflow-hidden">
            <p className="text-primary font-medium">{truncatedPreview}</p>
            <p className="mt-1 text-tertiary blur-[5px] select-none filter opacity-40">
              anamorphic lens bokeh ARRI Alexa 35mm optical flare volumetric haze kodachrome
            </p>
            <div className="absolute inset-0 flex items-center justify-end pr-3 bg-gradient-to-l from-surface-elevated via-surface-elevated/80 to-transparent">
              <span className="rounded-md bg-accent/10 border border-accent/30 px-2 py-0.5 text-[10px] font-mono text-accent font-bold">
                PRO VAULT SPEC
              </span>
            </div>
          </div>

          {/* Variables list */}
          {prompt.variables && prompt.variables.length > 0 && (
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-tertiary font-sans">Params:</span>
              {prompt.variables.slice(0, 3).map((v, i) => (
                <span
                  key={i}
                  className="rounded bg-accent/10 px-1.5 py-0.5 text-xs font-mono text-accent"
                >
                  [{v.key || v.label}]
                </span>
              ))}
              {prompt.variables.length > 3 && (
                <span className="text-xs text-tertiary font-sans font-mono">
                  +{prompt.variables.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs sm:text-sm">
          <span className="text-tertiary text-xs font-sans">
            {prompt.variables.length} parameters
          </span>
          <span className="font-semibold text-accent group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1 font-sans">
            Unlock in Vault →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * 3. EditorialCard - For Creator Journal & Articles
 */
export function EditorialCard({ post }: { post: BlogPost }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={springTransition}
      className="h-full"
    >
      <article className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block h-full transition-colors">
        <div>
          <div className="flex items-center justify-between text-xs font-sans text-secondary">
            <span className="text-xs font-semibold tracking-wider uppercase text-secondary font-sans">{post.category}</span>
            <span className="text-tertiary text-xs font-sans">{post.readingTime}</span>
          </div>

          <h3 className="mt-3.5 text-xl font-serif font-bold text-primary group-hover:text-accent transition-colors leading-snug">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-secondary line-clamp-3 font-normal font-sans">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs sm:text-sm font-sans">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center font-mono text-xs font-bold text-accent">
              {post.author.name[0]}
            </div>
            <span className="text-secondary text-xs sm:text-sm font-medium">{post.author.name}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="font-semibold text-accent group-hover:opacity-80 inline-flex items-center gap-1"
          >
            Read essay →
          </Link>
        </div>
      </article>
    </motion.div>
  );
}

/**
 * 4. VideoCard - Masterclass 16:9 Thumbnail Card
 */
export function VideoCard({ video }: { video: VideoItem }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={springTransition}
      className="h-full"
    >
      <article className="group surface surface-hover flex flex-col justify-between overflow-hidden block h-full transition-colors">
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
              <div className="text-tertiary font-sans text-xs">VIDEO PREVIEW</div>
            )}
            {/* Duration Badge */}
            <span className="absolute bottom-2.5 right-2.5 rounded bg-black/75 backdrop-blur-md px-2 py-0.5 font-mono text-xs font-medium text-white">
              {video.duration}
            </span>
            {/* Platform Badge */}
            <span className="absolute top-2.5 left-2.5 rounded bg-black/75 backdrop-blur-md px-2 py-0.5 font-sans text-xs font-medium text-white uppercase">
              {video.platform}
            </span>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between text-xs font-sans text-secondary">
              <span className="text-xs font-semibold tracking-wider uppercase text-secondary font-sans">{video.category}</span>
              <span className="text-tertiary text-xs font-sans">{video.publishedAt}</span>
            </div>

            <h3 className="mt-3 text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug font-sans">
              <Link href={`/videos/${video.slug}`}>{video.title}</Link>
            </h3>

            <p className="mt-1.5 text-sm leading-relaxed text-secondary line-clamp-2 font-normal font-sans">
              {video.description}
            </p>
          </div>
        </div>

        <div className="p-6 pt-0 border-t border-border-subtle flex items-center justify-between text-xs sm:text-sm font-sans">
          <span className="text-secondary truncate max-w-[140px] text-xs sm:text-sm">
            by {video.creator.name}
          </span>
          <Link
            href={`/videos/${video.slug}`}
            className="font-semibold text-accent hover:opacity-80"
          >
            Watch breakdown →
          </Link>
        </div>
      </article>
    </motion.div>
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
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={springTransition}
      className="h-full"
    >
      <Link
        href={`/compare/${comparison.slug}`}
        className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block h-full transition-colors"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent font-sans">
              {comparison.category}
            </span>
            <span className="font-sans text-xs text-tertiary">
              Audited {comparison.updatedAt}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="rounded-xl border border-border bg-surface-elevated p-3 flex-1 text-center font-bold text-primary text-sm sm:text-base font-sans">
              {nameA}
            </div>
            <span className="text-xs text-tertiary font-bold font-sans">VS</span>
            <div className="rounded-xl border border-border bg-surface-elevated p-3 flex-1 text-center font-bold text-primary text-sm sm:text-base font-sans">
              {nameB}
            </div>
          </div>

          {/* Verdict snippet */}
          <div className="mt-4 rounded-xl border border-border-subtle bg-surface-elevated p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-1 font-sans">
              Editorial Verdict
            </p>
            <p className="text-sm text-secondary line-clamp-3 leading-relaxed font-sans">
              {comparison.summaryVerdict}
            </p>
          </div>

          {/* Quick Scores preview */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs font-sans">
            <div className="rounded-lg border border-border-subtle bg-surface-elevated py-2 px-2">
              <span className="text-xs text-tertiary block font-medium">Quality</span>
              <span className="text-primary font-bold text-xs sm:text-sm">{comparison.scores.quality.toolA} vs {comparison.scores.quality.toolB}</span>
            </div>
            <div className="rounded-lg border border-border-subtle bg-surface-elevated py-2 px-2">
              <span className="text-xs text-tertiary block font-medium">Speed</span>
              <span className="text-primary font-bold text-xs sm:text-sm">{comparison.scores.speed.toolA} vs {comparison.scores.speed.toolB}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs sm:text-sm font-sans">
          <span className="text-tertiary text-xs">
            {comparison.featureMatrix.length} checkpoints
          </span>
          <span className="font-semibold text-accent group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1">
            Full Verdict →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * 6. WorkflowCard - Pipeline Blueprint Card
 */
export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={springTransition}
      className="h-full"
    >
      <Link
        href={`/workflows/${workflow.slug}`}
        className="group surface surface-hover flex flex-col justify-between p-6 sm:p-7 block h-full transition-colors"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent font-sans">
              {workflow.category} Pipeline
            </span>
            <span className="text-xs text-tertiary font-sans">
              ⏱ {workflow.estimatedTime}
            </span>
          </div>

          <h3 className="mt-3.5 text-lg font-bold text-primary group-hover:text-accent transition-colors leading-snug font-sans">
            {workflow.title}
          </h3>

          <p className="mt-1.5 text-sm sm:text-[15px] text-secondary line-clamp-2 leading-relaxed font-sans">
            {workflow.summary}
          </p>

          {/* Phase timeline preview */}
          <div className="mt-4 grid grid-cols-4 gap-1.5 pt-1">
            {workflow.steps.slice(0, 4).map((step) => (
              <div
                key={step.stepNumber}
                className="rounded-lg border border-border-subtle bg-surface-elevated p-2 text-center"
              >
                <span className="font-mono text-xs text-accent font-bold block">
                  0{step.stepNumber}
                </span>
                <span className="text-xs text-secondary line-clamp-1 block font-sans font-medium mt-0.5">
                  {step.phaseName}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 border-t border-border-subtle pt-3.5 flex items-center justify-between text-xs sm:text-sm font-sans">
          <span className="text-tertiary uppercase text-xs font-medium">
            {workflow.difficulty}
          </span>
          <span className="font-semibold text-accent group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1">
            Inspect Pipeline →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
