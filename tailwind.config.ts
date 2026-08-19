import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
          hover: "var(--surface-hover)",
        },
        border: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
          bright: "var(--border-bright)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          muted: "var(--accent-muted)",
        },
        // Text semantic aliases
        primary: "var(--foreground)",
        secondary: "var(--muted-foreground)",
        tertiary: "var(--tertiary)",

        // Backward compatibility mappings
        ink: {
          DEFAULT: "var(--background)",
          deep: "var(--background)",
          elevated: "var(--surface)",
        },
        panel: {
          DEFAULT: "var(--surface)",
          hover: "var(--surface-hover)",
          active: "var(--surface-elevated)",
        },
        line: {
          DEFAULT: "var(--border)",
          subtle: "var(--border-subtle)",
          bright: "var(--border-bright)",
        },
        lime: {
          DEFAULT: "var(--accent)",
          dim: "var(--accent)",
          muted: "var(--accent-muted)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          "ui-monospace",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          "monospace",
        ],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 12px 32px -4px rgba(0, 0, 0, 0.12)",
        "dark-card": "0 4px 20px -2px rgba(0, 0, 0, 0.4)",
        "glow-subtle": "0 0 24px var(--accent-muted)",
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
