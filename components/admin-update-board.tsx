"use client";

import { useState } from "react";
import { UpdateEvent } from "@/lib/db/types";

export function AdminUpdateBoard({ initialUpdates }: { initialUpdates: UpdateEvent[] }) {
  const [updates, setUpdates] = useState<UpdateEvent[]>(initialUpdates);
  const [activeFilter, setActiveFilter] = useState<string>("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredUpdates = updates.filter((u) => {
    if (activeFilter === "all") return true;
    return u.status === activeFilter;
  });

  const handleResolve = async (
    id: string,
    action: "approve" | "reject" | "edit" | "rollback",
    customVal?: unknown
  ) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/updates/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reviewerName: "Editorial Curator",
          customNewValue: customVal,
        }),
      });

      const data = await res.json();
      if (data.success && data.update) {
        setUpdates((prev) =>
          prev.map((u) => (u.id === id ? data.update : u))
        );
        setFeedback(`✓ Successfully executed ${action} for ${data.update.entityName}`);
        setEditingId(null);
        setTimeout(() => setFeedback(null), 3000);
      } else {
        alert(data.error || "Failed to execute update action");
      }
    } catch {
      alert("Network error updating event");
    } finally {
      setProcessingId(null);
    }
  };

  const startEdit = (upd: UpdateEvent) => {
    setEditingId(upd.id);
    setEditValue(
      typeof upd.newValue === "object"
        ? JSON.stringify(upd.newValue, null, 2)
        : String(upd.newValue)
    );
  };

  const submitEdit = (id: string) => {
    let parsed: unknown = editValue;
    try {
      parsed = JSON.parse(editValue);
    } catch {
      parsed = editValue;
    }
    handleResolve(id, "edit", parsed);
  };

  const formatValue = (val: unknown) => {
    if (Array.isArray(val)) {
      return val.join(", ");
    }
    if (typeof val === "object" && val !== null) {
      return JSON.stringify(val);
    }
    return String(val);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className="rounded-xl border border-lime/40 bg-lime/10 p-4 text-xs font-bold text-lime animate-fade-in">
          {feedback}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs border-b border-line pb-4">
        {["pending", "applied", "rolled_back", "rejected", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`rounded-full px-4 py-1.5 font-semibold capitalize transition ${
              activeFilter === tab
                ? "bg-lime text-black"
                : "border border-line bg-panel text-zinc-300 hover:border-lime"
            }`}
          >
            {tab.replace("_", " ")} (
            {
              updates.filter((u) => (tab === "all" ? true : u.status === tab))
                .length
            }
            )
          </button>
        ))}
      </div>

      {/* Update Diff Cards */}
      {filteredUpdates.length === 0 ? (
        <div className="surface p-12 text-center text-xs text-zinc-500">
          No update records found matching status &quot;{activeFilter.replace("_", " ")}&quot;.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredUpdates.map((upd) => (
            <article
              key={upd.id}
              className={`surface overflow-hidden p-6 transition ${
                upd.status === "pending"
                  ? "border-lime/40 shadow-glow"
                  : upd.status === "applied"
                  ? "border-emerald-500/30"
                  : upd.status === "rolled_back"
                  ? "border-amber-500/30"
                  : "border-zinc-800 opacity-75"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line/60 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-md border border-line bg-black/40 px-2 py-0.5 font-mono text-[11px] text-zinc-400">
                      {upd.entityType.toUpperCase()}: {upd.entityName}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      Field: <strong className="text-white">{upd.fieldPath}</strong>
                    </span>
                    {/* Risk Badge */}
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
                        upd.risk === "high"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : upd.risk === "medium"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      }`}
                    >
                      {upd.risk || "medium"} Risk
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-white">
                    {upd.changeSummary}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] text-zinc-500 font-mono">Confidence</div>
                    <div className="text-xs font-bold text-lime">
                      {Math.round((upd.confidenceScore || 0.9) * 100)}%
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                      upd.status === "pending"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        : upd.status === "applied"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : upd.status === "rolled_back"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        : "bg-red-500/10 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {upd.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Diff Section */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                {/* OLD VALUE */}
                <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                    <span>− OLD VALUE (CURRENT)</span>
                  </div>
                  <div className="text-zinc-300 break-words leading-5">
                    {formatValue(upd.previousValue)}
                  </div>
                </div>

                {/* NEW VALUE */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/10 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
                    <span>+ NEW VALUE (PROPOSED)</span>
                    {editingId === upd.id && (
                      <span className="text-[10px] text-lime">EDITING</span>
                    )}
                  </div>

                  {editingId === upd.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full rounded border border-lime bg-black/80 p-2 font-mono text-xs text-white focus:outline-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitEdit(upd.id)}
                          className="rounded bg-lime px-3 py-1 font-bold text-black text-[11px]"
                        >
                          Apply Edited Value
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded border border-line bg-panel px-3 py-1 text-zinc-400 text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-zinc-100 break-words leading-5">
                      {formatValue(upd.newValue)}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions & Source Link */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-line/60 pt-4 text-xs">
                <div className="text-zinc-500">
                  <span>Source URL: </span>
                  <a
                    href={upd.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime underline ml-1"
                  >
                    {upd.sourceUrl} ↗
                  </a>
                  <span className="ml-3 font-mono">
                    Detected: {new Date(upd.detectedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {upd.status === "pending" && (
                    <>
                      <button
                        disabled={processingId === upd.id}
                        onClick={() => startEdit(upd)}
                        className="rounded-lg border border-line bg-panel px-3.5 py-1.5 font-semibold text-zinc-300 hover:border-lime hover:text-white transition"
                      >
                        ✎ Edit & Apply
                      </button>
                      <button
                        disabled={processingId === upd.id}
                        onClick={() => handleResolve(upd.id, "reject")}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-1.5 font-semibold text-red-400 hover:bg-red-500/20 transition"
                      >
                        ✗ Reject
                      </button>
                      <button
                        disabled={processingId === upd.id}
                        onClick={() => handleResolve(upd.id, "approve")}
                        className="rounded-lg bg-lime px-4 py-1.5 font-bold text-black hover:bg-white transition flex items-center gap-1"
                      >
                        <span>✓ Approve & Apply</span>
                      </button>
                    </>
                  )}

                  {upd.status === "applied" && (
                    <button
                      disabled={processingId === upd.id}
                      onClick={() => handleResolve(upd.id, "rollback")}
                      className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 font-semibold text-amber-400 hover:bg-amber-500/20 transition flex items-center gap-1"
                    >
                      <span>↩ Rollback to Previous Value</span>
                    </button>
                  )}

                  {upd.reviewedBy && (
                    <span className="text-zinc-500 font-mono text-[11px] ml-2">
                      Reviewed by {upd.reviewedBy} on{" "}
                      {upd.reviewedAt
                        ? new Date(upd.reviewedAt).toLocaleDateString()
                        : "recent"}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
