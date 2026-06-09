import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface MegaMenuCardProps {
  href: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  primary?: boolean;
  onClick?: () => void;
}

export function MegaMenuCard({
  href,
  title,
  description,
  icon: Icon,
  primary = false,
  onClick,
}: MegaMenuCardProps) {
  const classes = primary
    ? "card-hover min-h-[7.5rem] rounded-xl border border-teal-400/30 bg-[#0c1a18] p-6 transition-colors hover:border-teal-400/40 hover:bg-[#0f221f]"
    : "card-hover min-h-[7.5rem] rounded-xl border border-white/[0.08] bg-[#141414] p-6 transition-colors hover:border-white/[0.14] hover:bg-[#1a1a1a]";

  return (
    <Link href={href} className={`group block ${classes}`} onClick={onClick}>
      {Icon && (
        <Icon
          className={`mb-3 h-5 w-5 ${primary ? "text-teal-400" : "text-ink-500"}`}
          aria-hidden
        />
      )}
      <h3 className="text-base font-semibold text-white transition-colors group-hover:text-teal-400">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-300">{description}</p>
    </Link>
  );
}
