"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface PendingChange {
  id: string;
  tool_id: string;
  tool_name: string;
  tool_slug: string;
  field_name: string;
  old_price: string;
  new_price: string;
  source_url: string;
  detected_date: string;
  status: string;
  notes?: string;
  created_at: string;
}

export default function AdminReviewPage() {
  const [changes, setChanges] = useState<PendingChange[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchChanges = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/review");
      const data = await res.json();
      if (data.success) {
        setChanges(data.changes || []);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChanges();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/review/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(
          action === "approve"
            ? `✓ Approved change for tool. Live record and verified date updated.`
            : `✓ Rejected change.`
        );
        fetchChanges();
      } else {
        setFeedback(`Error: ${data.error || "Action failed."}`);
      }
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingList = changes.filter((c) => c.status === "needs_review");
  const historyList = changes.filter((c) => c.status !== "needs_review");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-lime font-semibold">
            Trust &amp; Verification Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Pricing &amp; Model Drift Review
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review changes detected by the daily pricing check cron. Approving immediately updates the live Neon record and bumps verified date to today.
          </p>
        </div>
        <button
          onClick={fetchChanges}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition self-start sm:self-auto"
        >
          ↻ Refresh List
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl border border-lime/30 bg-lime/10 text-lime text-xs font-mono">
          {feedback}
        </div>
      )}

      {/* Pending Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>Pending Approvals</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {pendingList.length} Needs Review
            </span>
          </h2>
        </div>

        {loading ? (
          <p className="text-xs font-mono text-zinc-500">Loading pending changes...</p>
        ) : pendingList.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-line bg-panel/30 text-center text-zinc-400 text-xs font-mono">
            ✓ Zero pending drift alerts. All tool pricing and feature tiers match verified specifications.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingList.map((change) => (
              <div
                key={change.id}
                className="rounded-2xl border border-line bg-panel p-6 space-y-4 shadow-subtle"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
                  <div>
                    <span className="text-xs font-bold text-white">
                      {change.tool_name || change.tool_id}
                    </span>
                    <span className="text-xs text-zinc-400 ml-2 font-mono">
                      (Field: {change.field_name})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400">
                    Detected: {change.detected_date}
                  </span>
                </div>

                {/* Diff View */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-rose-400 block font-semibold">
                      Current Stored Price
                    </span>
                    <p className="text-xs text-zinc-200 font-mono">
                      {change.old_price || "—"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 block font-semibold">
                      Detected New Price
                    </span>
                    <p className="text-xs text-emerald-300 font-mono font-bold">
                      {change.new_price || "—"}
                    </p>
                  </div>
                </div>

                {change.notes && (
                  <p className="text-xs text-zinc-300 bg-ink/60 p-3 rounded-xl border border-line">
                    <span className="font-semibold text-zinc-400">Notes: </span>
                    {change.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <a
                    href={change.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-lime hover:underline"
                  >
                    View Official Source Page ↗
                  </a>

                  <div className="flex items-center gap-3">
                    <button
                      disabled={processingId === change.id}
                      onClick={() => handleAction(change.id, "reject")}
                      className="px-4 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      disabled={processingId === change.id}
                      onClick={() => handleAction(change.id, "approve")}
                      className="px-4 py-1.5 rounded-lg bg-lime hover:bg-lime/90 text-ink text-xs font-bold transition disabled:opacity-50 shadow-sm"
                    >
                      ✓ Approve &amp; Update Live
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit History */}
      {historyList.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-line">
          <h2 className="text-base font-semibold text-zinc-300">Resolved History</h2>
          <div className="grid gap-2">
            {historyList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-line/60 bg-panel/40 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                  <span className="text-zinc-200">{item.tool_name || item.tool_id}</span>
                </div>
                <span className="text-zinc-400">{item.detected_date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-line pt-6">
        <Link href="/admin" className="text-xs text-lime font-mono hover:underline">
          ← Back to Admin Control Center
        </Link>
      </div>
    </div>
  );
}
