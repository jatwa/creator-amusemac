"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Tools", href: "/tools" },
    { name: "Prompts", href: "/prompts" },
    { name: "Compare", href: "/compare" },
    { name: "Video Hub", href: "/categories/video", badge: "Flagship" },
    { name: "Workflows", href: "/workflows" },
    { name: "Journal", href: "/blog" },
    { name: "Videos", href: "/videos" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 dark:bg-black/80 backdrop-blur-xl shadow-subtle"
          : "border-b border-border/40 bg-background/60 dark:bg-black/60 backdrop-blur-lg"
      }`}
    >
      <nav className="shell flex h-12 sm:h-14 items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-medium tracking-tight text-primary text-base transition-opacity hover:opacity-80"
          >
            <span className="font-semibold text-lg">creator</span>
            <span className="text-accent font-bold">.</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-xs font-normal transition-colors rounded-full ${
                    isActive
                      ? "text-primary font-medium bg-black/5 dark:bg-white/10"
                      : "text-secondary hover:text-primary hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {link.name}
                  {link.badge && (
                    <span className="ml-1.5 rounded-full bg-accent/10 px-1.5 py-0.2 font-mono text-[9px] font-medium text-accent">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Global Right Actions: Search + Theme Toggle + CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <Link
            href="/search"
            aria-label="Search Platform"
            className="flex h-8 items-center gap-2 rounded-full px-2.5 sm:px-3 text-xs text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="hidden sm:inline font-normal">Search</span>
            <kbd className="hidden font-mono text-[10px] text-tertiary sm:inline bg-black/5 dark:bg-white/10 px-1 rounded">
              /
            </kbd>
          </Link>

          {/* Apple-style Theme Switcher */}
          <ThemeToggle />

          {/* Clean Primary Action */}
          <Link
            href="/tools"
            className="hidden sm:inline-flex rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-opacity hover:opacity-90"
          >
            Explore
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 md:hidden transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Full-Screen Apple-Style Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-12 bottom-0 z-50 bg-background/98 dark:bg-black/95 backdrop-blur-2xl md:hidden overflow-y-auto px-6 py-8 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-tertiary">
                Navigation
              </p>
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-2xl font-semibold tracking-tight text-primary hover:text-accent transition-colors"
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-mono font-medium text-accent">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-3">
              <p className="text-[11px] font-mono uppercase tracking-widest text-tertiary">
                Discovery &amp; Search
              </p>
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 text-sm text-secondary hover:text-primary transition-colors"
              >
                <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search tools, prompts, recipes...</span>
              </Link>
            </div>
          </div>

          <div className="pt-8 border-t border-border mt-8 flex items-center justify-between text-xs text-tertiary">
            <span>© 2026 Creator by Amusemac</span>
            <div className="flex items-center gap-2">
              <span>Theme:</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
