"use client";

import { useEffect, useState } from "react";
import { Github, Star } from "lucide-react";

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
        className={`inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-900/50 px-3 py-1.5 text-sm font-medium text-ink-200 hover:border-ink-600 hover:bg-ink-800/60 hover:text-white transition-colors ${className}`}
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
      className={`btn-secondary group relative inline-flex items-center gap-2.5 rounded-xl px-8 py-4 font-semibold text-white ${className}`}
    >
      <Github className="relative z-10 h-5 w-5 transition-transform group-hover:scale-110" />
      <span className="relative z-10">View on GitHub</span>
      {!isLoading && starCount !== null && (
        <span className="relative z-10 ml-1 inline-flex items-center gap-1 rounded-full border border-ink-600 bg-ink-800/50 px-2.5 py-0.5 text-xs font-medium">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {starCount.toLocaleString()}
        </span>
      )}
    </a>
  );
}
