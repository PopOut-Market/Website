import { MelbourneCarltonSuburbContent } from "@/components/melbourne-carlton-suburb-content";
import { localizedAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carlton Student Second-Hand Melbourne: Furniture, Bikes & Study Essentials",
  description:
    "Looking for student-friendly second-hand deals in Carlton? Discover affordable desks, chairs, bikes, and home essentials near UniMelb and central Melbourne campuses.",
  alternates: {
    canonical: "/melbourne-suburbs/carlton",
    languages: localizedAlternates("/melbourne-suburbs/carlton"),
  },
};

export default function CarltonSuburbPage() {
  return <MelbourneCarltonSuburbContent />;
}
