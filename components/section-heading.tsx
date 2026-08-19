import Link from "next/link";

interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  label,
  title,
  description,
  viewAllHref,
  viewAllLabel = "Explore domain",
  align = "left",
  as = "h2",
}: SectionHeadingProps) {
  const HeadingTag = as;

  return (
    <div
      className={`mb-10 sm:mb-12 ${
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      }`}
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          <p className="eyebrow">{label}</p>
        </div>
        <HeadingTag className="section-title">{title}</HeadingTag>
        {description && (
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-400">
            {description}
          </p>
        )}
      </div>

      {viewAllHref && align !== "center" && (
        <div className="shrink-0">
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-lime transition hover:text-white"
          >
            <span>{viewAllLabel}</span>
            <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
