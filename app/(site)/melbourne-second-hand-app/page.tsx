import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const title = "Melbourne Second-Hand App | Local Buying and Selling with PopOut Market";
const description =
  "PopOut Market is a Melbourne second-hand app for local buying and selling, with suburb-based discovery, multilingual communication, and safer meetup workflows.";

const faqItems = [
  {
    q: "What makes a Melbourne second-hand app useful for local trading?",
    a: "The most useful apps help people browse nearby listings, message clearly, and finish pickups with less friction. For Melbourne users, suburb-based discovery and clearer meetup coordination matter more than generic city-wide scrolling.",
  },
  {
    q: "Is PopOut designed only for students?",
    a: "No. PopOut is useful for students, apartment residents, recent movers, and local households. Student and graduation-season scenarios are important, but the product is designed for everyday Melbourne second-hand trading as well.",
  },
  {
    q: "Why mention Melbourne CBD in a second-hand app page?",
    a: "Melbourne CBD has dense apartment living, university activity, and frequent short-distance pickups. That makes it one of the strongest examples of why a local-first second-hand app can be more practical than a broad classifieds feed.",
  },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Melbourne second hand app",
    "second hand app Melbourne",
    "Melbourne buy and sell app",
    "Melbourne second hand trading platform",
  ],
  alternates: {
    canonical: "/melbourne-second-hand-app",
    languages: localizedAlternates("/melbourne-second-hand-app"),
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
        "@type": "Thing",
        name: "Melbourne second-hand app",
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

export default function MelbourneSecondHandAppPage() {
  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{description}</p>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Why local matters in Melbourne</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Melbourne second-hand trading often happens inside practical living zones: apartment towers,
            student areas, CBD blocks, and nearby suburbs. A local-first app helps users compare listings
            that are realistically close enough to inspect, collect, and complete without excessive travel.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            PopOut is built around that local behaviour. Instead of treating Melbourne as one flat city-wide
            feed, it emphasizes suburb-level browsing, easier communication, and a clearer path from listing
            discovery to meetup.
          </p>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Who this is designed for</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
            <li>Students setting up or clearing out rooms near universities and city campuses.</li>
            <li>Apartment residents in Melbourne city and Melbourne CBD who prefer nearby pickup.</li>
            <li>Local buyers and sellers who want multilingual communication and clearer coordination.</li>
            <li>Graduation-season users moving out quickly and trying to sell practical household items.</li>
          </ul>
        </section>

        <section className="mt-7 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Related Melbourne search intent</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/market"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Browse Melbourne listings
            </Link>
            <Link
              href="/melbourne-second-hand-market"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Read Melbourne second-hand market guide
            </Link>
            <Link
              href="/melbourne-cbd-second-hand-marketplace"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50"
            >
              Explore Melbourne CBD marketplace page
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
