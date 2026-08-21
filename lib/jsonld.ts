import { SITE_ORIGIN } from "@/lib/seo";
import {
  APP_STORE_URL,
  FOOTER_CONTACT_EMAIL,
  GOOGLE_PLAY_URL,
  FOOTER_SOCIAL_LINKEDIN_DEFAULT,
  FOOTER_SOCIAL_REDNOTE_DEFAULT,
} from "@/lib/site-config";
import type { Locale } from "@/lib/site-i18n";

/**
 * The site's entity graph, defined once.
 *
 * Before this, `/` and `/about` each declared their own `Organization` — with
 * different `legalName` spellings ("POPOUT MARKET PTY LTD" vs "PopOut Market Pty
 * Ltd"). Entity resolution treats a one-character difference as two separate
 * companies, which is the opposite of what a brand with essentially no
 * third-party corroboration needs. Every page now points at one `@id`.
 *
 * Deliberately absent everywhere, and each for a specific reason:
 *
 *  - `aggregateRating` / `review` — first-party rating markup on your own
 *    product is a known manual-action trigger, and the only figure available is
 *    5.0 from 18 Apple ratings against 4.6 from 10 on Play.
 *  - `LocalBusiness` — asserts premises customers visit. The registered address
 *    is an office unit; PopOut is not eligible for a Google Business Profile.
 *  - `FAQPage` — Google deprecated the rich result on 7 May 2026.
 *  - `Event` — Google explicitly names promotions, discounts and coupons as
 *    things NOT to mark up as events. This matters the moment anything on this
 *    site describes a shop special.
 */

const LANGUAGES: Locale[] = ["en", "zh-Hans", "zh-Hant", "ko", "ja", "vi", "fr", "es"];

/**
 * Every URL here must be a live 200 that the company actually controls.
 * A `sameAs` entry pointing at a generic homepage (as the Instagram link did)
 * is a broken corroboration signal, not a weak one.
 */
const SAME_AS = [
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  FOOTER_SOCIAL_LINKEDIN_DEFAULT,
  FOOTER_SOCIAL_REDNOTE_DEFAULT,
];

export function webSiteNode(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    url: `${SITE_ORIGIN}/`,
    name: "PopOut Market",
    inLanguage: locale,
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
  };
}

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: "PopOut Market",
    // Exactly as registered with ASIC. Keep byte-identical everywhere it appears.
    legalName: "POPOUT MARKET PTY LTD",
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/favicon.png`,
    email: FOOTER_CONTACT_EMAIL,
    // `taxID` in Australia means the ABN. The previous markup used it for the
    // ACN and baked the label inside the value ("ACN 696 464 945").
    identifier: [
      { "@type": "PropertyValue", propertyID: "ABN", value: "76696464945" },
      { "@type": "PropertyValue", propertyID: "ACN", value: "696464945" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "1003/151 City Rd",
      addressLocality: "Southbank",
      addressRegion: "VIC",
      postalCode: "3006",
      addressCountry: "AU",
    },
    areaServed: {
      "@type": "City",
      name: "Melbourne",
      containedInPlace: { "@type": "State", name: "Victoria" },
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: FOOTER_CONTACT_EMAIL,
      contactType: "customer support",
      availableLanguage: LANGUAGES,
    },
    sameAs: SAME_AS,
  };
}

export function mobileAppNode() {
  return {
    "@type": "MobileApplication",
    "@id": `${SITE_ORIGIN}/#app`,
    name: "PopOut Market",
    // "MarketplaceApplication" was not a valid value in either Google's list or
    // schema.org's vocabulary, so the property was silently discarded.
    applicationCategory: "ShoppingApplication",
    operatingSystem: "iOS 17.0+, Android",
    url: `${SITE_ORIGIN}/`,
    downloadUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
    installUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
    inLanguage: LANGUAGES,
    availableLanguage: LANGUAGES,
    publisher: { "@id": `${SITE_ORIGIN}/#organization` },
    areaServed: {
      "@type": "City",
      name: "Melbourne",
      containedInPlace: { "@type": "State", name: "Victoria" },
    },
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    // Shipped features only — every line here is verifiable in the app today.
    featureList: [
      "Second-hand listings ranked by how close they are to your Melbourne suburb",
      "Listing, chat and community-post translation across eight languages",
      "AI-drafted listings from photos, including bulk drafts from a whole room",
      "A public meetup spot chosen when a listing is created and shown to the buyer",
      "Local shop specials posted on a neighbourhood map",
      "A neighbourhood feed for local deals, questions, recommendations and wanted posts",
      "Accounts verified by Australian mobile number and a one-time location check",
    ],
  };
}
