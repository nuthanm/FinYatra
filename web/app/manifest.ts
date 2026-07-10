import type { MetadataRoute } from "next";
import { SITE_FY, SITE_NAME } from "@/lib/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    id: "./",
    start_url: "./",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563EB",
    description: `Free finance calculators and planners for India. Based on FY ${SITE_FY}.`,
    prefer_related_applications: false,
    icons: [
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
