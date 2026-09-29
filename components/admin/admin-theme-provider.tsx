"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type AdminTheme = "light" | "dark" | "system";
export type AdminResolvedTheme = "light" | "dark";

interface AdminThemeContextType {
  theme: AdminTheme;
  resolvedTheme: AdminResolvedTheme;
  setTheme: (theme: AdminTheme) => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const ADMIN_THEME_STORAGE_KEY = "ci_admin_theme";

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AdminTheme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<AdminResolvedTheme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(ADMIN_THEME_STORAGE_KEY) as AdminTheme | null;
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
        setThemeState(savedTheme);
      }
    } catch {
      // localStorage may be disabled or inaccessible
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateResolvedTheme = () => {
      let active: AdminResolvedTheme = "dark";
      if (theme === "system") {
        active = mediaQuery.matches ? "dark" : "light";
      } else {
        active = theme;
      }
      setResolvedTheme(active);
    };

    updateResolvedTheme();

    const listener = () => {
      if (theme === "system") {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [theme, mounted]);

  const setTheme = (newTheme: AdminTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(ADMIN_THEME_STORAGE_KEY, newTheme);
    } catch {
      // localStorage error handling
    }
  };

  return (
    <AdminThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      <div
        id="ci-admin-scope"
        data-admin-theme={resolvedTheme}
        className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
          resolvedTheme === "dark"
            ? "dark bg-zinc-950 text-zinc-100 selection:bg-amber-400/20 selection:text-amber-300"
            : "light bg-zinc-100 text-zinc-900 selection:bg-amber-500/20 selection:text-amber-800"
        }`}
      >
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}
