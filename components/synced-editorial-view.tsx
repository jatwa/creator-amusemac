'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SYNCED_MASTER_CONTENT, SyncedMediaArticle } from '@/data/synced-content';

export const SyncedEditorialHub = () => {
  const [selectedArticle, setSelectedArticle] = useState<SyncedMediaArticle>(SYNCED_MASTER_CONTENT[0]);
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-slate-100 font-sans">
      <div className="border-b border-white/10 pb-6 mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">Verified Masterclasses &amp; Articles</span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">Synchronized Production Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">Every masterclass video is directly tied to a verified tool dossier, prompt recipe, and workflow pipeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Article Selector List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          {SYNCED_MASTER_CONTENT.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className={`p-5 rounded-xl border transition cursor-pointer ${
                selectedArticle.id === art.id
                  ? 'bg-[#12151E] border-amber-400/60 shadow-lg shadow-amber-400/5'
                  : 'bg-[#0E121B] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase">{art.category}</span>
                <span className="text-[11px] font-mono text-slate-400">{art.readTime}</span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-2">{art.title}</h3>
              <span className="text-[11px] font-mono text-slate-400 mt-2 block">By {art.author}</span>
            </div>
          ))}
        </div>

        {/* Selected Masterclass & Integrated Assets Viewer (8 Cols) */}
        <div className="lg:col-span-8 bg-[#0E121B] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                {selectedArticle.category}
              </span>
              <span className="text-xs font-mono text-slate-400">Published {selectedArticle.publishedDate}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{selectedArticle.title}</h2>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">{selectedArticle.summary}</p>
          </div>

          {/* Embedded Video Masterclass Player */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center">
            <video
              src={selectedArticle.embeddedVideoUrl}
              controls
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* Key Takeaways */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Key Filmmaking Takeaways</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {selectedArticle.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Connected Prompt Recipe & Tool Link */}
          <div className="p-4 bg-[#07090E] rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-amber-400 font-bold">Matched Prompt Recipe: {selectedArticle.relatedPromptRecipe.title}</span>
              <button
                onClick={() => handleCopyPrompt(selectedArticle.relatedPromptRecipe.prompt)}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-mono font-bold rounded transition"
              >
                {copied ? '✓ Copied' : 'Copy Prompt'}
              </button>
            </div>
            <p className="text-xs font-mono text-slate-300 bg-black/40 p-2.5 rounded border border-white/5">
              {selectedArticle.relatedPromptRecipe.prompt}
            </p>
          </div>

          {/* Cross-Link to Tool Dossier */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-xs font-mono text-slate-400">Primary Engine Evaluated: <strong className="text-white uppercase">{selectedArticle.primaryToolId}</strong></span>
            <Link
              href={`/tools/${selectedArticle.primaryToolId}`}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold rounded-lg text-amber-400 transition flex items-center gap-2"
            >
              View Full Tool Dossier →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
