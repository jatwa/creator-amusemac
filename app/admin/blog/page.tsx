import Link from "next/link";
import { db } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  const blogs = db.getAllBlogs();

  return (
    <div className="space-y-8 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
            <Link href="/admin" className="hover:text-amber-400">Admin</Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200">Blog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Blog &amp; Editorial Content Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
            Publish, edit, draft, and audit source attributions for long-form essays, benchmarks, and cinematography deep dives.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 bg-zinc-950 text-[10px] font-semibold uppercase text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Title / Slug</th>
                <th className="py-3.5 px-4">Author</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Reading Time</th>
                <th className="py-3.5 px-4">Published</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-zinc-800/40 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white leading-snug">{b.title}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">/blog/{b.slug}</p>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <p className="font-medium text-white">{b.author.name}</p>
                    <p className="text-[10px] text-zinc-500">{b.author.role}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-zinc-950 border border-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-300 uppercase">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono">{b.readingTime}</td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono">{b.publishedAt}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded px-2.5 py-0.5 font-bold uppercase text-[10px] border ${
                        b.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      className="rounded border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-400/20 transition"
                    >
                      View Live ↗
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
