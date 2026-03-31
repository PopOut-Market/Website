import { MelbourneDocklandsSuburbContent } from "@/components/melbourne-docklands-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Second-Hand Furniture & Appliances for Docklands Apartments",
  description:
    "Moving to Docklands? Find affordable second-hand furniture & kitchen appliances for your apartment. Perfect for working holiday visa holders & short-term stays in Melbourne. Buy & sell locally!",
  alternates: {
    canonical: "/melbourne-suburbs/docklands",
    languages: localizedAlternates("/melbourne-suburbs/docklands"),
  },
};

export default function DocklandsSuburbPage() {
  return <MelbourneDocklandsSuburbContent />;
}
