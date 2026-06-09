import { NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  validateCheckSecret,
} from "@/lib/check-rate-limit";
import { runChecks, type CheckRequestInput } from "@/lib/check-url";

export async function POST(request: Request) {
  const secretHeader = request.headers.get("x-check-secret");
  const secretCheck = validateCheckSecret(secretHeader);

  if (secretCheck.required && !secretCheck.valid) {
    return NextResponse.json(
      { error: "Invalid or missing X-Check-Secret header." },
      { status: 401 }
    );
  }

  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(
    clientIp,
    secretCheck.required && secretCheck.valid
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      }
    );
  }

  let body: CheckRequestInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const result = await runChecks(body);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ results: result.results });
}
