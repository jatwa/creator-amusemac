import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#08080a",
          deep: "#050507",
          elevated: "#0e0e12",
        },
        panel: {
          DEFAULT: "#131318",
          hover: "#1a1a22",
          active: "#22222c",
        },
        line: {
          DEFAULT: "#22222a",
          subtle: "#1c1c24",
          bright: "#3f3f4a",
        },
        lime: {
          DEFAULT: "#d9ff4a",
          dim: "#a8cc28",
          muted: "rgba(217, 255, 74, 0.15)",
        },
        cine: {
          amber: "#f59e0b",
          cyan: "#38bdf8",
          emerald: "#10b981",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 48px rgba(217, 255, 74, .12)",
        "glow-subtle": "0 0 24px rgba(217, 255, 74, .06)",
        card: "0 8px 30px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
