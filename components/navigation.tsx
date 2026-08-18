"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { name: "Tools", href: "/tools" },
  { name: "Prompts", href: "/prompts" },
  { name: "Compare", href: "/compare" },
  { name: "Tutorials", href: "/tutorials" },
  { name: "Workflows", href: "/workflows" },
  { name: "Blog", href: "/blog" },
  { name: "Videos", href: "/videos" },
  { name: "Resources", href: "/resources" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/85 backdrop-blur-xl">
      <nav className="shell flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold tracking-tight text-white text-lg">
            creator<span className="text-lime">.</span>
          </Link>

          <div className="hidden items-center gap-5 xl:flex">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search Platform"
            className="flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-500 hover:text-white"
          >
            <span className="text-lime font-mono">⌕</span>
            <span className="hidden sm:inline">Search stack...</span>
          </Link>

          <Link
            href="/tools"
            className="rounded-full bg-lime px-4 py-2 text-xs font-semibold text-black transition hover:bg-white sm:text-sm"
          >
            Explore tools
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-400 hover:text-white xl:hidden"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-line bg-panel p-5 xl:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-lime"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
