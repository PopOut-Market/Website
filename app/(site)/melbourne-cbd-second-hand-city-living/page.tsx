import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Melbourne CBD Second-Hand Market: City Living Furniture & Essentials";
const description =
  "Set up city life in Melbourne CBD with affordable second-hand furniture, kitchen gear, and apartment essentials. Great for students, WHV workers, and short-term renters.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Melbourne CBD second hand",
    "city apartment essentials Melbourne",
    "used furniture Melbourne CBD",
    "student furniture CBD",
  ],
  alternates: {
    canonical: "/melbourne-cbd-second-hand-city-living",
    languages: localizedAlternates("/melbourne-cbd-second-hand-city-living"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  about: {
    "@type": "Place",
    name: "Melbourne CBD, Victoria",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Melbourne CBD",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  },
};

export default function MelbourneCbdSeoPage() {
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
            <li>Melbourne CBD</li>
            <li>Melbourne, Victoria</li>
            <li>Australia</li>
          </ul>
        </div>
        <div className="mt-7">
          <Link
            href="/market?area=Melbourne%20CBD"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Explore Melbourne CBD Listings
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
