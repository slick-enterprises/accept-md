const WINDOW_MS = 60 * 1000;
const PUBLIC_LIMIT = 10;
const AUTH_LIMIT = 60;

interface WindowEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, WindowEntry>();

function getLimit(hasValidSecret: boolean): number {
  return hasValidSecret ? AUTH_LIMIT : PUBLIC_LIMIT;
}

export function validateCheckSecret(headerSecret: string | null): {
  valid: boolean;
  required: boolean;
} {
  const envSecret = process.env.CHECK_API_SECRET;
  if (!envSecret) {
    return { valid: true, required: false };
  }
  if (!headerSecret) {
    return { valid: false, required: true };
  }
  return { valid: headerSecret === envSecret, required: true };
}

export function checkRateLimit(
  key: string,
  hasValidSecret: boolean
): { allowed: true } | { allowed: false; retryAfter: number } {
  const limit = getLimit(hasValidSecret);
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now - entry.windowStart >= WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count >= limit) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 1000);
    return { allowed: false, retryAfter: Math.max(1, retryAfter) };
  }

  entry.count += 1;
  return { allowed: true };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
