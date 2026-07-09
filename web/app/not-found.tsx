"use client";

import { useT } from "@/components/providers/I18nProvider";

export default function NotFound() {
  const t = useT();
  return <p role="alert">{t("NotFound_Message")}</p>;
}
