import { db } from "@/lib/db/repository";
import { AdminUpdateBoard } from "@/components/admin-update-board";

export const dynamic = "force-dynamic";

export default function AdminUpdatesPage() {
  const allUpdates = db.getAllUpdates();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Automated Change Review Board
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Review detected field-level differences before applying them to production. Review evidence, edit values, or reject false positives.
        </p>
      </div>

      <AdminUpdateBoard initialUpdates={allUpdates} />
    </div>
  );
}
