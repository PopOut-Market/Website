import { MelbourneNorthMelbourneSuburbContent } from "@/components/melbourne-north-melbourne-suburb-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "North Melbourne Second-Hand: Student Living & Apartment Essentials",
  description:
    "Find affordable second-hand furniture, appliances, and daily essentials in North Melbourne. Ideal for students, shared housing, and budget-conscious city living.",
  alternates: {
    canonical: "/melbourne-suburbs/north-melbourne",
  },
};

export default function NorthMelbourneSuburbPage() {
  return <MelbourneNorthMelbourneSuburbContent />;
}
