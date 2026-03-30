import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import type { Metadata } from "next";
import Link from "next/link";

const title = "North Melbourne Second-Hand: Student Living & Apartment Essentials";
const description =
  "Find affordable second-hand furniture, appliances, and daily essentials in North Melbourne. Ideal for students, shared housing, and budget-conscious city living.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "North Melbourne second hand",
    "student living North Melbourne",
    "shared apartment furniture Melbourne",
    "used essentials North Melbourne",
  ],
  alternates: {
    canonical: "/north-melbourne-second-hand-student-living",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  about: {
    "@type": "Place",
    name: "North Melbourne, Melbourne",
    address: {
      "@type": "PostalAddress",
      addressLocality: "North Melbourne",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  },
};

export default function NorthMelbourneSeoPage() {
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
            <li>North Melbourne</li>
            <li>Melbourne, Victoria</li>
            <li>Australia</li>
          </ul>
        </div>
        <div className="mt-7">
          <Link
            href="/market?area=North%20Melbourne"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Explore North Melbourne Listings
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
