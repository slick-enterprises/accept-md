import Link from "next/link";
import type { ReactNode } from "react";

interface ContentCardProps {
  href?: string;
  variant?: "nav" | "callout";
  children: ReactNode;
  className?: string;
}

const variantClasses = {
  nav: "card-hover rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04]",
  callout:
    "rounded-xl border border-teal-400/20 bg-teal-400/[0.03] p-6",
};

export function ContentCard({
  href,
  variant = "nav",
  children,
  className = "",
}: ContentCardProps) {
  const classes = `${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={`block ${classes}`}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
