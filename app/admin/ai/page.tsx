import React from "react";
import Link from "next/link";
import { queryNeon } from "@/lib/db/neon";
import { CINEMATIC_42_PROMPTS } from "@/data/cinematic-prompts";

export const dynamic = "force-dynamic";

export default async function AdminAiXRayPage() {
  let basicAiGenerationsSum = 0;
  let basicSubsWithAi = 0;
  let proSubsCount = 0;

  try {
    const res = await queryNeon<any>(`
      SELECT 
        COUNT(*) FILTER (WHERE tier = 'basic' AND status = 'active') as basic_subs,
        COUNT(*) FILTER (WHERE tier = 'pro' AND status = 'active') as pro_subs,
        COALESCE(SUM(CASE 
          WHEN tier = 'basic' AND paddle_custom_data->>'ai_generations_used' IS NOT NULL 
          THEN (paddle_custom_data->>'ai_generations_used')::integer 
          ELSE 0 
        END), 0) as total_basic_used
      FROM subscriptions;
    `);

    if (res && res.rows && res.rows.length > 0) {
      const row = res.rows[0];
      basicSubsWithAi = parseInt(row.basic_subs || "0", 10);
      proSubsCount = parseInt(row.pro_subs || "0", 10);
      basicAiGenerationsSum = parseInt(row.total_basic_used || "0", 10);
    }
  } catch (err: any) {
    console.warn("[Admin AI X-Ray Query Warning]:", err.message);
  }

  const recipeCount = CINEMATIC_42_PROMPTS.length;

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-amber-400 transition">Admin</Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200">AI Customizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>AI Customizer Backend X-Ray</span>
            <span className="text-xs px-2.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold">
              PHASE 1 FROZEN BASELINE
            </span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Internal telemetry, deterministic matcher weights, quota invariants, and engine syntax matrix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/prompts/ai"
            className="rounded border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition"
          >
            Launch Public AI Customizer ↗
          </Link>
        </div>
      </div>

      {/* Telemetry Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
          <p className="text-[11px] uppercase text-zinc-400 font-bold">Canonical Recipes</p>
          <p className="text-3xl font-bold text-white">{recipeCount}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Loaded dynamically from promptsData</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
          <p className="text-[11px] uppercase text-zinc-400 font-bold">Basic Generations Used</p>
          <p className="text-3xl font-bold text-amber-400">{basicAiGenerationsSum}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Sum across {basicSubsWithAi} active Basic subscribers</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-1">
          <p className="text-[11px] uppercase text-zinc-400 font-bold">Pro Subscribers (Unlimited)</p>
          <p className="text-3xl font-bold text-emerald-400">{proSubsCount}</p>
          <p className="text-[10px] text-zinc-500 font-mono">Direct DB verified entitlement</p>
        </div>
      </div>

      {/* Deterministic Matcher Weights Section */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-sm font-bold uppercase text-white tracking-wider">
              1. Deterministic Matcher Scoring Algorithm
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Multi-token fuzzy matching against canonical recipes. Verified 100% canonical weighting distribution.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
            TOTAL = 100%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold">Weight 1</span>
            <p className="text-white font-bold text-xs">Subject / Character</p>
            <p className="text-amber-400 text-xl font-bold">30%</p>
            <p className="text-[10px] text-zinc-500">Vehicles, characters, main focus</p>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold">Weight 2</span>
            <p className="text-white font-bold text-xs">Environment / Light</p>
            <p className="text-amber-400 text-xl font-bold">25%</p>
            <p className="text-[10px] text-zinc-500">Weather, time of day, atmosphere</p>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold">Weight 3</span>
            <p className="text-white font-bold text-xs">Action / Movement</p>
            <p className="text-amber-400 text-xl font-bold">20%</p>
            <p className="text-[10px] text-zinc-500">Camera motion, speed, dynamics</p>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold">Weight 4</span>
            <p className="text-white font-bold text-xs">Genre / Mood Tags</p>
            <p className="text-amber-400 text-xl font-bold">15%</p>
            <p className="text-[10px] text-zinc-500">Cinematic tone, palette, styling</p>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold">Weight 5</span>
            <p className="text-white font-bold text-xs">Category / Use Case</p>
            <p className="text-amber-400 text-xl font-bold">10%</p>
            <p className="text-[10px] text-zinc-500">Shot intent &amp; framing style</p>
          </div>
        </div>
      </section>

      {/* Tier Quota & Security Invariants */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-sm font-bold uppercase text-white tracking-wider">
            2. Tier Security &amp; Quota Invariants
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Production enforcement rules strictly validated across unit and security test suites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-zinc-300">FREE TIER</span>
              <span className="text-emerald-400 text-[10px] font-bold">1 / DAY</span>
            </div>
            <ul className="space-y-2 text-zinc-400 text-[11px] list-disc list-inside">
              <li>Tracked via signed HMAC cookie <code className="text-zinc-300 font-mono">ci_ai_preview_tracker</code></li>
              <li>Request 1: Watermarked 15-word preview with redacted engine parameters</li>
              <li>Request 2+: Strict HTTP 429 paywall response</li>
              <li>Negative prompts &amp; dialer flags 100% blocked from Free users</li>
            </ul>
          </div>

          <div className="p-5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400">DIRECTOR BASIC</span>
              <span className="text-emerald-400 text-[10px] font-bold">25 / PERIOD</span>
            </div>
            <ul className="space-y-2 text-zinc-400 text-[11px] list-disc list-inside">
              <li>Tracked per <code className="text-zinc-300 font-mono">current_period_start</code> (subscription billing cycle)</li>
              <li>Atomic Postgres update preserving all existing <code className="text-zinc-300 font-mono">paddle_custom_data</code> keys</li>
              <li>Concurrency-safe: simultaneous requests at 24/25 cannot exceed quota</li>
              <li>Separate from Vault prompt unlocks (does NOT consume 25 unlocks)</li>
            </ul>
          </div>

          <div className="p-5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400">STUDIO PRO</span>
              <span className="text-emerald-400 text-[10px] font-bold">UNLIMITED</span>
            </div>
            <ul className="space-y-2 text-zinc-400 text-[11px] list-disc list-inside">
              <li>Direct DB verification of active subscription status</li>
              <li>Stale JWT/session tokens alone cannot grant Pro access</li>
              <li>Full compiler access across all 5 engines + aspect ratios</li>
              <li>Instant fail-closed protection if DB becomes unreachable</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Compiler Dialect Matrix */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-sm font-bold uppercase text-white tracking-wider">
            3. AI Engine Compiler Dialect Matrix
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Engine-specific prompt syntax and parameter formatting rules in lib/ai/engine-configs.ts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-2">
            <p className="text-white font-bold">Midjourney v6.1</p>
            <p className="text-zinc-400 text-[11px]">Flag based syntax:</p>
            <code className="text-[10px] text-amber-400 block bg-zinc-950 p-2 rounded border border-zinc-800 font-mono">
              --ar 16:9 --style raw --v 6.1
            </code>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-2">
            <p className="text-white font-bold">Kling 1.5</p>
            <p className="text-zinc-400 text-[11px]">Direct camera motions:</p>
            <code className="text-[10px] text-amber-400 block bg-zinc-950 p-2 rounded border border-zinc-800 font-mono">
              [Camera: Orbit Right, 4K Master]
            </code>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-2">
            <p className="text-white font-bold">Runway Gen-3</p>
            <p className="text-zinc-400 text-[11px]">Structural descriptors:</p>
            <code className="text-[10px] text-amber-400 block bg-zinc-950 p-2 rounded border border-zinc-800 font-mono">
              FPV drone shot, anamorphic lens
            </code>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-2">
            <p className="text-white font-bold">Google Veo 2</p>
            <p className="text-zinc-400 text-[11px]">Cinematic camera tags:</p>
            <code className="text-[10px] text-amber-400 block bg-zinc-950 p-2 rounded border border-zinc-800 font-mono">
              Cinematic slow dolly, Arri Alexa
            </code>
          </div>

          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-lg space-y-2">
            <p className="text-white font-bold">Flux 1.1 Pro</p>
            <p className="text-zinc-400 text-[11px]">Natural photorealism:</p>
            <code className="text-[10px] text-amber-400 block bg-zinc-950 p-2 rounded border border-zinc-800 font-mono">
              35mm photography, subtle grain
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}
