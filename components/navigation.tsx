"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navPillars = [
    {
      name: "Discover",
      href: "/tools",
      sublinks: [
        { name: "AI Tools Directory", href: "/tools" },
        { name: "Video Generation Hub", href: "/categories/video", badge: "Flagship" },
        { name: "All Categories", href: "/categories" },
      ],
    },
    {
      name: "Create",
      href: "/prompts",
      sublinks: [
        { name: "Prompt Library", href: "/prompts" },
        { name: "Production Workflows", href: "/workflows" },
      ],
    },
    {
      name: "Compare",
      href: "/compare",
      sublinks: [
        { name: "Model Comparisons", href: "/compare" },
        { name: "Runway vs Kling", href: "/compare/runway-vs-kling" },
      ],
    },
    {
      name: "Learn",
      href: "/blog",
      sublinks: [
        { name: "Creator Journal", href: "/blog" },
        { name: "Masterclasses & Videos", href: "/videos" },
        { name: "Tutorials", href: "/tutorials" },
        { name: "Director Resources", href: "/resources" },
      ],
    },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? "border-b border-line bg-ink/90 backdrop-blur-xl shadow-lg shadow-black/40"
          : "border-b border-white/5 bg-ink/80 backdrop-blur-md"
      }`}
    >
      <nav className="shell flex h-16 items-center justify-between">
        {/* Brand Logo & Editorial Taxonomy */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 group font-bold tracking-tight text-white text-lg focus-visible:ring-1"
          >
            <span className="h-2 w-2 rounded-full bg-lime group-hover:scale-125 transition-transform" />
            <span>creator</span>
            <span className="font-mono text-xs text-zinc-500 font-normal hidden sm:inline">
              / intelligence
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-1 lg:flex">
            {navPillars.map((pillar) => {
              const isActive =
                pathname === pillar.href ||
                pillar.sublinks.some((s) => pathname.startsWith(s.href));

              return (
                <div key={pillar.name} className="relative group px-3 py-2">
                  <Link
                    href={pillar.href}
                    className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                      isActive ? "text-lime" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {pillar.name}
                  </Link>

                  {/* Dropdown Menu on Hover */}
                  <div className="invisible group-hover:visible group-focus-within:visible opacity-0 group-hover:opacity-100 transition-all duration-150 absolute top-full left-0 w-56 pt-2">
                    <div className="surface p-2 shadow-card backdrop-blur-xl bg-panel/95 border-line-bright rounded-xl">
                      {pillar.sublinks.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-zinc-300 hover:bg-white/5 hover:text-white transition"
                        >
                          <span>{sub.name}</span>
                          {sub.badge && (
                            <span className="rounded-full bg-lime/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-lime border border-lime/30">
                              {sub.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search Platform"
            className="flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs text-zinc-400 transition hover:border-zinc-500 hover:text-white"
          >
            <span className="text-lime font-mono text-xs">⌕</span>
            <span className="hidden sm:inline">Search intelligence...</span>
            <kbd className="hidden font-mono text-[10px] text-zinc-600 sm:inline bg-ink px-1 rounded border border-line">
              /
            </kbd>
          </Link>

          <Link
            href="/categories/video"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-lime/30 bg-lime/10 px-3.5 py-1.5 text-xs font-semibold text-lime transition hover:bg-lime hover:text-black"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <span>Video AI Hub</span>
          </Link>

          <Link
            href="/tools"
            className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black transition hover:bg-lime"
          >
            Explore Tools
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-400 hover:text-white lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
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

      {/* Structured Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-line bg-panel/98 p-5 lg:hidden backdrop-blur-2xl">
          <div className="space-y-6">
            {navPillars.map((pillar) => (
              <div key={pillar.name} className="space-y-2">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-lime">
                  {pillar.name}
                </p>
                <div className="grid grid-cols-1 gap-1 pl-2 border-l border-line/60">
                  {pillar.sublinks.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between py-1.5 text-sm font-medium text-zinc-300 hover:text-white"
                    >
                      <span>{sub.name}</span>
                      {sub.badge && (
                        <span className="rounded-full bg-lime/10 px-1.5 py-0.2 font-mono text-[9px] text-lime">
                          {sub.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-line flex flex-col gap-2">
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg border border-line bg-ink py-2.5 text-xs text-zinc-300"
              >
                <span>⌕ Full Platform Search</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
