"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDraftsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"blogs" | "prompts">("blogs");
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/drafts");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
        setPrompts(data.prompts || []);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleDraftAction = async (
    type: "blog" | "prompt",
    id: string,
    action: "publish" | "reject"
  ) => {
    setProcessingId(id);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/drafts/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, action }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback(
          action === "publish"
            ? `✓ Successfully published ${type} to live site!`
            : `✓ Draft marked as rejected.`
        );
        fetchDrafts();
      } else {
        setFeedback(`Error: ${data.error || "Action failed."}`);
      }
    } catch (e: any) {
      setFeedback(`Error: ${e.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-lime font-semibold">
            Editorial CMS Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Automated Drafts &amp; Recipes Hub
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review daily AI news digest articles and generated prompt recipes. Publishing makes them live on `/blog` and `/prompts`.
          </p>
        </div>
        <button
          onClick={fetchDrafts}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 transition self-start sm:self-auto"
        >
          ↻ Refresh Drafts
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl border border-lime/30 bg-lime/10 text-lime text-xs font-mono">
          {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <button
          onClick={() => setActiveTab("blogs")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition ${
            activeTab === "blogs"
              ? "bg-lime text-ink font-bold shadow-sm"
              : "bg-panel text-zinc-400 hover:text-white"
          }`}
        >
          Blog &amp; News Drafts ({blogs.length})
        </button>
        <button
          onClick={() => setActiveTab("prompts")}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition ${
            activeTab === "prompts"
              ? "bg-lime text-ink font-bold shadow-sm"
              : "bg-panel text-zinc-400 hover:text-white"
          }`}
        >
          Prompt Recipe Drafts ({prompts.length})
        </button>
      </div>

      {/* Blog Drafts Tab */}
      {activeTab === "blogs" && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-xs font-mono text-zinc-500">Loading blog drafts...</p>
          ) : blogs.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-line bg-panel/30 text-center text-zinc-400 text-xs font-mono">
              No blog drafts found. The daily digest cron runs at 00:30 UTC.
            </div>
          ) : (
            <div className="grid gap-6">
              {blogs.map((b) => (
                <div
                  key={b.id}
                  className="rounded-2xl border border-line bg-panel p-6 space-y-4 shadow-subtle"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-lime bg-lime/10 px-2 py-0.5 rounded border border-lime/20 mr-2">
                        {b.category || "Editorial"}
                      </span>
                      <span className="text-xs font-mono text-zinc-400">
                        Status: <strong className={b.status === "published" ? "text-emerald-400" : "text-amber-400"}>{b.status}</strong>
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">
                      Created: {b.created_date}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{b.title}</h3>
                    <p className="text-xs text-zinc-300 mt-2 leading-relaxed font-normal">
                      {b.excerpt}
                    </p>
                  </div>

                  <div className="p-4 bg-ink/70 rounded-xl border border-line text-xs font-mono text-zinc-300 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {b.content}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line/60">
                    <span className="text-xs text-zinc-400 font-mono">
                      Author: {b.author_name}
                    </span>

                    <div className="flex items-center gap-3">
                      {b.status !== "published" && (
                        <>
                          <button
                            disabled={processingId === b.id}
                            onClick={() => handleDraftAction("blog", b.id, "reject")}
                            className="px-4 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            disabled={processingId === b.id}
                            onClick={() => handleDraftAction("blog", b.id, "publish")}
                            className="px-5 py-1.5 rounded-lg bg-lime hover:bg-lime/90 text-ink text-xs font-bold transition disabled:opacity-50 shadow-sm"
                          >
                            ✓ Publish to Live /blog
                          </button>
                        </>
                      )}
                      {b.status === "published" && (
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          className="text-xs font-mono text-lime hover:underline"
                        >
                          View Live Post ↗
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Prompt Drafts Tab */}
      {activeTab === "prompts" && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-xs font-mono text-zinc-500">Loading prompt drafts...</p>
          ) : prompts.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-line bg-panel/30 text-center text-zinc-400 text-xs font-mono">
              No prompt drafts found. New tool prompt recipes generate with daily digest.
            </div>
          ) : (
            <div className="grid gap-6">
              {prompts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-line bg-panel p-6 space-y-4 shadow-subtle"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
                    <span className="text-[10px] font-mono uppercase text-lime bg-lime/10 px-2 py-0.5 rounded border border-lime/20">
                      {p.use_case || p.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      Status: <strong className={p.status === "published" ? "text-emerald-400" : "text-amber-400"}>{p.status}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-zinc-300 mt-1">{p.description}</p>
                  </div>

                  <div className="p-4 bg-ink/70 rounded-xl border border-line space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-lime block font-semibold">
                      Prompt Formula:
                    </span>
                    <p className="text-xs font-mono text-zinc-200 leading-relaxed">
                      {p.prompt_text}
                    </p>
                    {p.negative_prompt && (
                      <p className="text-xs font-mono text-zinc-400 pt-1">
                        <span className="text-rose-400">Negative:</span> {p.negative_prompt}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-line/60">
                    <span className="text-xs text-zinc-400 font-mono">
                      Target Models: {Array.isArray(p.compatible_tool_ids) ? p.compatible_tool_ids.join(", ") : p.compatible_tool_ids}
                    </span>

                    <div className="flex items-center gap-3">
                      {p.status !== "published" && (
                        <>
                          <button
                            disabled={processingId === p.id}
                            onClick={() => handleDraftAction("prompt", p.id, "reject")}
                            className="px-4 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            disabled={processingId === p.id}
                            onClick={() => handleDraftAction("prompt", p.id, "publish")}
                            className="px-5 py-1.5 rounded-lg bg-lime hover:bg-lime/90 text-ink text-xs font-bold transition disabled:opacity-50 shadow-sm"
                          >
                            ✓ Publish to Live /prompts
                          </button>
                        </>
                      )}
                      {p.status === "published" && (
                        <Link
                          href={`/prompts/${p.slug}`}
                          target="_blank"
                          className="text-xs font-mono text-lime hover:underline"
                        >
                          View Live Recipe ↗
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
