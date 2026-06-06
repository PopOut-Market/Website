import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates, siteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const title =
  "Melbourne Second-Hand Marketplace | Buy & Sell Locally with PopOut Market";
const description =
  "PopOut Market is a Melbourne second-hand marketplace app for buying and selling locally. Browse nearby furniture, appliances, bikes and home essentials by suburb, chat across languages, and meet up safely. Centred on the Melbourne CBD, useful right across the city.";

const categories = [
  {
    name: "Furniture",
    detail: "Beds, mattresses, desks, chairs, sofas, wardrobes and shelving.",
  },
  {
    name: "Appliances",
    detail: "Fridges, microwaves, washing machines, heaters and small kitchen appliances.",
  },
  {
    name: "Kitchen & homewares",
    detail: "Cookware, plates, glassware, storage and everyday apartment basics.",
  },
  {
    name: "Bikes & scooters",
    detail: "Commuter bikes, e-scooters, locks and accessories for getting around the city.",
  },
  {
    name: "Electronics",
    detail: "Monitors, desk setups, lamps, routers and study-from-home gear.",
  },
  {
    name: "Student & dorm essentials",
    detail: "Move-in bundles, study desks and clear-out items around exam and graduation season.",
  },
];

const faqItems = [
  {
    q: "What is the PopOut Melbourne second-hand marketplace?",
    a: "PopOut Market is a neighbourhood-first second-hand marketplace app for Melbourne. Instead of one flat, statewide feed, it shows you listings near where you actually live, study or work, so the things you find are realistically close enough to inspect and collect.",
  },
  {
    q: "How do I buy and sell on the marketplace?",
    a: "Sellers post an item in a few minutes with photos and a quick description. Buyers browse by suburb, message the seller in the chat, agree on a time, and meet locally to complete the trade. The whole flow is built around short-distance, same-area pickups.",
  },
  {
    q: "Is the marketplace only for Melbourne CBD?",
    a: "No. The CBD is our busiest hub because of its apartment density, university activity and fast move-in and move-out cycles, but the marketplace works right across Melbourne. Suburb-based discovery means people in Carlton, Parkville, Southbank, Docklands, Fitzroy, North Melbourne, South Wharf and beyond can all use the app to trade quickly with people nearby.",
  },
  {
    q: "How is this different from Facebook Marketplace or Gumtree?",
    a: "PopOut is designed specifically for local Melbourne trading: suburb-first discovery, multilingual chat with built-in translation, and clearer, safer meetup coordination. The focus is on completing nearby trades smoothly rather than scrolling an endless general classifieds feed.",
  },
  {
    q: "Is it safe to meet up and trade?",
    a: "PopOut encourages public, well-lit meetup points and provides a clearer in-app flow for arranging and confirming pickups, so both sides know what to expect before they meet.",
  },
  {
    q: "Does it support languages other than English?",
    a: "Yes. Melbourne is highly multilingual, so PopOut supports communication across languages, which helps international students and new arrivals trade with confidence.",
  },
];

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "Melbourne second hand marketplace",
    "second hand marketplace Melbourne",
    "Melbourne second hand marketplace app",
    "local marketplace Melbourne",
    "neighbourhood marketplace Melbourne",
    "buy and sell Melbourne",
    "Facebook Marketplace alternative Melbourne",
  ],
  alternates: {
    canonical: "/melbourne-second-hand-marketplace",
    languages: localizedAlternates("/melbourne-second-hand-marketplace"),
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
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "PopOut Market",
          item: `${siteUrl().replace(/\/$/, "")}/en`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Melbourne Second-Hand Marketplace",
          item: `${siteUrl().replace(/\/$/, "")}/melbourne-second-hand-marketplace`,
        },
      ],
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

export default function MelbourneSecondHandMarketplacePage() {
  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Melbourne Second-Hand Marketplace
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{description}</p>

        <section className="mt-8 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            A neighbourhood-first marketplace, not a flat city feed
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            PopOut Market is a Melbourne second-hand marketplace built around how local trading
            actually happens. Most successful second-hand trades come down to one thing: is the item
            close enough to inspect, collect and carry home without a long trip? PopOut puts that
            front and centre by showing you listings near where you live, study or work.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Instead of treating the whole state as one endless feed, the marketplace emphasises
            suburb-level browsing, clearer communication, and a smoother path from finding a listing
            to meeting up. For a city as spread out as Melbourne, that local focus is what turns
            browsing into completed trades.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">How the marketplace works</h2>
          <ol className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
            <li>
              <span className="font-semibold text-gray-900">1. Post in minutes.</span> Add a few
              photos and a short description to list an item quickly.
            </li>
            <li>
              <span className="font-semibold text-gray-900">2. Discover by suburb.</span> Buyers
              browse what is nearby first, so pickup distance and timing are realistic.
            </li>
            <li>
              <span className="font-semibold text-gray-900">3. Chat across languages.</span> Message
              the other person directly, with support for communicating across languages.
            </li>
            <li>
              <span className="font-semibold text-gray-900">4. Meet up safely.</span> Arrange a
              public, convenient meetup and confirm the pickup with a clearer in-app flow.
            </li>
          </ol>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">What people buy and sell</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            The most active categories reflect real Melbourne living, especially around apartments,
            share houses and student accommodation:
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {categories.map((c) => (
              <div key={c.name} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <h3 className="text-sm font-semibold text-gray-900">{c.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-700">{c.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Centred on the Melbourne CBD, useful across the city
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            The Melbourne CBD is our busiest hub. Dense apartment living, university activity, and
            fast move-in and move-out cycles create steady demand for furniture, appliances and
            everyday essentials that can be collected nearby. That makes the city centre a natural
            home for a local second-hand marketplace.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            But the marketplace is not limited to the CBD. Because discovery is suburb-based, anyone
            across Melbourne can use the app to trade quickly with people close to them. Whether you
            are in Carlton, Parkville, Southbank, Docklands, Fitzroy, North Melbourne, South Wharf or
            further out, you see what is nearby and can meet locally to complete the trade.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            A local alternative to broad classifieds
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Large general platforms like Facebook Marketplace and Gumtree work across the whole
            country, but that breadth can make local trading harder: distant listings, slower
            replies, and unclear meetups. PopOut focuses on the opposite: nearby listings,
            multilingual chat, and clearer coordination for trades that actually happen in person.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/comparison/facebook-marketplace"
              className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
            >
              PopOut vs Facebook Marketplace
            </Link>
            <Link
              href="/comparison/gumtree"
              className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
            >
              PopOut vs Gumtree
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Built for Melbourne communities</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">
            Melbourne is one of the most multicultural cities in Australia, with large student and
            international communities. PopOut is designed to make second-hand trading approachable
            for everyone: students setting up or clearing out rooms, apartment residents, recent
            arrivals, working-holiday travellers, and local households who simply want to buy and
            sell nearby without the friction of a city-wide search.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Explore by area and topic</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/market"
              className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
            >
              Browse Melbourne listings
            </Link>
            <Link
              href="/melbourne-second-hand-app"
              className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
            >
              Melbourne second-hand app
            </Link>
            <Link
              href="/melbourne-second-hand-market"
              className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
            >
              How the Melbourne second-hand market works
            </Link>
            <Link
              href="/melbourne-suburbs"
              className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
            >
              Melbourne suburbs
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
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
