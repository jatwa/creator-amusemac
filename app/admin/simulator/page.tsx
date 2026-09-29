"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminSimulatorPage() {
  const [currentMode, setCurrentMode] = useState<string>("NONE");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mode = localStorage.getItem("ci_admin_preview_mode") || "NONE";
      setCurrentMode(mode);
    }
  }, []);

  const setSimulationMode = (mode: string) => {
    if (typeof window !== "undefined") {
      if (mode === "NONE") {
        localStorage.removeItem("ci_admin_preview_mode");
      } else {
        localStorage.setItem("ci_admin_preview_mode", mode);
      }
      setCurrentMode(mode);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          Subscription Preview Simulator (View as User)
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
          Simulate the complete user experience across tiers without modifying database records or triggering billing charges.
        </p>
      </div>

      {/* Current Active Mode */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-zinc-400 block font-semibold">CURRENT PREVIEW MODE:</span>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-1">
            {currentMode === "NONE" ? "REAL ADMIN SESSION (NO PREVIEW)" : `VIEWING AS ${currentMode}`}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {currentMode === "NONE"
              ? "Your real authenticated admin account and database subscriptions are active."
              : "Client UI components will simulate the selected tier. Zero database mutations occur."}
          </p>
        </div>

        {currentMode !== "NONE" && (
          <button
            type="button"
            onClick={() => setSimulationMode("NONE")}
            className="rounded border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition font-mono"
          >
            Reset to Real Account ✕
          </button>
        )}
      </div>

      {/* Simulator Mode Selection Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* FREE */}
        <div
          className={`bg-zinc-900 p-6 rounded-xl border flex flex-col justify-between space-y-4 transition ${
            currentMode === "FREE" ? "border-amber-400 bg-zinc-900" : "border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">FREE / STARTER</span>
              {currentMode === "FREE" && (
                <span className="rounded bg-amber-400/10 border border-amber-400/40 px-2 py-0.5 text-[10px] font-mono text-amber-300 font-bold">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Experience the public free tier: limited preview cards, prompt gating paywalls, and basic Director's Studio.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSimulationMode("FREE")}
            className={`w-full rounded py-2 text-xs font-bold transition font-mono ${
              currentMode === "FREE"
                ? "bg-amber-400 text-zinc-950"
                : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-500"
            }`}
          >
            {currentMode === "FREE" ? "Active Preview" : "View as Free"}
          </button>
        </div>

        {/* BASIC */}
        <div
          className={`bg-zinc-900 p-6 rounded-xl border flex flex-col justify-between space-y-4 transition ${
            currentMode === "BASIC" ? "border-emerald-400 bg-zinc-900" : "border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">DIRECTOR BASIC</span>
              {currentMode === "BASIC" && (
                <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400 font-bold">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Experience the ₹499/mo tier: 25 monthly recipe unlocks, customizer controls, and standard projects.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSimulationMode("BASIC")}
            className={`w-full rounded py-2 text-xs font-bold transition font-mono ${
              currentMode === "BASIC"
                ? "bg-emerald-400 text-zinc-950"
                : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-500"
            }`}
          >
            {currentMode === "BASIC" ? "Active Preview" : "View as Basic (25/mo)"}
          </button>
        </div>

        {/* PRO */}
        <div
          className={`bg-zinc-900 p-6 rounded-xl border flex flex-col justify-between space-y-4 transition ${
            currentMode === "PRO" ? "border-amber-400 bg-zinc-900" : "border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">STUDIO PRO</span>
              {currentMode === "PRO" && (
                <span className="rounded bg-amber-400/10 border border-amber-400/40 px-2 py-0.5 text-[10px] font-mono text-amber-300 font-bold">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Experience the ₹1,499/mo tier: unlimited unlocks (65+ recipes), calibrated negative matrices, and full Toolkit.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSimulationMode("PRO")}
            className={`w-full rounded py-2 text-xs font-bold transition font-mono ${
              currentMode === "PRO"
                ? "bg-amber-400 text-zinc-950 font-bold"
                : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-500"
            }`}
          >
            {currentMode === "PRO" ? "Active Preview" : "View as Studio Pro"}
          </button>
        </div>

        {/* LOGGED OUT */}
        <div
          className={`bg-zinc-900 p-6 rounded-xl border flex flex-col justify-between space-y-4 transition ${
            currentMode === "LOGGED_OUT" ? "border-zinc-400 bg-zinc-900" : "border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-base">LOGGED OUT VISITOR</span>
              {currentMode === "LOGGED_OUT" && (
                <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-300 font-bold border border-zinc-700">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Experience the first-time landing flow: Google OAuth sign-in gates, preview modals, and conversion prompts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSimulationMode("LOGGED_OUT")}
            className={`w-full rounded py-2 text-xs font-bold transition font-mono ${
              currentMode === "LOGGED_OUT"
                ? "bg-zinc-200 text-zinc-950"
                : "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-500"
            }`}
          >
            {currentMode === "LOGGED_OUT" ? "Active Preview" : "View as Logged Out"}
          </button>
        </div>
      </div>

      {/* Direct Navigation Links */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">Test Key Conversion Pages in Active Mode</h2>
        <div className="grid gap-3 sm:grid-cols-3 text-xs font-mono">
          <Link
            href="/prompts"
            className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 hover:border-amber-400/50 transition block"
          >
            <span className="font-bold text-white block">/prompts</span>
            <span className="text-zinc-400 text-[11px]">Vault &amp; Prompt Catalog</span>
          </Link>
          <Link
            href="/prompts/factory"
            className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 hover:border-amber-400/50 transition block"
          >
            <span className="font-bold text-white block">/prompts/factory</span>
            <span className="text-zinc-400 text-[11px]">Director's Studio Workstation</span>
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 hover:border-amber-400/50 transition block"
          >
            <span className="font-bold text-white block">/pricing</span>
            <span className="text-zinc-400 text-[11px]">Pricing &amp; Plan Matrix</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
