import { MarketPostPageContent } from "@/components/market-post-page-content";
import { localizedAlternates } from "@/lib/seo";
import { localeFromParams } from "@/lib/server-locale";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Metadata } from "next";
import { Suspense } from "react";

/**
 * Listing detail pages are `noindex, follow` — permanently, and on purpose.
 *
 * 1. Any `postId` string returns HTTP 200, so leaving these indexable exposes an
 *    unbounded soft-404 crawl space.
 * 2. Listings are short-lived: no available listing on production is older than
 *    ~65 days, and none of the April/May cohort survived. 1,098 live listings ×
 *    8 locales is ~8,800 URLs with a two-month half-life — a permanent 404
 *    generator on a domain with no third-party authority to absorb it.
 * 3. Nobody searches for an individual second-hand listing by title. The demand
 *    is at the category and suburb level, which is where the indexable pages are.
 *
 * `follow` is kept so link equity still flows out to `/market` and the suburb
 * pages. Revisit only if listings start outliving 65 days AND the domain has
 * real third-party corroboration — both, not either.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  const locale = await localeFromParams(params);
  const path = `/market/p/${encodeURIComponent(postId)}`;

  return {
    // `absolute` — the layout template would otherwise append a second
    // "| PopOut Market" to a title that already carries one.
    title: { absolute: `Market listing ${postId} | PopOut Market` },
    description:
      "View second-hand listing details in Melbourne, including photos, area context, and seller profile on PopOut Market.",
    robots: { index: false, follow: true },
    alternates: {
      // Locale-prefixed: the un-prefixed form 308-redirects, and a canonical
      // that points at a redirect is a canonical Google discards.
      canonical: toLocalePath(path, locale),
      languages: localizedAlternates(path),
    },
  };
}

export default function MarketPostPage() {
  return (
    <Suspense fallback={null}>
      <MarketPostPageContent />
    </Suspense>
  );
}
