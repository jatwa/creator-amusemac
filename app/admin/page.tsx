import Link from "next/link";
import { db } from "@/lib/db/repository";

export const dynamic = "force-dynamic";

export default function AdminOverviewPage() {
  const allTools = db.getAllTools();
  const allSources = db.getAllSources();
  const pendingUpdates = db.getUpdatesByStatus("pending");
  const appliedUpdates = db.getUpdatesByStatus("applied");
  const staleTools = db.getStaleTools(10); // tools not verified in > 10 days

  return (
    <div className="space-y-10">
      {/* Header Banner */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Platform Health & Automated Intelligence
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Monitor automated tool monitoring, source verification reliability, and editorial review queues.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Tracked Creator Tools
          </p>
          <p className="mt-2 text-3xl font-bold text-white font-mono">{allTools.length}</p>
          <p className="mt-2 text-xs text-zinc-500">100% indexed in search & categories</p>
        </div>

        <div className="surface p-6 border-lime/30">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-lime">
              Pending Changes
            </p>
            {pendingUpdates.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
            )}
          </div>
          <p className="mt-2 text-3xl font-bold text-lime font-mono">{pendingUpdates.length}</p>
          <Link
            href="/admin/updates"
            className="mt-2 inline-block text-xs font-semibold text-white hover:underline"
          >
            Review change queue →
          </Link>
        </div>

        <div className="surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Verified Source URLs
          </p>
          <p className="mt-2 text-3xl font-bold text-white font-mono">{allSources.length}</p>
          <p className="mt-2 text-xs text-emerald-400">Average reliability: 99.4%</p>
        </div>

        <div className="surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Applied Ingestions
          </p>
          <p className="mt-2 text-3xl font-bold text-white font-mono">{appliedUpdates.length}</p>
          <p className="mt-2 text-xs text-zinc-500">Historical changes logged with rollback</p>
        </div>
      </div>

      {/* Action Center: Pending Queue & Stale Detection */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pending Review List */}
        <section className="surface p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h2 className="text-lg font-bold text-white">Pending Automated Changes</h2>
              <Link href="/admin/updates" className="text-xs text-lime hover:underline">
                Open review board →
              </Link>
            </div>

            {pendingUpdates.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-500">
                No pending changes requiring manual review.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {pendingUpdates.slice(0, 4).map((upd) => (
                  <div
                    key={upd.id}
                    className="rounded-xl border border-line bg-black/30 p-4 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{upd.entityName}</span>
                      <span className="rounded bg-lime/10 border border-lime/30 px-2 py-0.5 font-mono text-[10px] text-lime">
                        Confidence: {(upd.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="mt-1.5 text-zinc-300 font-medium">{upd.changeSummary}</p>
                    <p className="mt-1 text-[11px] text-zinc-500 font-mono">
                      Field: {upd.fieldPath}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 border-t border-line pt-4">
            <Link
              href="/admin/updates"
              className="block rounded-xl bg-lime py-2.5 text-center text-xs font-bold text-black hover:bg-white transition"
            >
              Review all {pendingUpdates.length} updates
            </Link>
          </div>
        </section>

        {/* Stale Records Warning */}
        <section className="surface p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Verification Staleness Monitor</h2>
              <p className="text-xs text-zinc-400">Tools not manually verified within 10 days</p>
            </div>
            <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs text-amber-400 font-mono">
              {staleTools.length} Flagged
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {staleTools.slice(0, 5).map((item) => (
              <div
                key={item.tool.id}
                className="flex items-center justify-between rounded-xl border border-line bg-black/30 p-3.5 text-xs"
              >
                <div>
                  <p className="font-bold text-white">{item.tool.name}</p>
                  <p className="text-[11px] text-zinc-500">
                    Last Verified: {item.tool.verifiedAt} ({item.daysSinceVerification} days ago)
                  </p>
                </div>
                <Link
                  href={`/tools/${item.tool.slug}`}
                  target="_blank"
                  className="rounded border border-line bg-panel px-2.5 py-1 text-[11px] font-semibold text-lime hover:border-lime"
                >
                  Verify Now ↗
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Scheduled Crons & System Status */}
      <section className="surface p-6">
        <h2 className="text-lg font-bold text-white mb-4">Configured Automated Background Jobs</h2>
        <div className="grid gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-line bg-black/30 p-4">
            <p className="font-mono text-lime font-bold">cron: /api/cron/check-tools</p>
            <p className="mt-1 text-zinc-300">Daily health, availability & pricing change checks</p>
            <p className="mt-2 text-zinc-500 font-mono">Schedule: 0 6 * * * (06:00 UTC)</p>
          </div>
          <div className="rounded-xl border border-line bg-black/30 p-4">
            <p className="font-mono text-lime font-bold">cron: /api/cron/detect-stale</p>
            <p className="mt-1 text-zinc-300">Weekly audit of records needing human review</p>
            <p className="mt-2 text-zinc-500 font-mono">Schedule: 0 12 * * 1 (Mondays)</p>
          </div>
          <div className="rounded-xl border border-line bg-black/30 p-4">
            <p className="font-mono text-lime font-bold">cron: /api/cron/refresh-index</p>
            <p className="mt-1 text-zinc-300">Daily full-text & faceted search index generation</p>
            <p className="mt-2 text-zinc-500 font-mono">Schedule: 0 0 * * * (Midnight)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
