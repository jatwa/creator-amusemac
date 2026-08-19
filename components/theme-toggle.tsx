"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current theme: ${theme}. Click to change theme`}
        aria-expanded={isOpen}
        className="flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
      >
        {theme === "system" ? (
          /* System Theme Icon */
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth="1.75" />
            <path d="M12 3v18" strokeWidth="1.75" />
            <path d="M12 3a9 9 0 010 18z" fill="currentColor" opacity="0.3" />
          </svg>
        ) : resolvedTheme === "dark" ? (
          /* Moon Icon */
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          /* Sun Icon */
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="4" strokeWidth="1.75" />
            <path
              strokeLinecap="round"
              strokeWidth="1.75"
              d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
            />
          </svg>
        )}
      </motion.button>

      {/* Popover Dropdown with Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-border bg-surface/95 backdrop-blur-xl p-1.5 shadow-2xl z-50 origin-top-right"
          >
            <button
              onClick={() => {
                setTheme("light");
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                theme === "light"
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="4" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
              </svg>
              <span>Light</span>
            </button>

            <button
              onClick={() => {
                setTheme("dark");
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                theme === "dark"
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <span>Dark</span>
            </button>

            <button
              onClick={() => {
                setTheme("system");
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                theme === "system"
                  ? "bg-accent/10 text-accent font-medium"
                  : "text-secondary hover:text-primary hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <path d="M12 3v18" strokeWidth="2" />
                <path d="M12 3a9 9 0 010 18z" fill="currentColor" opacity="0.3" />
              </svg>
              <span>System</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
