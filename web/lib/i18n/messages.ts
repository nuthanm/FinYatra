import type { Locale, Messages } from "@/lib/i18n";

import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import te from "@/messages/te.json";
import ta from "@/messages/ta.json";
import kn from "@/messages/kn.json";
import ml from "@/messages/ml.json";

const bundles: Record<Locale, Messages> = { en, hi, te, ta, kn, ml };

export function getMessages(locale: Locale): Messages {
  return bundles[locale] ?? bundles.en;
}
