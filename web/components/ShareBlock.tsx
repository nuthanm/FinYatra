"use client";

import { useId, useState, type ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function ShareBlock({ title, subtitle, children }: Props) {
  const id = useId().replace(/:/g, "");
  const blockId = `fyblk_${id}`;
  const [copying, setCopying] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const copyImage = async () => {
    try {
      setCopying(true);
      setToast(null);
      const share = window.FinYatraShare;
      if (!share) throw new Error("Share helper not loaded");
      const result = await share.copyElementPng(blockId);
      setToast(result === "download" ? "Downloaded image (clipboard not available)" : "Copied to clipboard");
    } catch {
      setToast("Copy failed — try again");
    } finally {
      setCopying(false);
      window.setTimeout(() => setToast(null), 1800);
    }
  };

  return (
    <section className="fy-share-block" id={blockId}>
      <div className="fy-share-head">
        <div className="fy-share-heading">
          <div className="fy-share-title">{title}</div>
          {subtitle ? <div className="fy-share-sub">{subtitle}</div> : null}
        </div>
        <button type="button" className="fy-share-btn" onClick={() => void copyImage()} disabled={copying}>
          {copying ? "Copying..." : "Copy screenshot"}
        </button>
      </div>
      <div className="fy-share-body">{children}</div>
      {toast ? (
        <div className="fy-toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
