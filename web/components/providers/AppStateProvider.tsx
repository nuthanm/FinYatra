"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ToolView = "tiles" | "list";

type AppStateContextValue = {
  toolView: ToolView;
  setToolView: (view: ToolView) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [toolView, setToolView] = useState<ToolView>("list");
  const value = useMemo(() => ({ toolView, setToolView }), [toolView]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
