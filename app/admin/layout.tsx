import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin & Review Control Center | Creator by Amusemac",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-zinc-100">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-50 border-b border-line bg-panel/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold tracking-tight text-white">
              creator<span className="text-lime">.</span>
            </Link>
            <span className="rounded-md border border-lime/30 bg-lime/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-lime">
              CONTROL CENTER
            </span>

            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold">
              <Link href="/admin" className="text-zinc-300 hover:text-lime transition">
                Overview &amp; Health
              </Link>
              <Link href="/admin/updates" className="text-zinc-300 hover:text-lime transition">
                Pending Updates
              </Link>
              <Link href="/admin/blog" className="text-zinc-300 hover:text-lime transition">
                Blog CMS
              </Link>
              <Link href="/admin/videos" className="text-zinc-300 hover:text-lime transition">
                Videos CMS
              </Link>
              <Link href="/admin/sources" className="text-zinc-300 hover:text-lime transition">
                Source Ledger
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="rounded-lg border border-line bg-ink px-3 py-1.5 text-zinc-400 hover:text-white transition"
            >
              ← Public Site
            </Link>
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Engine Online
            </span>
          </div>
        </div>
      </header>

      {/* Admin Body Content */}
      <main className="mx-auto max-w-7xl px-5 sm:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
