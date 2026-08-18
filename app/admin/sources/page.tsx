import { db } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export default function AdminSourcesPage() {
  const sources = db.getAllSources();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Verified Evidence & Source Ledger
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Immutable registry of external domains, pricing pages, API documentations, and manual audit sources.
        </p>
      </div>

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-black/40 text-[11px] font-semibold uppercase text-zinc-400">
              <tr>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Source URL</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Publisher</th>
                <th className="py-3.5 px-4">Reliability</th>
                <th className="py-3.5 px-4">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {sources.map((src) => {
                const tool = db.getToolById(src.entityId);
                return (
                  <tr key={src.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {tool?.name || src.entityId}
                    </td>
                    <td className="py-3.5 px-4">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime underline hover:text-white"
                      >
                        {src.url} ↗
                      </a>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-black/40 border border-line px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                        {src.sourceType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">{src.publisher}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      {(src.reliabilityScore * 100).toFixed(0)}%
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 font-mono">
                      {src.lastVerifiedAt || "Pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
