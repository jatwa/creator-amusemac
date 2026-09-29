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

import { AdminThemeProvider } from "@/components/admin/admin-theme-provider";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const isAuthorized = await isServerAdmin();
  const session = await getServerSession(authOptions);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 font-mono">
        <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-zinc-900 p-8 text-center space-y-5 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-2xl font-mono">
            403
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">Admin Authorization Required</h1>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              {session?.user?.email ? (
                <>
                  Signed in as <span className="font-mono text-amber-400">{session.user.email}</span>. This account does not have administrative privileges for the Creator Intel Command Center.
                </>
              ) : (
                "You must be signed in with an authorized Google account to access this private command center."
              )}
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/"
              className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white hover:border-zinc-500 transition font-mono"
            >
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminThemeProvider>
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 transition-colors">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-1.5 text-sm">
              <span>creatorintel</span>
              <span className="text-amber-500 dark:text-amber-400">.</span>
            </Link>
            <span className="rounded border border-amber-500/30 bg-amber-500/10 dark:border-amber-400/30 dark:bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              COMMAND CENTER
            </span>

            <nav className="hidden xl:flex items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <Link href="/admin" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Overview</Link>
              <Link href="/admin/users" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Users</Link>
              <Link href="/admin/subscriptions" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Subscriptions</Link>
              <Link href="/admin/entitlements" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Entitlements</Link>
              <Link href="/admin/access-debugger" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Access Debugger</Link>
              <Link href="/admin/simulator" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Simulator</Link>
              <Link href="/admin/billing" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Billing</Link>
              <Link href="/admin/billing/webhooks" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Webhooks</Link>
              <Link href="/admin/ai" className="hover:text-amber-600 dark:hover:text-amber-400 transition">AI X-Ray</Link>
              <Link href="/admin/vault" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Vault</Link>
              <Link href="/admin/system" className="hover:text-amber-600 dark:hover:text-amber-400 transition">System</Link>
              <Link href="/admin/analytics" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Analytics</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <AdminThemeToggle />
            <Link
              href="/"
              className="rounded border border-zinc-300 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 px-2.5 py-1 text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-700 transition"
            >
              ← Public Site
            </Link>
            <span className="hidden sm:flex items-center gap-1.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] px-2.5 py-1 rounded">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              Verified Admin
            </span>
          </div>
        </div>
      </header>

      {/* Sub Navigation Bar for smaller screens */}
      <div className="xl:hidden border-b border-zinc-200 bg-white/90 dark:border-zinc-800 dark:bg-zinc-900/80 px-4 py-2 overflow-x-auto">
        <nav className="flex items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-max">
          <Link href="/admin" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Overview</Link>
          <Link href="/admin/users" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Users</Link>
          <Link href="/admin/subscriptions" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Subscriptions</Link>
          <Link href="/admin/entitlements" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Entitlements</Link>
          <Link href="/admin/access-debugger" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Access Debugger</Link>
          <Link href="/admin/simulator" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Simulator</Link>
          <Link href="/admin/billing" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Billing</Link>
          <Link href="/admin/billing/webhooks" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Webhooks</Link>
          <Link href="/admin/ai" className="hover:text-amber-600 dark:hover:text-amber-400 transition">AI X-Ray</Link>
          <Link href="/admin/vault" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Vault</Link>
          <Link href="/admin/system" className="hover:text-amber-600 dark:hover:text-amber-400 transition">System</Link>
          <Link href="/admin/analytics" className="hover:text-amber-600 dark:hover:text-amber-400 transition">Analytics</Link>
        </nav>
      </div>

      {/* Main Admin Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </AdminThemeProvider>
  );
}
