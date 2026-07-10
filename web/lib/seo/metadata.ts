import type { Metadata } from "next";
import en from "@/messages/en.json";

function msg(key: string): string {
  return (en as Record<string, string>)[key] ?? key;
}

/** Page titles that already include the FinYatra suffix (e.g. Page_Privacy_PageTitle). */
export function pageMetadata(titleKey: string, descriptionKey?: string): Metadata {
  return {
    title: msg(titleKey),
    ...(descriptionKey ? { description: msg(descriptionKey) } : {}),
  };
}

/** Calculator / tool pages: title key + Common_PageTitleSuffix. */
export function toolMetadata(titleKey: string, descriptionKey?: string): Metadata {
  return {
    title: `${msg(titleKey)}${msg("Common_PageTitleSuffix")}`,
    ...(descriptionKey ? { description: msg(descriptionKey) } : {}),
  };
}
