import { Metadata } from "next";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AccountView } from "@/components/account-view";

export const metadata: Metadata = {
  title: "Account & Subscriptions — Creator Intel",
  description: "Manage your Prompt Vault subscription tier, monthly unlock quotas, and unlocked recipe library.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-background text-primary transition-colors">
      <Navigation />

      {/* Header */}
      <div className="border-b border-border-subtle bg-surface/30 py-12 sm:py-16">
        <div className="shell">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-tertiary mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-secondary">Account</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Director Account &amp; Vault Access
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Manage your active subscription plan, monthly unlock limits, and claimed production recipes.
          </p>
        </div>
      </div>

      <div className="shell py-12">
        <AccountView />
      </div>

      <Footer />
    </main>
  );
}
