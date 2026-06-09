"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronRight, Loader2, X } from "lucide-react";
import type { CheckResult } from "@/lib/check-url";

const LOADING_STEPS = [
  "Connecting…",
  "Fetching HTML…",
  "Sending Accept: text/markdown…",
  "Comparing headers and sizes…",
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
    return (
      <span className="rounded border border-red-400/20 bg-red-400/5 px-2 py-0.5 font-mono text-xs text-red-400">
        Error
      </span>
    );
  }
  if (result.supported) {
    return (
      <span className="rounded border border-emerald-400/20 bg-emerald-400/5 px-2 py-0.5 font-mono text-xs text-emerald-400">
        Supported
      </span>
    );
  }
  return (
    <span className="rounded border border-amber-400/20 bg-amber-400/5 px-2 py-0.5 font-mono text-xs text-amber-400">
      Not detected
    </span>
  );
}

function LoadingSteps({ step }: { step: number }) {
  return (
    <div className="checker-reveal mt-6 border-t border-white/[0.06] pt-6">
      <p className="font-mono text-sm text-teal-400">
        {LOADING_STEPS[step]}
      </p>
      <div className="mt-3 flex gap-1">
        {LOADING_STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-teal-400/60" : "bg-white/10"
            }`}
          />
        ))}
      </div>
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
    <p className="checker-reveal mt-4 font-mono text-lg text-white">
      −{display}%
      <span className="ml-2 text-sm text-ink-500">smaller than HTML</span>
    </p>
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
      className={`mt-6 space-y-4 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-ink-500">
          <span>HTML</span>
          <span>{formatBytes(sizes.htmlBytes)}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="checker-bar h-full rounded-full bg-white/30"
            style={{ width: visible ? `${htmlPct}%` : "0%" }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-ink-500">
          <span>
            Markdown
            {sizes.isEstimated && (
              <span className="text-ink-600"> · estimated</span>
            )}
          </span>
          <span>{formatBytes(sizes.markdownBytes)}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="checker-bar h-full rounded-full bg-teal-400/70"
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
      className="checker-reveal flex items-start gap-3 border-t border-white/5 py-3 text-sm first:border-t-0"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {pass ? (
        <Check
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400"
          aria-hidden
        />
      ) : (
        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-600" aria-hidden />
      )}
      <div className="min-w-0">
        <span className="font-medium text-ink-200">{label}</span>
        <span className="text-ink-600"> — </span>
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
    <div className="checker-reveal mt-4 border-t border-white/5 pt-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-sm text-ink-400 transition-colors hover:text-teal-400"
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        )}
        Show response
      </button>
      {open && (
        <div className="mt-3">
          <div className="flex gap-4 border-b border-white/5 pb-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => setTab("html")}
              className={
                tab === "html"
                  ? "text-teal-400"
                  : "text-ink-500 hover:text-ink-300"
              }
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => setTab("markdown")}
              className={
                tab === "markdown"
                  ? "text-teal-400"
                  : "text-ink-500 hover:text-ink-300"
              }
            >
              Markdown{sizes.isEstimated ? " (estimated)" : ""}
            </button>
          </div>
          <pre className="code-block mt-3 max-h-96 overflow-auto p-4 font-mono text-xs leading-relaxed text-ink-400">
            {tab === "html" ? bodies.html : bodies.markdown}
          </pre>
          {(tab === "html" && bodies.htmlTruncated) ||
          (tab === "markdown" && bodies.markdownTruncated) ? (
            <p className="mt-2 text-xs text-ink-500">
              Response truncated at 2 MB.
            </p>
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
    timeouts.push(
      setTimeout(() => setPhase(5), base + 900 + checksDelay + 300)
    );

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
        <div className="checker-reveal flex flex-wrap items-center gap-x-3 gap-y-2">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-mono text-sm text-teal-400 hover:underline"
          >
            {result.url}
          </a>
          <StatusBadge result={result} />
        </div>
      )}

      {result.error ? (
        showHeader && (
          <p className="checker-reveal mt-3 text-sm text-red-400">
            {result.error}
          </p>
        )
      ) : (
        <>
          <SizeComparison sizes={result.sizes} visible={showSizes} />

          {showChecks && (
            <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4">
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
            <p className="checker-reveal mt-4 text-sm">
              {result.supported ? (
                <Link href="/docs/troubleshooting" className="link-accent">
                  Troubleshoot failed checks
                </Link>
              ) : (
                <Link href="/#install" className="link-accent">
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
      <section className="border-b border-white/5 pb-12">
        <div className="max-w-2xl">
          <p className="section-label">Markdown Audit</p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Test Accept Markdown on any URL
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-400">
            Paste a public URL. We send{" "}
            <code className="rounded border border-teal-400/20 bg-teal-400/5 px-1.5 py-0.5 font-mono text-sm text-teal-400">
              Accept: text/markdown
            </code>{" "}
            and{" "}
            <code className="rounded border border-teal-400/20 bg-teal-400/5 px-1.5 py-0.5 font-mono text-sm text-teal-400">
              Accept: text/html
            </code>
            , then compare sizes and verify negotiation headers. Works on any
            site.
          </p>

          <div className="code-block mt-8">
            <div className="border-b border-white/[0.06] px-4 py-2 font-mono text-xs text-ink-500">
              URL to audit
            </div>
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !loading && handleCheck()}
                placeholder="https://accept.md/docs"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent font-mono text-sm text-ink-200 placeholder:text-ink-600 focus:outline-none disabled:opacity-60"
                aria-label="URL to audit"
              />
              <button
                type="button"
                onClick={handleCheck}
                disabled={loading}
                className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-40"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                )}
                {loading ? "Auditing…" : "Start audit"}
              </button>
            </div>

            {loading && <LoadingSteps step={loadingStep} />}

            {error && !loading && (
              <p className="border-t border-white/[0.06] px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}
          </div>

          {!loading && (
            <details
              className="group mt-4"
              open={advancedOpen}
              onToggle={(e) =>
                setAdvancedOpen((e.target as HTMLDetailsElement).open)
              }
            >
              <summary className="cursor-pointer list-none text-sm text-ink-500 transition-colors hover:text-ink-300 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-1">
                  Advanced options
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                </span>
              </summary>
              <div className="mt-4 space-y-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                <div>
                  <label
                    htmlFor="extra-paths"
                    className="block font-mono text-xs text-ink-500"
                  >
                    Additional paths (one per line)
                  </label>
                  <textarea
                    id="extra-paths"
                    value={extraPaths}
                    onChange={(e) => setExtraPaths(e.target.value)}
                    rows={3}
                    placeholder="/&#10;/docs&#10;/pricing"
                    className="mt-2 w-full rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 font-mono text-sm text-ink-300 placeholder:text-ink-600 focus:border-teal-400/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="authorization"
                    className="block font-mono text-xs text-ink-500"
                  >
                    Authorization
                  </label>
                  <input
                    id="authorization"
                    type="text"
                    value={authorization}
                    onChange={(e) => setAuthorization(e.target.value)}
                    placeholder="Bearer … or Basic …"
                    className="mt-2 w-full rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 font-mono text-sm text-ink-300 placeholder:text-ink-600 focus:border-teal-400/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="cookie"
                    className="block font-mono text-xs text-ink-500"
                  >
                    Cookie
                  </label>
                  <input
                    id="cookie"
                    type="text"
                    value={cookie}
                    onChange={(e) => setCookie(e.target.value)}
                    placeholder="session=…"
                    className="mt-2 w-full rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 font-mono text-sm text-ink-300 placeholder:text-ink-600 focus:border-teal-400/30 focus:outline-none"
                  />
                </div>
                <p className="text-xs text-ink-600">
                  Credentials are sent only for the outbound check and are not
                  stored.
                </p>
              </div>
            </details>
          )}
        </div>
      </section>

      {results && results.length > 0 && !loading && (
        <div ref={resultsRef} className="scroll-mt-24 pt-8">
          <p className="section-label mb-4">Report</p>
          <div className="max-w-2xl rounded-xl border border-white/[0.06] bg-white/[0.02] px-5 sm:px-6">
            {results.map((result, index) => (
              <AnimatedResultBlock
                key={result.url}
                result={result}
                index={index}
                onRevealStart={index === 0 ? scrollToResults : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
