import { ComparisonGumtreeContent } from "@/components/comparison-gumtree-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PopOut vs Gumtree | Feature Comparison",
  description:
    "Explore key workflow differences in listing setup, multilingual chat, safety zone guidance, QR meetup confirmation, and student verification support.",
  alternates: {
    canonical: "/comparison/gumtree",
  },
};

export default function ComparisonGumtreePage() {
  return <ComparisonGumtreeContent />;
}
