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
      <div className="border-b border-line pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-white">Admin</Link>
          <span>/</span>
          <span className="text-zinc-200">Content</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Editorial Content &amp; Entity Registries
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400">
          Inspect canonical AI tool dossiers, production workflows, head-to-head comparisons, and journal essays.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono text-xs">
        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">AI Tools</span>
          <span className="text-2xl font-bold text-white mt-1 block">{tools.length}</span>
          <span className="text-zinc-500 text-[11px]">Audited video, image, audio engines</span>
        </div>
        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Workflows</span>
          <span className="text-2xl font-bold text-white mt-1 block">{workflows.length}</span>
          <span className="text-zinc-500 text-[11px]">End-to-end production playbooks</span>
        </div>
        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Comparisons</span>
          <span className="text-2xl font-bold text-white mt-1 block">{comparisons.length}</span>
          <span className="text-zinc-500 text-[11px]">Head-to-head scenario battles</span>
        </div>
        <div className="surface p-5 rounded-2xl border border-line">
          <span className="text-zinc-400 block">Journal Articles</span>
          <span className="text-2xl font-bold text-white mt-1 block">{blogs.length}</span>
          <span className="text-zinc-500 text-[11px]">Published editorial essays</span>
        </div>
      </div>

      {/* Tools Table */}
      <section className="surface p-6 rounded-2xl border border-line space-y-4">
        <h2 className="text-base font-bold text-white">Audited AI Tools Dossiers</h2>
        <div className="rounded-xl border border-line overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[650px]">
            <thead className="border-b border-line bg-black/60 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Tool Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Pricing Model</th>
                <th className="p-3">Verified Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-zinc-300">
              {tools.slice(0, 10).map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02]">
                  <td className="p-3 font-semibold text-white">{t.name}</td>
                  <td className="p-3 uppercase text-lime">{t.category}</td>
                  <td className="p-3 text-zinc-400">{t.pricing.model}</td>
                  <td className="p-3 text-zinc-500">{t.verifiedAt}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/tools/${t.slug}`}
                      target="_blank"
                      className="text-xs text-lime hover:underline"
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
      <section className="surface p-6 rounded-2xl border border-line space-y-4">
        <h2 className="text-base font-bold text-white">Production Workflows &amp; Playbooks</h2>
        <div className="rounded-xl border border-line overflow-x-auto">
          <table className="w-full text-left text-xs font-mono min-w-[650px]">
            <thead className="border-b border-line bg-black/60 text-zinc-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Workflow Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Effort</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-zinc-300">
              {workflows.slice(0, 8).map((w: any) => (
                <tr key={w.id} className="hover:bg-white/[0.02]">
                  <td className="p-3 font-semibold text-white">{w.title}</td>
                  <td className="p-3 uppercase text-accent">{w.category}</td>
                  <td className="p-3 text-zinc-400">{w.estimatedEffort}</td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/workflows/${w.slug}`}
                      target="_blank"
                      className="text-xs text-lime hover:underline"
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
