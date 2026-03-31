import { MelbourneSouthWharfSuburbContent } from "@/components/melbourne-south-wharf-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "South Wharf Second-Hand: Apartment Furniture & Home Essentials",
  description:
    "Shop affordable second-hand furniture, appliances, and compact home essentials in South Wharf. Great for apartment setups and short-term stays in Melbourne.",
  alternates: {
    canonical: "/melbourne-suburbs/south-wharf",
    languages: localizedAlternates("/melbourne-suburbs/south-wharf"),
  },
};

export default function SouthWharfSuburbPage() {
  return <MelbourneSouthWharfSuburbContent />;
}
