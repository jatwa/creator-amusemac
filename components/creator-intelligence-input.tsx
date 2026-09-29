"use client";

import React, { useState, useRef } from "react";
import {
  getPlanLimits,
  isLocalTextExtractable,
  isExtractionPending,
  estimateWordCount,
  validateSourcePayload,
} from "@/lib/creator-intelligence-limits";
import {
  StagedSourcePayload,
  SAMPLE_CINEMATIC_SCENARIOS,
} from "@/lib/creator-intelligence-actions";
import { SubscriptionTier } from "@/lib/db/subscription-repo";

interface CreatorIntelligenceInputProps {
  userTier?: SubscriptionTier;
  onSourceStaged: (payload: StagedSourcePayload) => void;
  stagedPayload?: StagedSourcePayload | null;
}

export function CreatorIntelligenceInput({
  userTier = "free",
  onSourceStaged,
  stagedPayload,
}: CreatorIntelligenceInputProps) {
  const [tab, setTab] = useState<"file" | "paste" | "samples">("file");
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  // Paste state
  const [pastedTitle, setPastedTitle] = useState("");
  const [pastedText, setPastedText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const limits = getPlanLimits(userTier);

  // Process File
  const handleFile = (file: File) => {
    setFileError(null);
    const ext = file.name.includes(".")
      ? "." + file.name.split(".").pop()?.toLowerCase()
      : ".txt";

    // Validate size
    const validation = validateSourcePayload(file.size, null, ext, userTier);
    if (!validation.valid) {
      setFileError(validation.errors[0]);
      return;
    }

    if (isLocalTextExtractable(ext)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || "";
        const charCount = text.length;
        const wordCount = estimateWordCount(text);

        // Check char limit
        const charValidation = validateSourcePayload(file.size, charCount, ext, userTier);
        if (!charValidation.valid) {
          setFileError(charValidation.errors[0]);
          return;
        }

        const payload: StagedSourcePayload = {
          id: "src_" + Date.now(),
          sourceName: file.name,
          sourceType: "file_upload",
          fileName: file.name,
          fileExtension: ext,
          sizeBytes: file.size,
          rawText: text,
          characterCount: charCount,
          wordCount: wordCount,
          pageCount: null, // Deterministic: page counts not invented for raw txt
          textAvailable: true,
          extractionStatus: "ready",
          userTier,
          selectedModules: ["story_analysis", "visual_bible", "shot_breakdown"],
          executionMode: "semi_automatic",
          stagedAt: new Date().toISOString(),
        };

        onSourceStaged(payload);
      };
      reader.onerror = () => {
        setFileError("Error reading text file. Please ensure it is encoded in UTF-8.");
      };
      reader.readAsText(file);
    } else if (isExtractionPending(ext)) {
      // PDF or DOCX - Staged without fabricated extracted text
      const payload: StagedSourcePayload = {
        id: "src_" + Date.now(),
        sourceName: file.name,
        sourceType: "file_upload",
        fileName: file.name,
        fileExtension: ext,
        sizeBytes: file.size,
        rawText: null,
        characterCount: null,
        wordCount: null,
        pageCount: null, // Real policy: never fake page count
        textAvailable: false,
        extractionStatus: "pending",
        userTier,
        selectedModules: ["story_analysis", "screenplay_breakdown", "shot_breakdown"],
        executionMode: "semi_automatic",
        stagedAt: new Date().toISOString(),
      };

      onSourceStaged(payload);
    } else {
      setFileError(`Unsupported format "${ext}". Supported: ${limits.supportedFormats.join(", ")}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFileError(null);
    if (!pastedText.trim()) {
      setFileError("Please enter screenplay, scene treatment, or treatment notes.");
      return;
    }

    const title = pastedTitle.trim() || "Untitled Cinema Treatment";
    const charCount = pastedText.length;
    const wordCount = estimateWordCount(pastedText);

    const validation = validateSourcePayload(charCount, charCount, ".txt", userTier);
    if (!validation.valid) {
      setFileError(validation.errors[0]);
      return;
    }

    const payload: StagedSourcePayload = {
      id: "src_" + Date.now(),
      sourceName: title,
      sourceType: "direct_text",
      fileName: `${title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`,
      fileExtension: ".txt",
      sizeBytes: new Blob([pastedText]).size,
      rawText: pastedText,
      characterCount: charCount,
      wordCount: wordCount,
      pageCount: null,
      textAvailable: true,
      extractionStatus: "ready",
      userTier,
      selectedModules: ["story_analysis", "character_analysis", "visual_bible", "shot_breakdown"],
      executionMode: "semi_automatic",
      stagedAt: new Date().toISOString(),
    };

    onSourceStaged(payload);
  };

  const handleSelectSample = (sample: typeof SAMPLE_CINEMATIC_SCENARIOS[0]) => {
    setFileError(null);
    const charCount = sample.rawText.length;
    const wordCount = estimateWordCount(sample.rawText);

    const payload: StagedSourcePayload = {
      id: "src_sample_" + sample.id,
      sourceName: sample.title,
      sourceType: "sample_scenario",
      fileName: sample.filename,
      fileExtension: sample.extension,
      sizeBytes: new Blob([sample.rawText]).size,
      rawText: sample.rawText,
      characterCount: charCount,
      wordCount: wordCount,
      pageCount: null,
      textAvailable: true,
      extractionStatus: "ready",
      userTier,
      selectedModules: ["story_analysis", "visual_bible", "shot_breakdown"],
      executionMode: "semi_automatic",
      stagedAt: new Date().toISOString(),
    };

    onSourceStaged(payload);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Tier Badges & Limits Info Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold uppercase text-zinc-900 dark:text-white">
            Plan Capacity: <span className="text-amber-500 dark:text-amber-400">{limits.label}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-600 dark:text-zinc-400 font-sans">
          <span>Max File: <strong className="font-mono text-zinc-900 dark:text-zinc-200">{limits.maxFileSizeFormatted}</strong></span>
          <span>•</span>
          <span>Max Chars: <strong className="font-mono text-zinc-900 dark:text-zinc-200">{limits.maxCharactersFormatted}</strong></span>
          <span>•</span>
          <span>Formats: <strong className="font-mono text-zinc-900 dark:text-zinc-200">{limits.supportedFormats.join(" ")}</strong></span>
        </div>
      </div>

      {/* Input Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 text-xs">
        <button
          type="button"
          onClick={() => setTab("file")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold transition ${
            tab === "file"
              ? "bg-amber-500 text-zinc-950 font-bold dark:bg-amber-400"
              : "border border-zinc-300 bg-zinc-100 text-zinc-700 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white"
          }`}
        >
          <span>📁 File Upload (.pdf, .docx, .txt, .md)</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("paste")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold transition ${
            tab === "paste"
              ? "bg-amber-500 text-zinc-950 font-bold dark:bg-amber-400"
              : "border border-zinc-300 bg-zinc-100 text-zinc-700 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white"
          }`}
        >
          <span>✍ Direct Script Paste</span>
        </button>
        <button
          type="button"
          onClick={() => setTab("samples")}
          className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-semibold transition ${
            tab === "samples"
              ? "bg-amber-500 text-zinc-950 font-bold dark:bg-amber-400"
              : "border border-zinc-300 bg-zinc-100 text-zinc-700 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white"
          }`}
        >
          <span>🎬 Curated Film Scenarios</span>
        </button>
      </div>

      {/* Error Alert */}
      {fileError && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-semibold text-red-500 dark:text-red-400">
          ⚠️ {fileError}
        </div>
      )}

      {/* TAB 1: FILE UPLOAD DROPZONE */}
      {tab === "file" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? "border-amber-400 bg-amber-400/10 shadow-lg"
              : "border-zinc-300 bg-white hover:border-amber-400/60 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/60 dark:hover:border-amber-400/40 dark:hover:bg-zinc-900"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.pdf,.docx"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 text-2xl mb-3 group-hover:scale-110 transition-transform">
            📽
          </div>

          <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
            Drop your screenplay, treatment, or visual bible here
          </h3>
          <p className="mt-1.5 max-w-md text-xs text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
            Drag and drop <strong>.txt, .md, .pdf, or .docx</strong> (up to {limits.maxFileSizeFormatted}).
            <br />
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              TXT/MD are parsed locally in browser. PDF/DOCX are staged securely.
            </span>
          </p>

          <button
            type="button"
            className="mt-4 rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:text-white transition font-mono"
          >
            Browse Files ↗
          </button>
        </div>
      )}

      {/* TAB 2: DIRECT TEXT PASTE */}
      {tab === "paste" && (
        <form onSubmit={handlePasteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 mb-1.5">
              Project / Scene Title
            </label>
            <input
              type="text"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
              placeholder="e.g. Cyberpunk Extraction — Act 1 Treatment"
              className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-xs text-zinc-900 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-amber-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                Screenplay Text / Treatment Notes
              </label>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                {pastedText.length.toLocaleString()} / {limits.maxCharactersFormatted}
              </span>
            </div>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste screenplay dialogue, scene action, sluglines, character notes, or visual directives..."
              className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-xs font-mono text-zinc-900 outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-400 dark:bg-amber-400 dark:hover:bg-amber-300 transition shadow-sm"
          >
            Stage Text for Intake →
          </button>
        </form>
      )}

      {/* TAB 3: SAMPLE CINEMATIC SCENARIOS */}
      {tab === "samples" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {SAMPLE_CINEMATIC_SCENARIOS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className="cursor-pointer rounded-xl border border-zinc-300 bg-white p-5 hover:border-amber-400 transition dark:border-zinc-800 dark:bg-zinc-900 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-mono text-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                  {sample.extension}
                </span>
                <span className="text-xs text-amber-500 dark:text-amber-400 font-bold">Use Scenario →</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white font-mono">{sample.title}</h4>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 font-mono leading-relaxed">
                {sample.rawText.substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Currently Staged Notification Banner */}
      {stagedPayload && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <p className="font-bold text-zinc-900 dark:text-white">
                STAGED: <span className="text-emerald-600 dark:text-emerald-400">{stagedPayload.sourceName}</span>
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans mt-0.5">
                Format: <strong className="font-mono text-zinc-800 dark:text-zinc-200">{stagedPayload.fileExtension.toUpperCase()}</strong> • Size:{" "}
                <strong className="font-mono text-zinc-800 dark:text-zinc-200">{(stagedPayload.sizeBytes / 1024).toFixed(1)} KB</strong>
                {stagedPayload.characterCount !== null && (
                  <> • Characters: <strong className="font-mono text-zinc-800 dark:text-zinc-200">{stagedPayload.characterCount.toLocaleString()}</strong></>
                )}
                {stagedPayload.wordCount !== null && (
                  <> • Words: <strong className="font-mono text-zinc-800 dark:text-zinc-200">{stagedPayload.wordCount.toLocaleString()}</strong></>
                )}
              </p>
            </div>
          </div>
          <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase shrink-0">
            {stagedPayload.extractionStatus === "ready" ? "Text Verified & Ready" : "Document Staged"}
          </span>
        </div>
      )}
    </div>
  );
}
