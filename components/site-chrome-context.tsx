"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale, SiteCopy } from "@/lib/site-i18n";

export type SiteShellValue = {
  locale: Locale;
  t: SiteCopy;
  openLanguageModal: () => void;
  localizePath: (href: string) => string;
};

const SiteShellContext = createContext<SiteShellValue | null>(null);

export function SiteShellProvider({
  value,
  children,
}: {
  value: SiteShellValue;
  children: ReactNode;
}) {
  return (
    <SiteShellContext.Provider value={value}>{children}</SiteShellContext.Provider>
  );
}

export function useSiteShell(): SiteShellValue {
  const ctx = useContext(SiteShellContext);
  if (!ctx) {
    throw new Error("useSiteShell must be used within SiteChrome");
  }
  return ctx;
}
