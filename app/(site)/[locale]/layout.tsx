import "@/app/globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { baseMetadata } from "@/lib/root-metadata";
import { OG_IMAGE } from "@/lib/seo";
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
    // Required, and easy to lose: an explicit `openGraph` block suppresses the
    // og:image Next would otherwise derive from app/opengraph-image.tsx (see
    // lib/seo.ts). Without it the twelve templates that fall back to this
    // layout — the suburb pages, the comparison children, /contact — share to
    // WeChat, KakaoTalk, LINE and Facebook as a blank card.
    images: [OG_IMAGE],
    title: "PopOut Market",
    description:
      "The neighbourhood app for Melbourne — second-hand from verified neighbours nearby, local shop specials on the map, and neighbourhood questions answered in eight languages.",
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE.url],
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
