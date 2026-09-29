"use client";

import React from "react";
import { useAdminTheme, AdminTheme } from "./admin-theme-provider";

export function AdminThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useAdminTheme();

  const options: { value: AdminTheme; label: string; icon: string }[] = [
    { value: "light", label: "Light", icon: "☀" },
    { value: "dark", label: "Dark", icon: "☾" },
    { value: "system", label: "System", icon: "◐" },
  ];

  return (
    <div
      role="group"
      aria-label="Admin color theme"
      className="inline-flex items-center rounded-lg border border-zinc-300 bg-zinc-200/90 p-0.5 dark:border-zinc-800 dark:bg-zinc-900 text-xs font-mono shadow-sm"
    >
      {options.map((opt) => {
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-pressed={isActive}
            aria-label={`${opt.label} theme`}
            title={`${opt.label} Theme (${opt.value === "system" ? `System matches ${resolvedTheme}` : opt.label})`}
            className={`flex items-center gap-1 rounded px-2 py-1 text-[11px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400 ${
              isActive
                ? "bg-white text-zinc-950 shadow-sm border border-zinc-300/80 font-bold dark:border-amber-400/40 dark:bg-amber-400/20 dark:text-amber-300"
                : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <span aria-hidden="true" className="text-xs">{opt.icon}</span>
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
