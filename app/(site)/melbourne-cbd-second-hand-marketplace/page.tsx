import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Melbourne CBD Second-Hand Marketplace | City Listings and Safer Local Trading";
const description =
  "Discover how a Melbourne CBD second-hand marketplace helps city residents, students, and apartment movers buy and sell nearby furniture, essentials, and household items.";

const faqItems = [
  {
    q: "Why is Melbourne CBD a strong second-hand marketplace area?",
    a: "Melbourne CBD combines apartment density, university traffic, and fast move-in or move-out cycles. That creates steady demand for furniture, small appliances, and practical household goods that can be collected nearby.",
  },
  {
    q: "What do buyers usually look for in a CBD listing?",
    a: "Buyers typically want clear condition details, realistic pickup timing, and straightforward communication. In dense city areas, convenience and response speed often matter almost as much as price.",
  },
  {
    q: "Does a CBD marketplace page help users outside the city centre too?",
    a: "Yes. Melbourne CBD often acts as a reference point for nearby suburbs such as Carlton, Southbank, Docklands, and North Melbourne. City-centre search intent often overlaps with surrounding local trading zones.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Melbourne CBD second hand marketplace",
    "Melbourne city second hand market",
    "Melbourne CBD second hand",
    "city second hand marketplace Melbourne",
  ],
  alternates: {
    canonical: "/melbourne-cbd-second-hand-marketplace",
    languages: localizedAlternates("/melbourne-cbd-second-hand-marketplace"),
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: title,
      description,
      about: {
        "@type": "Place",
        name: "Melbourne CBD",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Melbourne CBD",
          addressRegion: "VIC",
          addressCountry: "AU",
        },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ],
};

export default function MelbourneCbdSecondHandMarketplacePage() {
  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{description}</p>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">What city-centre users usually need</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Melbourne CBD search intent often reflects very practical needs: furnishing a studio quickly,
            replacing household basics, selling items before a move, or comparing local options without
            traveling far. City users often want nearby pickup, faster replies, and listings that are easy to
            evaluate from photos and descriptions.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            That is where a CBD-focused second-hand marketplace becomes more useful than a broad statewide
            listing experience. The closer the listing is to real daily movement patterns, the more likely the
            trade is to complete smoothly.
          </p>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Nearby search overlap</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-700">
            <li>Melbourne city second-hand market</li>
            <li>Melbourne CBD second-hand listings</li>
            <li>Carlton and Melbourne CBD move-in essentials</li>
            <li>Docklands, Southbank, and inner-city apartment furniture</li>
          </ul>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Useful next steps</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/market?area=Melbourne%20CBD"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Open Melbourne CBD listings
            </Link>
            <Link
              href="/melbourne-cbd-second-hand-city-living"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Read Melbourne CBD city living guide
            </Link>
            <Link
              href="/melbourne-second-hand-market"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Read broader Melbourne market page
            </Link>
          </div>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">FAQ</h2>
          <div className="mt-4 space-y-4">
            {faqItems.map((item) => (
              <article key={item.q} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <h3 className="text-sm font-semibold text-gray-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
