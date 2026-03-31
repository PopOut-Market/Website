import { MarketPostPageContent } from "@/components/market-post-page-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  return {
    title: `Market listing ${postId} | PopOut Market`,
    description:
      "View second-hand listing details in Melbourne, including photos, area context, and seller profile on PopOut Market.",
    alternates: {
      canonical: `/market/p/${encodeURIComponent(postId)}`,
      languages: localizedAlternates(`/market/p/${encodeURIComponent(postId)}`),
    },
  };
}

export default function MarketPostPage() {
  return <MarketPostPageContent />;
}
