import { NextResponse } from "next/server";
import { validateCaptcha } from "@/lib/contact/captcha";
import { sendContactMail } from "@/lib/contact/mail";
import { getClientIp, isRateLimited } from "@/lib/contact/rate-limit";
import { validateContact, type ContactSubmitPayload } from "@/lib/contact/validation";

export const dynamic = "force-dynamic";

const ALLOWED_ORIGINS = new Set(
  (process.env.CONTACT_ALLOWED_ORIGINS ?? "https://finyatra.com,https://www.finyatra.com")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
);

function isAllowedOrigin(request: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const origin = request.headers.get("origin") ?? "";
  const referer = request.headers.get("referer") ?? "";
  // Vercel preview/production *.vercel.app deployments
  if (origin.endsWith(".vercel.app") || referer.includes(".vercel.app")) return true;
  for (const allowed of ALLOWED_ORIGINS) {
    if (origin.startsWith(allowed) || referer.startsWith(allowed)) return true;
  }
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host && ALLOWED_ORIGINS.has(`${proto}://${host}`)) return true;
  return false;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ ok: false, error: "Origin not allowed." }, { status: 403 });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try later." }, { status: 429 });
  }

  let body: ContactSubmitPayload;
  try {
    body = (await request.json()) as ContactSubmitPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Missing request body." }, { status: 400 });
  }

  const validation = validateContact(body);
  if (validation.ok && validation.honeypot) {
    return NextResponse.json({ ok: true });
  }
  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.error }, { status: 400 });
  }

  const req = validation.request;
  if (!validateCaptcha(req.captchaToken, req.captchaAnswer)) {
    return NextResponse.json({ ok: false, error: "Captcha verification failed." }, { status: 400 });
  }

  try {
    await sendContactMail(req.name, req.email, req.requestType, req.subject, req.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[contact] send failed:", err);
    }
    const message = err instanceof Error ? err.message : "Unable to send message right now.";
    if (message.includes("not configured")) {
      return NextResponse.json({ ok: false, error: "Mail server is not configured." }, { status: 500 });
    }
    return NextResponse.json({ ok: false, error: "Unable to send message right now." }, { status: 500 });
  }
}
