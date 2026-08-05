const links = ["Tools", "Prompts", "Compare", "Tutorials"];

export function Navigation() {
  return <header className="sticky top-0 z-50 border-b border-white/5 bg-ink/85 backdrop-blur-xl"><nav className="shell flex h-16 items-center justify-between"><a href="#top" className="font-semibold tracking-tight text-white">creator<span className="text-lime">.</span></a><div className="hidden items-center gap-7 md:flex">{links.map((link) => <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-zinc-400 transition hover:text-white">{link}</a>)}</div><a href="#tools" className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-black transition hover:bg-white">Explore tools</a></nav></header>;
}
