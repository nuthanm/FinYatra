import type { Metadata } from "next";
import { SITE_NAME, SITE_TITLE_SUFFIX } from "@/lib/config/site";
import en from "@/messages/en.json";

function msg(key: string): string {
  if (key === "App_Title") return SITE_NAME;
  if (key === "Common_PageTitleSuffix") return SITE_TITLE_SUFFIX;
  return (en as Record<string, string>)[key] ?? key;
}

/** Page titles that already include the site-name suffix (e.g. Page_Privacy_PageTitle). */
export function pageMetadata(titleKey: string, descriptionKey?: string): Metadata {
  return {
    title: msg(titleKey),
    ...(descriptionKey ? { description: msg(descriptionKey) } : {}),
  };
}

/** Calculator / tool pages: title key + Common_PageTitleSuffix. */
export function toolMetadata(titleKey: string, descriptionKey?: string): Metadata {
  return {
    title: `${msg(titleKey)}${SITE_TITLE_SUFFIX}`,
    ...(descriptionKey ? { description: msg(descriptionKey) } : {}),
  };
}
