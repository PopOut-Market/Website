import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Parkville Second-Hand: UniMelb Campus Essentials & Dorm Furniture";
const description =
  "UniMelb Parkville & UniLodge Lincoln House students: Find affordable second-hand study desks, bikes, kitchenware & dorm furniture. Get campus essentials for less!";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Parkville",
    "Melbourne",
    "VIC",
    "University of Melbourne",
    "UniLodge Lincoln House",
    "Melbourne Australia",
    "second hand Parkville",
  ],
  alternates: {
    canonical: "/parkville-secondhand-uni-melb-essentials",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  about: {
    "@type": "Place",
    name: "Parkville, Melbourne",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Parkville",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  },
};

export default function ParkvilleSeoPage() {
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
            <li>Parkville, Melbourne, VIC</li>
            <li>University of Melbourne</li>
            <li>UniLodge Lincoln House</li>
            <li>Melbourne, Australia</li>
          </ul>
        </div>

        <div className="mt-7">
          <Link
            href="/market?area=Parkville"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Explore Parkville Listings
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        // JSON-LD for SEO and GEO discoverability.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
