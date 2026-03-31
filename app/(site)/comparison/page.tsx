import { ComparisonHubContent } from "@/components/comparison-hub-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare PopOut with Other Second-Hand Markets",
  description:
    "Learn how PopOut helps Melbourne users list faster, communicate across languages, and trade more safely with AI-assisted workflows.",
  keywords: [
    "PopOut vs Facebook Marketplace",
    "PopOut vs Gumtree",
    "Melbourne second hand app comparison",
    "AI listing second hand marketplace",
  ],
  alternates: {
    canonical: "/comparison",
    languages: localizedAlternates("/comparison"),
  },
};

export default function ComparisonHubPage() {
  return <ComparisonHubContent />;
}
