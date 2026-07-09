const store = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? 600_000);
const MAX = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? 10);

export function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const key = clientIp?.trim() || "unknown";
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= MAX) return true;
  entry.count += 1;
  return false;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}
