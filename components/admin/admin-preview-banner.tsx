"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export function AdminPreviewBanner() {
  const [previewMode, setPreviewMode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mode = localStorage.getItem("ci_admin_preview_mode");
      if (mode && mode !== "NONE") {
        setPreviewMode(mode);
      }
    }
  }, []);

  const handleExit = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ci_admin_preview_mode");
      setPreviewMode(null);
      window.location.reload();
    }
  };

  if (!previewMode) return null;

  return (
    <aside aria-label="Admin Preview Mode" className="sticky top-0 z-[100] border-b border-amber-500/40 bg-amber-500/10 backdrop-blur-md px-4 py-2 text-xs text-amber-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-bold tracking-wider uppercase font-mono">ADMIN PREVIEW ACTIVE:</span>
          <span>
            Viewing as <strong className="font-mono uppercase text-white bg-amber-500/20 px-1.5 py-0.5 rounded">{previewMode}</strong> tier. Real database subscription unchanged.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/simulator"
            className="rounded border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-500/30 transition"
          >
            Change Mode
          </Link>
          <button
            type="button"
            onClick={handleExit}
            className="rounded bg-amber-500 px-2.5 py-1 text-xs font-bold text-black hover:bg-amber-400 transition"
          >
            Exit Preview ✕
          </button>
        </div>
      </div>
    </aside>
  );
}
