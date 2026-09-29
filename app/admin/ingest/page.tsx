"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IngestionBatchResult } from "@/lib/ingestion/types";

export default function AdminIngestPage() {
  const [batches, setBatches] = useState<Record<string, IngestionBatchResult>>({});
  const [loading, setLoading] = useState(true);
  const [jsonInput, setJsonInput] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("tools");
  const [testResult, setTestResult] = useState<any>(null);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ingest");
      const data = await res.json();
      if (data.success) {
        setBatches(data.batchSummary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleValidateCustom = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const records = Array.isArray(parsed) ? parsed : [parsed];
      const res = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType: selectedEntity, records }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (e: any) {
      setTestResult({ success: false, error: `Invalid JSON syntax: ${e.message}` });
    }
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Admin CMS Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-mono">
            Content Ingestion &amp; Validation Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-mono">
            Scan import folders (`data/import/*`), validate batch schemas, and stage verified content for publishing.
          </p>
        </div>
        <button
          onClick={fetchBatches}
          className="px-4 py-2 bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-mono font-semibold rounded hover:bg-zinc-700 transition self-start sm:self-auto"
        >
          ↻ Re-scan Directory
        </button>
      </div>

      {/* Directory Batches Grid */}
      <div className="space-y-4 font-mono">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">Staged Import Files (`data/import/`)</h2>
        {loading ? (
          <p className="text-xs text-zinc-400 font-mono">Scanning data/import directory...</p>
        ) : Object.keys(batches).length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/60 text-center text-zinc-400 text-xs">
            No staged JSON/CSV files found in data/import/. Add structured files to trigger batch ingest.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(batches).map(([fileKey, batch]) => (
              <div
                key={fileKey}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-amber-400">{fileKey}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
                      batch.totalInvalid === 0
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-red-500/10 text-red-400 border-red-500/30"
                    }`}
                  >
                    {batch.totalInvalid === 0 ? "✓ VALID" : `✗ ${batch.totalInvalid} ERRORS`}
                  </span>
                </div>
                <div className="text-xs text-zinc-300 space-y-1 font-mono">
                  <p>Total Records: {batch.totalProcessed}</p>
                  <p className="text-emerald-400">Valid: {batch.totalValid}</p>
                  <p className="text-red-400">Invalid: {batch.totalInvalid}</p>
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono block">
                    Scanned: {new Date(batch.importedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Ingestion & Validation Playground */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6 font-mono">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">Interactive JSON Schema Validator</h2>
        <p className="text-xs text-zinc-400 leading-relaxed font-mono">
          Paste raw JSON payload to test against the production validation engine before writing to disk.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-zinc-400">Target Entity:</label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded px-3 py-1 text-xs text-white font-mono outline-none focus:border-amber-400"
            >
              <option value="tools">Tools</option>
              <option value="prompts">Prompts</option>
              <option value="blogs">Blogs</option>
              <option value="videos">Videos</option>
              <option value="stories">Stories</option>
              <option value="festivals">Festivals</option>
              <option value="kits">Kits</option>
              <option value="lexicon">Lexicon</option>
            </select>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={8}
            placeholder={`[\n  {\n    "id": "tool-example",\n    "slug": "example-tool",\n    "name": "Example AI",\n    "category": "video",\n    "description": "...",\n    "officialUrl": "https://example.com",\n    "verifiedAt": "2026-08-21"\n  }\n]`}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-white outline-none focus:border-amber-400"
          />

          <button
            onClick={handleValidateCustom}
            className="px-5 py-2 bg-amber-400 text-zinc-950 text-xs font-mono font-bold rounded hover:bg-amber-300 transition shadow-sm"
          >
            Validate Payload →
          </button>
        </div>

        {testResult && (
          <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
            <h3 className="text-xs font-mono font-semibold text-white">Validation Result:</h3>
            <pre className="text-[11px] font-mono text-zinc-300 overflow-x-auto p-2 bg-zinc-900 rounded border border-zinc-800">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
        <Link href="/admin" className="text-xs text-amber-400 font-mono hover:underline font-semibold">
          ← Back to Admin CMS Dashboard
        </Link>
      </div>
    </div>
  );
}
