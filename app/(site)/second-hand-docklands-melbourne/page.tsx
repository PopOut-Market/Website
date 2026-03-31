import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Second-Hand Furniture & Appliances for Docklands Apartments";
const description =
  "Moving to Docklands? Find affordable second-hand furniture & kitchen appliances for your apartment. Perfect for working holiday visa holders & short-term stays in Melbourne. Buy & sell locally!";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Docklands",
    "Melbourne",
    "Victoria",
    "Australia",
    "second hand furniture Docklands",
    "used appliances Melbourne",
    "Docklands apartment essentials",
  ],
  alternates: {
    canonical: "/second-hand-docklands-melbourne",
    languages: localizedAlternates("/second-hand-docklands-melbourne"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  about: {
    "@type": "Place",
    name: "Docklands, Melbourne",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Docklands",
      addressRegion: "VIC",
      addressCountry: "AU",
    },
  },
};

export default function DocklandsSeoPage() {
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
            <li>Docklands, Melbourne</li>
            <li>Melbourne, Victoria</li>
            <li>Victoria, Australia</li>
          </ul>
        </div>

        <div className="mt-7">
          <Link
            href="/market?area=Docklands"
            className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
          >
            Explore Docklands Listings
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
