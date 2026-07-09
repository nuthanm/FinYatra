"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createT, normalizeLocale, STORAGE_KEY, type Locale, type TFn } from "@/lib/i18n";
import { getMessages } from "@/lib/i18n/messages";

type I18nContextValue = {
  locale: Locale;
  t: TFn;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = normalizeLocale(localStorage.getItem(STORAGE_KEY));
    setLocaleState(stored);
    document.documentElement.lang = stored === "en" ? "en-IN" : `${stored}-IN`;
  }, []);

  const setLocale = useCallback((next: Locale) => {
    localStorage.setItem(STORAGE_KEY, next);
    window.location.reload();
  }, []);

  const value = useMemo(() => {
    const messages = getMessages(locale);
    return { locale, t: createT(messages), setLocale };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT(): TFn {
  return useI18n().t;
}
