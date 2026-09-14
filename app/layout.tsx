import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/context/currency-context";
import { AuthProvider } from "@/components/auth-provider";
import { MotionConfig } from "@/components/motion/motion-config";

import { AdminPreviewBanner } from "@/components/admin/admin-preview-banner";

export const metadata: Metadata = {
  metadataBase: new URL("https://creatorintels.com"),
  title: {
    default: "Creator Intel — The Intelligence Layer for Modern Filmmakers",
    template: "%s",
  },
  description:
    "Creator Intel gives filmmakers and commercial creators director recipes, cinematography intelligence, AI workflows, filmmaking research, production tools and festival intelligence.",
  keywords: [
    "AI tools for creators",
    "filmmaking AI",
    "director recipes",
    "AI prompts",
    "creator tools",
    "cinematography intelligence",
    "video AI models",
    "camera syntax",
    "film festivals intelligence",
    "cinematography prompt engineering",
  ],
  alternates: {
    canonical: "https://creatorintels.com",
  },
  openGraph: {
    type: "website",
    siteName: "Creator Intel",
    title: "Creator Intel — The Intelligence Layer for Modern Filmmakers",
    description:
      "Creator Intel gives filmmakers and commercial creators director recipes, cinematography intelligence, AI workflows, filmmaking research, production tools and festival intelligence.",
    url: "https://creatorintels.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creator Intel — The Intelligence Layer for Modern Filmmakers",
    description:
      "Creator Intel gives filmmakers and commercial creators director recipes, cinematography intelligence, AI workflows, filmmaking research, production tools and festival intelligence.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
              <CurrencyProvider>
                <AdminPreviewBanner />
                {children}
              </CurrencyProvider>
            </ThemeProvider>
          </AuthProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
