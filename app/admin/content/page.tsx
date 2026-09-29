import React from "react";
import Link from "next/link";
import { toolsData, blogsData, comparisonsData } from "@/data/platform-data";
import { canonicalWorkflows } from "@/data/workflows-canonical";

export const dynamic = "force-dynamic";

export default function AdminContentPage() {
  const tools = toolsData;
  const workflows = canonicalWorkflows;
  const comparisons = comparisonsData;
  const blogs = blogsData;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">Content</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          Editorial Content &amp; Entity Registries
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
          Inspect canonical AI tool dossiers, production workflows, head-to-head comparisons, and journal essays.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-1">
          <span className="text-zinc-400 block font-bold text-[11px] uppercase">AI Tools</span>
          <span className="text-3xl font-bold text-white mt-1 block">{tools.length}</span>
          <span className="text-zinc-500 text-[10px]">Audited video, image, audio engines</span>
        </div>
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-1">
          <span className="text-zinc-400 block font-bold text-[11px] uppercase">Workflows</span>
          <span className="text-3xl font-bold text-amber-400 mt-1 block">{workflows.length}</span>
          <span className="text-zinc-500 text-[10px]">End-to-end production playbooks</span>
        </div>
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-1">
          <span className="text-zinc-400 block font-bold text-[11px] uppercase">Comparisons</span>
          <span className="text-3xl font-bold text-emerald-400 mt-1 block">{comparisons.length}</span>
          <span className="text-zinc-500 text-[10px]">Head-to-head scenario battles</span>
        </div>
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-1">
          <span className="text-zinc-400 block font-bold text-[11px] uppercase">Journal Articles</span>
          <span className="text-3xl font-bold text-zinc-300 mt-1 block">{blogs.length}</span>
          <span className="text-zinc-500 text-[10px]">Published editorial essays</span>
        </div>
      </div>

      {/* Tools Table */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">Audited AI Tools Dossiers</h2>
        <div className="rounded-lg border border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[650px]">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Tool Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Pricing Model</th>
                <th className="p-3">Verified Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {tools.slice(0, 10).map((t) => (
                <tr key={t.id} className="hover:bg-zinc-800/40 transition">
                  <td className="p-3 font-semibold text-white">{t.name}</td>
                  <td className="p-3 uppercase text-amber-400 font-semibold">{t.category}</td>
                  <td className="p-3 text-zinc-400">{t.pricing.model}</td>
                  <td className="p-3 text-zinc-500">{t.verifiedAt}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/tools/${t.slug}`}
                      target="_blank"
                      className="text-xs text-amber-400 hover:underline font-semibold"
                    >
                      View Dossier ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Workflows Table */}
      <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h2 className="text-sm font-bold uppercase text-white tracking-wider font-mono">Production Workflows &amp; Playbooks</h2>
        <div className="rounded-lg border border-zinc-800 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[650px]">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-zinc-400 uppercase text-[10px] font-semibold">
              <tr>
                <th className="p-3">Workflow Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Effort</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {workflows.slice(0, 8).map((w: any) => (
                <tr key={w.id} className="hover:bg-zinc-800/40 transition">
                  <td className="p-3 font-semibold text-white">{w.title}</td>
                  <td className="p-3 uppercase text-emerald-400 font-semibold">{w.category}</td>
                  <td className="p-3 text-zinc-400">{w.estimatedEffort}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/workflows/${w.slug}`}
                      target="_blank"
                      className="text-xs text-amber-400 hover:underline font-semibold"
                    >
                      Open Playbook ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
