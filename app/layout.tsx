import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://creator.amusemac.com"),
  title: { default: "Creator by Amusemac | AI tools for visual storytellers", template: "%s | Creator by Amusemac" },
  description: "The practical AI toolkit for filmmakers, editors, designers, and content creators.",
  keywords: ["AI tools for creators", "filmmaking AI", "AI prompts", "creator tools"],
  openGraph: { type: "website", siteName: "Creator by Amusemac", title: "Creator by Amusemac", description: "AI tools and workflows for visual storytellers." },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
