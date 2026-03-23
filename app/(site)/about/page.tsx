"use client";

import { AboutPageContent } from "@/components/about-page-content";
import { useSiteShell } from "@/components/site-chrome-context";
import { useEffect } from "react";

export default function AboutPage() {
  const { t } = useSiteShell();

  useEffect(() => {
    const prev = document.title;
    document.title = `${t.aboutPageTitle} · Popout Market`;
    return () => {
      document.title = prev;
    };
  }, [t.aboutPageTitle]);

  return <AboutPageContent t={t} />;
}
