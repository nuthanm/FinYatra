const NEWLINE = /[\r\n]+/g;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function clean(value: string | null | undefined): string {
  return (value ?? "").trim();
}

export function cleanSingleLine(value: string | null | undefined): string {
  return clean(value).replace(NEWLINE, " ");
}

export function isValidEmail(email: string): boolean {
  return EMAIL.test(email);
}

export const MIN_MESSAGE_LENGTH = 10;

export const ALLOWED_REQUEST_TYPES = new Set([
  "Bug report",
  "Feature request",
  "Calculator feedback",
  "Translation improvement",
  "Partnership / advertising",
  "Other",
]);

export type ContactSubmitPayload = {
  name: string;
  email: string;
  requestType: string;
  subject: string;
  message: string;
  website?: string;
  captchaToken: string;
  captchaAnswer: number;
  consent: boolean;
};

export type SanitizedContactRequest = {
  name: string;
  email: string;
  requestType: string;
  subject: string;
  message: string;
  captchaToken: string;
  captchaAnswer: number;
};

export type ContactValidationResult =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; request: SanitizedContactRequest }
  | { ok: false; error: string };

export function validateContact(dto: ContactSubmitPayload): ContactValidationResult {
  const name = cleanSingleLine(dto.name);
  const email = cleanSingleLine(dto.email);
  const requestType = cleanSingleLine(dto.requestType);
  const subject = cleanSingleLine(dto.subject);
  const message = clean(dto.message);
  const website = clean(dto.website);
  const captchaToken = cleanSingleLine(dto.captchaToken);

  if (website) return { ok: true, honeypot: true };

  if (!name || !email || !subject || !message) {
    return { ok: false, error: "Missing required fields." };
  }
  if (!dto.consent) return { ok: false, error: "Consent is required." };
  if (name.length > 120 || email.length > 254 || subject.length > 180 || message.length > 5000) {
    return { ok: false, error: "Input exceeds allowed limits." };
  }
  if (message.length < MIN_MESSAGE_LENGTH) return { ok: false, error: "Message is too short." };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email format." };
  if (!ALLOWED_REQUEST_TYPES.has(requestType)) return { ok: false, error: "Invalid request type." };
  if (!captchaToken || dto.captchaAnswer == null) return { ok: false, error: "Invalid captcha payload." };

  return {
    ok: true,
    honeypot: false,
    request: { name, email, requestType, subject, message, captchaToken, captchaAnswer: dto.captchaAnswer },
  };
}

export function isMailConfigured(): boolean {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "") ?? "";
  const mailTo = process.env.SMTP_MAIL_TO?.trim();
  return Boolean(user && pass && mailTo);
}
