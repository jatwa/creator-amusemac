import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090b",
        panel: "#121214",
        line: "#27272a",
        lime: "#d9ff4a",
      },
      boxShadow: { glow: "0 0 48px rgba(217, 255, 74, .12)" },
    },
  },
  plugins: [],
};

export default config;
