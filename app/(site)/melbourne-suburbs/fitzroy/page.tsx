import { MelbourneFitzroySuburbContent } from "@/components/melbourne-fitzroy-suburb-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitzroy Second-Hand: Creative Living, Decor & Apartment Essentials",
  description:
    "Discover second-hand home decor, furniture, and practical apartment essentials around Fitzroy. Ideal for creative living, students, and budget-friendly Melbourne lifestyles.",
  alternates: {
    canonical: "/melbourne-suburbs/fitzroy",
  },
};

export default function FitzroySuburbPage() {
  return <MelbourneFitzroySuburbContent />;
}
