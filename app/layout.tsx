import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/context/currency-context";
import { AuthProvider } from "@/components/auth-provider";
import { MotionConfig } from "@/components/motion/motion-config";

export const metadata: Metadata = {
  metadataBase: new URL("https://creatorintels.com"),
  title: {
    default: "Creator Intel — Intelligence for People Who Make Things",
    template: "%s — Creator Intel",
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
    siteName: "Creator Intel",
    title: "Creator Intel",
    description: "AI tools and workflows for visual storytellers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creator Intel",
    description: "AI tools and workflows for visual storytellers.",
  },
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
        {/* Google AdSense Site Verification & Ad Engine */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1556731799149585"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <MotionConfig>
          <AuthProvider>
            <ThemeProvider>
              <CurrencyProvider>{children}</CurrencyProvider>
            </ThemeProvider>
          </AuthProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
