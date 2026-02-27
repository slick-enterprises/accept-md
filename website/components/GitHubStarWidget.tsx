"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const GITHUB_REPO = "slick-enterprises/accept-md";

interface GitHubStarWidgetProps {
  className?: string;
  variant?: "button" | "badge";
  onClick?: () => void;
}

export function GitHubStarWidget({ className = "", variant = "button", onClick }: GitHubStarWidgetProps) {
  const [starCount, setStarCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStarCount() {
      try {
        const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`);
        if (response.ok) {
          const data = await response.json();
          setStarCount(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub star count:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStarCount();
  }, []);

  if (variant === "badge") {
    return (
      <a
        href={`https://github.com/${GITHUB_REPO}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-ink-300 transition-colors duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white ${className}`}
      >
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        {isLoading ? (
          <span className="w-8 h-4 bg-ink-800 rounded animate-pulse" />
        ) : (
          <span>{starCount !== null ? starCount.toLocaleString() : "—"}</span>
        )}
      </a>
    );
  }

  return (
    <a
      href={`https://github.com/${GITHUB_REPO}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`btn-secondary inline-flex items-center rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-white ${className}`}
    >
      View on GitHub
      {!isLoading && starCount !== null && (
        <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-ink-400">
          <Star className="h-3 w-3 fill-amber-400/80 text-amber-400/80" />
          {starCount.toLocaleString()}
        </span>
      )}
    </a>
  );
}
