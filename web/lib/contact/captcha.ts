import { createHmac, randomBytes, timingSafeEqual } from "crypto";

function base64UrlEncode(data: Buffer): string {
  return data.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(input: string): Buffer | null {
  try {
    const padded = input.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4;
    const withPad = pad === 2 ? padded + "==" : pad === 3 ? padded + "=" : padded;
    return Buffer.from(withPad, "base64");
  } catch {
    return null;
  }
}

function sign(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function getSecret(): string {
  return (
    process.env.CONTACT_CAPTCHA_SECRET ||
    (process.env.SMTP_USER && process.env.SMTP_PASS ? `${process.env.SMTP_USER}:${process.env.SMTP_PASS}` : "") ||
    "finyatra-dev-captcha-secret"
  );
}

const TOKEN_TTL_MS = Number(process.env.CONTACT_CAPTCHA_TTL_MS ?? 600_000);

export type CaptchaChallenge = { challenge: string; token: string };

export function createCaptchaChallenge(): CaptchaChallenge {
  const a = Math.floor(Math.random() * 7) + 2;
  const b = Math.floor(Math.random() * 7) + 2;
  const issuedAt = Date.now();
  const nonce = randomBytes(8).toString("hex");
  const payload = `${a}:${b}:${issuedAt}:${nonce}`;
  const signature = sign(getSecret(), payload);
  const token = base64UrlEncode(Buffer.from(`${payload}:${signature}`, "utf8"));
  return { challenge: `${a} + ${b}`, token };
}

export function validateCaptcha(token: string, answer: number): boolean {
  const rawBuf = base64UrlDecode(token);
  if (!rawBuf) return false;
  const raw = rawBuf.toString("utf8");
  const parts = raw.split(":");
  if (parts.length !== 5) return false;

  const [aText, bText, issuedAtText, nonce, signature] = parts;
  if (!aText || !bText || !issuedAtText || !nonce || !signature) return false;

  const payload = `${aText}:${bText}:${issuedAtText}:${nonce}`;
  const expected = sign(getSecret(), payload);
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false;

  const a = Number(aText);
  const b = Number(bText);
  const issuedAt = Number(issuedAtText);
  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(issuedAt)) return false;
  if (Date.now() - issuedAt > TOKEN_TTL_MS) return false;

  return a + b === answer;
}
