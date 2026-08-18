import Link from "next/link";
import { db } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export default function AdminVideosPage() {
  const videos = db.getAllVideos();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Video Masterclass &amp; Breakdown Management
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Curate, embed, verify creator attribution, and manage platform links for visual breakdowns and timeline case studies.
        </p>
      </div>

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-black/40 text-[11px] font-semibold uppercase text-zinc-400">
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
            <tbody className="divide-y divide-line/60">
              {videos.map((v) => (
                <tr key={v.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white leading-snug">{v.title}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">/videos/{v.slug}</p>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <a
                      href={v.creator.channelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-lime underline hover:text-white"
                    >
                      {v.creator.name} ↗
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-black/40 border border-line px-2 py-0.5 font-mono text-[10px] text-zinc-300 uppercase">
                      {v.platform}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono">{v.duration}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{v.category}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-bold uppercase text-[10px] ${
                        v.status === "published"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/videos/${v.slug}`}
                      target="_blank"
                      className="rounded border border-line bg-panel px-2.5 py-1 text-[11px] font-semibold text-lime hover:border-lime"
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
