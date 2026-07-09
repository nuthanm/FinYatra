import type { Metadata } from "next";
import en from "@/messages/en.json";

type MessageKey = keyof typeof en;

function msg(key: string): string {
  return (en as Record<string, string>)[key] ?? key;
}

/** Page titles that already include the FinYatra suffix (e.g. Page_Privacy_PageTitle). */
export function pageMetadata(titleKey: MessageKey, descriptionKey?: MessageKey): Metadata {
  return {
    title: msg(titleKey),
    ...(descriptionKey ? { description: msg(descriptionKey) } : {}),
  };
}

/** Calculator / tool pages: title key + Common_PageTitleSuffix. */
export function toolMetadata(titleKey: MessageKey, descriptionKey?: MessageKey): Metadata {
  return {
    title: `${msg(titleKey)}${msg("Common_PageTitleSuffix")}`,
    ...(descriptionKey ? { description: msg(descriptionKey) } : {}),
  };
}
