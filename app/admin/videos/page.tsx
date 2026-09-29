import React from "react";
import Link from "next/link";
import { db } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export default function AdminVideosPage() {
  const videos = db.getAllVideos();

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">Videos</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          Video Masterclass &amp; Breakdown Management
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
          Curate, embed, verify creator attribution, and manage platform links for visual breakdowns and timeline case studies.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-[10px] font-semibold uppercase text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Title / Slug</th>
                <th className="py-3.5 px-4">Creator / Channel</th>
                <th className="py-3.5 px-4">Platform</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {videos.map((v) => (
                <tr key={v.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white leading-snug">{v.title}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">/videos/{v.slug}</p>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <a
                      href={v.creator.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-amber-400 underline hover:text-white"
                    >
                      {v.creator.name} ↗
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-zinc-950 border border-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300 uppercase">
                      {v.platform}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono">{v.duration}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{v.category}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded px-2.5 py-0.5 font-bold uppercase text-[10px] border ${
                        v.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/videos/${v.slug}`}
                      target="_blank"
                      className="rounded border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-400/20 transition"
                    >
                      Watch ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
