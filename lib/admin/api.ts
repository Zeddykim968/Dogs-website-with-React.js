import { NextResponse } from "next/server";

/** JSON error helper for API routes. */
export function jsonError(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

/** JSON success helper for API routes. */
export function jsonOk(payload?: Record<string, unknown>) {
  return NextResponse.json({ ok: true, ...payload });
}

/**
 * Fixed-window in-memory rate limiter (per server process).
 * Returns true when the request is allowed, false when the key is
 * over its limit. Enough for a single-node admin panel; swap for a
 * shared store if the site ever runs multiple instances.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();

  if (buckets.size > 2000) {
    for (const [k, bucket] of buckets) {
      if (bucket.resetAt <= now) {
        buckets.delete(k);
      }
    }
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= max) {
    return false;
  }

  bucket.count += 1;
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "local";
}

/** Request origin, used for auth redirect URLs. */
export function requestOrigin(request: Request): string {
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    return originHeader;
  }
  return new URL(request.url).origin;
}
