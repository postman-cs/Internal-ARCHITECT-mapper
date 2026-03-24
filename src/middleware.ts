import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, SESSION_COOKIE_NAME, getSessionSecret } from "@/lib/session-config";

// ---------------------------------------------------------------------------
// Public paths
// ---------------------------------------------------------------------------

const PUBLIC_EXACT_PATHS = new Set([
  "/",
  "/login",
  "/api/health",
  "/api/webhooks/architect-ingest",
]);

// ---------------------------------------------------------------------------
// Rate limiting — in-memory sliding window
// ---------------------------------------------------------------------------

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 300_000;
const RATE_LIMITS: Record<string, number> = {
  "/login": 10,
  "default": 120,
};

function inMemoryRateLimit(key: string, limit: number): boolean {
  const now = Date.now();

  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now;
    for (const [k, v] of rateLimitMap) {
      if (now > v.resetAt) rateLimitMap.delete(k);
    }
  }

  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > limit;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// Security headers
// ---------------------------------------------------------------------------

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // ---- Rate limiting ----
  const rateKey = `${ip}:${pathname}`;
  const limit = RATE_LIMITS[pathname] ?? RATE_LIMITS["default"];
  if (inMemoryRateLimit(rateKey, limit)) {
    return addSecurityHeaders(
      NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      )
    );
  }

  // ---- Public paths ----
  const isPublicPrefix =
    pathname.startsWith("/architect/fill/") ||
    pathname.startsWith("/api/webhooks/");
  if (PUBLIC_EXACT_PATHS.has(pathname) || isPublicPrefix) {
    return addSecurityHeaders(NextResponse.next());
  }

  // ---- Session-authenticated routes ----
  const response = NextResponse.next();

  let sessionPassword: string;
  try {
    sessionPassword = getSessionSecret();
  } catch {
    return addSecurityHeaders(
      NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
    );
  }

  const session = await getIronSession<SessionData>(request, response, {
    password: sessionPassword,
    cookieName: SESSION_COOKIE_NAME,
  });

  if (!session.userId) {
    if (pathname.startsWith("/api/")) {
      return addSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    return addSecurityHeaders(
      NextResponse.redirect(new URL("/login", request.url))
    );
  }

  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
