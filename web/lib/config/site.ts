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

/** Public contact address shown on privacy/terms/contact pages. */
export const CONTACT_EMAIL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()) ||
  "inbox.nuthan@gmail.com";

export const BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL?.trim()) || "https://finyatra.com";

export type SitePageLink = { titleKey: string; route: string; descriptionKey: string };

export const SITE_PAGES: SitePageLink[] = [
  { titleKey: "Nav_Home", route: "", descriptionKey: "Page_Sitemap_Desc_Home" },
  { titleKey: "Nav_AllTools", route: "tools", descriptionKey: "Page_Sitemap_Desc_Tools" },
  { titleKey: "Nav_GoalPlanner", route: "goal", descriptionKey: "Page_Sitemap_Desc_Goal" },
  { titleKey: "Nav_Fire", route: "fire", descriptionKey: "Page_Sitemap_Desc_Fire" },
  { titleKey: "Nav_FdLaddering", route: "fd-laddering", descriptionKey: "Page_Sitemap_Desc_Fd" },
  { titleKey: "Nav_Sip", route: "sip", descriptionKey: "Page_Sitemap_Desc_Sip" },
  { titleKey: "Nav_Emi", route: "emi", descriptionKey: "Page_Sitemap_Desc_Emi" },
  { titleKey: "Nav_Inflation", route: "inflation", descriptionKey: "Page_Sitemap_Desc_Inflation" },
  { titleKey: "Nav_About", route: "about", descriptionKey: "Page_Sitemap_Desc_About" },
  {
    titleKey: "Nav_PmsbyPmjjby",
    route: "schemes/pmsby-pmjjby",
    descriptionKey: "Page_PmsbyPmjjby_Description",
  },
  { titleKey: "Nav_Contact", route: "contact", descriptionKey: "Page_Sitemap_Desc_Contact" },
  { titleKey: "Nav_Sitemap", route: "sitemap", descriptionKey: "Page_Sitemap_Desc_Sitemap" },
  { titleKey: "Common_PrivacyPolicy", route: "privacy", descriptionKey: "Page_Sitemap_Desc_Privacy" },
  { titleKey: "Common_Terms", route: "terms", descriptionKey: "Page_Sitemap_Desc_Terms" },
];

export function pageHref(route: string): string {
  return route ? `/${route}` : "/";
}

export function absoluteUrl(route: string): string {
  return route ? `${BASE_URL}/${route}` : `${BASE_URL}/`;
}
