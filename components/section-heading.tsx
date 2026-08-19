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
  viewAllLabel = "View all",
  align = "left",
  as = "h2",
}: SectionHeadingProps) {
  const HeadingTag = as;

  return (
    <div
      className={`mb-10 sm:mb-14 ${
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      }`}
    >
      <div>
        <p className="eyebrow">{label}</p>
        <HeadingTag className="section-title">{title}</HeadingTag>
        {description && (
          <p className="section-sub">{description}</p>
        )}
      </div>

      {viewAllHref && align !== "center" && (
        <div className="shrink-0">
          <Link
            href={viewAllHref}
            className="group inline-flex items-center gap-1 text-sm font-medium text-accent hover:opacity-80 transition-opacity"
          >
            <span>{viewAllLabel}</span>
            <span className="transition-transform duration-150 group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
