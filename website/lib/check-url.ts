import { htmlToMarkdown } from "accept-md-runtime";

const FETCH_TIMEOUT_MS = 10000;
const MAX_BODY_BYTES = 2 * 1024 * 1024;
const MAX_URLS = 10;
const USER_AGENT = "accept-md-checker/1.0";

const ALLOWED_FORWARD_HEADERS = new Set([
  "authorization",
  "cookie",
  "x-vercel-protection-bypass",
]);

export interface CheckHeaders {
  Authorization?: string;
  Cookie?: string;
  "X-Vercel-Protection-Bypass"?: string;
}

export interface CheckItem {
  id: string;
  label: string;
  pass: boolean;
  detail: string;
}

export interface CheckSizes {
  htmlBytes: number;
  markdownBytes: number;
  reductionPercent: number;
  isEstimated: boolean;
}

export interface CheckBodies {
  html: string;
  markdown: string;
  htmlTruncated: boolean;
  markdownTruncated: boolean;
}

export interface CheckResult {
  url: string;
  supported: boolean;
  checks: CheckItem[];
  sizes: CheckSizes;
  headers: {
    htmlContentType?: string;
    markdownContentType?: string;
    vary?: string;
  };
  bodies: CheckBodies;
  error?: string;
}

export interface CheckRequestInput {
  url?: string;
  urls?: string[];
  baseUrl?: string;
  headers?: CheckHeaders;
}

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (h === "localhost" || h.endsWith(".localhost")) {
    return process.env.NODE_ENV !== "development";
  }

  if (h === "::1" || h === "0:0:0:0:0:0:0:1") return true;

  // IPv4
  const ipv4Match = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, a, b, c, d] = ipv4Match.map(Number);
    if (a === 127) return process.env.NODE_ENV !== "development";
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 0) return true;
    if (a >= 224) return true;
    void c;
    void d;
  }

  return false;
}

export function validateUrl(urlString: string): { ok: true; url: URL } | { ok: false; error: string } {
  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return { ok: false, error: "Invalid URL format." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Only http and https URLs are allowed." };
  }

  if (!parsed.hostname) {
    return { ok: false, error: "URL must include a hostname." };
  }

  if (isPrivateHost(parsed.hostname)) {
    return { ok: false, error: "Private or local network URLs are not allowed." };
  }

  return { ok: true, url: parsed };
}

export function normalizeCheckUrls(input: CheckRequestInput): { urls: string[] } | { error: string } {
  const collected: string[] = [];

  if (input.url?.trim()) {
    collected.push(input.url.trim());
  }

  if (input.urls?.length) {
    for (const entry of input.urls) {
      const trimmed = entry.trim();
      if (trimmed) collected.push(trimmed);
    }
  }

  if (collected.length === 0) {
    return { error: "At least one URL is required." };
  }

  if (collected.length > MAX_URLS) {
    return { error: `Maximum ${MAX_URLS} URLs per request.` };
  }

  const base = input.baseUrl?.trim();
  const absolute: string[] = [];

  for (const entry of collected) {
    if (entry.startsWith("http://") || entry.startsWith("https://")) {
      absolute.push(entry);
    } else if (base) {
      const baseValidation = validateUrl(base.endsWith("/") ? base.slice(0, -1) : base);
      if (!baseValidation.ok) {
        return { error: `Invalid baseUrl: ${baseValidation.error}` };
      }
      const path = entry.startsWith("/") ? entry : `/${entry}`;
      absolute.push(`${baseValidation.url.origin}${path}`);
    } else {
      return { error: `Path "${entry}" requires a baseUrl.` };
    }
  }

  for (const u of absolute) {
    const validation = validateUrl(u);
    if (!validation.ok) {
      return { error: validation.error };
    }
  }

  return { urls: absolute };
}

