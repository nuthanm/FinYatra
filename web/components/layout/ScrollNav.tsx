"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FyIcon } from "@/components/FyIcon";
import { useT } from "@/components/providers/I18nProvider";

const THRESHOLD = 48;

function getScrollState() {
  const root = document.scrollingElement || document.documentElement;
  const y = window.scrollY || root.scrollTop || 0;
  const max = Math.max(0, root.scrollHeight - window.innerHeight);
  return {
    canScrollUp: y > THRESHOLD,
    canScrollDown: y < max - THRESHOLD,
    hasOverflow: max > THRESHOLD,
  };
}

export function ScrollNav() {
  const t = useT();
  const pathname = usePathname();
  const [initialized, setInitialized] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const update = () => {
      const state = getScrollState();
      setInitialized(true);
      setCanScrollUp(state.canScrollUp);
      setCanScrollDown(state.canScrollDown);
      setHasOverflow(state.hasOverflow);
    };

    update();
    const t1 = window.setTimeout(update, 250);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.clearTimeout(t1);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  const scrollTo = (top: number) => {
    window.scrollTo({ top, behavior: "smooth" });
  };

  const showNav = !initialized || hasOverflow;
  const showTop = !initialized || canScrollUp;
  const showBottom = !initialized || canScrollDown;

  if (!showNav) return null;

  return (
    <div className="fy-scroll-nav" aria-label={t("Scroll_NavAria")}>
      {showTop ? (
        <button
          type="button"
          className="fy-scroll-btn"
          onClick={() => scrollTo(0)}
          aria-label={t("Scroll_TopAria")}
          title={t("Scroll_TopAria")}
        >
          <FyIcon name="chevron-up" size={20} />
          <span className="fy-scroll-label">{t("Scroll_Top")}</span>
        </button>
      ) : null}
      {showBottom ? (
        <button
          type="button"
          className="fy-scroll-btn"
          onClick={() => {
            const root = document.scrollingElement || document.documentElement;
            scrollTo(Math.max(0, root.scrollHeight - window.innerHeight));
          }}
          aria-label={t("Scroll_BottomAria")}
          title={t("Scroll_BottomAria")}
        >
          <FyIcon name="chevron-down" size={20} />
          <span className="fy-scroll-label">{t("Scroll_Bottom")}</span>
        </button>
      ) : null}
    </div>
  );
}
