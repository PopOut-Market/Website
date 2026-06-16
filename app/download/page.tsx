import {
  APP_STORE_BADGE_SRC,
  APP_STORE_URL,
  GOOGLE_PLAY_BADGE_SRC,
  GOOGLE_PLAY_URL,
  LOGO_MARK_SRC,
} from "@/lib/site-config";
import { OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";

const TITLE = "Download PopOut Market — iOS & Android";
const DESCRIPTION =
  "Download the PopOut Market app — Melbourne's second-hand marketplace. Available on the App Store and Google Play.";

// Same share card as the homepage: the OG logo image + title/description, on
// both Open Graph and Twitter.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/download" },
  openGraph: {
    type: "website",
    siteName: "PopOut Market",
    title: TITLE,
    description: DESCRIPTION,
    url: "/download",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE.url],
  },
};

// Prerender as a static page so the CDN serves /download directly, ahead of the
// (site)/[locale] dynamic route (which otherwise 404s a non-locale path on
// Netlify).
export const dynamic = "force-static";

// Standalone download page (no site header/footer). The store links resolve
// device-natively: on a computer they open the store web page; on a phone iOS
// opens the App Store app and Android opens the Google Play app.
export default function DownloadPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-5 py-10 text-center sm:px-6 sm:py-12">
      <div className="flex w-full max-w-3xl flex-col items-center">
        <Image
          src={LOGO_MARK_SRC}
          alt="PopOut Market"
          width={224}
          height={224}
          priority
          className="h-16 w-16 rounded-3xl border border-black/10 bg-white object-cover shadow-card sm:h-24 sm:w-24"
        />
        <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900 sm:mt-6 sm:text-3xl">
          PopOut Market
        </h1>
        <p className="mt-2 text-sm text-gray-700 sm:text-base">
          Melbourne&apos;s second-hand marketplace
        </p>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
          Download the PopOut Market app for iOS or Android
        </p>

        {/* Store buttons: like the footer, they sit in a centered row that wraps
            on narrow screens; sizes scale down on small screens. */}
        <div className="mt-8 flex w-full flex-row flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-8">
          <a href={APP_STORE_URL} aria-label="Download on the App Store" className="block">
            <Image
              src={APP_STORE_BADGE_SRC}
              alt="Download on the App Store"
              width={300}
              height={100}
              className="h-16 w-auto max-w-full object-contain sm:h-28"
            />
          </a>
          <a href={GOOGLE_PLAY_URL} aria-label="Get it on Google Play" className="block">
            <Image
              src={GOOGLE_PLAY_BADGE_SRC}
              alt="Get it on Google Play"
              width={320}
              height={100}
              className="h-16 w-auto max-w-full object-contain sm:h-28"
            />
          </a>
        </div>

        <p className="mt-8 max-w-sm text-xs leading-relaxed text-gray-400 sm:mt-10">
          If a button doesn&apos;t open the store, open this page in your browser (such as Safari or
          Chrome) and tap it again.
        </p>
      </div>
    </main>
  );
}
