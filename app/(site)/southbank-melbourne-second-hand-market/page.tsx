import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const title =
  "Southbank Melbourne Second-Hand Market: Furniture, Art Supplies & Studio Essentials";
const description =
  "Discover second-hand furniture, art supplies & studio essentials in Southbank, Melbourne. Perfect for UniLodge students & compact apartments. Buy, sell, save!";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Southbank",
    "Melbourne",
    "Victoria",
    "Australia",
    "second hand Southbank",
    "Southbank studio essentials",
    "Southbank furniture marketplace",
  ],
  alternates: {
    canonical: "/southbank-melbourne-second-hand-market",
    languages: localizedAlternates("/southbank-melbourne-second-hand-market"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  about: {
    "@type": "Place",
    name: "Southbank, Melbourne",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Southbank",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  },
};

export default function SouthbankSeoPage() {
  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-3xl`}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{description}</p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Geo Tags
          </h2>
          <ul className="mt-3 space-y-1 text-sm text-gray-700">
            <li>Southbank</li>
            <li>Melbourne</li>
            <li>Victoria</li>
            <li>Australia</li>
          </ul>
        </div>

        <div className="mt-7">
          <Link
            href="/market?area=Southbank"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Explore Southbank Listings
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
