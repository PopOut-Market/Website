"use client";

import { useEffect } from "react";

/**
 * Sets <html lang> on the client to match the active locale. The root layout is
 * shared with the (non-localized) admin tree and is statically rendered with a
 * default lang, so the per-locale value is applied here. Content and hreflang
 * are already correct in the server HTML; this only refines the lang attribute.
 */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
