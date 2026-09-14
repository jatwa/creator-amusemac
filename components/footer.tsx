import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-border bg-surface/40 text-secondary transition-colors">
      <div className="shell grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="text-base font-semibold tracking-tight text-primary inline-flex items-center gap-1">
            <span>creatorintel</span>
            <span className="text-accent">.</span>
          </Link>
          <p className="text-xs leading-relaxed text-secondary max-w-sm font-normal">
            Production intelligence, verified generative models, prompt architecture, and director workflows for filmmakers and visual storytellers.
          </p>
          <p className="text-[11px] text-tertiary font-mono pt-1">
            Zero sponsored rankings. 100% verified ground truth.
          </p>
        </div>

        {/* Platform Column */}
        <div>
          <p className="text-xs font-medium text-primary mb-3">Intelligence</p>
          <div className="space-y-2 text-xs text-secondary">
            <Link href="/tools" className="block transition hover:text-primary">Tools Directory</Link>
            <Link href="/prompts/factory" className="block font-medium text-accent transition hover:opacity-80">Director's Studio</Link>
            <Link href="/vault" className="block transition hover:text-primary">The Vault</Link>
            <Link href="/prompts" className="block transition hover:text-primary">Prompt Recipes</Link>
            <Link href="/compare" className="block transition hover:text-primary">Model Comparisons</Link>
            <Link href="/workflows" className="block transition hover:text-primary">Workflows</Link>
            <Link href="/journal" className="block transition hover:text-primary">Creator Journal</Link>
          </div>
        </div>

        {/* Disciplines Column */}
        <div>
          <p className="text-xs font-medium text-primary mb-3">Disciplines</p>
          <div className="space-y-2 text-xs text-secondary">
            <Link href="/categories/video" className="block font-medium text-accent transition hover:opacity-80">Video Generation Hub</Link>
            <Link href="/categories/image" className="block transition hover:text-primary">Image Direction</Link>
            <Link href="/categories/editing" className="block transition hover:text-primary">Editing &amp; Post</Link>
            <Link href="/categories/audio" className="block transition hover:text-primary">Voice &amp; Audio</Link>
            <Link href="/categories/vfx" className="block transition hover:text-primary">Upscaling &amp; VFX</Link>
            <Link href="/festivals" className="block transition hover:text-primary">AI Film Festivals</Link>
          </div>
        </div>

        {/* Trust & Legal */}
        <div>
          <p className="text-xs font-medium text-primary mb-3">Trust &amp; Legal</p>
          <div className="space-y-2 text-xs text-secondary">
            <Link href="/methodology" className="block transition hover:text-primary">Scoring Methodology</Link>
            <Link href="/press" className="block transition hover:text-primary">Press &amp; Media Kit</Link>
            <Link href="/about" className="block transition hover:text-primary">About &amp; Philosophy</Link>
            <Link href="/privacy" className="block transition hover:text-primary">Privacy &amp; Cookies</Link>
            <Link href="/terms" className="block transition hover:text-primary">Terms of Service</Link>
            <Link href="/contact" className="block transition hover:text-primary">Contact &amp; Corrections</Link>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col sm:flex-row items-center justify-between border-t border-border-subtle py-6 text-xs text-tertiary">
        <div>© {new Date().getFullYear()} Amusemac Studio. All rights reserved.</div>
        <div className="mt-2 sm:mt-0 flex flex-wrap gap-4">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <span>•</span>
          <Link href="/contact" className="hover:underline">Editorial Desk</Link>
        </div>
      </div>
    </footer>
  );
}