export function sanitizeForwardHeaders(headers?: CheckHeaders): Record<string, string> {
  const out: Record<string, string> = {};
  if (!headers) return out;

  for (const [key, value] of Object.entries(headers)) {
    if (!value?.trim()) continue;
    const lower = key.toLowerCase();
    if (!ALLOWED_FORWARD_HEADERS.has(lower)) continue;
    if (lower === "authorization") out.Authorization = value.trim();
    else if (lower === "cookie") out.Cookie = value.trim();
    else if (lower === "x-vercel-protection-bypass") {
      out["X-Vercel-Protection-Bypass"] = value.trim();
    }
  }

  return out;
}

async function readBodyCapped(response: Response): Promise<{ text: string; truncated: boolean; byteSize: number }> {
  const reader = response.body?.getReader();
  if (!reader) {
    const text = await response.text();
    const byteSize = Buffer.byteLength(text, "utf8");
    if (byteSize <= MAX_BODY_BYTES) {
      return { text, truncated: false, byteSize };
    }
    const buf = Buffer.from(text, "utf8").subarray(0, MAX_BODY_BYTES);
    return { text: buf.toString("utf8"), truncated: true, byteSize };
  }

  const chunks: Uint8Array[] = [];
  let total = 0;
  let truncated = false;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    if (total + value.length > MAX_BODY_BYTES) {
      const remaining = MAX_BODY_BYTES - total;
      if (remaining > 0) {
        chunks.push(value.subarray(0, remaining));
        total += remaining;
      }
      truncated = true;
      await reader.cancel();
      break;
    }
    chunks.push(value);
    total += value.length;
  }

  const combined = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  const text = new TextDecoder("utf-8", { fatal: false }).decode(combined);
  return { text, truncated, byteSize: total };
}

function looksLikeHtml(body: string): boolean {
  const trimmed = body.trimStart().slice(0, 200).toLowerCase();
  return (
    trimmed.startsWith("<!doctype") ||
    trimmed.startsWith("<html") ||
    trimmed.startsWith("<body") ||
    trimmed.startsWith("<head")
  );
}

function varyIncludesAccept(vary: string | null): boolean {
  if (!vary) return false;
  return vary.toLowerCase().split(",").some((v) => v.trim() === "accept");
}

function clampReduction(htmlBytes: number, markdownBytes: number): number {
  if (htmlBytes <= 0) return 0;
  const pct = Math.round(((htmlBytes - markdownBytes) / htmlBytes) * 100);
  return Math.max(0, Math.min(100, pct));
}

interface FetchRepresentation {
  status: number;
  contentType: string;
  vary: string | null;
  body: string;
  truncated: boolean;
  byteSize: number;
}

