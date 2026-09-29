"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Search } from "@/components/cinematic/icons";

const EXAMPLES = [
  "Analyse my script",
  "Create 5 shots for this scene",
  "Build a visual bible",
  "Find the right AI model",
];

export function CreatorIntelligenceInput() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [fileName, setFileName] = useState("");
  const [reading, setReading] = useState(false);

  const persistAndOpen = (text: string, name = "") => {
    sessionStorage.setItem("ci_intelligence_draft", JSON.stringify({
      query: text, fileName: name, createdAt: Date.now()
    }));
    router.push("/create");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    persistAndOpen(query.trim(), fileName);
  };

  const handleFile = async (file: File) => {
    setFileName(file.name);
    if (file.type === "text/plain" || /\.(md|txt)$/i.test(file.name)) {
      setReading(true);
      try {
        setQuery((await file.text()).slice(0, 120000));
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
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400">CREATOR INTELLIGENCE</span>
        <span className="text-[10px] font-mono text-neutral-500">SCRIPT • SCENE • IDEA • DOCUMENT</span>
      </div>

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-white/[0.12] bg-neutral-900/90 shadow-[0_18px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl focus-within:border-amber-400/40">
        <div className="flex items-start gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <Search className="mt-1 h-5 w-5 shrink-0 text-amber-400" />
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            rows={3}
            aria-label="Ask Creator Intel about your story, scene, script or visual idea"
            placeholder="What are you creating? Ask about a script, scene, character, shot or visual idea..."
            className="min-h-[78px] w-full resize-none bg-transparent text-sm sm:text-base leading-relaxed text-white outline-none placeholder:text-neutral-500"
          />
        </div>

        {fileName && (
          <div className="mx-4 mt-2 flex items-center justify-between rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2 sm:mx-5">
            <span className="truncate text-xs text-amber-200">📄 {fileName}</span>
            <button type="button" onClick={() => {
              setFileName(""); setQuery("");
              if (fileRef.current) fileRef.current.value = "";
            }} className="ml-3 text-[10px] font-mono uppercase text-neutral-500 hover:text-white">
              Remove
            </button>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt,.md" className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
              }} />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-xs font-semibold text-neutral-200 transition hover:border-amber-400/30 hover:text-white">
              ＋ Upload Script / Document
            </button>
            <button type="button" onClick={() => {
              setQuery(""); setFileName(""); fileRef.current?.click();
            }} className="rounded-xl border border-white/[0.1] px-3 py-2 text-xs text-neutral-400 hover:text-white">
              Start Writing
            </button>
          </div>

          <motion.button type="submit" whileTap={{ scale: 0.98 }}
            disabled={reading || (!query.trim() && !fileName)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-neutral-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40">
            {reading ? "Reading…" : "Analyse & Create"}
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 text-[10px] font-mono uppercase tracking-wider text-neutral-600">Try</span>
        {EXAMPLES.map((example) => (
          <button key={example} type="button" onClick={() => setQuery(example)}
            className="rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[10px] text-neutral-400 transition hover:border-amber-400/25 hover:text-amber-200">
            {example}
          </button>
        ))}
      </div>

      <p className="mt-3 text-center text-[10px] font-mono text-neutral-600">PDF • DOCX • TXT • MD · Your creative workspace starts here</p>
    </div>
  );
}
