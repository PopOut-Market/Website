import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Melbourne Second-Hand Market | Local Trading Platform and Listings";
const description =
  "Explore how a Melbourne second-hand market works across city suburbs, with local listings, multilingual communication, and practical trading workflows through PopOut Market.";

const faqItems = [
  {
    q: "What does Melbourne second-hand market usually mean online?",
    a: "It can mean many things: local listing platforms, buy-and-sell apps, suburb-based marketplaces, or even general used-goods communities. For search intent, people often want a practical place to browse and trade nearby items rather than a generic classifieds directory.",
  },
  {
    q: "Why is suburb-based browsing important in Melbourne?",
    a: "Melbourne is spread across many distinct suburbs with different living patterns and commute habits. A suburb-first view makes second-hand discovery more useful because pickup distance, timing, and buyer convenience strongly affect whether a trade actually happens.",
  },
  {
    q: "How is Melbourne CBD different from the wider city market?",
    a: "Melbourne CBD usually has denser apartment living, more student demand, and quicker turnover for furniture, kitchen gear, and move-in essentials. The wider Melbourne market includes a broader mix of households, travel distances, and pickup expectations.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Melbourne second hand market",
    "second hand market Melbourne",
    "Melbourne second hand trading platform",
    "Melbourne second hand marketplace",
  ],
  alternates: {
    canonical: "/melbourne-second-hand-market",
    languages: localizedAlternates("/melbourne-second-hand-market"),
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
        name: "Melbourne, Victoria, Australia",
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

export default function MelbourneSecondHandMarketPage() {
  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{description}</p>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">How local trading works in Melbourne</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            In a real Melbourne second-hand market, users rarely care only about price. They also care about
            pickup convenience, suburb familiarity, seller responsiveness, and whether the item fits a short
            move-in or move-out timeline. Those practical factors shape whether a listing is truly useful.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            PopOut is positioned around those realities. It supports neighbourhood-level discovery,
            multilingual communication, and clearer meetup planning for people trading inside Melbourne rather
            than across an abstract national feed.
          </p>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Strong-fit use cases</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-3 py-2 font-semibold text-gray-900">Scenario</th>
                  <th className="border border-gray-200 px-3 py-2 font-semibold text-gray-900">Why local fit matters</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">Student move-in</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">Beds, desks, and kitchen items are easier to compare when pickup stays near campus or city housing.</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">Graduation move-out</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">Faster local matching helps sellers clear items before lease deadlines or flights.</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">Apartment living</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-700">Short pickup distance reduces coordination cost for bulky furniture and same-day collection.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Related pages</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/market"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Open Melbourne market listings
            </Link>
            <Link
              href="/melbourne-second-hand-app"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Read Melbourne second-hand app page
            </Link>
            <Link
              href="/melbourne-cbd-second-hand-marketplace"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Read Melbourne CBD marketplace page
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
