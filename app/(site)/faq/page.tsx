import { FaqPageContent } from "@/components/faq-page-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PopOut Market FAQ",
  description:
    "Frequently asked questions about how PopOut helps Melbourne users post faster, communicate across languages, and trade with clearer safety workflows.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FaqPage() {
  return <FaqPageContent />;
}