async function fetchRepresentation(
  url: string,
  accept: string,
  forwardHeaders: Record<string, string>
): Promise<FetchRepresentation> {
  const headers: Record<string, string> = {
    Accept: accept,
    "User-Agent": USER_AGENT,
    ...forwardHeaders,
  };

  const response = await fetch(url, {
    method: "GET",
    headers,
    redirect: "follow",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  const { text, truncated, byteSize } = await readBodyCapped(response);

  return {
    status: response.status,
    contentType: response.headers.get("content-type") ?? "",
    vary: response.headers.get("vary"),
    body: text,
    truncated,
    byteSize,
  };
}

function buildChecks(
  html: FetchRepresentation,
  markdown: FetchRepresentation,
  markdownBody: string,
  supported: boolean
): CheckItem[] {
  const markdownContentTypeOk =
    markdown.contentType.toLowerCase().includes("text/markdown");
  const markdownBodyOk = !looksLikeHtml(markdownBody);
  const markdownStatusOk = markdown.status >= 200 && markdown.status < 300;

  const htmlContentTypeOk = html.contentType.toLowerCase().includes("text/html");
  const htmlStatusOk = html.status >= 200 && html.status < 300;

  const varyOk =
    varyIncludesAccept(markdown.vary) || varyIncludesAccept(html.vary);

  const markdownBodyBytes = Buffer.byteLength(markdownBody, "utf8");
  const distinctOk =
    supported ||
    (html.body !== markdownBody &&
      markdownBodyBytes < html.byteSize * 0.95);

  return [
    {
      id: "markdown-response",
      label: "Markdown response",
      pass: markdownStatusOk && markdownContentTypeOk && markdownBodyOk,
      detail: markdownStatusOk
        ? markdownContentTypeOk
          ? markdownBodyOk
            ? `Content-Type: ${markdown.contentType}`
            : "Body looks like HTML, not Markdown"
          : `Content-Type: ${markdown.contentType || "missing"}`
        : `HTTP ${markdown.status}`,
    },
    {
      id: "html-fallback",
      label: "HTML fallback",
      pass: htmlStatusOk && htmlContentTypeOk,
      detail: htmlStatusOk
        ? htmlContentTypeOk
          ? `Content-Type: ${html.contentType}`
          : `Content-Type: ${html.contentType || "missing"}`
        : `HTTP ${html.status}`,
    },
    {
      id: "vary-accept",
      label: "Vary: Accept",
      pass: varyOk,
      detail: varyOk
        ? `Vary: ${markdown.vary || html.vary}`
        : "No Vary: Accept header found",
    },
    {
      id: "distinct-representations",
      label: "Distinct representations",
      pass: distinctOk,
      detail: distinctOk
        ? supported
          ? "Markdown and HTML responses differ"
          : "Estimated Markdown is smaller than HTML"
        : "Markdown response matches HTML (no savings)",
    },
  ];
}

export async function checkSingleUrl(
  url: string,
  forwardHeaders: Record<string, string>
): Promise<CheckResult> {
  try {
    const html = await fetchRepresentation(
      url,
      "text/html,application/xhtml+xml",
      forwardHeaders
    );
    const markdown = await fetchRepresentation(url, "text/markdown", forwardHeaders);

    const liveMarkdownSupported =
      markdown.status >= 200 &&
      markdown.status < 300 &&
      markdown.contentType.toLowerCase().includes("text/markdown") &&
      !looksLikeHtml(markdown.body);

    let markdownBody = markdown.body;
    let markdownBytes = markdown.byteSize;
    let markdownTruncated = markdown.truncated;
    let isEstimated = false;

    if (!liveMarkdownSupported && html.status >= 200 && html.status < 300) {
      markdownBody = htmlToMarkdown(html.body);
      markdownBytes = Buffer.byteLength(markdownBody, "utf8");
      markdownTruncated = false;
      isEstimated = true;
    } else if (!liveMarkdownSupported) {
      markdownBody = "";
      markdownBytes = 0;
      markdownTruncated = false;
    }

    const supported = liveMarkdownSupported;
    const htmlBytes = html.byteSize;

    const checks = buildChecks(html, markdown, markdownBody, supported);

    return {
      url,
      supported,
      checks,
      sizes: {
        htmlBytes,
        markdownBytes,
        reductionPercent: clampReduction(htmlBytes, markdownBytes),
        isEstimated,
      },
      headers: {
        htmlContentType: html.contentType || undefined,
        markdownContentType: markdown.contentType || undefined,
        vary: markdown.vary || html.vary || undefined,
      },
      bodies: {
        html: html.body,
        markdown: markdownBody,
        htmlTruncated: html.truncated,
        markdownTruncated: markdownTruncated,
      },
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === "TimeoutError"
          ? "Request timed out after 10 seconds."
          : err.message
        : "Request failed.";

    return {
      url,
      supported: false,
      checks: [],
      sizes: {
        htmlBytes: 0,
        markdownBytes: 0,
        reductionPercent: 0,
        isEstimated: false,
      },
      headers: {},
      bodies: {
        html: "",
        markdown: "",
        htmlTruncated: false,
        markdownTruncated: false,
      },
      error: message,
    };
  }
}

export async function runChecks(
  input: CheckRequestInput,
  concurrency = 3
): Promise<{ results: CheckResult[] } | { error: string }> {
  const normalized = normalizeCheckUrls(input);
  if ("error" in normalized) return { error: normalized.error };

  const forwardHeaders = sanitizeForwardHeaders(input.headers);
  const results: CheckResult[] = [];
  const urls = normalized.urls;

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((u) => checkSingleUrl(u, forwardHeaders))
    );
    results.push(...batchResults);
  }

  return { results };
}
