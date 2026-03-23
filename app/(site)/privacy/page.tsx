"use client";

import { FooterLegalStubPage } from "@/components/footer-legal-stub-page";
import { useSiteShell } from "@/components/site-chrome-context";

export default function PrivacyPage() {
  const { t } = useSiteShell();
  return <FooterLegalStubPage title={t.footerNavPrivacy} />;
}
