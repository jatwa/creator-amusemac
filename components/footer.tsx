import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-border bg-surface/40 text-secondary transition-colors">
      <div className="shell grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div className="lg:col-span-1 space-y-4">
          <Link href="/" className="text-base font-semibold tracking-tight text-primary inline-flex items-center gap-1">
            <span>creator</span>
            <span className="text-accent">.</span>
          </Link>
          <p className="text-xs leading-relaxed text-secondary max-w-xs font-normal">
            Production intelligence, verified camera models, prompt architecture, and director workflows for filmmakers and visual storytellers.
          </p>
          <p className="text-[11px] text-tertiary font-mono pt-1">
            Zero sponsored clutter. Verified ground truth.
          </p>
        </div>

        {/* Platform Column */}
        <div>
          <p className="text-xs font-medium text-primary mb-3">Platform</p>
          <div className="space-y-2 text-xs text-secondary">
            <Link href="/tools" className="block transition hover:text-primary">Tools Directory</Link>
            <Link href="/prompts" className="block transition hover:text-primary">Prompt Recipes</Link>
            <Link href="/compare" className="block transition hover:text-primary">Model Comparisons</Link>
            <Link href="/workflows" className="block transition hover:text-primary">Production Workflows</Link>
            <Link href="/tutorials" className="block transition hover:text-primary">Tutorials</Link>
            <Link href="/blog" className="block transition hover:text-primary">Creator Journal</Link>
            <Link href="/videos" className="block transition hover:text-primary">Video Masterclasses</Link>
          </div>
        </div>

        {/* Disciplines Column */}
        <div>
          <p className="text-xs font-medium text-primary mb-3">Disciplines</p>
          <div className="space-y-2 text-xs text-secondary">
            <Link href="/categories/video" className="block font-medium text-accent transition hover:opacity-80">Video Generation Hub</Link>
            <Link href="/categories/image" className="block transition hover:text-primary">Image Generation</Link>
            <Link href="/categories/editing" className="block transition hover:text-primary">Editing &amp; Post</Link>
            <Link href="/categories/audio" className="block transition hover:text-primary">Voice &amp; Audio</Link>
            <Link href="/categories/vfx" className="block transition hover:text-primary">Upscaling &amp; VFX</Link>
          </div>
        </div>

        {/* Resources & Information */}
        <div>
          <p className="text-xs font-medium text-primary mb-3">Resources</p>
          <div className="space-y-2 text-xs text-secondary">
            <Link href="/resources" className="block transition hover:text-primary">Director Toolkits</Link>
            <Link href="/search" className="block transition hover:text-primary">Search Platform</Link>
            <a href="mailto:hello@amusemac.com" className="block transition hover:text-primary">Editorial Desk</a>
            <a href="mailto:hello@amusemac.com" className="block transition hover:text-primary">Submit Tool / Workflow</a>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col sm:flex-row items-center justify-between border-t border-border-subtle py-6 text-xs text-tertiary">
        <div>© {new Date().getFullYear()} Creator by Amusemac. All rights reserved.</div>
        <div className="mt-2 sm:mt-0 flex gap-4">
          <span>Non-sponsored editorial reviews</span>
          <span>•</span>
          <span>Verified intelligence</span>
        </div>
      </div>
    </footer>
  );
}
