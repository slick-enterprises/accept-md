import { Search } from "lucide-react";

interface SiteSearchFormProps {
  defaultQuery?: string;
  compact?: boolean;
  id?: string;
}

export function SiteSearchForm({
  defaultQuery = "",
  compact = false,
  id = "site-search",
}: SiteSearchFormProps) {
  return (
    <form action="/" method="GET" role="search" className={compact ? "w-full" : "w-full max-w-xl"}>
      <label htmlFor={id} className="sr-only">
        Search accept-md
      </label>
      <div
        className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] ${
          compact ? "px-3 py-1.5" : "px-4 py-2.5"
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-ink-500" aria-hidden />
        <input
          id={id}
          name="s"
          type="search"
          defaultValue={defaultQuery}
          placeholder="Search docs, learn, integrations, blog…"
          className={`w-full bg-transparent text-ink-100 placeholder:text-ink-500 focus:outline-none ${
            compact ? "text-sm" : "text-base"
          }`}
          autoComplete="off"
        />
      </div>
    </form>
  );
}
