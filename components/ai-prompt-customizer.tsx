"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ENGINE_CONFIGS, TargetEngine } from "@/lib/ai/engine-configs";
import { DirectorShotConfig } from "@/data/types";

const SUGGESTED_SHOTS = [
  "A luxury car driving through Mumbai during heavy rain at night with neon lights",
  "A lone detective in a trench coat walking through a foggy neo-noir alleyway at midnight",
  "Microscopic macro shot of an exposed titanium watch movement with oscillating gears",
  "Golden hour close-up of a weathered fisherman gazing at the ocean horizon",
];

export function AiPromptCustomizer() {
  const router = useRouter();

  // Inputs
  const [concept, setConcept] = useState("");
  const [selectedEngine, setSelectedEngine] = useState<TargetEngine>("runway");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>(undefined);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Response State
  const [result, setResult] = useState<{
    matchedRecipe: { id: string; slug: string; title: string; category: string; useCase: string };
    matchScore: number;
    matchPercentage: number;
    dimensionScores: { subject: number; environment: number; action: number; genreMood: number; category: number };
    explanation: string;
    topAlternatives: { id: string; slug: string; title: string; matchPercentage: number }[];
    directorShotConfig: DirectorShotConfig;
    directorSlip: string;
    engine: TargetEngine;
    isLocked: boolean;
    quotaRemaining: number | null;
    quotaLimit: number | null;
    promptPreview: string;
    promptFull: string | null;
    negativePrompt: string | null;
  } | null>(null);

  const handleSubmit = async (e?: React.FormEvent, overrideRecipeId?: string) => {
    if (e) e.preventDefault();
    const query = concept.trim();
    if (!query && !overrideRecipeId) {
      setErrorMsg("Please describe your shot idea to customize.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/customize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concept: query,
          engine: selectedEngine,
          recipeId: overrideRecipeId || selectedRecipeId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to process shot customization.");
      }

      setResult(data);
    } catch (err: any) {
      console.error("[Customizer Error]:", err);
      setErrorMsg(err.message || "An error occurred while building your prompt.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    } catch {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const handleHandoffToStudio = () => {
    if (!result || !result.directorShotConfig) return;

    // SECURITY: Store ONLY safe structured metadata in sessionStorage. NEVER full premium prompt text.
    const safeHandoffPayload: Partial<DirectorShotConfig> & { engine: TargetEngine } = {
      shotTitle: result.directorShotConfig.shotTitle,
      shotCategory: result.directorShotConfig.shotCategory,
      subject: result.directorShotConfig.subject,
      action: result.directorShotConfig.action,
      cameraRig: result.directorShotConfig.cameraRig,
      cameraMovement: result.directorShotConfig.cameraMovement,
      lens: result.directorShotConfig.lens,
      framing: result.directorShotConfig.framing,
      composition: result.directorShotConfig.composition,
      lighting: result.directorShotConfig.lighting,
      environment: result.directorShotConfig.environment,
      weather: result.directorShotConfig.weather,
      timeOfDay: result.directorShotConfig.timeOfDay,
      aspectRatio: result.directorShotConfig.aspectRatio,
      fps: result.directorShotConfig.fps,
      duration: result.directorShotConfig.duration,
      visualStyle: result.directorShotConfig.visualStyle,
      mood: result.directorShotConfig.mood,
      engine: result.engine,
    };

    try {
      sessionStorage.setItem(
        "creatorintel_studio_handoff",
        JSON.stringify(safeHandoffPayload)
      );
    } catch (err) {
      console.warn("[Studio Handoff Session Storage Error]:", err);
    }

    router.push("/prompts/factory?source=ai_customizer");
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Main Input Form */}
      <div className="surface rounded-3xl border border-border p-6 sm:p-10 shadow-subtle space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
            <span>⚡</span>
            <span>CINEMATIC INTEL LAYER</span>
          </span>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-primary font-serif">
            Describe Your Shot
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-secondary font-normal font-sans">
            Enter your natural language concept. Creator Intel deterministically matches your idea against verified canonical recipe blueprints and compiles model-specific diffusion syntax.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Natural Language Prompt Input */}
          <div className="space-y-2">
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="e.g. A luxury sports car accelerating through rain-soaked Mumbai streets at night with neon reflections and 35mm anamorphic flares..."
              rows={4}
              className="w-full rounded-2xl border border-border bg-surface-elevated p-4 text-sm sm:text-base text-primary placeholder:text-tertiary focus:border-accent/40 focus:outline-none transition resize-none font-sans leading-relaxed"
            />

            {/* Quick Inspiration Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-mono text-tertiary uppercase">Try an example:</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_SHOTS.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setConcept(s);
                      setSelectedRecipeId(undefined);
                    }}
                    className="rounded-full border border-border-subtle bg-surface px-3 py-1 text-[11px] text-secondary hover:text-primary hover:border-border-bright transition text-left"
                  >
                    &ldquo;{s.substring(0, 42)}...&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Engine Selector */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-tertiary block">
              Target Diffusion Model
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(ENGINE_CONFIGS) as TargetEngine[]).map((eng) => {
                const conf = ENGINE_CONFIGS[eng];
                const isSelected = selectedEngine === eng;
                return (
                  <button
                    key={eng}
                    type="button"
                    onClick={() => setSelectedEngine(eng)}
                    className={`rounded-xl border p-3 text-left transition flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? "border-accent bg-accent/10 shadow-sm"
                        : "border-border bg-surface hover:border-border-bright"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{conf.icon}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-elevated border border-border-subtle text-tertiary">
                        {conf.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary block truncate">
                        {conf.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
              {errorMsg}
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-tertiary">
              Deterministic Lexical Matcher &bull; Zero Hallucinations
            </span>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="rounded-full bg-foreground px-6 py-3 text-xs sm:text-sm font-semibold text-background hover:opacity-90 transition shadow-sm inline-flex items-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Matching & Compiling..." : "Build My Shot"}</span>
              <span>⚡</span>
            </motion.button>
          </div>
        </form>
      </div>

      {/* Result Output Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Matched Recipe Header */}
          <div className="surface rounded-2xl border border-border p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold block">
                  CANONICAL BLUEPRINT MATCH
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-primary mt-0.5 font-serif">
                  Matched to: {result.matchedRecipe.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent/15 border border-accent/30 px-3.5 py-1 text-xs font-mono font-bold text-accent">
                  Match Score: {result.matchPercentage}%
                </span>
              </div>
            </div>

            <p className="text-xs text-secondary font-sans leading-relaxed">
              {result.explanation}
            </p>

            {/* Alternative matches */}
            {result.topAlternatives && result.topAlternatives.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border-subtle">
                <span className="text-[11px] font-mono text-tertiary">Alternative matches:</span>
                {result.topAlternatives.map((alt) => (
                  <button
                    key={alt.id}
                    onClick={() => handleSubmit(undefined, alt.id)}
                    className="rounded-full border border-border-subtle bg-surface px-3 py-1 text-xs text-secondary hover:text-primary hover:border-border-bright transition"
                  >
                    {alt.title} ({alt.matchPercentage}%)
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Layer 1: Director's Recipe Slip */}
          <div className="surface rounded-2xl border border-border p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-secondary font-semibold">
                Layer 01 &mdash; Director&apos;s Recipe Specification
              </span>
              <button
                onClick={() => handleCopy(result.directorSlip, "slip")}
                className="text-xs font-mono text-accent hover:underline"
              >
                {copiedType === "slip" ? "✓ Copied!" : "Copy Spec"}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs font-sans">
              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5 space-y-1">
                <span className="text-tertiary font-mono text-[10px] uppercase block">Subject &amp; Action</span>
                <p className="text-primary font-medium">{result.directorShotConfig.subject}</p>
                <p className="text-secondary text-[11px]">{result.directorShotConfig.action}</p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5 space-y-1">
                <span className="text-tertiary font-mono text-[10px] uppercase block">Camera Rig &amp; Optics</span>
                <p className="text-primary font-medium">{result.directorShotConfig.cameraRig}</p>
                <p className="text-secondary text-[11px]">{result.directorShotConfig.lens} ({result.directorShotConfig.framing})</p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5 space-y-1">
                <span className="text-tertiary font-mono text-[10px] uppercase block">Lighting &amp; Environment</span>
                <p className="text-primary font-medium">{result.directorShotConfig.lighting}</p>
                <p className="text-secondary text-[11px]">{result.directorShotConfig.environment} ({result.directorShotConfig.weather}, {result.directorShotConfig.timeOfDay})</p>
              </div>

              <div className="rounded-xl border border-border-subtle bg-surface-elevated p-3.5 space-y-1">
                <span className="text-tertiary font-mono text-[10px] uppercase block">Cinematic Cadence &amp; Format</span>
                <p className="text-primary font-medium">{result.directorShotConfig.aspectRatio} | {result.directorShotConfig.fps}</p>
                <p className="text-secondary text-[11px]">{result.directorShotConfig.visualStyle} &mdash; {result.directorShotConfig.mood}</p>
              </div>
            </div>
          </div>

          {/* Layer 2: Model-Ready Syntactic Prompt */}
          <div className="surface rounded-2xl border border-border p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                  Layer 02 &mdash; Model-Ready Syntactic Prompt
                </span>
                <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-mono text-accent">
                  {ENGINE_CONFIGS[result.engine]?.name}
                </span>
              </div>

              {!result.isLocked && result.promptFull && (
                <button
                  onClick={() => handleCopy(result.promptFull!, "prompt")}
                  className="text-xs font-mono text-accent hover:underline"
                >
                  {copiedType === "prompt" ? "✓ Copied Prompt!" : "Copy Prompt"}
                </button>
              )}
            </div>

            {/* UNLOCKED STATE */}
            {!result.isLocked && result.promptFull ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-border-subtle bg-surface-elevated p-4 font-mono text-xs sm:text-sm text-primary leading-relaxed select-all">
                  {result.promptFull}
                </div>

                {result.negativePrompt && (
                  <div className="rounded-xl border border-border-subtle bg-surface-elevated/60 p-3.5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-tertiary block">
                      Engine-Calibrated Negative Prompt:
                    </span>
                    <p className="font-mono text-xs text-secondary">{result.negativePrompt}</p>
                  </div>
                )}
              </div>
            ) : (
              /* LOCKED / PAYWALLED STATE */
              <div className="relative overflow-hidden rounded-2xl border border-border-subtle bg-surface-elevated p-6 space-y-4">
                <div className="space-y-2 select-none">
                  <p className="font-mono text-xs text-primary font-medium">{result.promptPreview}</p>
                  <p className="font-mono text-xs text-tertiary blur-[6px] opacity-40">
                    anamorphic 35mm lens flare optical halation volumetric blue hour neon lighting kodak 5219 grain --ar 2.39:1 --style raw --v 6.1
                  </p>
                </div>

                {/* Paywall Overlay Box */}
                <div className="rounded-xl border border-accent/30 bg-background/95 p-5 text-center space-y-3 shadow-lg">
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-accent/15 text-accent text-sm font-bold">
                    🔒
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-primary font-serif">
                      Unlock Full Model Prompt &amp; Negative Matrix
                    </h4>
                    <p className="mt-1 text-xs text-secondary max-w-md mx-auto">
                      Upgrade to Director Basic or Studio Pro to generate unlimited full diffusion prompt syntax with exact camera coordinates and calibrated artifact suppression.
                    </p>
                  </div>
                  <div className="pt-1">
                    <Link
                      href="/pricing"
                      className="rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background hover:opacity-90 transition shadow-sm inline-flex items-center gap-1.5"
                    >
                      <span>Unlock with Director&apos;s Vault</span>
                      <span>⚡</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Director's Studio Handoff Bridge */}
            <div className="border-t border-border-subtle pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-secondary">
                <span>Want to visually refine camera rigs, lenses, or lighting?</span>
              </div>
              <button
                type="button"
                onClick={handleHandoffToStudio}
                className="rounded-full bg-foreground px-5 py-2.5 text-xs sm:text-sm font-semibold text-background hover:opacity-90 transition shadow-sm inline-flex items-center justify-center gap-2"
              >
                <span>Open in Director&apos;s Studio</span>
                <span>🎥</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
