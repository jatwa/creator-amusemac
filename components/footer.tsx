import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-ink-elevated text-zinc-400">
      <div className="shell grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-white inline-flex items-center gap-1">
            <span>creator</span>
            <span className="text-lime text-2xl leading-none">.</span>
          </Link>
          <p className="text-xs sm:text-sm leading-relaxed text-zinc-400">
            Better tools deserve better direction. Creator by Amusemac maps interconnected AI tools, prompt recipes, video masterclasses, and production workflows for visual storytellers.
          </p>
          <div className="flex items-center gap-2.5 text-xs text-zinc-400 pt-2 font-mono">
            <span className="inline-block h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span>Curated &amp; verified for production</span>
          </div>
        </div>

        <div>
          <p className="eyebrow text-xs mb-4">Platform</p>
          <div className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
            <Link href="/tools" className="block transition hover:text-lime">AI Tools Directory</Link>
            <Link href="/prompts" className="block transition hover:text-lime">Prompt Recipes</Link>
            <Link href="/compare" className="block transition hover:text-lime">Head-to-Head Comparisons</Link>
            <Link href="/workflows" className="block transition hover:text-lime">Production Workflows</Link>
            <Link href="/tutorials" className="block transition hover:text-lime">Workflow Tutorials</Link>
            <Link href="/blog" className="block transition hover:text-lime">Creator Journal</Link>
            <Link href="/videos" className="block transition hover:text-lime">Video Masterclasses</Link>
          </div>
        </div>

        <div>
          <p className="eyebrow text-xs mb-4">Production Disciplines</p>
          <div className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
            <Link href="/categories/video" className="block transition hover:text-lime font-medium text-white">★ Video Generation Hub</Link>
            <Link href="/categories/image" className="block transition hover:text-lime">Image Direction</Link>
            <Link href="/categories/editing" className="block transition hover:text-lime">Editing &amp; Post</Link>
            <Link href="/categories/audio" className="block transition hover:text-lime">Voice &amp; Sound Design</Link>
            <Link href="/categories/vfx" className="block transition hover:text-lime">Upscaling &amp; VFX</Link>
          </div>
        </div>

        <div>
          <p className="eyebrow text-xs mb-4">Resources &amp; Contact</p>
          <div className="space-y-2.5 text-xs sm:text-sm text-zinc-400">
            <Link href="/resources" className="block transition hover:text-lime">Director Toolkits &amp; Kits</Link>
            <Link href="/search" className="block transition hover:text-lime">Universal Search</Link>
            <a href="mailto:hello@amusemac.com" className="block transition hover:text-lime">Editorial Desk</a>
            <a href="mailto:hello@amusemac.com" className="block transition hover:text-lime">Submit Tool / Pipeline</a>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col sm:flex-row items-center justify-between border-t border-line py-6 text-xs text-zinc-500 font-mono">
        <div>© {new Date().getFullYear()} Creator by Amusemac. Built for working visual storytellers.</div>
        <div className="mt-2 sm:mt-0 flex gap-4">
          <span>Non-sponsored editorial reviews</span>
          <span>•</span>
          <span>Verified ground truth</span>
        </div>
      </div>
    </footer>
  );
}
