import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MARKDOWN_ACCEPT = /\btext\/markdown\b/i;
const EXCLUDED_PREFIXES = ['/api/', '/_next/'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accept = (request.headers.get('accept') || '').toLowerCase();
  if (!MARKDOWN_ACCEPT.test(accept)) return NextResponse.next();
  if (EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/api/accept-md';
  url.searchParams.set('path', pathname);
  // Let Next.js carry through original headers/cookies; only use query param for the path.
  return NextResponse.rewrite(url);
}
