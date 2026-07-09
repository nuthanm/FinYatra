"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const isLocalDev = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if (isLocalDev) return;

    navigator.serviceWorker
      .register("/service-worker.js?v=2026-07-09-6")
      .then((reg) => {
        reg.update();
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              location.reload();
            }
          });
        });
      })
      .catch(() => {
        /* no-op */
      });
  }, []);

  return null;
}
