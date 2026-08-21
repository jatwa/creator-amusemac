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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
            Admin CMS Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mt-1">
            Content Ingestion &amp; Validation Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Scan import folders (`data/import/*`), validate batch schemas, and stage verified content for publishing.
          </p>
        </div>
        <button
          onClick={fetchBatches}
          className="px-4 py-2 bg-foreground text-background text-xs font-mono font-medium rounded-full hover:opacity-90 transition self-start sm:self-auto"
        >
          ↻ Re-scan Directory
        </button>
      </div>

      {/* Directory Batches Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-primary">Staged Import Files (`data/import/`)</h2>
        {loading ? (
          <p className="text-xs text-tertiary font-mono">Scanning data/import directory...</p>
        ) : Object.keys(batches).length === 0 ? (
          <div className="p-6 rounded-2xl border border-dashed border-border-subtle text-center text-secondary text-xs">
            No staged JSON/CSV files found in data/import/. Add structured files to trigger batch ingest.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(batches).map(([fileKey, batch]) => (
              <div
                key={fileKey}
                className="surface bg-surface border border-border rounded-2xl p-5 space-y-3 shadow-subtle"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-accent">{fileKey}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      batch.totalInvalid === 0
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {batch.totalInvalid === 0 ? "✓ VALID" : `✗ ${batch.totalInvalid} ERRORS`}
                  </span>
                </div>
                <div className="text-xs text-secondary space-y-1 font-mono">
                  <p>Total Records: {batch.totalProcessed}</p>
                  <p className="text-emerald-400">Valid: {batch.totalValid}</p>
                  <p className="text-rose-400">Invalid: {batch.totalInvalid}</p>
                </div>
                <div className="pt-2 border-t border-border-subtle">
                  <span className="text-[10px] text-tertiary font-mono block">
                    Scanned: {new Date(batch.importedAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Ingestion & Validation Playground */}
      <div className="surface bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-subtle">
        <h2 className="text-lg font-semibold text-primary">Interactive JSON Schema Validator</h2>
        <p className="text-xs text-secondary leading-relaxed">
          Paste raw JSON payload to test against the production validation engine before writing to disk.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-tertiary">Target Entity:</label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="bg-surface-elevated border border-border rounded-lg px-3 py-1 text-xs text-primary font-mono outline-none"
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
            className="w-full bg-surface-elevated border border-border rounded-xl p-4 text-xs font-mono text-primary outline-none focus:border-accent/40"
          />

          <button
            onClick={handleValidateCustom}
            className="px-5 py-2.5 bg-foreground text-background text-xs font-mono font-medium rounded-full hover:opacity-90 transition shadow-sm"
          >
            Validate Payload →
          </button>
        </div>

        {testResult && (
          <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-2">
            <h3 className="text-xs font-mono font-semibold text-primary">Validation Result:</h3>
            <pre className="text-[11px] font-mono text-secondary overflow-x-auto p-2 bg-surface rounded border border-border-subtle">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle pt-6">
        <Link href="/admin" className="text-xs text-accent font-mono hover:underline">
          ← Back to Admin CMS Dashboard
        </Link>
      </div>
    </div>
  );
}
