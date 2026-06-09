"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Loader2,
  Radio,
  Scale,
  Search,
  X,
} from "lucide-react";
import type { CheckResult } from "@/lib/check-url";

const LOADING_STEPS = [
  "Connecting to your site…",
  "Fetching HTML response…",
  "Sending Accept: text/markdown…",
  "Comparing sizes and headers…",
];

const MIN_LOADING_MS = 2800;
const STEP_INTERVAL_MS = 650;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function StatusBadge({ result }: { result: CheckResult }) {
  if (result.error) {
    return <span className="text-xs text-red-400/90">Error</span>;
  }
  if (result.supported) {
    return <span className="text-xs text-emerald-400/90">Supported</span>;
  }
  return <span className="text-xs text-amber-400/90">Not detected</span>;
}

function LoadingSteps({ step }: { step: number }) {
  return (
    <div
      className="checker-reveal mx-auto mt-8 max-w-sm text-center"
      style={{ animationDelay: "0ms" }}
    >
      <div className="flex justify-center gap-1.5">
        {LOADING_STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full bg-white/40 ${
              i <= step ? "checker-pulse-dot" : "opacity-20"
            }`}
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-400 transition-opacity duration-300">
        {LOADING_STEPS[step]}
      </p>
      <p className="mt-1 text-xs text-ink-600">This usually takes a few seconds</p>
    </div>
  );
}

function AnimatedReduction({
  target,
  active,
}: {
  target: number;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active || target <= 0) {
      setDisplay(0);
      return;
    }

    const duration = 800;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setDisplay(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  if (!active || target <= 0) return null;

  return (
    <span
      className="checker-reveal mt-3 inline-block text-2xl font-semibold tracking-tight text-white"
      style={{ animationDelay: "200ms" }}
    >
      −{display}%
      <span className="ml-1 text-sm font-normal text-ink-500">smaller</span>
    </span>
  );
}

function SizeComparison({
  sizes,
  visible,
}: {
  sizes: CheckResult["sizes"];
  visible: boolean;
}) {
  const maxBytes = Math.max(sizes.htmlBytes, sizes.markdownBytes, 1);
  const htmlPct = (sizes.htmlBytes / maxBytes) * 100;
  const mdPct = (sizes.markdownBytes / maxBytes) * 100;

  return (
    <div
      className={`mt-4 space-y-3 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>HTML</span>
          <span className="font-mono text-ink-400">{formatBytes(sizes.htmlBytes)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="checker-bar h-full rounded-full bg-white/25"
            style={{ width: visible ? `${htmlPct}%` : "0%" }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>
            Markdown
            {sizes.isEstimated && (
              <span className="text-ink-600"> · estimated</span>
            )}
          </span>
          <span className="font-mono text-ink-400">
            {formatBytes(sizes.markdownBytes)}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="checker-bar h-full rounded-full bg-emerald-500/70"
            style={{
              width: visible ? `${mdPct}%` : "0%",
              animationDelay: "150ms",
            }}
          />
        </div>
      </div>
      <AnimatedReduction target={sizes.reductionPercent} active={visible} />
    </div>
  );
}

function CheckRow({
  pass,
  label,
  detail,
  visible,
  delayMs,
}: {
  pass: boolean;
  label: string;
  detail: string;
  visible: boolean;
  delayMs: number;
}) {
  if (!visible) return null;

  return (
    <div
      className="checker-reveal flex items-start gap-2 py-1.5 text-sm"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {pass ? (
        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400/80" aria-hidden />
      ) : (
        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-500" aria-hidden />
      )}
      <div className="min-w-0">
        <span className="text-ink-300">{label}</span>
        <span className="text-ink-500"> — </span>
        <span className="text-ink-500">{detail}</span>
      </div>
    </div>
  );
}

function BodyViewer({
  bodies,
  sizes,
  visible,
}: {
  bodies: CheckResult["bodies"];
  sizes: CheckResult["sizes"];
  visible: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"html" | "markdown">("markdown");

  if (!visible || (!bodies.html && !bodies.markdown)) return null;

  return (
    <div className="checker-reveal mt-4" style={{ animationDelay: "100ms" }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-sm text-ink-400 transition-colors hover:text-ink-200"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        )}
        Show response
      </button>
      {open && (
        <div className="mt-2">
          <div className="flex gap-4 border-b border-white/5 pb-2 text-sm">
            <button
              type="button"
              onClick={() => setTab("html")}
              className={
                tab === "html" ? "text-white" : "text-ink-500 hover:text-ink-300"
              }
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => setTab("markdown")}
              className={
                tab === "markdown"
                  ? "text-white"
                  : "text-ink-500 hover:text-ink-300"
              }
            >
              Markdown{sizes.isEstimated ? " (estimated)" : ""}
            </button>
          </div>
          <pre className="mt-2 max-h-96 overflow-auto rounded-lg bg-black/30 p-4 font-mono text-xs leading-relaxed text-ink-400">
            {tab === "html" ? bodies.html : bodies.markdown}
          </pre>
          {(tab === "html" && bodies.htmlTruncated) ||
          (tab === "markdown" && bodies.markdownTruncated) ? (
            <p className="mt-2 text-xs text-ink-500">Response truncated at 2 MB.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function AnimatedResultBlock({
  result,
  index,
  onRevealStart,
}: {
  result: CheckResult;
  index: number;
  onRevealStart?: () => void;
}) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    onRevealStart?.();

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const base = index * 400;
    const checksDelay = result.checks.length * 120;

    timeouts.push(setTimeout(() => setPhase(1), base));
    timeouts.push(setTimeout(() => setPhase(2), base + 500));
    timeouts.push(setTimeout(() => setPhase(3), base + 900));
    timeouts.push(setTimeout(() => setPhase(5), base + 900 + checksDelay + 300));

    return () => {
      timeouts.forEach(clearTimeout);
      setPhase(0);
    };
  }, [index, onRevealStart, result.checks.length, result.url]);

  const showHeader = phase >= 1;
  const showSizes = phase >= 2;
  const showChecks = phase >= 3;
  const showFooter = phase >= 5;

  return (
    <article className="border-b border-white/5 py-8 last:border-b-0">
      {showHeader && (
        <div
          className="checker-reveal flex flex-wrap items-baseline gap-x-3 gap-y-1"
          style={{ animationDelay: "0ms" }}
        >
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-[#8ab4f8] hover:underline"
          >
            {result.url}
          </a>
          <StatusBadge result={result} />
        </div>
      )}

      {result.error ? (
        showHeader && (
          <p className="checker-reveal mt-2 text-sm text-red-400/90">{result.error}</p>
        )
      ) : (
        <>
          <SizeComparison sizes={result.sizes} visible={showSizes} />

          {showChecks && (
            <div className="mt-4">
              {result.checks.map((check, i) => (
                <CheckRow
                  key={check.id}
                  pass={check.pass}
                  label={check.label}
                  detail={check.detail}
                  visible={showChecks}
                  delayMs={i * 120}
                />
              ))}
            </div>
          )}

          <BodyViewer
            bodies={result.bodies}
            sizes={result.sizes}
            visible={showFooter}
          />

          {showFooter && (
            <p className="checker-reveal mt-4 text-sm" style={{ animationDelay: "50ms" }}>
              {result.supported ? (
                <Link
                  href="/docs/troubleshooting"
                  className="text-ink-400 hover:text-ink-200 hover:underline"
                >
                  Troubleshoot failed checks
                </Link>
              ) : (
                <Link
                  href="/#install"
                  className="text-ink-400 hover:text-ink-200 hover:underline"
                >
                  Install accept-md on your site
                </Link>
              )}
            </p>
          )}
        </>
      )}
    </article>
  );
}

export function UrlChecker() {
  const [url, setUrl] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [extraPaths, setExtraPaths] = useState("");
  const [authorization, setAuthorization] = useState("");
  const [cookie, setCookie] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CheckResult[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToResults = useCallback(() => {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  async function handleCheck() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter a URL to audit.");
      return;
    }

    setLoading(true);
    setLoadingStep(0);
    setError(null);
    setResults(null);
    setHasSearched(true);

    const stepTimer = setInterval(() => {
      setLoadingStep((s) => Math.min(s + 1, LOADING_STEPS.length - 1));
    }, STEP_INTERVAL_MS);

    const pathLines = extraPaths
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {};

    if (pathLines.length > 0) {
      try {
        const parsed = new URL(trimmed);
        payload.baseUrl = parsed.origin;
        const mainPath = parsed.pathname + parsed.search + parsed.hash;
        const urls =
          mainPath && mainPath !== "/"
            ? [mainPath, ...pathLines]
            : pathLines;
        payload.urls = urls;
      } catch {
        payload.baseUrl = trimmed.replace(/\/$/, "");
        payload.urls = pathLines;
      }
    } else {
      payload.url = trimmed;
    }

    const headers: Record<string, string> = {};
    if (authorization.trim()) headers.Authorization = authorization.trim();
    if (cookie.trim()) headers.Cookie = cookie.trim();
    if (Object.keys(headers).length > 0) payload.headers = headers;

    const start = Date.now();

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
      await delay(remaining);

      if (!res.ok) {
        setError(data.error || `Request failed (${res.status}).`);
        setResults(null);
        return;
      }

      setResults(data.results ?? []);
    } catch {
      setError("Network error. Please try again.");
      setResults(null);
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div
        className={`mx-auto max-w-2xl px-4 transition-all duration-500 ease-out ${
          hasSearched ? "pt-6 sm:pt-8" : "pt-16 sm:pt-28"
        }`}
      >
        {!hasSearched && (
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Markdown Audit
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-400 sm:text-base">
              Audit any public URL for{" "}
              <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-xs text-ink-300 sm:text-sm">
                Accept: text/markdown
              </code>{" "}
              support — compare HTML vs Markdown sizes and verify negotiation
              headers. Works on any site, not just accept-md installations.
            </p>
            <ul className="mx-auto mt-6 inline-flex max-w-md flex-col gap-2 text-left text-sm text-ink-400">
              <li className="flex items-start gap-2.5">
                <Radio
                  className="mt-0.5 h-4 w-4 shrink-0 text-ink-500"
                  aria-hidden
                />
                <span>Live negotiation test with real HTTP requests</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Scale
                  className="mt-0.5 h-4 w-4 shrink-0 text-ink-500"
                  aria-hidden
                />
                <span>HTML vs Markdown size comparison</span>
              </li>
              <li className="flex items-start gap-2.5">
                <ClipboardList
                  className="mt-0.5 h-4 w-4 shrink-0 text-ink-500"
                  aria-hidden
                />
                <span>Four-point checklist for production readiness</span>
              </li>
            </ul>
          </div>
        )}

        {hasSearched && !loading && (
          <p className="mb-4 text-center text-lg font-medium tracking-tight text-white">
            accept<span className="text-ink-500">.</span>md
          </p>
        )}

        <div className="relative">
          <div
            className={`flex items-center gap-2 rounded-full border bg-white/[0.04] px-4 py-2.5 shadow-[0_1px_6px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.4)] focus-within:border-white/20 ${
              loading ? "border-white/15" : "border-white/10"
            } ${hasSearched ? "scale-[0.98]" : ""}`}
          >
            <Search className="h-5 w-5 shrink-0 text-ink-500" aria-hidden />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleCheck()}
              placeholder="https://accept.md/docs"
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-ink-500 focus:outline-none disabled:opacity-60"
              aria-label="URL to audit"
            />
            {loading && (
              <Loader2
                className="h-5 w-5 shrink-0 animate-spin text-ink-400"
                aria-hidden
              />
            )}
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleCheck}
              disabled={loading}
              className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-[#0a0a0a] transition-all hover:opacity-90 disabled:opacity-40"
            >
              {loading ? "Auditing…" : "Start audit"}
            </button>
          </div>

          {!loading && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="text-sm text-ink-500 transition-colors hover:text-ink-300"
              >
                {advancedOpen ? "Hide advanced options" : "Advanced options"}
              </button>
            </div>
          )}

          {advancedOpen && !loading && (
            <div
              className="checker-reveal mt-4 space-y-4 border-t border-white/5 pt-4"
              style={{ animationDelay: "0ms" }}
            >
              <div>
                <label htmlFor="extra-paths" className="block text-xs text-ink-500">
                  Additional paths (one per line, uses URL above as base)
                </label>
                <textarea
                  id="extra-paths"
                  value={extraPaths}
                  onChange={(e) => setExtraPaths(e.target.value)}
                  rows={3}
                  placeholder="/&#10;/docs&#10;/pricing"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 font-mono text-sm text-ink-300 placeholder:text-ink-600 focus:border-white/20 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="authorization" className="block text-xs text-ink-500">
                  Authorization
                </label>
                <input
                  id="authorization"
                  type="text"
                  value={authorization}
                  onChange={(e) => setAuthorization(e.target.value)}
                  placeholder="Bearer … or Basic …"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-ink-300 placeholder:text-ink-600 focus:border-white/20 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="cookie" className="block text-xs text-ink-500">
                  Cookie
                </label>
                <input
                  id="cookie"
                  type="text"
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  placeholder="session=…"
                  className="mt-1.5 w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-ink-300 placeholder:text-ink-600 focus:border-white/20 focus:outline-none"
                />
              </div>
              <p className="text-xs text-ink-600">
                Credentials are sent only for the outbound check and are not stored.
              </p>
            </div>
          )}

          {loading && <LoadingSteps step={loadingStep} />}

          {error && !loading && (
            <p className="checker-reveal mt-6 text-center text-sm text-red-400/90">
              {error}
            </p>
          )}
        </div>
      </div>

      {results && results.length > 0 && !loading && (
        <div
          ref={resultsRef}
          className="mx-auto mt-4 max-w-2xl px-4 pb-8 scroll-mt-24"
        >
          {results.map((result, index) => (
            <AnimatedResultBlock
              key={result.url}
              result={result}
              index={index}
              onRevealStart={index === 0 ? scrollToResults : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
