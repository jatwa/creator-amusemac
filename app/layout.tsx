import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { MotionConfig } from "@/components/motion/motion-config";

export const metadata: Metadata = {
  metadataBase: new URL("https://creator.amusemac.com"),
  title: {
    default: "Creator by Amusemac — Intelligence for People Who Make Things",
    template: "%s — Creator by Amusemac",
  },
  description:
    "Editorial AI production intelligence, verified camera models, prompt architecture, and director workflows for filmmakers and visual storytellers.",
  keywords: [
    "AI tools for creators",
    "filmmaking AI",
    "AI prompts",
    "creator tools",
    "video AI models",
    "camera syntax",
  ],
  openGraph: {
    type: "website",
    siteName: "Creator by Amusemac",
    title: "Creator by Amusemac",
    description: "AI tools and workflows for visual storytellers.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('creator-theme');
    var isDark = stored === 'dark' || ((!stored || stored === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <MotionConfig>
          <ThemeProvider>{children}</ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
