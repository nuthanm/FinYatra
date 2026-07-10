/**
 * Site-wide branding & reference year.
 * Change NEXT_PUBLIC_SITE_NAME / NEXT_PUBLIC_SITE_FY in .env — no code hunt required.
 */
export const SITE_NAME =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_NAME?.trim()) || "FinYatra";

/** Financial year calculators / tax rules are based on (e.g. 2025-26). */
export const SITE_FY =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_FY?.trim()) || "2025-26";

export const SITE_TITLE_SUFFIX = ` — ${SITE_NAME}`;
