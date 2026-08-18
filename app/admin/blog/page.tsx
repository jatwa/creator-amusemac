import Link from "next/link";
import { db } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  const blogs = db.getAllBlogs();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Blog &amp; Editorial Content Management
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Publish, edit, draft, and audit source attributions for long-form essays, benchmarks, and cinematography deep dives.
          </p>
        </div>
      </div>

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-black/40 text-[11px] font-semibold uppercase text-zinc-400">
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
            <tbody className="divide-y divide-line/60">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white leading-snug">{b.title}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">/blog/{b.slug}</p>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <p className="font-medium text-white">{b.author.name}</p>
                    <p className="text-[10px] text-zinc-500">{b.author.role}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="rounded bg-black/40 border border-line px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono">{b.readingTime}</td>
                  <td className="py-3.5 px-4 text-zinc-400 font-mono">{b.publishedAt}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-bold uppercase text-[10px] ${
                        b.status === "published"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/blog/${b.slug}`}
                      target="_blank"
                      className="rounded border border-line bg-panel px-2.5 py-1 text-[11px] font-semibold text-lime hover:border-lime"
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
