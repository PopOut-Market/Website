import { MelbourneSuburbsHubContent } from "@/components/melbourne-suburbs-hub-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn More Melbourne Suburbs | PopOut Market",
  description:
    "Explore Melbourne suburb-focused second-hand pages for students, WHV newcomers, and local renters. Compare local areas and jump to suburb-specific marketplace guides.",
  keywords: [
    "Melbourne suburbs second hand",
    "Melbourne student marketplace",
    "WHV furniture Melbourne",
    "suburb second-hand guide Melbourne",
  ],
  alternates: {
    canonical: "/melbourne-suburbs",
  },
};

export default function MelbourneSuburbsHubPage() {
  return <MelbourneSuburbsHubContent />;
}
