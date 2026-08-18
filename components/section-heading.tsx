export function SectionHeading({ label, title, description }: { label: string; title: string; description: string }) {
  return <div className="mb-10 max-w-2xl"><p className="eyebrow">{label}</p><h2 className="section-title">{title}</h2><p className="mt-4 leading-7 text-zinc-400">{description}</p></div>;
}
