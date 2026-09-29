"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Search } from "@/components/cinematic/icons";
import {
  CREATOR_INTELLIGENCE_LIMITS,
  formatFileSize,
  isAllowedCreatorIntelligenceFile,
} from "@/lib/creator-intelligence-limits";

const EXAMPLES = [
  "Analyse my script",
  "Create 5 shots for this scene",
  "Build a visual bible",
  "Find the right AI model",
];

export function CreatorIntelligenceInput() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [query, setQuery] = useState("");
  const [fileName, setFileName] = useState("");
  const [reading, setReading] = useState(false);
  const [error, setError] = useState("");
  const [limits, setLimits] = useState(CREATOR_INTELLIGENCE_LIMITS);

  useEffect(() => {
    fetch("/api/creator-intelligence/limits")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data) setLimits({ ...CREATOR_INTELLIGENCE_LIMITS, ...data }); })
      .catch(() => undefined);
  }, []);

  const persistAndOpen = (text: string, name = "") => {
    sessionStorage.setItem(
      "ci_intelligence_draft",
      JSON.stringify({ query: text, fileName: name, createdAt: Date.now() })
    );
    router.push("/create");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    const trimmed = query.trim();

    if (trimmed.length > CREATOR_INTELLIGENCE_LIMITS.maxTextChars) {
      setError(
        `Text is limited to ${CREATOR_INTELLIGENCE_LIMITS.maxTextChars.toLocaleString()} characters.`
      );
      return;
    }

    if (!trimmed && !fileName) {
      setError("Write an instruction or upload a supported document first.");
      return;
    }

    persistAndOpen(trimmed, fileName);
  };

  const handleFile = async (file: File) => {
    setError("");

    if (!isAllowedCreatorIntelligenceFile(file.name)) {
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
      setError("Unsupported file type. Use PDF, DOCX, TXT or MD.");
      return;
    }

    if (file.size > CREATOR_INTELLIGENCE_LIMITS.maxFileBytes) {
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
      setError(
        `File is too large. Maximum size is ${formatFileSize(
          CREATOR_INTELLIGENCE_LIMITS.maxFileBytes
        )}.`
      );
      return;
    }

    setFileName(file.name);

    if (file.type === "text/plain" || /\.(md|txt)$/i.test(file.name)) {
      setReading(true);
      try {
        const text = await file.text();

        if (text.length > CREATOR_INTELLIGENCE_LIMITS.maxTextChars) {
          setQuery(text.slice(0, CREATOR_INTELLIGENCE_LIMITS.maxTextChars));
          setError(
            `Text was trimmed to ${CREATOR_INTELLIGENCE_LIMITS.maxTextChars.toLocaleString()} characters.`
          );
        } else {
          setQuery(text);
        }
      } finally {
        setReading(false);
      }
    } else {
      setQuery("");
    }
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-4xl">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400">
          CREATOR INTELLIGENCE
        </span>
        <span className="text-[10px] font-mono text-neutral-500">
          SCRIPT • SCENE • IDEA • DOCUMENT
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-3xl border border-white/[0.12] bg-neutral-900/90 shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl focus-within:border-amber-400/40"
      >
        <div className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <Search className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(event) => {
              const next = event.target.value;
              if (next.length <= CREATOR_INTELLIGENCE_LIMITS.maxTextChars) {
                setQuery(next);
                setError("");
              } else {
                setQuery(
                  next.slice(0, CREATOR_INTELLIGENCE_LIMITS.maxTextChars)
                );
                setError(
                  `Text limit reached: ${CREATOR_INTELLIGENCE_LIMITS.maxTextChars.toLocaleString()} characters.`
                );
              }
            }}
            rows={3}
            aria-label="Ask Creator Intel about your story, scene, script or visual idea"
            placeholder="What are you creating? Ask about a script, scene, character, shot or visual idea..."
            className="min-h-[78px] w-full resize-none bg-transparent text-sm leading-relaxed text-white outline-none placeholder:text-neutral-500 sm:text-base"
          />
        </div>

        {fileName && (
          <div className="mx-4 mt-2 flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 sm:mx-5">
            <span className="truncate text-xs text-amber-200">📄 {fileName}</span>
            <button
              type="button"
              onClick={() => {
                setFileName("");
                setQuery("");
                setError("");
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="ml-3 text-[10px] font-mono uppercase text-neutral-500 hover:text-white"
            >
              Remove
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-neutral-200 transition hover:border-amber-400/30 hover:text-white"
            >
              ＋ Upload Script / Document
            </button>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFileName("");
                setError("");
                if (fileRef.current) fileRef.current.value = "";
                textareaRef.current?.focus();
              }}
              className="rounded-xl border border-white/[0.1] px-3 py-2 text-xs text-neutral-400 hover:text-white"
            >
              Start Writing
            </button>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.98 }}
            disabled={reading || (!query.trim() && !fileName)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-neutral-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {reading ? "Reading…" : "Analyse & Create"}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="flex items-center justify-between gap-3 px-4 pb-3 sm:px-5">
          <span className="text-[10px] font-mono text-neutral-600">
            {query.length.toLocaleString()} / {CREATOR_INTELLIGENCE_LIMITS.maxTextChars.toLocaleString()} chars
          </span>
          <span className="text-right text-[10px] font-mono text-neutral-600">
            Max file {formatFileSize(CREATOR_INTELLIGENCE_LIMITS.maxFileBytes)} · PDF · DOCX · TXT · MD
          </span>
        </div>

        {error && (
          <p
            role="alert"
            className="border-t border-rose-400/10 px-4 py-3 text-xs text-rose-300 sm:px-5"
          >
            {error}
          </p>
        )}
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-[10px] font-mono uppercase tracking-wider text-neutral-600">
          Try
        </span>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setQuery(example);
              setError("");
              textareaRef.current?.focus();
            }}
            className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[10px] text-neutral-400 transition hover:border-amber-400/25 hover:text-amber-200"
          >
            {example}
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-[10px] font-mono text-neutral-600">
        PDF • DOCX • TXT • MD · 4 MB max file · 50K max characters
      </p>
    </div>
  );
}
