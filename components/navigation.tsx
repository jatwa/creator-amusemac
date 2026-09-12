"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./theme-toggle";
import { CurrencySwitcher } from "./currency-switcher";
import { UserNav } from "./user-nav";

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

  // Core Product Navigation Links
  const primaryNavLinks = [
    { name: "Tools", href: "/tools" },
    { name: "Prompts", href: "/prompts" },
    { name: "Workflows", href: "/workflows" },
    { name: "Festivals", href: "/festivals" },
    { name: "Journal", href: "/journal" },
    { name: "Vault", href: "/prompts/vault" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 dark:bg-black/85 backdrop-blur-xl shadow-subtle"
          : "border-b border-border/40 bg-background/60 dark:bg-black/60 backdrop-blur-lg"
      }`}
    >
      <nav className="shell flex h-12 sm:h-14 items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link
            href="/"
            className="flex items-center gap-1 font-medium tracking-tight text-primary text-base transition-opacity hover:opacity-80"
          >
            <span className="font-semibold text-lg">creatorintel</span>
            <span className="text-accent font-bold">.</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-0.5 md:flex">
            {primaryNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(`${link.href}/`)) ||
                    (link.href === "/journal" && pathname.startsWith("/blog"));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-xs font-normal transition-colors rounded-full ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-secondary hover:text-primary"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 rounded-full bg-black/5 dark:bg-white/10 -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Global Right Actions: Search + Pro Upgrade + Currency + Theme + Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <Link
            href="/search"
            aria-label="Search Platform"
            className={`flex h-8 items-center gap-2 rounded-full px-2.5 sm:px-3 text-xs transition-colors ${
              pathname === "/search"
                ? "text-primary bg-black/5 dark:bg-white/10 font-medium"
                : "text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/10"
            }`}
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

          {/* Pro Pass Link */}
          <Link
            href="/pricing"
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-mono font-medium transition ${
              pathname === "/pricing"
                ? "border-accent/40 bg-accent/15 text-accent"
                : "border-border bg-surface text-secondary hover:text-accent hover:border-accent/30"
            }`}
          >
            <span className="text-accent">⚡</span>
            <span>Pro</span>
          </Link>

          {/* Currency Switcher Pill */}
          <CurrencySwitcher variant="pill" className="hidden sm:inline-block" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile / Google Sign In */}
          <UserNav />

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

      {/* Full-Screen Minimal Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-12 bottom-0 z-50 bg-background/98 dark:bg-black/95 backdrop-blur-2xl md:hidden overflow-y-auto px-6 py-8 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[11px] font-mono uppercase tracking-widest text-tertiary">
                  Cinematic Intelligence
                </p>
                <div className="flex flex-col space-y-3">
                  {primaryNavLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between text-2xl font-semibold tracking-tight text-primary hover:text-accent transition-colors"
                    >
                      <span>{link.name}</span>
                    </Link>
                  ))}
                  
                  {/* Pro Mobile Link */}
                  <Link
                    href="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between text-2xl font-semibold tracking-tight text-accent hover:opacity-80 transition-opacity pt-2 border-t border-border-subtle"
                  >
                    <span className="flex items-center gap-2">
                      <span>⚡</span>
                      <span>Pro Intelligence</span>
                    </span>
                    <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-mono font-medium text-accent">
                      Upgrade
                    </span>
                  </Link>
                </div>
              </div>

              {/* Universal Search in Mobile Menu */}
              <div className="border-t border-border pt-6 space-y-3">
                <p className="text-[11px] font-mono uppercase tracking-widest text-tertiary">
                  Universal Search
                </p>
                <Link
                  href="/search"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3.5 text-sm text-secondary hover:text-primary transition-colors"
                >
                  <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search tools, prompts, festivals...</span>
                </Link>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-8 border-t border-border mt-8 flex flex-col gap-4 text-xs text-tertiary">
              <div className="flex items-center justify-between">
                <span>Account:</span>
                <UserNav />
              </div>
              <div className="flex items-center justify-between">
                <span>Currency:</span>
                <CurrencySwitcher variant="pill" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                <span>© {new Date().getFullYear()} Amusemac Studio</span>
                <div className="flex items-center gap-2">
                  <span>Theme:</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
