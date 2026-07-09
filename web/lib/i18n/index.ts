export type Locale = "en" | "hi" | "te" | "ta" | "kn" | "ml";

export const STORAGE_KEY = "fy-culture";

export type CultureOption = { code: Locale; blazorCode: string; nativeName: string };

export const SUPPORTED: CultureOption[] = [
  { code: "en", blazorCode: "en-IN", nativeName: "English" },
  { code: "hi", blazorCode: "hi-IN", nativeName: "हिंदी" },
  { code: "te", blazorCode: "te-IN", nativeName: "తెలుగు" },
  { code: "ta", blazorCode: "ta-IN", nativeName: "தமிழ்" },
  { code: "kn", blazorCode: "kn-IN", nativeName: "ಕನ್ನಡ" },
  { code: "ml", blazorCode: "ml-IN", nativeName: "മലയാളം" },
];

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) return "en";
  const lower = value.toLowerCase();
  for (const c of SUPPORTED) {
    if (lower === c.code || lower === c.blazorCode.toLowerCase()) return c.code;
  }
  const prefix = lower.split("-")[0] as Locale;
  return SUPPORTED.some((c) => c.code === prefix) ? prefix : "en";
}

export type Messages = Record<string, string>;

export function formatMessage(template: string, ...args: (string | number)[]): string {
  return template.replace(/\{(\d+)\}/g, (_, index) => {
    const i = Number(index);
    return i < args.length ? String(args[i]) : `{${index}}`;
  });
}

export type TFn = (key: string, ...args: (string | number)[]) => string;

export function createT(messages: Messages): TFn {
  return (key: string, ...args: (string | number)[]) => {
    const template = messages[key] ?? key;
    return args.length ? formatMessage(template, ...args) : template;
  };
}
