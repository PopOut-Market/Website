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
    "PopOut Market is the neighbourhood app for Melbourne: buy and sell second-hand with verified neighbours nearby, see current specials at local shops on the map, and ask your neighbours anything, in eight languages.",
  openGraph: {
    type: "website",
    siteName: "PopOut Market",
    title: "PopOut Market",
    description:
      "The neighbourhood app for Melbourne — second-hand from verified neighbours nearby, local shop specials on the map, and neighbourhood questions answered in eight languages.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PopOut Market",
    description:
      "The neighbourhood app for Melbourne — second-hand from verified neighbours nearby, local shop specials on the map, and neighbourhood questions answered in eight languages.",
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
