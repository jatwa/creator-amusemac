import React from "react";
import Link from "next/link";
import { db } from "@/lib/db/repository";
import { AdminUpdateBoard } from "@/components/admin-update-board";

export const dynamic = "force-dynamic";

export default function AdminUpdatesPage() {
  const allUpdates = db.getAllUpdates();

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
          <Link href="/admin" className="hover:text-amber-400">Admin</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">Updates</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
          Automated Change Review Board
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-mono">
          Review detected field-level differences before applying them to production. Review evidence, edit values, or reject false positives.
        </p>
      </div>

      <AdminUpdateBoard initialUpdates={allUpdates} />
    </div>
  );
}
