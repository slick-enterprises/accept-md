interface SectionHeaderProps {
  title: string;
  description?: string;
  label?: string;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  label,
  className = "",
}: SectionHeaderProps) {
  return (
    <header className={className}>
      {label && <p className="section-label">{label}</p>}
      <h2
        className={`font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl ${label ? "mt-4" : ""}`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-400">
          {description}
        </p>
      )}
    </header>
  );
}
