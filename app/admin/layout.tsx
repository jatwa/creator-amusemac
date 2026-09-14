import Link from "next/link";
import { Metadata } from "next";
import { isServerAdmin } from "@/lib/auth/admin-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth-options";

export const metadata: Metadata = {
  title: "Admin Command Center",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthorized = await isServerAdmin();
  const session = await getServerSession(authOptions);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-ink text-zinc-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-panel p-8 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-2xl font-mono">
            403
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Authorization Required</h1>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              {session?.user?.email ? (
                <>
                  Signed in as <span className="font-mono text-zinc-200">{session.user.email}</span>. This account does not have administrative privileges for the Creator Intel Command Center.
                </>
              ) : (
                "You must be signed in with an authorized Google account to access this private command center."
              )}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/"
              className="rounded-xl border border-line bg-ink px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white transition"
            >
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-line bg-panel/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>creatorintel</span>
              <span className="text-lime">.</span>
            </Link>
            <span className="rounded-md border border-lime/30 bg-lime/10 px-2.5 py-0.5 font-mono text-[11px] font-bold text-lime">
              COMMAND CENTER
            </span>

            <nav className="hidden xl:flex items-center gap-4 text-xs font-medium text-zinc-400">
              <Link href="/admin" className="hover:text-lime transition">Overview</Link>
              <Link href="/admin/users" className="hover:text-lime transition">Users</Link>
              <Link href="/admin/entitlements" className="hover:text-lime transition">Entitlements</Link>
              <Link href="/admin/simulator" className="hover:text-lime transition">Simulator</Link>
              <Link href="/admin/access-debugger" className="hover:text-lime transition">Access Debugger</Link>
              <Link href="/admin/billing" className="hover:text-lime transition">Billing &amp; Webhooks</Link>
              <Link href="/admin/system" className="hover:text-lime transition">System Health</Link>
              <Link href="/admin/content" className="hover:text-lime transition">Content</Link>
              <Link href="/admin/vault" className="hover:text-lime transition">Vault</Link>
              <Link href="/admin/analytics" className="hover:text-lime transition">Analytics</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              className="rounded-lg border border-line bg-ink px-3 py-1.5 text-zinc-400 hover:text-white transition"
            >
              ← Public Site
            </Link>
            <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Verified Admin
            </span>
          </div>
        </div>
      </header>

      {/* Sub Navigation Bar for smaller screens */}
      <div className="xl:hidden border-b border-line bg-black/40 px-5 py-2.5 overflow-x-auto">
        <nav className="flex items-center gap-4 text-xs font-medium text-zinc-400 min-w-max">
          <Link href="/admin" className="hover:text-lime transition">Overview</Link>
          <Link href="/admin/users" className="hover:text-lime transition">Users</Link>
          <Link href="/admin/entitlements" className="hover:text-lime transition">Entitlements</Link>
          <Link href="/admin/simulator" className="hover:text-lime transition">Simulator</Link>
          <Link href="/admin/access-debugger" className="hover:text-lime transition">Access Debugger</Link>
          <Link href="/admin/billing" className="hover:text-lime transition">Billing &amp; Webhooks</Link>
          <Link href="/admin/system" className="hover:text-lime transition">System Health</Link>
          <Link href="/admin/content" className="hover:text-lime transition">Content</Link>
          <Link href="/admin/vault" className="hover:text-lime transition">Vault</Link>
          <Link href="/admin/analytics" className="hover:text-lime transition">Analytics</Link>
        </nav>
      </div>

      {/* Main Admin Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-5 sm:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
