import { ComparisonFacebookMarketplaceContent } from "@/components/comparison-facebook-marketplace-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PopOut vs Facebook Marketplace | Feature Comparison",
  description:
    "A friendly feature comparison focused on faster listing, multilingual communication, safer meetup flow, and student-friendly trust tools in Melbourne.",
  alternates: {
    canonical: "/comparison/facebook-marketplace",
    languages: localizedAlternates("/comparison/facebook-marketplace"),
  },
};

export default function ComparisonFacebookMarketplacePage() {
  return <ComparisonFacebookMarketplaceContent />;
}
