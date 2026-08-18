import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-ink">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" className="text-xl font-semibold text-white">
            creator<span className="text-lime">.</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
            Better tools deserve better direction. Creator by Amusemac maps interconnected AI tools, prompt recipes, video masterclasses, and production workflows for visual storytellers.
          </p>
          <div className="mt-6 flex items-center gap-3 text-xs text-zinc-400">
            <span className="inline-block h-2 w-2 rounded-full bg-lime animate-pulse" />
            <span>Curated &amp; verified for production</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white">Platform</p>
          <div className="mt-4 space-y-2.5 text-sm text-zinc-500">
            <Link href="/tools" className="block transition hover:text-lime">AI Tools Directory</Link>
            <Link href="/prompts" className="block transition hover:text-lime">Prompt Recipes</Link>
            <Link href="/compare" className="block transition hover:text-lime">Head-to-Head Comparisons</Link>
            <Link href="/workflows" className="block transition hover:text-lime">Production Workflows</Link>
            <Link href="/tutorials" className="block transition hover:text-lime">Workflow Tutorials</Link>
            <Link href="/blog" className="block transition hover:text-lime">Editorial Insights &amp; Blog</Link>
            <Link href="/videos" className="block transition hover:text-lime">Video Masterclasses</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white">Categories</p>
          <div className="mt-4 space-y-2.5 text-sm text-zinc-500">
            <Link href="/categories/video" className="block transition hover:text-lime">Video Generation</Link>
            <Link href="/categories/image" className="block transition hover:text-lime">Image Direction</Link>
            <Link href="/categories/editing" className="block transition hover:text-lime">Editing &amp; Post</Link>
            <Link href="/categories/audio" className="block transition hover:text-lime">Voice &amp; Sound Design</Link>
            <Link href="/categories/vfx" className="block transition hover:text-lime">Upscaling &amp; VFX</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white">Resources &amp; Contact</p>
          <div className="mt-4 space-y-2.5 text-sm text-zinc-500">
            <Link href="/resources" className="block transition hover:text-lime">Creator Resources &amp; Kits</Link>
            <Link href="/search" className="block transition hover:text-lime">Universal Search</Link>
            <a href="mailto:hello@amusemac.com" className="block transition hover:text-lime">Editorial Inquiries</a>
            <a href="mailto:hello@amusemac.com" className="block transition hover:text-lime">Submit a Tool / Recipe</a>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col sm:flex-row items-center justify-between border-t border-line py-6 text-xs text-zinc-600">
        <div>© {new Date().getFullYear()} Amusemac. Built for working visual storytellers.</div>
        <div className="mt-2 sm:mt-0 flex gap-4">
          <span>Non-sponsored editorial ratings</span>
          <span>Verified ground truth</span>
        </div>
      </div>
    </footer>
  );
}
