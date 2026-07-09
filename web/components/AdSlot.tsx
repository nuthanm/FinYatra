"use client";

import { useEffect } from "react";

type Props = {
  enabled?: boolean;
  client?: string;
  slot?: string;
  format?: string;
};

export function AdSlot({
  enabled = false,
  client = "ca-pub-XXXXXXXXXXXXXXXX",
  slot = "0000000000",
  format = "auto",
}: Props) {
  useEffect(() => {
    if (!enabled) return;
    try {
      const w = window as Window & { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* no-op */
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <ins
      className="adsbygoogle fy-ad"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
