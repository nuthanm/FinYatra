import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { AppStateProvider } from "@/components/providers/AppStateProvider";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { SITE_FY, SITE_NAME } from "@/lib/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: `Free India-first personal finance calculators and guides. Based on FY ${SITE_FY}.`,
  metadataBase: new URL("https://finyatra.com"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/icon-512.png", sizes: "512x512" },
      { url: "/icon-192.png", sizes: "192x192" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;600;700&family=Noto+Sans+Telugu:wght@400;600;700&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Sans+Kannada:wght@400;600;700&family=Noto+Sans+Malayalam:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <I18nProvider>
          <AppStateProvider>
            <AppShell>{children}</AppShell>
          </AppStateProvider>
        </I18nProvider>
        <Script src="/js/finyatra-scroll.js" strategy="afterInteractive" />
        <Script src="/js/finyatra-share.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js" strategy="afterInteractive" />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
