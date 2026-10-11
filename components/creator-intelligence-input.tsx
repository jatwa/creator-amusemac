"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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
  saveStagedIntake,
} from "@/lib/creator-intelligence-actions";
import { SubscriptionTier } from "@/lib/db/subscription-repo";

interface CreatorIntelligenceInputProps {
  userTier?: SubscriptionTier;
  onSourceStaged?: (payload: StagedSourcePayload) => void;
  stagedPayload?: StagedSourcePayload | null;
}

export function CreatorIntelligenceInput({
  userTier = "free",
  onSourceStaged,
  stagedPayload,
}: CreatorIntelligenceInputProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"file" | "paste" | "samples">("file");
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const dispatchSourceStaged = (payload: StagedSourcePayload) => {
    saveStagedIntake(payload);
    if (onSourceStaged) {
      onSourceStaged(payload);
    } else {
      router.push("/create/analyze");
    }
  };

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
          pageCount: null, // Deterministic: page count not invented for raw text
          textAvailable: true,
          extractionStatus: "ready",
          userTier,
          selectedModules: ["story_analysis", "visual_bible", "shot_breakdown"],
          executionMode: "semi_automatic",
          stagedAt: new Date().toISOString(),
        };

        dispatchSourceStaged(payload);
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
        pageCount: null, // Transparent invariant: never fake page count
        textAvailable: false,
        extractionStatus: "pending",
        userTier,
        selectedModules: ["story_analysis", "screenplay_breakdown", "shot_breakdown"],
        executionMode: "semi_automatic",
        stagedAt: new Date().toISOString(),
      };

      dispatchSourceStaged(payload);
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
      setFileError("Please enter screenplay dialogue, scene treatment, or director notes.");
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

    dispatchSourceStaged(payload);
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

    dispatchSourceStaged(payload);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Step 1 Header & Explanation */}
      <div className="space-y-2 pb-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            STEP 1 · ADD YOUR STORY
          </span>
          <span className="text-xs font-mono text-zinc-500">Create Studio Intake</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          What are you making?
        </h2>
        <p className="text-sm text-zinc-400 font-sans leading-relaxed max-w-2xl">
          Upload a screenplay, paste a scene, or start with a curated film scenario. Choose what you need help with next.
        </p>
      </div>

      {/* Input Mode Navigation Tabs */}
      <div
        role="tablist"
        aria-label="Story intake methods"
        className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3 text-xs"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "file"}
          onClick={() => setTab("file")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
            tab === "file"
              ? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20"
              : "border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-amber-400/40 hover:text-white"
          }`}
        >
          <span>📁 File Upload</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "paste"}
          onClick={() => setTab("paste")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
            tab === "paste"
              ? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20"
              : "border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-amber-400/40 hover:text-white"
          }`}
        >
          <span>✍ Direct Script Paste</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "samples"}
          onClick={() => setTab("samples")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
            tab === "samples"
              ? "bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20"
              : "border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:border-amber-400/40 hover:text-white"
          }`}
        >
          <span>🎬 Curated Film Scenarios</span>
        </button>
      </div>

      {/* Plan Capacity & Formats Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-200">{limits.label}:</span>
          <span className="text-zinc-300">{limits.maxFileSizeFormatted} max file</span>
          <span>·</span>
          <span className="text-zinc-300">{limits.maxCharactersFormatted} max text</span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <span className="text-zinc-500">Formats:</span>
          <span className="text-amber-400/90 font-semibold">.TXT</span>
          <span>·</span>
          <span className="text-amber-400/90 font-semibold">.MD</span>
          <span>·</span>
          <span className="text-zinc-300">.PDF</span>
          <span>·</span>
          <span className="text-zinc-300">.DOCX</span>
        </div>
      </div>

      {/* Error Alert */}
      {fileError && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-semibold text-red-400 flex items-start gap-2"
        >
          <span className="text-base leading-none">⚠️</span>
          <span>{fileError}</span>
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
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload screenplay, treatment or notes file"
          className={`group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all focus:outline-none focus:ring-2 focus:ring-amber-400/60 ${
            dragActive
              ? "border-amber-400 bg-amber-400/10 shadow-lg"
              : "border-zinc-700 bg-zinc-900/60 hover:border-amber-400/60 hover:bg-zinc-900"
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

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 text-2xl mb-3 group-hover:scale-110 transition-transform">
            📽
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white font-sans">
            Drop your screenplay, treatment, or scene notes here
          </h3>
          <p className="mt-1.5 max-w-md text-xs text-zinc-400 font-sans leading-relaxed">
            Drag and drop <strong>.txt, .md, .pdf, or .docx</strong> (up to {limits.maxFileSizeFormatted}).
            <br />
            <span className="text-[11px] text-zinc-500">
              TXT/MD are parsed locally in browser. PDF/DOCX are staged safely without premature extraction claims.
            </span>
          </p>

          <button
            type="button"
            className="mt-4 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 group-hover:text-white group-hover:border-amber-400/50 transition font-mono"
          >
            Browse Files ↗
          </button>
        </div>
      )}

      {/* TAB 2: DIRECT TEXT PASTE */}
      {tab === "paste" && (
        <form onSubmit={handlePasteSubmit} className="space-y-4">
          <div>
            <label htmlFor="pastedTitle" className="block text-xs font-bold uppercase text-zinc-300 mb-1.5 font-mono">
              Project / Scene Title (Optional)
            </label>
            <input
              id="pastedTitle"
              type="text"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
              placeholder="e.g. Cyberpunk Extraction — Act 1 Treatment"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-xs text-white outline-none focus:border-amber-400 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="pastedText" className="block text-xs font-bold uppercase text-zinc-300 font-mono">
                Screenplay Text / Treatment Notes
              </label>
              <span className="text-[11px] text-zinc-400 font-mono">
                {pastedText.length.toLocaleString()} / {limits.maxCharactersFormatted}
              </span>
            </div>
            <textarea
              id="pastedText"
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste screenplay dialogue, scene action, sluglines, character notes, or visual directives..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-xs font-mono text-zinc-100 outline-none focus:border-amber-400 transition"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition shadow-sm font-mono cursor-pointer"
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
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelectSample(sample);
                }
              }}
              tabIndex={0}
              role="button"
              className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-amber-400 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400/60"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="rounded bg-zinc-950 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                  {sample.extension}
                </span>
                <span className="text-xs text-amber-400 font-bold font-mono">Use Scenario →</span>
              </div>
              <h4 className="text-sm font-bold text-white font-mono">{sample.title}</h4>
              <p className="mt-2 text-xs text-zinc-400 line-clamp-3 font-mono leading-relaxed">
                {sample.rawText.substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Current Staging Status Card */}
      {stagedPayload && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 text-xs font-mono shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <span
                className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 sm:mt-0 ${
                  stagedPayload.textAvailable ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                }`}
              />
              <div>
                <p className="font-bold text-white text-sm">
                  STAGED: <span className="text-amber-400">{stagedPayload.sourceName}</span>
                </p>
                <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  Format: <strong className="font-mono text-zinc-200">{stagedPayload.fileExtension.toUpperCase()}</strong>
                  {" "}· Size: <strong className="font-mono text-zinc-200">{(stagedPayload.sizeBytes / 1024).toFixed(1)} KB</strong>
                  {stagedPayload.characterCount !== null && (
                    <> · Chars: <strong className="font-mono text-zinc-200">{stagedPayload.characterCount.toLocaleString()}</strong></>
                  )}
                  {stagedPayload.wordCount !== null && (
                    <> · Words: <strong className="font-mono text-zinc-200">{stagedPayload.wordCount.toLocaleString()}</strong></>
                  )}
                </p>
              </div>
            </div>

            <span
              className={`rounded px-3 py-1 text-[11px] font-bold uppercase shrink-0 self-start sm:self-center border ${
                stagedPayload.textAvailable
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-400"
              }`}
            >
              {stagedPayload.textAvailable ? "Text ready" : "File staged — extraction pending"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
