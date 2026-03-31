import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Fitzroy Second-Hand: Creative Living, Decor & Apartment Essentials";
const description =
  "Discover second-hand home decor, furniture, and practical apartment essentials around Fitzroy. Ideal for creative living, students, and budget-friendly Melbourne lifestyles.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Fitzroy second hand",
    "creative living Fitzroy",
    "used decor Melbourne",
    "Fitzroy apartment essentials",
  ],
  alternates: {
    canonical: "/fitzroy-second-hand-creative-living",
    languages: localizedAlternates("/fitzroy-second-hand-creative-living"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  about: {
    "@type": "Place",
    name: "Fitzroy, Melbourne",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Fitzroy",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  },
};

export default function FitzroySeoPage() {
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
            <li>Fitzroy</li>
            <li>Melbourne, Victoria</li>
            <li>Australia</li>
          </ul>
        </div>
        <div className="mt-7">
          <Link
            href="/market?area=Fitzory"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Explore Fitzroy Listings
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
