import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Carlton Student Second-Hand Melbourne: Furniture, Bikes & Study Essentials";
const description =
  "Looking for student-friendly second-hand deals in Carlton? Discover affordable desks, chairs, bikes, and home essentials near UniMelb and central Melbourne campuses.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Carlton second hand",
    "student furniture Carlton",
    "used bikes Carlton Melbourne",
    "UniMelb second hand essentials",
  ],
  alternates: {
    canonical: "/carlton-student-second-hand-melbourne",
    languages: localizedAlternates("/carlton-student-second-hand-melbourne"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  about: {
    "@type": "Place",
    name: "Carlton, Melbourne",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Carlton",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  },
};

export default function CarltonSeoPage() {
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
            <li>Carlton</li>
            <li>Melbourne, Victoria</li>
            <li>Australia</li>
          </ul>
        </div>
        <div className="mt-7">
          <Link
            href="/market?area=Carlton"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Explore Carlton Listings
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
