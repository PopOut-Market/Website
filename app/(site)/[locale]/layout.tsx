import "@/app/globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { baseMetadata } from "@/lib/root-metadata";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { LOCALE_SEGMENT_TO_CODE, htmlLang } from "@/lib/site-locale-routing";
import type { Metadata } from "next";
import type { ReactNode } from "react";

// Root layout for the localized public site. Because this owns <html>, the
// `lang` attribute is rendered correctly per locale on the SERVER (no more
// client-side correction). Pre-renders one static variant per locale.
export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "PopOut Market",
    template: "%s | PopOut Market",
  },
  description:
    "PopOut Market helps Melbourne communities buy and sell second-hand items with suburb-first discovery, multilingual communication, and safer meetup workflows.",
  openGraph: {
    type: "website",
    siteName: "PopOut Market",
    title: "PopOut Market",
    description:
      "Melbourne's second-hand marketplace — buy and sell locally with suburb-first discovery and multilingual chat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PopOut Market",
    description:
      "Melbourne's second-hand marketplace — buy and sell locally with suburb-first discovery and multilingual chat.",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(LOCALE_SEGMENT_TO_CODE).map((locale) => ({ locale }));
}

export default async function SiteLocaleLayout({
  children,
  params,
}: LocaleParams & { children: ReactNode }) {
  const locale = await localeFromParams(params);
  return (
    <html lang={htmlLang(locale)}>
      <body>
        <SiteChrome initialLocale={locale}>{children}</SiteChrome>
      </body>
    </html>
  );
}
