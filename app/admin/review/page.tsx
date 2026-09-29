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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Trust &amp; Verification Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-mono">
            Pricing &amp; Model Drift Review
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-mono">
            Review changes detected by the daily pricing check cron. Approving immediately updates the live Neon record and bumps verified date to today.
          </p>
        </div>
        <button
          onClick={fetchChanges}
          className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 border border-zinc-700 transition self-start sm:self-auto font-semibold"
        >
          ↻ Refresh List
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl border border-amber-400/40 bg-amber-400/10 text-amber-300 text-xs font-mono">
          {feedback}
        </div>
      )}

      {/* Pending Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white flex items-center gap-2 font-mono">
            <span>Pending Approvals</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              {pendingList.length} Needs Review
            </span>
          </h2>
        </div>

        {loading ? (
          <p className="text-xs font-mono text-zinc-400">Loading pending changes...</p>
        ) : pendingList.length === 0 ? (
          <div className="p-8 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/60 text-center text-zinc-400 text-xs font-mono">
            ✓ Zero pending drift alerts. All tool pricing and feature tiers match verified specifications.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingList.map((change) => (
              <div
                key={change.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4 font-mono"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
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
                  <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-red-400 block font-bold">
                      Current Stored Price
                    </span>
                    <p className="text-xs text-zinc-200 font-mono">
                      {change.old_price || "—"}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">
                      Detected New Price
                    </span>
                    <p className="text-xs text-emerald-300 font-mono font-bold">
                      {change.new_price || "—"}
                    </p>
                  </div>
                </div>

                {change.notes && (
                  <p className="text-xs text-zinc-300 bg-zinc-950/70 p-3 rounded-lg border border-zinc-800">
                    <span className="font-semibold text-zinc-400">Notes: </span>
                    {change.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <a
                    href={change.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-amber-400 hover:underline"
                  >
                    View Official Source Page ↗
                  </a>

                  <div className="flex items-center gap-3">
                    <button
                      disabled={processingId === change.id}
                      onClick={() => handleAction(change.id, "reject")}
                      className="px-4 py-1.5 rounded border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      disabled={processingId === change.id}
                      onClick={() => handleAction(change.id, "approve")}
                      className="px-4 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition disabled:opacity-50 shadow-sm"
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
        <div className="space-y-4 pt-6 border-t border-zinc-800 font-mono">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Resolved History</h2>
          <div className="grid gap-2">
            {historyList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-mono"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      item.status === "approved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-zinc-800 text-zinc-400 border-zinc-700"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                  <span className="text-zinc-200 font-semibold">{item.tool_name || item.tool_id}</span>
                </div>
                <span className="text-zinc-400">{item.detected_date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-zinc-800 pt-6">
        <Link href="/admin" className="text-xs text-amber-400 font-mono hover:underline font-semibold">
          ← Back to Admin Control Center
        </Link>
      </div>
    </div>
  );
}
